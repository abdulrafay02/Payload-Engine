import { GoogleGenAI, Type } from "@google/genai";
import { NextResponse } from "next/server";

// Use the private key if available, fallback to the public one for AI Studio preview
const apiKey = process.env.LLM_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || "" });

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

export async function POST(req: Request) {
  try {
    const { action, payload } = await req.json();

    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API key is not configured on the server." }, { status: 500 });
    }

    if (action === "parseText") {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Extract load details from this text: "${payload.text}"`,
        config: {
          responseMimeType: "application/json",
          responseSchema: LOAD_SCHEMA,
          systemInstruction: "You are a freight dispatcher assistant. Extract load details accurately. Always provide a 'marketContext' note. The note MUST START with the AI-recommended bid and CPM (e.g., 'AI Recommended Bid: $X,XXX | AI Recommended CPM: $X.XX'), followed by a brief route assessment."
        }
      });

      const result = JSON.parse(response.text || "{}");
      const { marketContext, ...data } = result;
      return NextResponse.json({ data, aiNote: marketContext });
    }

    if (action === "parseImage") {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          { text: "Extract load details from this screenshot of a load board." },
          {
            inlineData: {
              mimeType: "image/png",
              data: payload.base64Image.split(",")[1] || payload.base64Image
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
      return NextResponse.json({ data, aiNote: marketContext });
    }

    if (action === "getInsight") {
      const { data } = payload;
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

      return NextResponse.json({ insight: response.text });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("AI API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
