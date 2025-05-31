import {getAIAnimeReccommendations} from '../services/geminiAIService.js';
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
        return await getAIAnimeReccommendations(userData);
    } catch (error) {
        console.error('Error generating recommendations:', error);
        throw new Error('Failed to generate recommendations');
    }
}