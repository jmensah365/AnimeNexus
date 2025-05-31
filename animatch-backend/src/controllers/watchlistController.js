import {getWatchlist, insertWatchlist, removeWatchlist, updateWatchlist, getWatchlistWithAnimeTitles} from '../services/watchlistService.js';
import { supabaseAuthMiddleware } from "../middlewares/supabaseMiddleware.js";

export const getWatchlistController = async (req, res) => {
    // Check if the user is authenticated
    const {data: {session}, error} = await supabaseAuthMiddleware(req);
    if (error || !session) {
        return res.status(401).json({
            error: true,
            message: 'Unauthorized: Please log in to add preferences'
        });
    }
    try {
        // Fetch the watchlist for the authenticated user
        const watchList = await getWatchlist();

        if(!watchList) {
            return res.status(404).json({
                error:true,
                message: 'No watchlists found for this user'
            });
        }

        // Return the watchlist
        return res.status(200).json({result: watchList, message: 'Watchlist fetched successfully'});
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: `Something went wrong: ${error.message}`
        })
    }
}

export const getWatchlistControllerWithAnimeTitles = async (req, res) => {
    // Check if the user is authenticated
    const {data: {session}, error} = await supabaseAuthMiddleware(req);
    if (error || !session) {
        return res.status(401).json({
            error: true,
            message: 'Unauthorized: Please log in to add preferences'
        });
    }
    try {
        // Fetch the watchlist for the authenticated user
        const watchList = await getWatchlistWithAnimeTitles();

        if(!watchList) {
            return res.status(404).json({
                error:true,
                message: 'No watchlists found for this user'
            });
        }

        // Return the watchlist
        return res.status(200).json({result: watchList, message: 'Watchlist fetched successfully'});
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: `Something went wrong: ${error.message}`
        })
    }
}

export const insertWatchlistController = async (req, res) => {
    // Check if the user is authenticated
    const {data: {session}, error} = await supabaseAuthMiddleware(req);
    if (error || !session) {
        return res.status(401).json({
            error: true,
            message: 'Unauthorized: Please log in to add preferences'
        });
    }
    // Extract watchlist data from the request body
    const watchlistData = req.body;


    // Validate the watchlist data
    if (!watchlistData || !watchlistData.anime_id || !watchlistData.status) {
        return res.status(400).json({
            error:true,
            message: 'Anime data is missing or incomplete'
        })
    }

    try {
        // Insert the watchlist data into the database
        const result = await insertWatchlist(watchlistData);

        if (!result || result.length === 0) {
            return res.status(400).json({
                error: true,
                message: 'Failed to create watchlist'
            })
        }

        if (result.error) {
            return res.status(400).json({
                error: true,
                message: `Failed to create watchlist ${result.error}`
            });
        }

        // Return the created watchlist
        return res.status(201).json({
            result: result.data,
            message: 'Watchlist created successfully'
        })
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: `Something went wrong: ${error.message}`
        })
    }
}

export const updateWatchlistController = async (req, res) => {
    // Check if the user is authenticated
    const {data: {session}, error} = await supabaseAuthMiddleware(req);
    if (error || !session) {
        return res.status(401).json({
            error: true,
            message: 'Unauthorized: Please log in to add preferences'
        });
    }

    // Extract watchlist ID and updated data from the request
    const watchListId = req.params.watchListId;
    const updatedData = req.body;

    // Validate the watchlist ID and updated data
    if (!watchListId) {
        return res.status(400).json({
            error: true,
            message: 'Watchlist ID is missing'
        });
    }
    if (!updatedData || Object.keys(updatedData).length === 0) {
        return res.status(400).json({
            error: true,
            message: 'Updated data is missing'
        });
    }

    try {
        // Update the watchlist in the database
        const result = await updateWatchlist(watchListId, updatedData);
        if (!result || result.length === 0) {
            return res.status(400).json({
                error: true,
                message: 'Failed to update watchlist'
            });
        }

        if (result.error) {
            return res.status(400).json({
                error: true,
                message: `Failed to create watchlist ${result.error}`
            });
        }

        // Return the updated watchlist
        return res.status(200).json({
            result: result,
            message: 'Watchlist updated successfully'
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: `Something went wrong: ${error.message}`
        })
    }
}

export const removeWatchlistController = async (req, res) => {
    // Check if the user is authenticated
    const {data: {session}, error} = await supabaseAuthMiddleware(req);
    if (error || !session) {
        return res.status(401).json({
            error: true,
            message: 'Unauthorized: Please log in to add preferences'
        });
    }
    // Extract watchlist ID from the request parameters
    const watchListId = req.params.watchListId;
    
        if (!watchListId) {
            return res.status(400).json({
                error: true,
                message: 'Watchlist ID is missing'
            });
        }
    
        try {
            // Remove the watchlist from the database
            const result = await removeWatchlist(watchListId);
            if (!result || result.length === 0) {
                return res.status(404).json({
                    error: true,
                    message: 'Watchlist not found or already deleted'
                });
            }
            if (result.error) {
                return res.status(400).json({
                    error: true,
                    message: `Failed to delete watchlist ${result.error}`
                });
            }
            // Return a success message
            return res.status(204).json({
                message: 'Watchlist deleted successfully'
            });
        } catch (error) {
            return res.status(500).json({
                error: true,
                message: `Something went wrong: ${error.message}`
            })
        }
}