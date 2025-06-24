import {getAIAnimeReccommendations,getAIAnimeReccommendationsWInput} from '../services/geminiAIService.js';
import {fetchPreferences} from '../models/preferenceModel.js';
import {fetchUserReactionsWithAnimeTitles} from '../models/userReactionModel.js';
import {fetchWatchlistWithAnimeTitles} from '../models/watchlistModel.js';

export const generateAIReccommendations = async () => {
    const [preferences, watchlist, reactions] = await Promise.all([
        fetchPreferences(),
        fetchWatchlistWithAnimeTitles(),
        fetchUserReactionsWithAnimeTitles(),
    ]);

    const userData = {preferences, watchlist, reactions};

    try {
        const recommendations = await getAIAnimeReccommendations(userData);
        return recommendations;
    } catch (error) {
        console.error('Error generating recommendations:', error);
        throw new Error('Failed to generate recommendations');
    }
}

export const generateAIReccommendationsWithInput = async (user_input) => {
    const [preferences, watchlist, reactions] = await Promise.all([
        fetchPreferences(),
        fetchWatchlistWithAnimeTitles(),
        fetchUserReactionsWithAnimeTitles(),
    ]);

    const userData = {preferences, watchlist, reactions, user_input};

    try {
        const recommendations = await getAIAnimeReccommendationsWInput(userData);
        return recommendations;
    } catch (error) {
        console.error('Error generating recommendations:', error);
        throw new Error('Failed to generate recommendations');
    }
}