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
      作为一位专业的经济学导师，请根据以下市场图表数据解释“生产者剩余”和“消费者剩余”的概念：

      当前状态数据:
      - 需求方程: P = ${params.demandIntercept} - ${params.demandSlope}Q
      - 供给方程: P = ${params.supplyIntercept} + ${params.supplySlope}Q
      - 均衡价格: $${data.eqPrice.toFixed(2)}
      - 均衡数量: ${data.eqQuantity.toFixed(2)} units
      - 消费者剩余 (CS): $${data.consumerSurplus.toFixed(2)}
      - 生产者剩余 (PS): $${data.producerSurplus.toFixed(2)}
      - 总福利: $${data.totalSurplus.toFixed(2)}

      请提供一个简洁的、包含三个段落的中文解释：
      1. 简要定义此情境下的“市场均衡”。
      2. 解释为什么消费者剩余是 ${data.consumerSurplus.toFixed(2)} (需求曲线以下，价格以上的区域)。
      3. 解释为什么生产者剩余是 ${data.producerSurplus.toFixed(2)} (供给曲线以上，价格以下的区域)。
      
      请保持教育性、鼓励性的语气，让学生容易理解。使用 Markdown 语法加粗关键术语。
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