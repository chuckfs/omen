import type { SymbolInfo, Geolocation, SpiritualPractice } from "../types";

export const fetchSymbolInfoAndImage = async (
  query: string,
  location: Geolocation | null,
  spiritualPractice?: SpiritualPractice | null
): Promise<{ info: SymbolInfo; imageUrl: string }> => {
  try {
    const response = await fetch("/api/omen", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        location,
        spiritualPractice: spiritualPractice ?? null,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || "Failed to fetch symbol info from backend.");
    }

    const data = (await response.json()) as {
      info: SymbolInfo;
      imageUrl: string;
      error?: string;
    };

    if (data.error) {
      throw new Error(data.error);
    }

    if (!data.info || !data.imageUrl) {
      throw new Error("Backend did not return the expected symbol info or image.");
    }

    return { info: data.info, imageUrl: data.imageUrl };
  } catch (error) {
    console.error("Error in frontend Gemini proxy service:", error);

    let message = "Failed to process the request with the Omen backend.";
    if (error instanceof Error && error.message) {
      message = error.message;
    }

    throw new Error(message);
  }
};