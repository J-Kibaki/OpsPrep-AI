import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { PROMPTS } from "../constants";
import { Question, AnswerGuide, Job } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getCleanJson = (text: string): string => {
    return text.replace(/```json/g, '').replace(/```/g, '').trim();
};

export const generateQuestions = async (
    role: string,
    level: string,
    cloud: string,
    topics: string[]
): Promise<Question[]> => {
    const prompt = PROMPTS.QUESTION_GENERATOR
        .replace('{count}', '5')
        .replace('{seniority}', level)
        .replace('{role}', role)
        .replace('{topics}', topics.join(', '))
        .replace('{cloud_provider}', cloud);

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
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
    const prompt = PROMPTS.ANSWER_GUIDE.replace('{question_text}', questionText);

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash', // Using flash for speed, could use pro for quality
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                temperature: 0.4 // Lower temp for factual answers
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
    const prompt = PROMPTS.JOB_PARSER.replace('{raw_job_text}', rawText);

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
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

export const createMockInterviewSession = (systemInstruction: string) => {
    return ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction,
        }
    });
};
