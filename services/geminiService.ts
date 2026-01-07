// This file is currently unused as AI functionality has been disabled.
// Commenting out contents to prevent build errors with missing @google/genai dependency.

/*
import { GoogleGenAI } from "@google/genai";
import { MarketParams, MarketData } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY is not defined in the environment.");
  }
  return new GoogleGenAI({ apiKey });
};

export const explainMarketParams = async (
  params: MarketParams,
  data: MarketData
): Promise<string> => {
  try {
    const ai = getClient();
    
    const prompt = `
      ... (prompt content)
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "你是一位乐于助人、清晰简洁的经济学教授，请用中文回复。",
        temperature: 0.7,
      },
    });

    return response.text || "抱歉，目前无法生成解释。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "与 AI 导师通信时发生错误，请稍后再试。";
  }
};
*/

export const explainMarketParams = async () => { return ""; };
