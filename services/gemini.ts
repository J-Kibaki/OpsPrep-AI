import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { PROMPTS } from "../constants";
import { Question, AnswerGuide, Job, CheatSheet, InterviewFeedback } from "../types";

// For Vite, we use import.meta.env
// We also add a check to handle missing keys gracefully in development
const API_KEY = (import.meta.env?.VITE_GEMINI_API_KEY as string) || "";

if (!API_KEY && typeof window !== 'undefined') {
    console.warn("Gemini API Key is missing. Please set VITE_GEMINI_API_KEY in your .env file.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const getCleanJson = (text: string): string => {
    return text.replace(/```json/g, '').replace(/```/g, '').trim();
};

const MODEL_NAME = "gemini-1.5-flash";

export const generateQuestions = async (
    role: string,
    level: string,
    cloud: string,
    topics: string[]
): Promise<Question[]> => {
    if (!API_KEY) return [];

    const prompt = PROMPTS.QUESTION_GENERATOR
        .replace('{count}', '5')
        .replace('{seniority}', level)
        .replace('{role}', role)
        .replace('{topics}', topics.join(', '))
        .replace('{cloud_provider}', cloud);

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                temperature: 0.7
            }
        });

        const text = response.text || "[]";
        return JSON.parse(getCleanJson(text));
    } catch (error) {
        console.error("Error generating questions:", error);
        return [];
    }
};

export const generateAnswerGuide = async (questionText: string): Promise<AnswerGuide | null> => {
    if (!API_KEY) return null;
    const prompt = PROMPTS.ANSWER_GUIDE.replace('{question_text}', questionText);

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: MODEL_NAME, 
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                temperature: 0.4 
            }
        });

        const text = response.text || "{}";
        return JSON.parse(getCleanJson(text));
    } catch (error) {
        console.error("Error generating answer guide:", error);
        return null;
    }
};

export const parseJobDescription = async (rawText: string): Promise<Job | null> => {
    if (!API_KEY) return null;
    const prompt = PROMPTS.JOB_PARSER.replace('{raw_job_text}', rawText);

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
            }
        });

        const text = response.text || "{}";
        return JSON.parse(getCleanJson(text));
    } catch (error) {
        console.error("Error parsing job:", error);
        return null;
    }
};

export const generateCheatSheet = async (topic: string): Promise<CheatSheet | null> => {
    if (!API_KEY) return null;
    const prompt = PROMPTS.CHEAT_SHEET_GENERATOR.replace('{topic}', topic);

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                temperature: 0.3 // Low temp for accurate commands
            }
        });

        const text = response.text || "{}";
        return JSON.parse(getCleanJson(text));
    } catch (error) {
        console.error("Error generating cheat sheet:", error);
        return null;
    }
};

export const createMockInterviewSession = (systemInstruction: string) => {
    return ai.chats.create({
        model: MODEL_NAME,
        config: {
            systemInstruction,
        }
    });
};

export const evaluateInterview = async (messages: { role: string; text: string }[]): Promise<InterviewFeedback | null> => {
    if (!API_KEY) return null;
    const transcript = messages
        .map(m => `${m.role === 'model' ? 'Interviewer' : 'Candidate'}: ${m.text}`)
        .join('\n\n');

    const prompt = PROMPTS.INTERVIEW_EVALUATOR.replace('{transcript}', transcript);

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                temperature: 0.5 
            }
        });

        const text = response.text || "{}";
        return JSON.parse(getCleanJson(text));
    } catch (error) {
        console.error("Error evaluating interview:", error);
        return null;
    }
};

export const parseResume = async (resumeText: string): Promise<any | null> => {
    if (!API_KEY) return null;
    const prompt = PROMPTS.RESUME_PARSER.replace('{resume_text}', resumeText.substring(0, 10000)); // Limit length

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                temperature: 0.2
            }
        });

        const text = response.text || "{}";
        return JSON.parse(getCleanJson(text));
    } catch (error) {
        console.error("Error parsing resume:", error);
        return null;
    }
};