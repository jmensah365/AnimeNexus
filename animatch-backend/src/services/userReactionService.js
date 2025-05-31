import {createUserReaction, fetchUserReactions, updateUserReaction, deleteUserReaction, fetchUserReactionsWithAnimeTitles} from '../models/userReactionModel.js';

export const getUserReactions = async () => {
    return await fetchUserReactions();
}

export const getUserReactionsWithAnimeTitles = async () => {
    return await fetchUserReactionsWithAnimeTitles();
}

export const addUserReaction = async (reaction) => {
    return await createUserReaction(reaction);
}

export const updateUserReactionService = async (reactionId, updatedData) => {
    return await updateUserReaction(reactionId, updatedData);
}

export const removeUserReaction = async (reactionId) => {
    return await deleteUserReaction(reactionId);
}