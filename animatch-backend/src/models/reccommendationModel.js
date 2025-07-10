import supabase from '../config/databaseConfig.js';
import { generateAIReccommendations } from '../services/reccommendationService.js';

/*
    Get User is in each function to ensure the user is valid and authenticated before performing any operations.
*/

export const fetchAIRecs =  async () => {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!userData || !userData.user) {
        throw new Error('User not authenticated');
    }

    // Fetch AI Recs for user in ascending order of similarity score, so the user can see their highest recommendations first
    const {data: aiRecs, error: fetchError} = await supabase.from('ai_recommendations').select().eq('user_id', userData.user.id).order('similarity_score', { ascending: false });

    if (fetchError) throw fetchError;
    if (!aiRecs) {
        throw new Error('No AI recommendations found for the user');
    }
    return aiRecs;
}

export const insertAIRecs = async () => {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!userData || !userData.user) {
        throw new Error('User not authenticated');
    }

    // Generate AI recommendations for the user and add the user_id to each recommendation
    const recs = await generateAIReccommendations();
    const recsWithuser = recs.recommendations.map(rec => ({
        ...rec,
        user_id: userData.user.id
    }));

    const { data, error } = await supabase.from('ai_recommendations').insert(recsWithuser).select();
    if (error) throw error;
    return data;
}