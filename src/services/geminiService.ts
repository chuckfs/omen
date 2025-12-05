import { GoogleGenAI, Type } from "@google/genai";
import type { SymbolInfo, Geolocation, SpiritualPractice } from '../types';

// NOTE: In a production export, you might switch this to import.meta.env.VITE_API_KEY
// or proxy through a backend to protect the key.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const symbolInfoSchema = {
  type: Type.OBJECT,
  properties: {
    name: {
      type: Type.STRING,
      description: 'The common name of the symbol.',
    },
    interpretations: {
      type: Type.OBJECT,
      description: 'The meaning of the symbol broken down into three specific perspectives.',
      properties: {
        indigenous: {
          type: Type.STRING,
          description: 'Meaning from indigenous, ancient, or folkloric spiritual perspectives. Focus on the region if provided.',
        },
        cultural: {
          type: Type.STRING,
          description: 'Meaning in modern societal, pop-cultural, or general contexts.',
        },
        psychological: {
          type: Type.STRING,
          description: 'Jungian or psychological interpretation (subconscious, archetypes, etc.) of the symbol.',
        },
      },
      required: ['indigenous', 'cultural', 'psychological'],
    },
    history: {
      type: Type.STRING,
      description: 'A brief history of the symbol\'s origin and evolution.',
    },
    image_prompt: {
        type: Type.STRING,
        description: 'A simple, descriptive prompt for an AI image generator to create a clear, minimalist, and iconic representation of this symbol. e.g., "A minimalist Eye of Horus, ancient Egyptian style, vector art on white background".'
    }
  },
  required: ['name', 'interpretations', 'history', 'image_prompt'],
};

interface GeminiResponse {
  name: string;
  interpretations: {
    indigenous: string;
    cultural: string;
    psychological: string;
  };
  history: string;
  image_prompt: string;
}

export const fetchSymbolInfoAndImage = async (
  query: string,
  location: Geolocation | null,
  spiritualPractice?: SpiritualPractice | null
): Promise<{ info: SymbolInfo; imageUrl: string }> => {
  try {
    const beliefContext = spiritualPractice && spiritualPractice !== 'None'
      ? `User's spiritual path: ${spiritualPractice}. Tailor the 'indigenous' or 'cultural' sections to reflect this lens where appropriate.`
      : '';

    const locationContext = location
      ? `User location: Lat ${location.latitude}, Long ${location.longitude}. If this region has specific folklore regarding this symbol, include it in the indigenous interpretation.`
      : '';
    
    // Using gemini-2.5-flash for responsiveness and efficiency on text tasks
    const model = 'gemini-2.5-flash';
    
    const userPrompt = `Analyze the symbol/omen: "${query}". ${beliefContext} ${locationContext}`;

    // Step 1: Get structured information
    const infoResponse = await ai.models.generateContent({
      model: model,
      contents: userPrompt,
      config: {
        systemInstruction: "You are an expert symbologist and mystic guide. Analyze the provided symbol query. Return valid JSON containing the name, three distinct interpretations (indigenous/folklore, cultural/modern, psychological/Jungian), a brief history, and a concise image generation prompt.",
        responseMimeType: 'application/json',
        responseSchema: symbolInfoSchema,
      },
    });

    const infoText = infoResponse.text;
    if (!infoText) {
      throw new Error("No text returned from Gemini model.");
    }

    const parsedInfo = JSON.parse(infoText.trim()) as GeminiResponse;
    const { image_prompt, ...symbolDetails } = parsedInfo;
    
    if (!image_prompt) {
        throw new Error("The model did not provide a valid image prompt.");
    }
    
    // Step 2: Generate an image using the prompt
    // Using imagen-4.0-generate-001 for high quality visuals
    const imageResponse = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: image_prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '1:1',
        },
    });

    const base64ImageBytes = imageResponse.generatedImages?.[0]?.image?.imageBytes;
    if (!base64ImageBytes) {
        throw new Error("Image generation failed, no image data received.");
    }

    const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;

    return { info: symbolDetails as SymbolInfo, imageUrl };

  } catch (error: unknown) {
    console.error("Error in Gemini service:", error);
    
    let message = "Failed to process the request with the AI model.";
    if (error instanceof Error) {
        message = error.message;
        if (message.includes('429')) message = "The spirits are overwhelmed (Rate Limit). Please try again in a moment.";
        if (message.includes('SAFETY')) message = "This symbol cannot be interpreted due to safety guidelines.";
    }
    throw new Error(message);
  }
};