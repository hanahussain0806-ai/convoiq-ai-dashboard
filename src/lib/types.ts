export interface SentenceAnalysis {
  sentence: string;
  sentiment: "Positive" | "Negative" | "Neutral";
  emotion: string;
}

export interface BusinessKPIs {
  customer_frustration_index: number;
  agent_empathy_score: number;
  churn_risk_percentage: number;
  churn_risk: "Low" | "Medium" | "High"; 
  resolution_probability: number;
  issue_resolved: boolean;
}

export interface AnalysisResult {
  // Matches both the n8n backend and Claude's new UI expectations
  overall_sentiment: "Positive" | "Negative" | "Neutral";
  overallSentiment: "Positive" | "Negative" | "Neutral"; 
  emotion_detected: string;
  overallScore: number; 
  summary: string;
  topKeywords: string[];
  callDuration?: number;
  business_kpis: BusinessKPIs;
  sentence_level_analysis: SentenceAnalysis[];
}