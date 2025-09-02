import supabase from '../config/databaseConfig.js';
import { generateAIReccommendations } from '../services/reccommendationService.js';

/*
    Get User is in each function to ensure the user is valid and authenticated before performing any operations.
*/

export const fetchAIRecs = async (supabaseClient, userId) => {
    console.log('in fetchAIRecs');
    // Fetch AI Recs for user in ascending order of similarity score, so the user can see their highest recommendations first
    const {data: aiRecs, error: fetchError} = await supabaseClient.from('ai_recommendations').select().eq('user_id', userId).order('similarity_score', { ascending: false });

    if (fetchError) throw fetchError;
    if (!aiRecs) {
        throw new Error('No AI recommendations found for the user');
    }
    console.log('exiting fetchAIRecs');
    return aiRecs;
}

export const insertAIRecs = async (supabaseClient, userId) => {


    // Generate AI recommendations for the user and add the user_id to each recommendation
    const recs = await generateAIReccommendations(supabaseClient, userId);
    const recsWithuser = recs.recommendations.map(rec => ({
        ...rec,
        user_id: userId
    }));



    const { data, error } = await supabaseClient.from('ai_recommendations').insert(recsWithuser).select();
    if (error) throw error;
    return data;
}