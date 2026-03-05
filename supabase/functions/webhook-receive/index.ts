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
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const webhookSecret = Deno.env.get("WEBHOOK_SECRET");
    const adminClient = createClient(supabaseUrl, serviceKey);

    // Validate webhook secret if configured
    const incomingSecret = req.headers.get("x-webhook-secret");
    if (webhookSecret && incomingSecret !== webhookSecret) {
      return new Response(JSON.stringify({ error: "Invalid webhook secret" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const payload = await req.json();
    const {
      provider = "whatsapp",
      from_phone,
      from_email,
      message,
      lead_name,
      lead_email,
      lead_company,
      content_type = "text",
      external_id,
    } = payload;

    if (!message) {
      return new Response(
        JSON.stringify({ error: "message is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Try to find existing lead by phone or email
    let leadId: string | null = null;
    const identifier = from_email || from_phone;

    if (identifier) {
      const { data: existingLead } = await adminClient
        .from("leads")
        .select("id")
        .or(`email.eq.${identifier},phone.eq.${identifier}`)
        .limit(1)
        .single();

      if (existingLead) {
        leadId = existingLead.id;
      }
    }

    // Create lead if not found
    if (!leadId) {
      const { data: newLead, error: leadErr } = await adminClient
        .from("leads")
        .insert({
          name: lead_name || from_phone || from_email || "Lead Desconhecido",
          email: from_email || null,
          phone: from_phone || null,
          company: lead_company || null,
          status: "New",
          pipeline_stage: "prospeccao",
        })
        .select()
        .single();

      if (leadErr) {
        console.error("Failed to create lead:", leadErr);
        return new Response(
          JSON.stringify({ error: "Failed to create lead" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      leadId = newLead.id;
    }

    // Save interaction
    const { data: interaction, error: interactionErr } = await adminClient
      .from("interactions")
      .insert({
        lead_id: leadId,
        provider,
        content_type,
        message_content: message,
        direction: "inbound",
        ai_processed: false,
      })
      .select()
      .single();

    if (interactionErr) {
      console.error("Failed to save interaction:", interactionErr);
      return new Response(
        JSON.stringify({ error: "Failed to save interaction" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update lead's last_interaction_at
    await adminClient
      .from("leads")
      .update({ last_interaction_at: new Date().toISOString() })
      .eq("id", leadId);

    return new Response(
      JSON.stringify({
        success: true,
        lead_id: leadId,
        interaction_id: interaction.id,
        message: "Mensagem recebida e registrada com sucesso.",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("webhook-receive error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
