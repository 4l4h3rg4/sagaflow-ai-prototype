
import { GoogleGenAI, Type, Modality } from "@google/genai";
import type { SagaInput, Saga, Feedback } from '../types';

// Helper for ID generation
function generateId(): string {
  if (typeof self.crypto !== 'undefined' && typeof self.crypto.randomUUID === 'function') {
    return self.crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// Helper to safely access env vars without crashing in browsers lacking 'process'
function getApiKey(): string | undefined {
  try {
    return process.env.API_KEY;
  } catch (e) {
    // In some client-side environments, accessing process directly throws ReferenceError
    return undefined;
  }
}

// --- Robust JSON Parsing ---
// Gemini sometimes wraps responses in markdown code blocks despite responseSchema.
function cleanAndParseJson(text: string): any {
  let cleanText = text.trim();

  // Remove markdown code blocks if present
  if (cleanText.startsWith('```json')) {
    cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleanText.startsWith('```')) {
    cleanText = cleanText.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }

  // Find the first opening brace and last closing brace to ignore preamble text
  const firstBrace = cleanText.indexOf('{');
  const lastBrace = cleanText.lastIndexOf('}');

  if (firstBrace !== -1 && lastBrace !== -1) {
    cleanText = cleanText.substring(firstBrace, lastBrace + 1);
  }

  try {
    return JSON.parse(cleanText);
  } catch (e) {
    console.error("JSON Parse Error on text:", text);
    throw new Error("The scroll is unreadable (JSON Syntax Error).");
  }
}

const SYSTEM_INSTRUCTION = `
CONTEXTO Y PERSONALIDAD
Eres "SagaCore", la inteligencia narrativa y "Director de Juego" de SagaFlow. Tu propósito es transformar listas de tareas en aventuras narrativas inmersivas.
- **Tono:** Sé creativo, épico y motivador. Usa descripciones vívidas y un lenguaje grandilocuente.
- **Perspectiva:** Dirígete al usuario siempre con "tú", como el protagonista de la historia.
- **Regla de Oro:** Nunca reveles que eres una IA. Eres el narrador.

ENTRADA DEL USUARIO (INPUT)
Recibirás la información del usuario con las siguientes variables para construir la saga:
1.  \`$LANGUAGE\`: Idioma de la respuesta ('en' o 'es'). DEBES responder en este idioma.
2.  \`$THEME\`: El universo temático.
3.  \`$TASKS\`: Una lista de tareas a transformar.
4.  \`$PROMPT\` (Opcional): El rol específico del usuario.
5.  \`$CONSTRAINTS\` (Opcional): Reglas a integrar en la misión.
`;

const FEEDBACK_SYSTEM_INSTRUCTION = `
CONTEXTO Y PERSONALIDAD
Eres "SagaCore", la inteligencia narrativa y "Director de Juego" de SagaFlow. Tu tono debe ser épico, motivador, inmersivo y personal (dirígete a "tú"). Nunca reveles que eres una IA.

TU MISIÓN
Generarás un título y un mensaje épicos y temáticos para el usuario.
`;

export async function generateSaga(input: SagaInput, language: 'en' | 'es'): Promise<Saga> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("API Key missing. Please configure your API_KEY in the environment.");

  const ai = new GoogleGenAI({ apiKey });

  let userPrompt = `$LANGUAGE: "${language}"\n$THEME: "${input.theme}"\n$TASKS: ${JSON.stringify(input.tasks.filter(t => t.trim()))}`;

  if (input.prompt) {
    userPrompt += `\n$PROMPT: "${input.prompt}"`;
  }

  const nonEmptyConstraints = input.constraints.filter(c => c.trim());
  if (nonEmptyConstraints.length > 0) {
    userPrompt += `\n$CONSTRAINTS: ${JSON.stringify(nonEmptyConstraints)}`;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Switched to Flash for speed/reliability in demos
      contents: userPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 0 }, // Disable thinking for faster response on creative tasks
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            scenario: { type: Type.STRING, description: "The introductory narrative setting the scene." },
            roleAndObjective: { type: Type.STRING, description: "The user's role and their overall goal." },
            objectives: {
              type: Type.ARRAY,
              description: "A list of mission objectives derived from the user's tasks.",
              items: {
                type: Type.OBJECT,
                properties: {
                  originalTask: { type: Type.STRING, description: "The exact user-provided task." },
                  missionTask: { type: Type.STRING, description: "The gamified version of the task." }
                },
                required: ["originalTask", "missionTask"]
              }
            },
            missionRules: { type: Type.STRING, description: "Optional rules based on user constraints." },
            callToAction: { type: Type.STRING, description: "A final motivating sentence." }
          },
          required: ["scenario", "roleAndObjective", "objectives", "callToAction"]
        }
      }
    });

    // Use robust parsing
    const parsedSaga = cleanAndParseJson(response.text);

    const sagaWithCompletion: Saga = {
      ...parsedSaga,
      objectives: parsedSaga.objectives.map((obj: { originalTask: string; missionTask: string; }) => ({ ...obj, completed: false }))
    };

    return sagaWithCompletion;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error && error.message.includes("scroll is unreadable")) {
      throw error;
    }
    throw new Error("Failed to generate saga. The connection to the storyteller was lost.");
  }
}

