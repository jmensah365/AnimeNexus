import { deletePreference, fetchPreferences, insertPreference, updatePreference,checkPreferenceFormCompleted,updatePreferenceCheck, insertPreferenceForm} from "../models/preferenceModel.js";

export const saveUserPreference = async (preferenceData) => {
    return await insertPreference(preferenceData);
}

export const deleteUserPreference = async (preferenceId) => {
    return await deletePreference(preferenceId);
}

export const updateUserPreference = async (preferenceId, updatedData) => {
    return await updatePreference(preferenceId, updatedData);
}

export const fetchUserPreferences = async () => {
    return await fetchPreferences();
}

export const checkPreferenceFormCompletedService = async () => {
    return await checkPreferenceFormCompleted();
}

export const updatePreferenceCheckService = async () => {
    return await updatePreferenceCheck();
}

export const insertPreferenceFormService = async () => {
    return await insertPreferenceForm();
}



