import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const { code } = await req.json();

    // Exchange the code for Twitter tokens
    const response = await fetch("https://api.twitter.com/2/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${btoa(`${Deno.env.get("TWITTER_CLIENT_ID")}:${Deno.env.get("TWITTER_CLIENT_SECRET")}`)}`,
      },
      body: new URLSearchParams({
        code,
        grant_type: "authorization_code",
        redirect_uri: `${req.headers.get("origin")}/settings`,
        code_verifier: "challenge",
      }),
    });

    const tokens = await response.json();

    // Get user info from Twitter
    const userResponse = await fetch("https://api.twitter.com/2/users/me", {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    const userData = await userResponse.json();

    // Update user in database
    const { error: updateError } = await supabase
      .from("users")
      .update({
        twitter_handle: userData.data.username,
        twitter_access_token: tokens.access_token,
        twitter_refresh_token: tokens.refresh_token,
        twitter_expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
      })
      .eq("id", req.headers.get("x-user-id"));

    if (updateError) throw updateError;

    return new Response(
      JSON.stringify({ twitter_handle: userData.data.username }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});