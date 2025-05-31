import { deletePreference, fetchPreferences, insertPreference, updatePreference} from "../models/preferenceModel.js";

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



