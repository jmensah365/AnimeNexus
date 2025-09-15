

/* This model handles user reactions to anime. Whether they like, dislike, not interested, or no interaction yet
    A user is able to create, update, fetch, and delete their reactions to anime.
     */


//This object helps map the types of reactions a user can have to anime to the ENUM stored in the database.
const UserReaction_reaction = Object.freeze({
    LIKED: 'liked',
    DISLIKED: 'disliked',
    NOT_INTERESTED: 'not_interested',
    NO_INTERACTION: 'no_interaction'
});

export const fetchUserReactions = async (supabaseClient, userId) => {

    // Fetch user reactions from the user_reactions table
    const {data: reactions, error: fetchError} = await supabaseClient.from('user_reactions').select().eq('user_id', userId);

    if (fetchError) throw fetchError;

    if (!reactions) throw new Error('No reactions found for user');

    return reactions;
}

export const fetchUserReactionsWithAnimeTitles = async (supabaseClient, userId) => {
    // Fetch user reactions along with the assoaciated anime titles from the kitsu_anime_data table
    const {data: reactions, error: fetchError} = await supabaseClient
    .from('user_reactions')
    .select(`id, reaction, kitsu_anime_data (id, title, image_url)`)
    .eq('user_id', userId);


    if (fetchError) throw fetchError;
    if (!reactions) throw new Error('No reactions found for user');

    return reactions;
}

export const createUserReaction = async ({anime_id, reaction}, supabaseClient, userId) => {

    // Validate the reaction type
    if (!Object.values(UserReaction_reaction).includes(reaction)) throw new Error('Invalid reaction type');
    else reaction = UserReaction_reaction[reaction.toUpperCase()];

    const response = await supabaseClient.from('user_reactions').insert({anime_id: anime_id, reaction, user_id: userId}).select();

    if(!response || response.length == 0) throw new Error('Failed to create user reaction');
    if (response.error) throw response.error;


    return response;
}

export const updateUserReaction = async (reactionId, updatedData, supabaseClient) => {

    //check if the specific user reaction exists before trying to update it
    const {data: existingReaction, error: fetchError} = await supabaseClient.from('user_reactions').select().eq('id', reactionId);
    if (!existingReaction) throw new Error('User reaction does not exist');
    if (fetchError) throw fetchError;

    const response = await supabaseClient.from('user_reactions').update(updatedData).eq('id', reactionId).select();

    if (!response || response.length === 0) throw new Error('Failed to update user reaction');
    if (response.error) throw response.error;

    return response;
}

export const deleteUserReaction = async (reactionId, supabaseClient) => {

    //check if the specific user reaction exists before trying to delete it
    const {data: existingReaction, error: fetchError} = await supabaseClient.from('user_reactions').select().eq('id', reactionId);
    if (!existingReaction) throw new Error('User reaction does not exist');
    if (fetchError) throw fetchError;


    const response = await supabaseClient.from('user_reactions').delete().eq('id', reactionId);

    if(!response || response.length === 0) throw new Error('Failed to delete user reaction');
    if (response.error) throw response.error;

    return response;
}

export const deleteReactionByAnimeId = async (animeId, supabaseClient) => {
    
    //check if specific watchlist exists before trying to delete it
    const {data: existingReaction, error: fetchError} = await supabaseClient.from('user_reactions').select().eq('anime_id',animeId);
    //error handling for fetch
    if (!existingReaction) throw new Error('Reaction does not exist');
    if (fetchError) throw fetchError;

    const response = await supabaseClient.from('user_reactions').delete().eq('anime_id', animeId);
    return response;
}