import supabase from "../config/databaseConfig.js";

/* This model handles a user's watchlist for anime. A user can create, update, fetch, and delete their watchlists. */

/*
    Get User is in each function to ensure the user is valid and authenticated before performing any operations.
*/

// This object helps map the types of watchlist status a user can have to the ENUM stored in the database.
const Watchlist_Status = Object.freeze({
    WATCHING: 'watching',
    COMPLETED: 'completed',
    ON_HOLD: 'on_hold',
    DROPPED: 'dropped',
    PLAN_TO_WATCH: 'plan_to_watch'
});

export const fetchWatchlist = async () => {
    const {data: userData, error: userError} = await supabase.auth.getUser();
    if (!userData || !userData.user) throw new Error('User not authenticated');
    if (userError) throw userError;

    const {data: watchList, error: fetchError} = await supabase.from('watchlist').select().eq('user_id', userData.user.id);
    if (fetchError) throw fetchError;

    return watchList;
}

export const fetchWatchlistWithAnimeTitles = async (supabaseClient, userId) => {
    // Fetch user watchlist along with the associated anime titles from the kitsu_anime_data table
    const {data: watchList, error: fetchError} = await supabaseClient
    .from('watchlist')
    .select(`id, status, 
    kitsu_anime_data (
        id,
        title,
        image_url,
        origin_genre
        )`)
    .eq('user_id', userId);



    if (fetchError) throw fetchError;
    if (!watchList) {
        throw new Error('Watchlist does not exist')
    }

    return watchList;
}

export const createWatchlist = async ({anime_id, status}, supabaseClient, userId) => {

    //Validate the status type
    if (!Object.values(Watchlist_Status).includes(status)) {
        throw new Error('Invalid watchlist status');
    } else {
        status = Watchlist_Status[status.toUpperCase()];
    }

    const response = await supabaseClient.from('watchlist').insert({anime_id: anime_id, status, user_id: userId}).select();

    if (!response || response.length === 0) throw new Error('Failed to create watchlist');
    

    return response;
}

export const updateExistingWatchlist = async (watchListId, updatedData, supabaseClient) => {

    //check if specific watchlist exists before trying to update it
    const {data: existingWatchlist, error: fetchError} = await supabaseClient.from('watchlist').select().eq('id',watchListId);
    if (!existingWatchlist) throw new Error('Watchlist does not exist');
    if (fetchError) throw fetchError;

    const response = await supabaseClient.from('watchlist').update(updatedData).eq('id',watchListId).select();

    if (!response || response.length === 0) throw new Error('Failed to update watchlist');
    if (response.error) throw response.error;
    
    return response;
}

export const deleteWatchlist = async (watchListId, supabaseClient) => {
    
    //check if specific watchlist exists before trying to delete it
    const {data: existingWatchlist, error: fetchError} = await supabaseClient.from('watchlist').select().eq('id',watchListId);
    //error handling for fetch
    if (!existingWatchlist) throw new Error('Watchlist does not exist');
    if (fetchError) throw fetchError;

    const response = await supabaseClient.from('watchlist').delete().eq('id', watchListId);
    return response;
}

export const deleteWatchlistByAnimeId = async (animeId, supabaseClient) => {
    
    //check if specific watchlist exists before trying to delete it
    const {data: existingWatchlist, error: fetchError} = await supabaseClient.from('watchlist').select().eq('anime_id',animeId);
    //error handling for fetch
    if (!existingWatchlist) throw new Error('Watchlist does not exist');
    if (fetchError) throw fetchError;

    const response = await supabaseClient.from('watchlist').delete().eq('anime_id', animeId);
    console.log(response);
    return response;
}