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
    const { interaction_id } = await req.json();
    if (!interaction_id) throw new Error("interaction_id is required");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableKey = Deno.env.get("LOVABLE_API_KEY");

    const supabase = createClient(supabaseUrl, serviceKey);

    // Fetch interaction with lead info
    const { data: interaction, error: fetchErr } = await supabase
      .from("interactions")
      .select("*, leads(*)")
      .eq("id", interaction_id)
      .single();

    if (fetchErr || !interaction) {
      throw new Error(`Interaction not found: ${fetchErr?.message}`);
    }

    let sentiment = "Neutral";
    let score = 50;
    let summary = interaction.message_content?.slice(0, 200) || "No content";

    // Use Lovable AI if available
    if (lovableKey) {
      const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${lovableKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            {
              role: "system",
              content: `You are a CRM AI analyst. Analyze the following customer interaction and return structured output using the provided tool.`,
            },
            {
              role: "user",
              content: `Provider: ${interaction.provider}\nContent Type: ${interaction.content_type}\nMessage: ${interaction.message_content}\nLead: ${interaction.leads?.name} (${interaction.leads?.company})`,
            },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "analyze_interaction",
                description: "Analyze a customer interaction for sentiment, lead score, and summary.",
                parameters: {
                  type: "object",
                  properties: {
                    sentiment: { type: "string", enum: ["Positive", "Neutral", "Negative"] },
                    lead_score: { type: "number", description: "Score 0-100 based on purchase intent" },
                    summary: { type: "string", description: "Brief summary of the conversation in Portuguese" },
                  },
                  required: ["sentiment", "lead_score", "summary"],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: { type: "function", function: { name: "analyze_interaction" } },
        }),
      });

      if (aiResponse.ok) {
        const aiData = await aiResponse.json();
        const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
        if (toolCall) {
          const args = JSON.parse(toolCall.function.arguments);
          sentiment = args.sentiment;
          score = args.lead_score;
          summary = args.summary;
        }
      } else {
        const errText = await aiResponse.text();
        console.error("AI Gateway error:", aiResponse.status, errText);
      }
    }

    // Update interaction with sentiment
    await supabase
      .from("interactions")
      .update({ sentiment_analysis: sentiment, ai_processed: true })
      .eq("id", interaction_id);

    // Update lead with score and summary
    const leadUpdate: Record<string, unknown> = {
      lead_score: score,
      ai_summary: summary,
      last_interaction_at: new Date().toISOString(),
    };

    // Auto-qualify if score > 70
    if (score > 70) {
      leadUpdate.status = "Qualified";
    }

    await supabase
      .from("leads")
      .update(leadUpdate)
      .eq("id", interaction.lead_id);

    return new Response(
      JSON.stringify({
        success: true,
        sentiment,
        lead_score: score,
        summary,
        auto_qualified: score > 70,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("analyze-interaction error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
