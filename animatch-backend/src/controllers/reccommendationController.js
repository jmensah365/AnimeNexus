import { generateAIReccommendations } from "../services/reccommendationService.js";
import { supabaseAuthMiddleware } from "../middlewares/supabaseMiddleware.js";

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

        console.log(recommendations);

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