
import { GoogleGenAI, Type } from "@google/genai";
import type { SagaInput, Saga, Feedback } from '../types';

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
Generarás un título y un mensaje épicos y temáticos para el usuario, basándote en la siguiente información:

ENTRADA DEL USUARIO (INPUT)
1.  \`$LANGUAGE\`: Idioma de la respuesta ('en' o 'es'). DEBES responder en este idioma.
2.  \`$THEME\`: El universo temático.
3.  \`$ROLE\`: El rol del usuario.
4.  \`$COMPLETED_TASK\`: La tarea que acaba de completar.
5.  \`$IS_FINAL\`: Un booleano.
    - Si es \`false\`, el mensaje debe registrar la hazaña completada de forma concisa, como una entrada en un diario de gestas.
    - Si es \`true\`, el mensaje debe ser una felicitación grandiosa por haber completado toda la misión, usando la tarea completada como el golpe de gracia.
`;

export async function generateSaga(input: SagaInput, language: 'en' | 'es'): Promise<Saga> {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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
      model: 'gemini-2.5-pro',
      contents: userPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
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
    
    const parsedSaga = JSON.parse(response.text);

    const sagaWithCompletion: Saga = {
      ...parsedSaga,
      objectives: parsedSaga.objectives.map((obj: { originalTask: string; missionTask: string; }) => ({ ...obj, completed: false }))
    };

    return sagaWithCompletion;
    
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof SyntaxError) {
      throw new Error("The storyteller's response was garbled. Please try rephrasing your request.");
    }
    throw new Error("Failed to generate saga. The connection to the storyteller was lost.");
  }
}

export async function generateFeedback(input: {
  theme: string;
  role: string;
  completedTask: string;
  isFinal: boolean;
}, language: 'en' | 'es'): Promise<Feedback> {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const userPrompt = `$LANGUAGE: "${language}"\n$THEME: "${input.theme}"\n$ROLE: "${input.role}"\n$COMPLETED_TASK: "${input.completedTask}"\n$IS_FINAL: ${input.isFinal}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: userPrompt,
      config: {
        systemInstruction: FEEDBACK_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
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

    const parsedFeedback = JSON.parse(response.text);
    return {
      ...parsedFeedback,
      id: self.crypto.randomUUID()
    };

  } catch (error) {
    console.error("Error calling Gemini API for feedback:", error);
    throw new Error("The storyteller is momentarily silent. Could not generate feedback.");
  }
}