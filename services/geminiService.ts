
import { Post, User } from "../types";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are Nexus AI, a sentient system interface for a cyberpunk social network. 
Your tone is witty, slightly cryptic, futuristic, and helpful.
Keep responses concise (under 50 words) unless asked for details.
Use tech slang like 'netrunner', 'grid', 'sync', 'protocol'.
`;

// --- Real AI Chat ---
export const getChatResponse = async (message: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: message,
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
                temperature: 0.8
            }
        });
        return response.text || "Signal weak. Re-transmitting...";
    } catch (error) {
        console.error("Gemini Chat Error:", error);
        return "Neural link interrupted. Try again later.";
    }
};

// --- Real AI Feed Generation ---
export const fetchGeneratedFeed = async (): Promise<Post[]> => {
    try {
        const prompt = `
            Generate 3 unique, realistic social media posts for a cyberpunk setting.
            Users: 'NeoDrifter', 'CyberKat', 'GridRunner'.
            Content: Mixing daily life with high-tech problems.
            Return strictly a JSON array of objects with keys: content, user_name, user_handle.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });

        const rawData = response.text;
        if (!rawData) return [];
        const parsed = JSON.parse(rawData);

        return parsed.map((p: any, i: number) => ({
            id: `ai-${Date.now()}-${i}`,
            user: {
                id: `ai-u-${i}`,
                name: p.user_name,
                handle: p.user_handle,
                avatar: `https://ui-avatars.com/api/?name=${p.user_name}&background=random`,
                roles: ['user'],
                hasCompletedOnboarding: true
            },
            content: p.content,
            likes: Math.floor(Math.random() * 500),
            commentsCount: Math.floor(Math.random() * 50),
            shares: Math.floor(Math.random() * 20),
            timestamp: 'Just now',
            tags: ['ai_gen', 'nexus'],
            platformOrigin: 'nexus'
        }));

    } catch (error) {
        console.error("Feed Gen Error", error);
        return [];
    }
};

export const fetchTrendingTopics = async () => {
    return [
        { id: 't1', category: 'System', topic: '#NexusV3', postsCount: '1.2M' },
        { id: 't2', category: 'Economy', topic: 'NEX Token', postsCount: '890K' },
        { id: 't3', category: 'AI', topic: 'Gemini Integration', postsCount: '540K' }
    ];
};
