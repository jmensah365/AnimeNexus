import {addUserReaction, getUserReactions, removeUserReaction, updateUserReactionService, getUserReactionsWithAnimeTitles} from '../services/userReactionService.js';
import { supabaseAuthMiddleware } from "../middlewares/supabaseMiddleware.js";

export const fetchUserReactionController = async (req, res) => {
    // const {data: {session}, error} = await supabaseAuthMiddleware(req);
    // if (error || !session) {
    //     return res.status(401).json({
    //         error: true,
    //         message: 'Unauthorized: Please log in to add preferences'
    //     });
    // }
    try {
        const userReactionList = await getUserReactions();

        if (!userReactionList) {
            return res.status(404).json({
                error: true,
                message: 'No user reactions found for this user'
            });
        }
        return res.status(200).json({result: userReactionList, message: 'User reactions fetched successfully'});
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: `Something went wrong: ${error.message}`
        })
    }
}

export const fetchUserReactionControllerWithAnimeTitles = async (req, res) => {
    // const {data: {session}, error} = await supabaseAuthMiddleware(req);
    // if (error || !session) {
    //     return res.status(401).json({
    //         error: true,
    //         message: 'Unauthorized: Please log in to add preferences'
    //     });
    // }
    try {
        const userReactionList = await getUserReactionsWithAnimeTitles(req.supabase, req.user.id);

        if (!userReactionList) {
            return res.status(404).json({
                error: true,
                message: 'No user reactions found for this user'
            });
        }
        return res.status(200).json({result: userReactionList, message: 'User reactions fetched successfully'});
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: `Something went wrong: ${error.message}`
        })
    }
}

export const insertUserReactionController = async (req, res) => {
    // const {data: {session}, error} = await supabaseAuthMiddleware(req);
    // if (error || !session) {
    //     return res.status(401).json({
    //         error: true,
    //         message: 'Unauthorized: Please log in to add preferences'
    //     });
    // }
    const reactionData = req.body;

    if (!reactionData) throw new Error('Reaction data is missing');
    if (!reactionData.anime_id) throw new Error('Anime ID is required');
    if (!reactionData.reaction) throw new Error('Reaction type is required');

    try {
        const response = await addUserReaction(reactionData);
        if(!response || response.length === 0) {
            return res.status(400).json({
                error: true,
                message: 'Failed to create user reaction'
            })
        }
        if (response.error) {
            return res.status(400).json({
                error: true,
                message: 'Failed to create user reaction'
            });
        }
        return res.status(201).json({
            result: response.data,
            message: 'User reaction created successfully'
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: `Something went wrong: ${error.message}`
        })
    }
}

export const updateUserReactionController = async (req, res) => {
    // const {data: {session}, error} = await supabaseAuthMiddleware(req);
    // if (error || !session) {
    //     return res.status(401).json({
    //         error: true,
    //         message: 'Unauthorized: Please log in to add preferences'
    //     });
    // }
    const reactionId = req.params.reactionId;
    const updatedData = req.body;

    if (!reactionId) throw new Error('Reaction ID is required');
    if (!updatedData) throw new Error('Updated data is missing');

    try {

        const response = await updateUserReactionService(reactionId, updatedData);

        if (!response || response.length === 0) return response.status(400).json({error: true, message: 'Failed to update user reaction'});
        if (response.error) throw new Error(`Failed to update user reaction ${response.error}`);

        return res.status(200).json({
            result: response.data,
            message: 'User reaction updated successfully'
        })

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: `Something went wrong: ${error.message}`
        })
    }
}

export const deleteUserReactionController = async (req, res) => {
    // const {data: {session}, error} = await supabaseAuthMiddleware(req);
    // if (error || !session) {
    //     return res.status(401).json({
    //         error: true,
    //         message: 'Unauthorized: Please log in to add preferences'
    //     });
    // }
    const reactionId = req.params.reactionId;

    if (!reactionId) throw new Error('Reaction ID is required');

    try {
        const response = await removeUserReaction(reactionId);

        if (!response || response.length === 0) return res.status(400).json({error: true, message: 'Failed to delete user reaction'});
        if (response.error) throw new Error(`Failed to delete user reaction ${response.error}`);

        return res.status(204).json({
            message: 'User reaction deleted successfully'
        })

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: `Something went wrong: ${error.message}`
        })
    }
}