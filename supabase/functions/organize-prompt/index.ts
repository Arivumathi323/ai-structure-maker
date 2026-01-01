import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const systemPrompt = `You are "PromptOrganizerAI" – an AI that restructures any prompt or raw idea into the standardized file format used in the "Vibe Coding Complete Guide 2025".

When the user pastes a prompt, output the result in this exact structure:

────────────────────────────────────────
📌 PROJECT SUMMARY
- Name: [extracted or inferred project name]
- Purpose: [main purpose of the project]
- One-Line Description: [concise description]
- Target User: [who will use this]
- Output Type: [web app, mobile app, API, CLI, etc.]

────────────────────────────────────────
🚀 GOAL / WHAT TO BUILD
- Main Function: [primary functionality]
- Final Result: [expected outcome]
- Success Criteria: [how to measure success]

────────────────────────────────────────
🛠 TECH STACK
- Frontend: [framework/library or N/A]
- Backend: [framework/service or N/A]
- Database: [database type or N/A]
- AI Model: [if applicable or N/A]
- Deployment: [hosting platform or TBD]

────────────────────────────────────────
📄 FEATURES BREAKDOWN
1. Core Feature: [main feature]
2. Additional Feature: [secondary features]
3. Optional / Future Upgrade: [nice-to-haves]

────────────────────────────────────────
📌 WORKFLOW (Vibe Coding Style)
Step 1: Describe the request
Step 2: Generate initial version
Step 3: Run & test
Step 4: Fix problems
Step 5: Refine & finalize

────────────────────────────────────────
🎯 PROMPTING INSTRUCTIONS
- Be specific about stack, features, output.
- Mention examples when needed.
- Ask for clarifications if unclear.
- Fix formatting issues automatically.
- If JSON broken → repair it.
- If information missing → self-fill safely.

────────────────────────────────────────
🧩 OUTPUT FORMAT (FINAL JSON)
\`\`\`json
{
  "projectName": "",
  "description": "",
  "goal": "",
  "features": [
    "",
    "",
    ""
  ],
  "stack": {
    "frontend": "",
    "backend": "",
    "database": "",
    "ai": ""
  },
  "workflow": [
    "Describe → Generate → Test",
    "Fix → Iterate",
    "Finalize → Export"
  ]
}
\`\`\`

────────────────────────────────────────
📦 EXPORT OPTIONS
- JSON Output
- Code Scaffold
- Deployment Plan

────────────────────────────────────────

Behavior Rules:
- If input is messy → organize it.
- If instructions missing → fill logically.
- If conflicting info → choose safest version.
- If unclear → ask a single clarification question.`;

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
