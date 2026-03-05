import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const stateB64 = url.searchParams.get("state");

    if (!code || !stateB64) {
      return new Response("Missing code or state", { status: 400 });
    }

    const state = JSON.parse(atob(stateB64));
    const { user_id, redirect_uri } = state;

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const clientId = Deno.env.get("GOOGLE_CLIENT_ID")!;
    const clientSecret = Deno.env.get("GOOGLE_CLIENT_SECRET")!;
    const callbackUrl = `${supabaseUrl}/functions/v1/google-contacts-callback`;

    // Exchange code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: callbackUrl,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok) {
      console.error("Token exchange error:", tokenData);
      return new Response(`Token exchange failed: ${JSON.stringify(tokenData)}`, { status: 500 });
    }

    const accessToken = tokenData.access_token;
    const refreshToken = tokenData.refresh_token || null;

    // Save tokens to social_connections using service role
    const adminClient = createClient(supabaseUrl, serviceKey);

    const { data: existing } = await adminClient
      .from("social_connections")
      .select("id")
      .eq("user_id", user_id)
      .eq("provider", "google")
      .maybeSingle();

    if (existing) {
      await adminClient
        .from("social_connections")
        .update({
          access_token_enc: accessToken,
          refresh_token_enc: refreshToken,
          status: "connected",
        })
        .eq("id", existing.id);
    } else {
      await adminClient.from("social_connections").insert({
        user_id,
        provider: "google",
        provider_user_id: user_id,
        status: "connected",
        access_token_enc: accessToken,
        refresh_token_enc: refreshToken,
      });
    }

    // Redirect back to the app
    const finalRedirect = redirect_uri || "/settings/integrations";
    const redirectUrl = finalRedirect.startsWith("http")
      ? `${finalRedirect}?google_contacts=success`
      : `${finalRedirect}?google_contacts=success`;

    return new Response(null, {
      status: 302,
      headers: { Location: redirectUrl },
    });
  } catch (e) {
    console.error("google-contacts-callback error:", e);
    return new Response(`Error: ${e instanceof Error ? e.message : "Unknown"}`, { status: 500 });
  }
});
