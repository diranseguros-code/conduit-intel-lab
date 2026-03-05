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
    const authHeader = req.headers.get("authorization");
    if (!authHeader) throw new Error("Missing authorization header");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Authenticate the user
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userErr } = await userClient.auth.getUser();
    if (userErr || !user) throw new Error("User not authenticated");

    // Use service role to read the stored provider token
    const adminClient = createClient(supabaseUrl, serviceKey);

    const { data: connection, error: connErr } = await adminClient
      .from("social_connections")
      .select("access_token_enc")
      .eq("user_id", user.id)
      .eq("provider", "google")
      .eq("status", "connected")
      .maybeSingle();

    if (connErr) throw new Error(`Failed to fetch connection: ${connErr.message}`);

    const providerToken = connection?.access_token_enc;
    if (!providerToken) {
      throw new Error(
        "Google access token not available. Please reconnect Google to grant contacts access."
      );
    }

    // Fetch contacts from Google People API
    const peopleResponse = await fetch(
      "https://people.googleapis.com/v1/people/me/connections?" +
        new URLSearchParams({
          personFields: "names,emailAddresses,organizations,phoneNumbers",
          pageSize: "100",
          sortOrder: "LAST_MODIFIED_DESCENDING",
        }),
      {
        headers: { Authorization: `Bearer ${providerToken}` },
      }
    );

    if (!peopleResponse.ok) {
      const errBody = await peopleResponse.text();
      console.error("People API error:", peopleResponse.status, errBody);

      if (peopleResponse.status === 401 || peopleResponse.status === 403) {
        // Token expired — mark connection for re-auth
        await adminClient
          .from("social_connections")
          .update({ status: "expired", access_token_enc: null })
          .eq("user_id", user.id)
          .eq("provider", "google");

        throw new Error("Google token expired. Please reconnect Google.");
      }

      throw new Error(`Google People API error: ${peopleResponse.status}`);
    }

    const peopleData = await peopleResponse.json();
    const connections = peopleData.connections || [];

    let imported = 0;
    let skipped = 0;

    for (const person of connections) {
      const name =
        person.names?.[0]?.displayName ||
        person.emailAddresses?.[0]?.value ||
        null;
      if (!name) {
        skipped++;
        continue;
      }

      const email = person.emailAddresses?.[0]?.value || null;
      const company = person.organizations?.[0]?.name || null;

      // Skip duplicates by email
      if (email) {
        const { data: existing } = await adminClient
          .from("leads")
          .select("id")
          .eq("user_id", user.id)
          .eq("email", email)
          .maybeSingle();

        if (existing) {
          skipped++;
          continue;
        }
      }

      const { error: insertErr } = await adminClient.from("leads").insert({
        name,
        email,
        company,
        user_id: user.id,
        status: "New",
        lead_score: 0,
      });

      if (insertErr) {
        console.error("Insert error:", insertErr.message);
        skipped++;
      } else {
        imported++;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        total_contacts: connections.length,
        imported,
        skipped,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("sync-google-contacts error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
