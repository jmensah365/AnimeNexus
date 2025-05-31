import supabase from "../config/databaseConfig.js";

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

    const {data: reactions, error: fetchError} = await supabase.from('user_reactions').select().eq('user_id', userData.user.id);

    if (fetchError) throw fetchError;

    if (!reactions) throw new Error('No reactions found for user');

    return reactions;
}

export const fetchUserReactionsWithAnimeTitles = async () => {
    const {data: userData, error: userError} = await supabase.auth.getUser();

    if (!userData) throw new Error('User not authenticated');
    if (userError) throw userError;

    const {data: reactions, error: fetchError} = await supabase
    .from('user_reactions')
    .select(`anime_id, reaction, kitsu_anime_data (id, title)`)
    .eq('user_id', userData.user.id);


    if (fetchError) throw fetchError;

    if (!reactions) throw new Error('No reactions found for user');

    return reactions;
}

export const createUserReaction = async ({anime_id, reaction}) => {
    const {data: userData, error: userError} = await supabase.auth.getUser();

    if (!userData) throw new Error('User not authenticated');
    if (userError) throw userError;


    if (!Object.values(UserReaction_reaction).includes(reaction)) throw new Error('Invalid reaction type');
    else reaction = UserReaction_reaction[reaction.toUpperCase()];

    const response = await supabase.from('user_reactions').insert({anime_id: anime_id, reaction, user_id: userData.user.id}).select();

    if(!response || response.length == 0) throw new Error('Failed to create user reaction');

    if (response.error) throw response.error;


    return response;
}

export const updateUserReaction = async (reactionId, updatedData) => {
    const {data: existingReaction, error: fetchError} = await supabase.from('user_reactions').select().eq('id', reactionId);

    if (!existingReaction) throw new Error('User reaction does not exist');
    if (fetchError) throw fetchError;

    const response = await supabase.from('user_reactions').update(updatedData).eq('id', reactionId).select();

    if (!response || response.length === 0) throw new Error('Failed to update user reaction');

    if (response.error) throw response.error;

    return response;
}

export const deleteUserReaction = async (reactionId) => {
    const {data: existingReaction, error: fetchError} = await supabase.from('user_reactions').select().eq('id', reactionId);

    if (!existingReaction) throw new Error('User reaction does not exist');
    if (fetchError) throw fetchError;

    const response = await supabase.from('user_reactions').delete().eq('id', reactionId);

    if(!response || response.length === 0) throw new Error('Failed to delete user reaction');

    if (response.error) throw response.error;

    return response;
}