import { GoogleGenAI, Type, GenerateContentResponse, Chat, Modality } from "@google/genai";
import { LearningRoadmap, CareerPath, ResumeData, JobPosting, GroundingSource, ChatMessage } from '../types';

let ai: GoogleGenAI;
try {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
} catch (error) {
    console.error("Failed to initialize GoogleGenAI. Is API_KEY set?", error);
    // We'll let individual calls fail to notify the user.
}


// In-memory store for chat histories. Keyed by a user identifier.
// In a real app, this would be in a database like Redis or Firestore.
const chatHistories = new Map<string, Chat>();

const getOrCreateChat = (userId: string): Chat => {
    if (chatHistories.has(userId)) {
        return chatHistories.get(userId)!;
    }
    if (!ai) throw new Error("AI Service is not available.");
    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: 'You are EduFluxAI\'s Smart Tutor. You are a helpful and friendly AI assistant for students learning about technology. Keep your answers concise and encouraging. You can answer questions related to courses, topics, or concepts.',
        },
    });
    chatHistories.set(userId, chat);
    return chat;
}

export const continueChat = async (userId: string, message: string): Promise<string> => {
    try {
        const chat = getOrCreateChat(userId);
        const result = await chat.sendMessage({ message });
        return result.text;
    } catch (error: any) {
        console.error("Error in continueChat:", error);
        throw new Error("Failed to get chat response from AI.");
    }
}

// --- Schemas for structured JSON output ---
const roadmapSchema = { type: Type.OBJECT, properties: { topic: { type: Type.STRING }, steps: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, description: { type: Type.STRING }, resources: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { type: { type: Type.STRING, enum: ['youtube', 'book', 'article', 'documentation'] }, title: { type: Type.STRING }, url: { type: Type.STRING } } } } } } } } };
const careerPathSchema = { type: Type.OBJECT, properties: { name: { type: Type.STRING }, description: { type: Type.STRING }, learningPlan: { type: Type.ARRAY, items: { type: Type.STRING } }, certifications: { type: Type.ARRAY, items: { type: Type.STRING } }, jobPortals: { type: Type.ARRAY, items: { type: Type.STRING } } } };

// --- AI Service Functions ---

const generateWithModel = async (model: string, prompt: string, config?: any) => {
    if (!ai) throw new Error("AI Service not initialized. Please check your API_KEY.");
    try {
        const response = await ai.models.generateContent({ model, contents: prompt, ...config });
        return response;
    } catch (error: any) {
        console.error(`Error with ${model}:`, error.message);
        throw new Error(`Failed to generate content. Please check your API key and try again.`);
    }
};

export const generateLearningRoadmap = async (topic: string): Promise<LearningRoadmap> => {
  const prompt = `Generate a detailed learning roadmap for: "${topic}". Structure it with steps, each having a title, description, and diverse resources (YouTube, books, articles).`;
  const response = await generateWithModel("gemini-2.5-pro", prompt, { config: { responseMimeType: "application/json", responseSchema: roadmapSchema, thinkingConfig: { thinkingBudget: 32768 } } });
  return JSON.parse(response.text) as LearningRoadmap;
};

export const recommendCareerPath = async (answers: Record<string, string>): Promise<CareerPath> => {
    const prompt = `Based on these quiz answers, recommend a tech career path with a plan.\nInterests: ${answers.interests}\nActivities: ${answers.activities}\nStyle: ${answers.learningStyle}\nGoal: ${answers.goal}`;
    const response = await generateWithModel("gemini-2.5-pro", prompt, { config: { responseMimeType: "application/json", responseSchema: careerPathSchema, thinkingConfig: { thinkingBudget: 32768 } } });
    return JSON.parse(response.text) as CareerPath;
};

export const generateResume = async (data: ResumeData): Promise<string> => {
    const prompt = `Act as a pro resume writer. Generate a Markdown resume for a tech role based on this data: ${JSON.stringify(data)}. Use action verbs and quantify achievements.`;
    const response = await generateWithModel('gemini-2.5-pro', prompt);
    return response.text;
};

export const getFutureTrends = async (career: string): Promise<{ text: string; sources: GroundingSource[] }> => {
    const prompt = `As a tech analyst, predict key trends, tech, and skills for a "${career}" in the next 5 years. Use Google Search. Format as Markdown.`;
    const response = await generateWithModel('gemini-2.5-flash', prompt, { config: { tools: [{googleSearch: {}}] } });
    
    // FIX: The raw API response is incompatible with the GroundingSource type expected by the frontend.
    // This transforms the data to ensure `uri` and `title` are always present for valid sources.
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources: GroundingSource[] = groundingChunks
        .filter(chunk => chunk.web?.uri)
        .map(chunk => ({
            web: {
                uri: chunk.web!.uri!,
                title: chunk.web!.title || chunk.web!.uri!,
            },
        }));

    return { text: response.text, sources };
};

export const getDSAHint = async (problemTitle: string): Promise<string> => {
    const prompt = `I need a high-level hint for the DSA problem: "${problemTitle}". Don't give the solution, just the core concept or data structure. Keep it to 2-3 sentences.`;
    const response = await generateWithModel('gemini-2.5-flash', prompt);
    return response.text;
};

export const findJobs = async (role: string, skills: string): Promise<{ jobs: JobPosting[], sources: GroundingSource[] }> => {
    const prompt = `As a tech career assistant, use Google Search to find 3-5 recent job postings for a "${role}" with skills in "${skills}". Return ONLY a raw JSON array of objects with keys: "jobTitle", "company", "location", "description" (1-2 sentences), and "applyLink".`;
    const response = await generateWithModel('gemini-2.5-pro', prompt, { config: { tools: [{ googleSearch: {} }], thinkingConfig: { thinkingBudget: 32768 } } });
    const textResponse = response.text.trim();
    const jsonStart = textResponse.indexOf('[');
    const jsonEnd = textResponse.lastIndexOf(']');
    if (jsonStart === -1 || jsonEnd === -1) throw new Error("AI response did not contain a valid JSON array.");
    const jsonString = textResponse.substring(jsonStart, jsonEnd + 1);

    // FIX: The grounding chunks from the Gemini API have optional `uri` and `title` fields,
    // which is incompatible with our `GroundingSource` type. This maps the response,
    // filtering out chunks without a URI and providing a fallback for the title.
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources: GroundingSource[] = groundingChunks
        .filter(chunk => chunk.web?.uri)
        .map(chunk => ({
            web: {
                uri: chunk.web!.uri!,
                title: chunk.web!.title || chunk.web!.uri!,
            }
        }));

    return { jobs: JSON.parse(jsonString), sources };
};

export const generateSpeech = async (text: string): Promise<string | null> => {
    if (!ai) { console.error("AI Service not available for speech generation."); return null; }
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-preview-tts',
            contents: [{ parts: [{ text }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
            },
        });
        return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
    } catch (error) {
        console.error("Error generating speech:", error);
        return null;
    }
};
