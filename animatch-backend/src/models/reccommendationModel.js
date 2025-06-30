import supabase from '../config/databaseConfig.js';
import { generateAIReccommendations } from '../services/reccommendationService.js';


export const fetchAIRecs =  async () => {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!userData || !userData.user) {
        throw new Error('User not authenticated');
    }

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

    const recs = await generateAIReccommendations();
    const recsWithuser = recs.recommendations.map(rec => ({
        ...rec,
        user_id: userData.user.id
    }));

    const { data, error } = await supabase.from('ai_recommendations').insert(recsWithuser).select();
    if (error) throw error;
    return data;
}