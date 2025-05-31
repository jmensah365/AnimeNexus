import supabase from "../config/databaseConfig.js";

const Watchlist_Status = Object.freeze({
    WATCHING: 'watching',
    COMPLETED: 'completed',
    ON_HOLD: 'on_hold',
    DROPPED: 'dropped',
    PLAN_TO_WATCH: 'plan_to_watch'
});

export const fetchWatchlist = async () => {
    
    const {data: userData, error: userError} = await supabase.auth.getUser();
    if (!userData || !userData.user) {
        throw new Error('User not authenticated');
    }
    if (userError) throw userError;

    const {data: watchList, error: fetchError} = await supabase.from('watchlist').select().eq('user_id', userData.user.id);
    if (fetchError) throw fetchError;
    if (!watchList) {
        throw new Error('Watchlist does not exist')
    }

    return watchList;
}

export const fetchWatchlistWithAnimeTitles = async () => {
    
    const {data: userData, error: userError} = await supabase.auth.getUser();
    if (!userData || !userData.user) {
        throw new Error('User not authenticated');
    }
    if (userError) throw userError;

    const {data: watchList, error: fetchError} = await supabase
    .from('watchlist')
    .select(`anime_id, status, 
    kitsu_anime_data (
        id,
        title
        )`)
    .eq('user_id', userData.user.id);

    if (fetchError) throw fetchError;
    if (!watchList) {
        throw new Error('Watchlist does not exist')
    }

    return watchList;
}

export const createWatchlist = async ({anime_id, status}) => {
    //get user id
    const {data: userData, error: userError} = await supabase.auth.getUser();

    //preform error handling for user info
    if (!userData || !userData.user) {
        throw new Error('User not authenticated');
    }
    if (userError) throw userError;

    //get the watchlist status from the enum
    if (!Object.values(Watchlist_Status).includes(status)) {
        throw new Error('Invalid watchlist status');
    } else {
        status = Watchlist_Status[status.toUpperCase()];
    }

    //insert into supabase watchlist table
    const response = await supabase.from('watchlist').insert({anime_id: anime_id, status, user_id: userData.user.id}).select();

    //preform error handing for insert
    if (!response || response.length === 0) {
        throw new Error('Failed to create watchlist');
    }


    //return response
    return response;
}

export const updateExistingWatchlist = async (watchListId, updatedData) => {
    //check if specific watchlist exists
    const {data: existingWatchlist, error: fetchError} = await supabase.from('watchlist').select().eq('id',watchListId);
    //error handling for fetch
    if (!existingWatchlist) {
        throw new Error('Watchlist does not exist');
    }
    if (fetchError) throw fetchError;

    //update watchlist
    const response = await supabase.from('watchlist').update(updatedData).eq('id',watchListId).select();

    //error handling for update
    if (!response || response.length === 0) throw new Error('Failed to update watchlist');
    if (response.error) throw response.error;
    
    return response;
}

export const deleteWatchlist = async (watchListId) => {
        //check if specific watchlist exists
        const {data: existingWatchlist, error: fetchError} = await supabase.from('watchlist').select().eq('id',watchListId);
        //error handling for fetch
        if (!existingWatchlist) {
            throw new Error('Watchlist does not exist');
        }
        if (fetchError) throw fetchError;

        const response = await supabase.from('watchlist').delete().eq('id', watchListId);
        return response;
}