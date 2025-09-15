import { saveUserPreference, deleteUserPreference, updateUserPreference, fetchUserPreferences, checkPreferenceFormCompletedService, updatePreferenceCheckService } from "../services/preferenceService.js";


export const addPreference = async (req, res) => {
    const preferenceData = req.body; // Extract preference data from the request body
    if (!preferenceData) {
        return res.status(400).json({
            error: true,
            message: 'Preference data is missing or incomplete'
        });
    }
    try {
        const data = await saveUserPreference(preferenceData, req.supabase, req.user.id);
        if (!data || data.length === 0) {
            return res.status(400).json({
                error: true,
                message: 'Failed to add preference'
            });
        }
        return res.status(201).json({ result: data, message: "Preference added successfully" });
    } catch (error) {
        return res.status(500).json({
            message: `Something went wrong: ${error.message}`
        })
    }
}

export const delPreference = async (req, res) => {
    const preferenceId = req.params.preferenceId; // Extract preference ID from the request parameters
    if (!preferenceId) {
        return res.status(400).json({
            error: true,
            message: 'Preference ID is missing'
        });
    }
    try {
        const result = await deleteUserPreference(req.supabase ,preferenceId);
        return res.status(204).json({
            result: result.data,
            message: "Preference deleted"
        });
    } catch (error) {
        return res.status(500).json({
            message: `Something went wrong: ${error.message}`
        })
    }
}

export const updatePreference = async (req, res) => {
    const preferenceId = req.params.preferenceId; // Extract preference ID from the request parameters
    const updatedData = req.body; // Extract updated data from the request body
    if (!preferenceId) {
        return res.status(400).json({
            error: true,
            message: 'Preference ID is missing'
        });
    }

    if (!updatedData) {
        return res.status(400).json({
            error: true,
            message: 'Updated data is missing'
        });
    }
    try {
        const { data, error } = await updateUserPreference(req.supabase, preferenceId, updatedData);
        if (error) {
            return res.status(400).json({
                error: true,
                message: `Something went wrong: ${error.message}`
            });
        }
        return res.status(200).json({
            message: "Preference updated successfully"
        });
    } catch (error) {
        return res.status(500).json({
            message: `Something went wrong: ${error.message}`
        });
    }
}

export const fetchPreferences = async (req, res) => {
    try {
        const preference = await fetchUserPreferences(req.supabase, req.user.id);
        if (!preference || preference.length === 0) {
            return res.status(404).json({
                message: 'No preferences found for this user'
            });
        }
        return res.status(200).json({ preference });
    } catch (error) {
        return res.status(500).json({
            message: `Something went wrong: ${error.message}`
        });
    }
}

export const checkPreferenceFormCompletedController = async (req, res) => {
    try {
        const userId = req.user.id;
        const isCompleted = await checkPreferenceFormCompletedService(req.supabase, userId);
        return res.status(200).json({ isCompleted });
    } catch (error) {
        return res.status(500).json({
            message: `Something went wrong: ${error.message}`
        });
    }
}

export const updatePreferenceCheck = async (req, res) => {
    try {
        const updatedResponse = await updatePreferenceCheckService(req.supabase, req.user.id);
        return res.status(200).json({ updatedResponse });
    } catch (error) {
        return res.status(500).json({
            message: `Something went wrong: ${error.message}`
        });
    }
}

