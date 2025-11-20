import { GoogleGenAI } from "@google/genai";

// Safe initialization that handles missing API key gracefully
const getAIClient = () => {
  if (!process.env.API_KEY) {
    console.warn("Gemini API Key is missing. AI features will return mock data.");
    return null;
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateReportSummary = async (
  participantName: string,
  competencyData: any[]
): Promise<string> => {
  const ai = getAIClient();
  
  // Fallback for demo if no key
  if (!ai) {
    return `(AI Simulation) ${participantName}, your strongest area is Influencing. Peers see you as a Driver, but direct reports feel you could delegate more effectively in Strategic Thinking tasks.`;
  }

  try {
    const prompt = `
      Act as an executive leadership coach. Analyze the following 360-degree feedback data for ${participantName}.
      Data: ${JSON.stringify(competencyData)}
      
      Provide a concise 3-sentence executive summary highlighting:
      1. The top strength.
      2. The biggest blind spot (gap between self and others).
      3. One actionable recommendation.
      
      Keep the tone professional, encouraging, yet direct.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Unable to generate summary.";
  } catch (error) {
    console.error("AI Generation Error:", error);
    return "AI service is currently unavailable.";
  }
};

export const analyzeCommentsTheme = async (comments: string[]): Promise<string> => {
    const ai = getAIClient();
    if (!ai) return "Themes: Communication, Delegation, Vision (Simulated)";

    try {
        const prompt = `Identify the top 3 recurring themes in these anonymous feedback comments: ${JSON.stringify(comments)}. Return only the themes as a comma-separated list.`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });
        return response.text || "No themes found.";
    } catch (e) {
        return "Error analyzing themes.";
    }
}
