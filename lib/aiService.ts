import { GoogleGenAI, Type } from "@google/genai";
import { LoadData } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || "" });

const LOAD_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    origin: { type: Type.STRING, description: "Origin city and state" },
    destination: { type: Type.STRING, description: "Destination city and state" },
    loadedMiles: { type: Type.NUMBER, description: "Total loaded miles" },
    deadheadMiles: { type: Type.NUMBER, description: "Deadhead/empty miles to pickup" },
    weight: { type: Type.NUMBER, description: "Total weight in lbs" },
    dimensions: {
      type: Type.OBJECT,
      properties: {
        length: { type: Type.NUMBER },
        width: { type: Type.NUMBER },
        height: { type: Type.NUMBER },
      },
      description: "Cargo dimensions in inches"
    },
    marketContext: { type: Type.STRING, description: "Brief AI assessment of the market/route" }
  },
  required: ["origin", "destination", "loadedMiles", "weight"]
};

export async function parseLoadText(text: string): Promise<{ data: LoadData; aiNote: string }> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Extract load details from this text: "${text}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: LOAD_SCHEMA,
      systemInstruction: "You are a freight dispatcher assistant. Extract load details accurately. Always provide a 'marketContext' note. The note MUST START with the AI-recommended bid and CPM (e.g., 'AI Recommended Bid: $X,XXX | AI Recommended CPM: $X.XX'), followed by a brief route assessment."
    }
  });

  const result = JSON.parse(response.text || "{}");
  const { marketContext, ...data } = result;
  
  return {
    data: data as LoadData,
    aiNote: marketContext || "No market context available."
  };
}

export async function parseLoadImage(base64Image: string): Promise<{ data: LoadData; aiNote: string }> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      { text: "Extract load details from this screenshot of a load board." },
      {
        inlineData: {
          mimeType: "image/png",
          data: base64Image.split(",")[1] || base64Image
        }
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: LOAD_SCHEMA,
      systemInstruction: "You are a freight dispatcher assistant. Extract load details from images accurately. Always provide a 'marketContext' note that includes a brief route assessment AND a specific AI-recommended bid amount (e.g., 'AI Recommended Bid: $X,XXX')."
    }
  });

  const result = JSON.parse(response.text || "{}");
  const { marketContext, ...data } = result;

  return {
    data: data as LoadData,
    aiNote: marketContext || "No market context available."
  };
}

export async function getMarketInsight(data: LoadData): Promise<string> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Provide a brief market insight for this load.
    Parameters:
    Origin: ${data.origin || 'Not specified'}
    Destination: ${data.destination || 'Not specified'}
    Miles: ${data.loadedMiles || 'Unknown'}
    Weight: ${data.weight || 'Unknown'} lbs
    
    If origin or destination are missing, provide insights based on the available data (miles and weight) and general market conditions for sprinter vans.`,
    config: {
      systemInstruction: "You are a freight market expert. Provide a concise market insight. The insight MUST START with the AI-recommended bid and CPM (e.g., 'AI Recommended Bid: $X,XXX | AI Recommended CPM: $X.XX'), followed by a brief route assessment for the given parameters. If locations are unknown, provide a general range based on the distance and weight."
    }
  });

  return response.text || "No specific market insights at this time.";
}
