import { generateAIReccommendations, generateAIReccommendationsWithInput, insertAIReccommendations, fetchAIReccommendations, generateDailySpinReccommendation } from "../services/reccommendationService.js";
import { supabaseAuthMiddleware } from "../middlewares/supabaseMiddleware.js";

/*
    The supabase auth middleware is used to ensure a user is authenticated before each request in protected routes.
 */

export const fetchRecommendations = async (req, res) => {
    const {data: {session}, error} = await supabaseAuthMiddleware(req);
    if (error || !session) {
        return res.status(401).json({
            error: true,
            message: 'Unauthorized: Please log in to add preferences'
        });
    }

    try {
        const recommendations = await fetchAIReccommendations();

        if (!recommendations || recommendations.length === 0) {
            return res.status(404).json({
                error: true,
                message: 'No recommendations found'
            });
        }

        return res.status(200).json({
            recommendations
        });
    } catch (error) {
        return res.status(500).json({
            message: `Something went wrong: ${error.message}`
        })
    }
}

export const insertRecommendations = async (req, res) => {
    const {data: {session}, error} = await supabaseAuthMiddleware(req);
    if (error || !session) {
        return res.status(401).json({
            error: true,
            message: 'Unauthorized: Please log in to add preferences'
        });
    }

    try {
        const recommendations = await insertAIReccommendations();

        if (!recommendations || recommendations.length === 0) {
            return res.status(404).json({
                error: true,
                message: 'No recommendations found'
            });
        }

        return res.status(200).json({
            recommendations
        });
    } catch (error) {
        return res.status(500).json({
            message: `Something went wrong: ${error.message}`
        })
    }
}

export const getRecommendations = async (req, res) => {
    const {data: {session}, error} = await supabaseAuthMiddleware(req);
    if (error || !session) {
        return res.status(401).json({
            error: true,
            message: 'Unauthorized: Please log in to add preferences'
        });
    }

    try {
        const recommendations = await generateAIReccommendations();


        if (!recommendations || recommendations.length === 0) {
            return res.status(404).json({
                error: true,
                message: 'No recommendations found'
            });
        }

        return res.status(200).json({
            result: recommendations
        });
    } catch (error) {
        return res.status(500).json({
            message: `Something went wrong: ${error.message}`
        })
    }

}

export const getRecommendationsWithInput = async (req, res) => {
    const {data: {session}, error} = await supabaseAuthMiddleware(req);
    if (error || !session) {
        return res.status(401).json({
            error: true,
            message: 'Unauthorized: Please log in to add preferences'
        });
    }

    //User input is sent in the request body. Not sure if this is the best way to do it, but it works for now.
    const user_input = req.body; 

    try {
        const recommendations = await generateAIReccommendationsWithInput(user_input);


        if (!recommendations || recommendations.length === 0) {
            return res.status(404).json({
                error: true,
                message: 'No recommendations found'
            });
        }

        return res.status(200).json({
            result: recommendations
        });
    } catch (error) {
        return res.status(500).json({
            message: `Something went wrong: ${error.message}`
        })
    }

}

export const getDailySpinReccommendation = async (req, res) => {
    const {data: {session}, error} = await supabaseAuthMiddleware(req);
    if (error || !session) {
        return res.status(401).json({
            error: true,
            message: 'Unauthorized: Please log in to add preferences'
        });
    }

    try {
        const recommendations = await generateDailySpinReccommendation();
        console.log('recommendations', recommendations);


        if (!recommendations || recommendations.length === 0) {
            return res.status(404).json({
                error: true,
                message: 'No recommendations found'
            });
        }

        return res.status(200).json({
            result: recommendations
        });
    } catch (error) {
        return res.status(500).json({
            message: `Something went wrong: ${error.message}`
        })
    }

}

