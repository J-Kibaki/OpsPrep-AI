import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { PROMPTS } from "../constants";
import { Question, AnswerGuide, Job, CheatSheet, InterviewFeedback } from "../types";

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
            model: 'gemini-2.5-flash', 
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

export const generateCheatSheet = async (topic: string): Promise<CheatSheet | null> => {
    const prompt = PROMPTS.CHEAT_SHEET_GENERATOR.replace('{topic}', topic);

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
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
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction,
        }
    });
};

export const evaluateInterview = async (messages: { role: string; text: string }[]): Promise<InterviewFeedback | null> => {
    const transcript = messages
        .map(m => `${m.role === 'model' ? 'Interviewer' : 'Candidate'}: ${m.text}`)
        .join('\n\n');

    const prompt = PROMPTS.INTERVIEW_EVALUATOR.replace('{transcript}', transcript);

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
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