export async function generateScenarioImage(theme: string, scenario: string): Promise<string | null> {
  const apiKey = getApiKey();
  if (!apiKey) return null;
  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `Cinematic, epic digital art concept for a video game background. Theme: ${theme}. Scene description: ${scenario.substring(0, 250)}. Wide angle, atmospheric lighting, highly detailed, matte painting style. No text, no HUD, no UI elements.`,
          },
        ],
      },
      // responseMimeType and responseSchema are not supported for nano banana series models
    });

    if (response.candidates && response.candidates.length > 0) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64EncodeString = part.inlineData.data;
          const mimeType = part.inlineData.mimeType || 'image/png';
          return `data:${mimeType};base64,${base64EncodeString}`;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
}

// Optimized: Returns base64 string only. Decoding happens in the component to save AudioContexts.
export async function generateNarratorAudio(text: string, language: 'en' | 'es'): Promise<string | null> {
  const apiKey = getApiKey();
  if (!apiKey) return null;
  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Fenrir' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio || null;

  } catch (error) {
    console.error("Error generating audio:", error);
    throw new Error("The narrator has lost their voice.");
  }
}

export async function generateFeedback(input: {
  theme: string;
  role: string;
  completedTask: string;
  isFinal: boolean;
}, language: 'en' | 'es'): Promise<Feedback> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("API Key missing");
  const ai = new GoogleGenAI({ apiKey });

  const userPrompt = `$LANGUAGE: "${language}"\n$THEME: "${input.theme}"\n$ROLE: "${input.role}"\n$COMPLETED_TASK: "${input.completedTask}"\n$IS_FINAL: ${input.isFinal}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction: FEEDBACK_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 0 },
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "A short, epic title for the feedback." },
            message: { type: Type.STRING, description: "A short, thematic congratulatory message." },
          },
          required: ["title", "message"]
        }
      }
    });

    const parsedFeedback = cleanAndParseJson(response.text);
    return {
      ...parsedFeedback,
      id: generateId()
    };

  } catch (error) {
    console.error("Error calling Gemini API for feedback:", error);
    throw new Error("The storyteller is momentarily silent.");
  }
}

export async function generateCheckIn(
  theme: string,
  scenario: string,
  pendingTaskOriginal: string,
  pendingTaskMission: string,
  language: 'en' | 'es'
): Promise<string | null> {
  const apiKey = getApiKey();
  if (!apiKey) return null;
  const ai = new GoogleGenAI({ apiKey });

  const userPrompt = `Eres SagaCore. El usuario está en una aventura con tema '${theme}'. El escenario actual es: '${scenario}'. Parece que se ha detenido en esta parte de la misión: '${pendingTaskMission}' (tarea real: '${pendingTaskOriginal}'). Genera un mensaje CORTO (máximo 3 oraciones) EN PERSONAJE del tema, preguntando amablemente cómo va. NO preguntes '¿sigues ahí?' de forma genérica. Haz referencia al escenario y a la tarea de forma natural y narrativa. Usa el idioma: ${language}.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text || null;
  } catch (error) {
    console.error("Error generating check-in:", error);
    return null;
  }
}

export async function generateMicroGoals(
  theme: string,
  scenario: string,
  taskOriginal: string,
  taskMission: string,
  language: 'en' | 'es'
): Promise<{ step1: string, step2: string, step3: string } | null> {
  const apiKey = getApiKey();
  if (!apiKey) return null;
  const ai = new GoogleGenAI({ apiKey });

  const userPrompt = `Eres SagaCore. El usuario está bloqueado en esta tarea: '${taskOriginal}' (versión misión: '${taskMission}'). Tema: '${theme}'. Divide esta tarea en exactamente 3 micro-pasos de ~2 minutos cada uno. Cada paso debe ser concreto y accionable. Mantén el tono narrativo del tema '${theme}' pero que los pasos sean CLAROS sobre qué hacer en la vida real. Responde en idioma: ${language}.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            step1: { type: Type.STRING },
            step2: { type: Type.STRING },
            step3: { type: Type.STRING }
          },
          required: ["step1", "step2", "step3"]
        }
      }
    });

    return cleanAndParseJson(response.text);
  } catch (error) {
    console.error("Error generating micro-goals:", error);
    return null;
  }
}
