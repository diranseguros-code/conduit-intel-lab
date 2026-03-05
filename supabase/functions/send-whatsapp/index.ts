import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // Auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const adminClient = createClient(supabaseUrl, serviceKey);

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await adminClient.auth.getUser(token);
    if (claimsError || !claimsData.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
    }
    const userId = claimsData.user.id;

    const { lead_id, phone_number, message, content_type = "text" } = await req.json();
    if (!lead_id || !phone_number || !message) {
      return new Response(
        JSON.stringify({ error: "lead_id, phone_number and message are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check for WhatsApp API credentials
    const zapiInstanceId = Deno.env.get("ZAPI_INSTANCE_ID");
    const zapiToken = Deno.env.get("ZAPI_TOKEN");
    const metaToken = Deno.env.get("META_WHATSAPP_TOKEN");
    const metaPhoneId = Deno.env.get("META_WHATSAPP_PHONE_ID");

    let sendStatus = "queued";
    let externalId: string | null = null;
    let providerUsed = "none";

    // Try Z-API first
    if (zapiInstanceId && zapiToken) {
      providerUsed = "z-api";
      try {
        const zapiUrl = `https://api.z-api.io/instances/${zapiInstanceId}/token/${zapiToken}/send-text`;
        const zapiRes = await fetch(zapiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone: phone_number.replace(/\D/g, ""),
            message,
          }),
        });

        if (zapiRes.ok) {
          const zapiData = await zapiRes.json();
          sendStatus = "sent";
          externalId = zapiData.messageId ?? null;
        } else {
          const errText = await zapiRes.text();
          console.error("Z-API error:", zapiRes.status, errText);
          sendStatus = "failed";
        }
      } catch (e) {
        console.error("Z-API request failed:", e);
        sendStatus = "failed";
      }
    }
    // Try Meta Cloud API
    else if (metaToken && metaPhoneId) {
      providerUsed = "meta";
      try {
        const metaUrl = `https://graph.facebook.com/v18.0/${metaPhoneId}/messages`;
        const metaRes = await fetch(metaUrl, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${metaToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: phone_number.replace(/\D/g, ""),
            type: "text",
            text: { body: message },
          }),
        });

        if (metaRes.ok) {
          const metaData = await metaRes.json();
          sendStatus = "sent";
          externalId = metaData.messages?.[0]?.id ?? null;
        } else {
          const errText = await metaRes.text();
          console.error("Meta API error:", metaRes.status, errText);
          sendStatus = "failed";
        }
      } catch (e) {
        console.error("Meta request failed:", e);
        sendStatus = "failed";
      }
    } else {
      // No provider configured - save as pending
      sendStatus = "pending_config";
      console.log("No WhatsApp provider configured. Message saved locally only.");
    }

    // Save interaction to DB
    const { data: interaction, error: insertError } = await adminClient
      .from("interactions")
      .insert({
        lead_id,
        user_id: userId,
        provider: "whatsapp",
        content_type,
        message_content: message,
        direction: "outbound",
        sentiment_analysis: null,
        ai_processed: false,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Failed to save interaction:", insertError);
    }

    return new Response(
      JSON.stringify({
        success: sendStatus !== "failed",
        status: sendStatus,
        provider: providerUsed,
        external_id: externalId,
        interaction_id: interaction?.id ?? null,
        message: sendStatus === "pending_config"
          ? "Mensagem salva localmente. Configure ZAPI_INSTANCE_ID/ZAPI_TOKEN ou META_WHATSAPP_TOKEN/META_WHATSAPP_PHONE_ID para envio real."
          : sendStatus === "sent"
          ? "Mensagem enviada com sucesso!"
          : "Falha no envio. Verifique as credenciais do provedor.",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("send-whatsapp error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
