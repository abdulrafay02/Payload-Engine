import { LoadData, VehicleConfig } from "./types";

export async function parseLoadText(text: string, vehicle: VehicleConfig): Promise<{ data: LoadData; aiNote: string }> {
  const response = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "parseText", payload: { text, vehicle } }),
  });

  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(result.error || "Failed to parse load text via AI");
  }

  return {
    data: result.data as LoadData,
    aiNote: result.aiNote || "No market context available."
  };
}

export async function parseLoadImage(base64Image: string, vehicle: VehicleConfig): Promise<{ data: LoadData; aiNote: string }> {
  const response = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "parseImage", payload: { base64Image, vehicle } }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Failed to parse load image via AI");
  }

  return {
    data: result.data as LoadData,
    aiNote: result.aiNote || "No market context available."
  };
}

export async function getMarketInsight(data: LoadData, vehicle: VehicleConfig): Promise<string> {
  const response = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "getInsight", payload: { data, vehicle } }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Failed to get market insights via AI");
  }

  return result.insight || "No specific market insights at this time.";
}
