import { deletePreference, fetchPreferences, insertPreference, updatePreference,checkPreferenceFormCompleted,updatePreferenceCheck} from "../models/preferenceModel.js";

// This service handles user preferences, allowing users to save, delete, update, and fetch their preferences.

export const saveUserPreference = async (preferenceData) => {
    return await insertPreference(preferenceData);
}

export const deleteUserPreference = async (preferenceId) => {
    return await deletePreference(preferenceId);
}

export const updateUserPreference = async (preferenceId, updatedData) => {
    return await updatePreference(preferenceId, updatedData);
}

export const fetchUserPreferences = async (supabaseClient, userId) => {
    return await fetchPreferences(supabaseClient, userId);
}

export const checkPreferenceFormCompletedService = async (supabaseClient, userId) => {
    return await checkPreferenceFormCompleted(supabaseClient, userId);
}

export const updatePreferenceCheckService = async () => {
    return await updatePreferenceCheck();
}




