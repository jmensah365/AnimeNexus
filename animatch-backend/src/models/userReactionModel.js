import supabase from "../config/databaseConfig.js";

/* This model handles user reactions to anime. Whether they like, dislike, not interested, or no interaction yet
    A user is able to create, update, fetch, and delete their reactions to anime.
     */

/*
    Get User is in each function to ensure the user is valid and authenticated before performing any operations.
*/

//This object helps map the types of reactions a user can have to anime to the ENUM stored in the database.
const UserReaction_reaction = Object.freeze({
    LIKED: 'liked',
    DISLIKED: 'disliked',
    NOT_INTERESTED: 'not_interested',
    NO_INTERACTION: 'no_interaction'
});

export const fetchUserReactions = async () => {
    const {data: userData, error: userError} = await supabase.auth.getUser();
    if (!userData) throw new Error('User not authenticated');
    if (userError) throw userError;

    // Fetch user reactions from the user_reactions table
    const {data: reactions, error: fetchError} = await supabase.from('user_reactions').select().eq('user_id', userData.user.id);

    if (fetchError) throw fetchError;

    if (!reactions) throw new Error('No reactions found for user');

    return reactions;
}

export const fetchUserReactionsWithAnimeTitles = async (supabaseClient, userId) => {
    console.log('in fetchUserReactionsWithAnimeTitles');
    // Fetch user reactions along with the assoaciated anime titles from the kitsu_anime_data table
    const {data: reactions, error: fetchError} = await supabaseClient
    .from('user_reactions')
    .select(`anime_id, reaction, kitsu_anime_data (id, title)`)
    .eq('user_id', userId);


    if (fetchError) throw fetchError;
    if (!reactions) throw new Error('No reactions found for user');

    console.log('exiting fetchUserReactionsWithAnimeTitles');
    return reactions;
}

export const createUserReaction = async ({anime_id, reaction}) => {
    const {data: userData, error: userError} = await supabase.auth.getUser();
    if (!userData) throw new Error('User not authenticated');
    if (userError) throw userError;


    // Validate the reaction type
    if (!Object.values(UserReaction_reaction).includes(reaction)) throw new Error('Invalid reaction type');
    else reaction = UserReaction_reaction[reaction.toUpperCase()];

    const response = await supabase.from('user_reactions').insert({anime_id: anime_id, reaction, user_id: userData.user.id}).select();

    if(!response || response.length == 0) throw new Error('Failed to create user reaction');
    if (response.error) throw response.error;


    return response;
}

export const updateUserReaction = async (reactionId, updatedData) => {
    const {data: userData, error: userError} = await supabase.auth.getUser();
    if (!userData) throw new Error('User not authenticated');
    if (userError) throw userError;

    //check if the specific user reaction exists before trying to update it
    const {data: existingReaction, error: fetchError} = await supabase.from('user_reactions').select().eq('id', reactionId);
    if (!existingReaction) throw new Error('User reaction does not exist');
    if (fetchError) throw fetchError;

    const response = await supabase.from('user_reactions').update(updatedData).eq('id', reactionId).select();

    if (!response || response.length === 0) throw new Error('Failed to update user reaction');
    if (response.error) throw response.error;

    return response;
}

export const deleteUserReaction = async (reactionId) => {
    const {data: userData, error: userError} = await supabase.auth.getUser();
    if (!userData) throw new Error('User not authenticated');
    if (userError) throw userError;

    //check if the specific user reaction exists before trying to delete it
    const {data: existingReaction, error: fetchError} = await supabase.from('user_reactions').select().eq('id', reactionId);
    if (!existingReaction) throw new Error('User reaction does not exist');
    if (fetchError) throw fetchError;


    const response = await supabase.from('user_reactions').delete().eq('id', reactionId);

    if(!response || response.length === 0) throw new Error('Failed to delete user reaction');
    if (response.error) throw response.error;

    return response;
}