import { deletePreference, fetchPreferences, insertPreference, updatePreference,checkPreferenceFormCompleted,updatePreferenceCheck} from "../models/preferenceModel.js";

// This service handles user preferences, allowing users to save, delete, update, and fetch their preferences.

export const saveUserPreference = async (preferenceData, supabaseClient, userId) => {
    return await insertPreference(preferenceData, supabaseClient, userId);
}

export const deleteUserPreference = async (supabaseClient, preferenceId) => {
    return await deletePreference(supabaseClient, preferenceId);
}

export const updateUserPreference = async (supabaseClient, preferenceId, updatedData) => {
    return await updatePreference(supabaseClient, preferenceId, updatedData);
}

export const fetchUserPreferences = async (supabaseClient, userId) => {
    return await fetchPreferences(supabaseClient, userId);
}

export const checkPreferenceFormCompletedService = async (supabaseClient, userId) => {
    return await checkPreferenceFormCompleted(supabaseClient, userId);
}

export const updatePreferenceCheckService = async (supabaseClient, userId) => {
    return await updatePreferenceCheck(supabaseClient, userId);
}




