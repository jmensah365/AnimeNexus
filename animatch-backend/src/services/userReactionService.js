import {createUserReaction, fetchUserReactions, updateUserReaction, deleteUserReaction, fetchUserReactionsWithAnimeTitles} from '../models/userReactionModel.js';

// This service handles user reactions to anime, allowing users to add, update, delete, and fetch their reactions.

export const getUserReactions = async () => {
    return await fetchUserReactions();
}

export const getUserReactionsWithAnimeTitles = async (supabaseClient, userId) => {
    return await fetchUserReactionsWithAnimeTitles(supabaseClient, userId);
}

export const addUserReaction = async (reaction, supabaseClient, userId) => {
    return await createUserReaction(reaction, supabaseClient, userId);
}

export const updateUserReactionService = async (reactionId, updatedData, supabaseClient) => {
    return await updateUserReaction(reactionId, updatedData, supabaseClient);
}

export const removeUserReaction = async (reactionId, supabaseClient) => {
    return await deleteUserReaction(reactionId, supabaseClient);
}