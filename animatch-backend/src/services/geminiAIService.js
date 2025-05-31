import {GoogleGenAI} from '@google/genai';
import { GEMINI_API_KEY } from '../config/apiConfig.js';
import {buildRecommendationPrompt} from '../utils/reccommendationPromptBuilder.js';

const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});

export const getAIAnimeReccommendations = async (userData) => {
    try {
        const model = 'gemini-2.0-flash-001';
        const prompt = buildRecommendationPrompt(userData);

        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });

        if (!response || !response.text) throw new Error('No response from AI model');

        //trim the response to ensure it is valid JSON
        const processedResponse = response.text.replace(/^```json|```$/g, '').trim();


        console.log(processedResponse);

        return JSON.parse(processedResponse);
    } catch (error) {
        throw new Error(`Error generating AI reccomendations: ${error}`);
    }
}