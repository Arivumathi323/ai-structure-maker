import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const systemPrompt = `You are an expert AI that converts raw prompts, JSON, or plain text into a structured application specification format.

Your task is to analyze the input and output a valid JSON object following this exact structure:

{
  "application_info": {
    "name": "string - application name extracted or inferred",
    "type": "string - web_app, mobile_app, api, cli_tool, etc.",
    "description": "string - brief description of what the app does"
  },
  "pages": [
    {
      "page_name": "string",
      "route": "string - e.g., /home, /dashboard",
      "layout": {
        "header": "string - description of header",
        "body": "string - description of main content",
        "footer": "string - description of footer or null"
      },
      "components": ["array of component names used on this page"]
    }
  ],
  "ai_behavior": {
    "auto_detect": "Yes/No",
    "fix_invalid": "Yes/No",
    "restructure_prompt": "Yes/No",
    "explain_if_needed": "Yes/No"
  },
  "tech_stack": {
    "frontend": "string or null",
    "backend": "string or null",
    "database": "string or null",
    "other": ["array of other technologies"]
  },
  "features": ["array of key features"],
  "notes": "string - any additional observations or clarifications"
}

Rules:
1. Always return valid JSON
2. If the input is already JSON, clean it up and fit it into this structure
3. If the input is plain text/prompt, extract information and organize it
4. Fill missing fields with reasonable placeholders or null
5. Be concise but thorough
6. If the input is unclear, make reasonable assumptions and note them in the "notes" field`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { input } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    if (!input || typeof input !== "string") {
      throw new Error("Input is required and must be a string");
    }

    console.log("Processing input:", input.substring(0, 100) + "...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Please analyze and structure the following input:\n\n${input}` },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Usage limit reached. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Error in organize-prompt function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
