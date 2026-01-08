
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const geminiService = {
  /**
   * Suggests a competitive price for a listing based on its characteristics.
   */
  async suggestSmartPrice(details: { city: string, type: string, amenities: string[], bedrooms: number }) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Act as a real estate pricing expert for vacation rentals. 
        Given these details: City: ${details.city}, Type: ${details.type}, Bedrooms: ${details.bedrooms}, Amenities: ${details.amenities.join(', ')}.
        Suggest a daily price in USD and a brief reason.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              suggestedPrice: { type: Type.NUMBER },
              reason: { type: Type.STRING }
            },
            required: ['suggestedPrice', 'reason']
          }
        }
      });
      return JSON.parse(response.text);
    } catch (error) {
      console.error("Gemini Pricing Error:", error);
      return { suggestedPrice: 0, reason: "Could not calculate price." };
    }
  },

  /**
   * Generates a high-quality listing description.
   */
  async generateDescription(details: { title: string, amenities: string[], vibe: string }) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Write a compelling Airbnb-style listing description for a place titled "${details.title}". 
        It has these amenities: ${details.amenities.join(', ')}. 
        The desired vibe is ${details.vibe}. Keep it under 150 words.`,
      });
      return response.text;
    } catch (error) {
      console.error("Gemini Description Error:", error);
      return "An amazing place to stay!";
    }
  }
};
