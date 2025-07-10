import {createWatchlist, updateExistingWatchlist, fetchWatchlist, deleteWatchlist,fetchWatchlistWithAnimeTitles} from '../models/watchlistModel.js';

// This service handles user watchlists, allowing users to save, delete, update, and fetch their watchlists.

export const getWatchlist = async () => {
    return await fetchWatchlist();
}

export const getWatchlistWithAnimeTitles = async () => {
    return await fetchWatchlistWithAnimeTitles();
}

export const insertWatchlist = async (watchlistData) => {
    return await createWatchlist(watchlistData);
}

export const updateWatchlist = async (watchlistId, watchlistData) => {
    return await updateExistingWatchlist(watchlistId, watchlistData);
}

export const removeWatchlist = async (watchlistId) => {
    return await deleteWatchlist(watchlistId);
}