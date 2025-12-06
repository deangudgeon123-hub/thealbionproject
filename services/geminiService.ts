import { GoogleGenAI, Chat, GenerateContentResponse, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';

let chatSession: Chat | null = null;
let genAI: GoogleGenAI | null = null;

const getAIInstance = (): GoogleGenAI => {
  if (!genAI) {
    // API Key must be provided via environment variable as per instructions
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
    if (!apiKey) {
      console.error("VITE_GOOGLE_API_KEY is not set in environment variables.");
    }
    genAI = new GoogleGenAI({ apiKey: apiKey || '' });
  }
  return genAI;
};

export const initializeChat = (): void => {
  const ai = getAIInstance();
  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7, // Higher temperature for more natural, conversational bridging
      maxOutputTokens: 2048, // Increased to prevent cut-offs mid-paragraph
      // Adjust safety settings to avoid over-blocking political discourse
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH }
      ]
    },
  });
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  try {
    if (!chatSession) {
      initializeChat();
    }

    if (!chatSession) {
      throw new Error("Failed to initialize chat session.");
    }

    const result: GenerateContentResponse = await chatSession.sendMessage({
      message: message
    });

    return result.text || "I apologize, but I could not generate a response. The query may have been flagged by safety filters.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Handle generic errors or specific API key issues
    if (error instanceof Error && error.message.includes("API key")) {
        return "Configuration Error: API Key is missing or invalid. Please check your settings.";
    }
    return "I am experiencing high traffic or a temporary connection issue. Please try asking again in a moment.";
  }
};