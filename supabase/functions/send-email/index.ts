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

    const { lead_id, to_email, subject, body, lead_name } = await req.json();
    if (!lead_id || !to_email || !subject || !body) {
      return new Response(
        JSON.stringify({ error: "lead_id, to_email, subject and body are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    let sendStatus = "queued";
    let externalId: string | null = null;

    // Replace template variables
    const processedBody = body
      .replace(/\{\{lead_name\}\}/g, lead_name ?? "Cliente")
      .replace(/\{\{email\}\}/g, to_email);

    const processedSubject = subject
      .replace(/\{\{lead_name\}\}/g, lead_name ?? "Cliente")
      .replace(/\{\{email\}\}/g, to_email);

    if (resendApiKey) {
      try {
        const fromEmail = Deno.env.get("RESEND_FROM_EMAIL") ?? "onboarding@resend.dev";

        const resendRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: fromEmail,
            to: [to_email],
            subject: processedSubject,
            html: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <p>${processedBody.replace(/\n/g, "<br/>")}</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
              <p style="font-size: 12px; color: #999;">Enviado via NexusCRM</p>
            </div>`,
          }),
        });

        if (resendRes.ok) {
          const resendData = await resendRes.json();
          sendStatus = "sent";
          externalId = resendData.id ?? null;
        } else {
          const errText = await resendRes.text();
          console.error("Resend API error:", resendRes.status, errText);
          sendStatus = "failed";
        }
      } catch (e) {
        console.error("Resend request failed:", e);
        sendStatus = "failed";
      }
    } else {
      sendStatus = "pending_config";
      console.log("RESEND_API_KEY not configured. Email saved locally only.");
    }

    // Save interaction
    const { data: interaction, error: insertError } = await adminClient
      .from("interactions")
      .insert({
        lead_id,
        user_id: userId,
        provider: "email",
        content_type: "email",
        message_content: processedBody,
        subject: processedSubject,
        direction: "outbound",
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
        external_id: externalId,
        interaction_id: interaction?.id ?? null,
        message: sendStatus === "pending_config"
          ? "E-mail salvo no histórico. Configure RESEND_API_KEY para envio real."
          : sendStatus === "sent"
          ? "E-mail enviado com sucesso!"
          : "Falha no envio. Verifique a API Key do Resend.",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("send-email error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
