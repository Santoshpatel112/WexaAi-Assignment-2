import { NextRequest, NextResponse } from "next/server";
import { getPersonById } from "@/server/repositories/person.repository";
import { getRoleMatches } from "@/server/services/recommendation.service";
import { getCustomUserData } from "@/server/db/user-store";
import { toApiError } from "@/server/errors/app-error";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { userId, message } = await req.json();
    const effectiveUserId = userId || "person:santosh-patel";

    // 1. Retrieve authenticated user graph context
    const custom = getCustomUserData(effectiveUserId);
    let userName = custom?.name || "Developer";
    let userSkills = custom?.skills.map((s) => s.name) || [];
    let userTitle = custom?.title || "Full Stack Engineer";

    if (!custom) {
      try {
        const detail = await getPersonById(effectiveUserId);
        userName = detail.name;
        userSkills = detail.skills.map((s) => s.skill.name);
        userTitle = detail.title;
      } catch {
        // Fallback defaults
      }
    }

    // 2. Fetch graph role matches
    let matches: Array<{ role: { title: string }; matchPercentage: number; matchedSkills: Array<{ name: string }>; missingSkills: Array<{ name: string }> }> = [];
    try {
      matches = await getRoleMatches(effectiveUserId);
    } catch {
      // Fallback
    }

    const topMatch = matches[0];
    const contextPrompt = `
You are CareerGraph AI Assistant, a high-end career advisor powered by Grok AI & CognoDB Graph Database.
You are helping the authenticated candidate:
- Name: ${userName}
- Current Title: ${userTitle}
- User Skills: ${userSkills.join(", ") || "React, TypeScript, Node.js"}
- Top Job Match: ${topMatch ? `${topMatch.role.title} (${topMatch.matchPercentage}% match)` : "Senior Full Stack Engineer (92% match)"}
- Matched Skills: ${topMatch ? topMatch.matchedSkills.map((s) => s.name).join(", ") : "React, Node.js, TypeScript, Next.js"}
- Missing Skills: ${topMatch ? topMatch.missingSkills.map((s) => s.name).join(", ") : "AWS, Docker, Kubernetes"}

Instructions:
- Provide concise, encouraging, personalized career advice.
- Refer directly to their actual graph skills and target matches.
- Keep answers under 3-4 sentences unless detailed roadmap is requested.
`;

    const grokKey = process.env.GROK_API_KEY;

    if (grokKey && grokKey.startsWith("gsk_")) {
      try {
        const grokRes = await fetch("https://api.x.ai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${grokKey}`,
          },
          body: JSON.stringify({
            model: "grok-2-latest",
            messages: [
              { role: "system", content: contextPrompt },
              { role: "user", content: message },
            ],
            temperature: 0.7,
            max_tokens: 300,
          }),
        });

        if (grokRes.ok) {
          const grokData = await grokRes.json();
          const reply = grokData.choices?.[0]?.message?.content;
          if (reply) {
            return NextResponse.json({ success: true, data: { reply } });
          }
        }
      } catch (err) {
        console.error("Grok API call error:", err);
      }
    }

    // Smart Rule-based Fallback if Grok API call degraded or offline
    const lowerMsg = (message || "").toLowerCase();
    let reply = "";

    if (lowerMsg.includes("job") || lowerMsg.includes("match")) {
      reply = `Hello ${userName}! Based on your stored graph skills (${userSkills.join(", ")}), your top job match is **${topMatch ? topMatch.role.title : "Senior Full Stack Engineer"}** (${topMatch ? topMatch.matchPercentage : 92}% match). Matched skills: ${topMatch ? topMatch.matchedSkills.map((s) => s.name).join(", ") : "React, Node.js, TypeScript"}.`;
    } else if (lowerMsg.includes("missing") || lowerMsg.includes("gap") || lowerMsg.includes("learn")) {
      reply = `To reach 100% match for target roles, we recommend acquiring: **${topMatch && topMatch.missingSkills.length ? topMatch.missingSkills.map((s) => s.name).join(", ") : "AWS, Docker, Kubernetes"}**. Check the Skill Gap tab for step-by-step resources!`;
    } else {
      reply = `Hi ${userName}! I see you have skills in ${userSkills.join(", ")}. Ask me about your top job matches, missing skill gaps, or career learning paths!`;
    }

    return NextResponse.json({ success: true, data: { reply } });
  } catch (err) {
    const { code, message, statusCode } = toApiError(err);
    return NextResponse.json({ success: false, error: { code, message } }, { status: statusCode });
  }
}
