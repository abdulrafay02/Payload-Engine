import { LoadData, VehicleConfig } from "./types";

async function aiRequest<T>(action: string, payload: any): Promise<T> {
  const response = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, payload }),
  });

  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(result.error || `AI Request failed: ${action}`);
  }

  return result;
}

export async function parseLoadText(text: string, vehicle: VehicleConfig): Promise<{ data: LoadData; aiNote: string }> {
  const result = await aiRequest<{ data: LoadData; aiNote: string }>("parseText", { text, vehicle });
  return {
    data: result.data,
    aiNote: result.aiNote || "No market context available."
  };
}

export async function parseLoadImage(base64Image: string, vehicle: VehicleConfig): Promise<{ data: LoadData; aiNote: string }> {
  const result = await aiRequest<{ data: LoadData; aiNote: string }>("parseImage", { base64Image, vehicle });
  return {
    data: result.data,
    aiNote: result.aiNote || "No market context available."
  };
}

export async function getMarketInsight(data: LoadData, vehicle: VehicleConfig): Promise<string> {
  const result = await aiRequest<{ insight: string }>("getInsight", { data, vehicle });
  return result.insight || "No specific market insights at this time.";
}
