import {createWatchlist, updateExistingWatchlist, fetchWatchlist, deleteWatchlist,fetchWatchlistWithAnimeTitles, deleteWatchlistByAnimeId} from '../models/watchlistModel.js';

// This service handles user watchlists, allowing users to save, delete, update, and fetch their watchlists.

export const getWatchlist = async () => {
    return await fetchWatchlist();
}

export const getWatchlistWithAnimeTitles = async (supabaseClient, userId) => {
    return await fetchWatchlistWithAnimeTitles(supabaseClient, userId);
}

export const insertWatchlist = async (watchlistData, supabaseClient, userId) => {
    return await createWatchlist(watchlistData, supabaseClient, userId);
}

export const updateWatchlist = async (watchlistId, watchlistData, supabaseClient) => {
    return await updateExistingWatchlist(watchlistId, watchlistData, supabaseClient);
}

export const removeWatchlist = async (watchlistId, supabaseClient) => {
    return await deleteWatchlist(watchlistId, supabaseClient);
}

export const removeWatchlistByAnimeId = async(animeId, supabaseClient) => {
    return await deleteWatchlistByAnimeId(animeId, supabaseClient);
}