import { AnalysisResult } from "./types";

export async function analyzeConversation(text: string): Promise<AnalysisResult> {
  const response = await fetch("https://eligible-foothold-revolt.ngrok-free.dev/webhook/analyze-sentiment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(`n8n HTTP Error (${response.status}): ${responseText}`);
  }

  let raw: any;
  try {
    raw = JSON.parse(responseText);
  } catch (err) {
    throw new Error(`N8N CONFIG ERROR: n8n returned plain text instead of data. It returned: "${responseText}". Check your Webhook node settings.`);
  }

  const dataObj = Array.isArray(raw) ? raw[0] : raw;

  // 🚨 This will catch the exact error Groq throws (like your syntax error!)
  if (dataObj?.error) {
    throw new Error(`GROQ API ERROR: ${dataObj.error.message || JSON.stringify(dataObj.error)}`);
  }

  let llmString = "";
  if (typeof dataObj?.choices?.[0]?.message?.content === "string") {
    llmString = dataObj.choices[0].message.content;
  } else {
    throw new Error(`MISSING DATA: Groq did not return a valid response. n8n sent this instead: ${JSON.stringify(dataObj).substring(0, 200)}`);
  }

  let parsedJson: any = {};
  try {
    let clean = llmString.replace(/```json/gi, "").replace(/```/g, "").trim();
    const start = clean.indexOf("{");
    const end   = clean.lastIndexOf("}");
    if (start !== -1 && end !== -1) {
      parsedJson = JSON.parse(clean.substring(start, end + 1));
    } else {
      parsedJson = JSON.parse(clean);
    }
  } catch (err) {
    throw new Error(`LLM FORMAT ERROR: Groq generated bad JSON. Output starts with: ${llmString.substring(0, 150)}`);
  }

  const data = parsedJson?.output ?? parsedJson?.result ?? parsedJson;

  return {
    overall_sentiment: data.overall_sentiment ?? data.overallSentiment ?? "Neutral",
    overallSentiment: data.overall_sentiment ?? data.overallSentiment ?? "Neutral",
    emotion_detected: data.emotion_detected ?? data.dominant_emotion ?? "Neutral",
    overallScore: data.overallScore ?? data.overall_score ?? 0,
    summary: data.summary ?? "Analysis completed.",
    topKeywords: data.topKeywords ?? data.top_keywords ?? [],
    callDuration: data.callDuration ?? data.call_duration ?? 0,
    business_kpis: {
      customer_frustration_index: data.business_kpis?.customer_frustration_index ?? 0,
      agent_empathy_score: data.business_kpis?.agent_empathy_score ?? 0,
      churn_risk_percentage: data.business_kpis?.churn_risk_percentage ?? 0,
      churn_risk: data.business_kpis?.churn_risk ?? "Low",
      resolution_probability: data.business_kpis?.resolution_probability ?? 0,
      issue_resolved: data.business_kpis?.issue_resolved ?? false,
    },
    sentence_level_analysis: (data.sentence_level_analysis ?? []).map((s: any) => ({
      sentence: s.sentence ?? s.text ?? "...",
      sentiment: s.sentiment ?? "Neutral",
      emotion:   s.emotion  ?? "Neutral",
    })),
  };
}