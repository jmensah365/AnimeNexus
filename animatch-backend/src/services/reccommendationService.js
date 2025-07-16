import {getAIAnimeReccommendations,getAIAnimeReccommendationsWInput, getDailySpin} from '../services/geminiAIService.js';
import {fetchPreferences} from '../models/preferenceModel.js';
import {fetchUserReactionsWithAnimeTitles} from '../models/userReactionModel.js';
import {fetchWatchlistWithAnimeTitles} from '../models/watchlistModel.js';
import { insertAIRecs, fetchAIRecs } from '../models/reccommendationModel.js';

/* This service allows me to generate AI reccommendations with and without user input
    It also fetches AI Recs from the DB and inserts them into the DB
     */

export const insertAIReccommendations = async () => {
    return await insertAIRecs();
}

export const fetchAIReccommendations = async () => {
    return await fetchAIRecs();
}

export const generateAIReccommendations = async () => {
    const [preferences, watchlist, reactions, previous_recommendations] = await Promise.all([
        fetchPreferences(),
        fetchWatchlistWithAnimeTitles(),
        fetchUserReactionsWithAnimeTitles(),
        fetchAIRecs()
    ]);

    const userData = {preferences, watchlist, reactions, previous_recommendations};


    try {
        const recommendations = await getAIAnimeReccommendations(userData);
        return recommendations;
    } catch (error) {
        console.error('Error generating recommendations:', error);
        throw new Error('Failed to generate recommendations');
    }
}

export const generateAIReccommendationsWithInput = async (user_input) => {
    const [preferences, watchlist, reactions, previous_recommendations] = await Promise.all([
        fetchPreferences(),
        fetchWatchlistWithAnimeTitles(),
        fetchUserReactionsWithAnimeTitles(),
        fetchAIRecs()
    ]);

    const userData = {preferences, watchlist, reactions,previous_recommendations, user_input};

    try {
        const recommendations = await getAIAnimeReccommendationsWInput(userData);
        return recommendations;
    } catch (error) {
        console.error('Error generating recommendations:', error);
        throw new Error('Failed to generate recommendations');
    }
}

export const generateDailySpinReccommendation = async () => {
    const [preferences, watchlist, reactions, previous_recommendations] = await Promise.all([
        fetchPreferences(),
        fetchWatchlistWithAnimeTitles(),
        fetchUserReactionsWithAnimeTitles(),
        fetchAIRecs()
    ]);

    const userData = {preferences, watchlist, reactions, previous_recommendations};
    console.log('userData for daily spin:', userData);


    try {
        const recommendations = await getDailySpin(userData);
        console.log(recommendations);
        
        return recommendations;
    } catch (error) {
        console.error('Error generating recommendations:', error);
        throw new Error('Failed to generate recommendations');
    }
}
