
import { GoogleGenAI } from "@google/genai";
import { Skill, Goal, MaxwellLaw } from "../types";

export class GeminiCoachService {
  private ai: GoogleGenAI;
  // Use gemini-3-pro-preview for complex reasoning and coaching tasks.
  private model = 'gemini-3-pro-preview';

  constructor() {
    // Always use the process.env.API_KEY directly as per guidelines.
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async getResponse(
    message: string, 
    context: { 
      skills: Skill[], 
      goals: Goal[], 
      activeLaw: MaxwellLaw | null 
    }
  ) {
    const systemInstruction = `
      You are the "LOS AI Coach", a personal strategic counselor for AKINOLA OLUJOBI's "Life Operating System". 
      Your task is to provide high-level mentorship to users who are multi-talented, seeking financial stability, and emotional/spiritual support.
      
      User Context:
      - Skills: ${context.skills.map(s => `${s.name} (${s.status})`).join(', ')}
      - Major Goals: ${context.goals.map(g => `${g.title} (${g.progress}% done)`).join(', ')}
      - Current Personal Growth Focus: ${context.activeLaw ? context.activeLaw.name : 'General Growth'}
      
      Tone:
      - Authoritative yet encouraging, strategic, and professional.
      - Deeply incorporate John Maxwell's 15 Invaluable Laws of Growth.
      - Provide faith-based wisdom when appropriate (Christian context).
      - Act as a stability engineer, helping users harmonize their diverse talents into a unified engine.
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: this.model,
        contents: message,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      return response.text || "I'm having trouble connecting right now. Take a deep breath and stay focused on the vision.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "I apologize, but I encountered an error. Let's try again in a moment.";
    }
  }
}

export const coachService = new GeminiCoachService();
