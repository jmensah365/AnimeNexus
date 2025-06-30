import supabase from "../config/databaseConfig.js";

const Anime_Eras = Object.freeze({
    THE_FOUNDATIONS: 'Pre-1960s',
    THE_CLASSICS: '1960s-1980s',
    THE_BOOM: '1990s',
    THE_DIGITAL_REVOLUTION: '2000s-2010s',
    THE_STREAMING_ERA: '2010s-2020s',
    THE_CURRENT_ERA: '2020s-Current'
});

const Episode_Counts = Object.freeze({
    '1-13': '(1-13)',
    '13-26': '(13-26)',
    '26-50+': '(26-50+)',
    '50+': '(50+)'
});

export const insertPreference = async ({ genres, mood, episode_count, anime_era }) => {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!userData || !userData.user) {
        throw new Error('User not authenticated');
    }

    //spread anime eras and validate input    
    const anime_eras = anime_era.map(era => {
        if (!Object.keys(Anime_Eras).includes(era.toUpperCase())) throw new Error('Invalid anime era');
        else era = Anime_Eras[era.toUpperCase()];
        return era;
    })
    //spread episode counts and validate input
    const episode_counts = episode_count.map(episode_count => {
        if(!Object.keys(Episode_Counts).includes(episode_count)) throw new Error('Invalid episode count');
        else episode_count = Episode_Counts[episode_count];
        return episode_count;
    })

    const { data, error } = await supabase.from('preferences').insert({ genres, mood, user_id: userData.user.id, episode_counts, anime_eras }).select();
    if (error) throw error;
    return data;
}

export const deletePreference = async (preferenceId) => {
    const response = await supabase.from('preferences').delete().eq('id', preferenceId);
    return response;
}

export const updatePreference = async (preferenceId, updatedData) => {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!userData || !userData.user) {
        throw new Error('User not authenticated');
    }

    //check if the record exists
    const { data: preference, error: fetchError } = await supabase
        .from('preferences')
        .select()
        .eq('user_id', userData.user.id);


    if (!preference || preference.length === 0) {
        throw new Error('Preference does not exist')
    }
    if (fetchError) {
        throw fetchError;
    }

    updatedData.anime_eras = updatedData.anime_eras.map(era => {
        if (!Object.keys(Anime_Eras).includes(era.toUpperCase())) throw new Error('Invalid anime era');
        else era = Anime_Eras[era.toUpperCase()];
        return era;
    })

    updatedData.episode_counts = updatedData.episode_counts.map(episode_count => {
        if (!Object.keys(Episode_Counts).includes(episode_count)) throw new Error('Invalid episode count');
        else episode_count = Episode_Counts[episode_count];
        return episode_count;
    })


    const response = await supabase.from('preferences').update(updatedData).eq('id', preferenceId).select();
    return response;
}

export const fetchPreferences = async () => {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!userData || !userData.user) {
        throw new Error('User not authenticated');
    }

    const { data: preference, error: fetchError } = await supabase
        .from('preferences')
        .select()
        .eq('user_id', userData.user.id);

       


    if (!preference) {
        throw new Error('Preference does not exist')
    }
    if (fetchError) {
        throw fetchError;
    }
    return preference;
}

export const insertPreferenceForm = async () => {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!userData || !userData.user) {
        throw new Error('User not authenticated');
    }

    const { data, error } = await supabase.from('preference_users').insert({ id: userData.user.id, preference_survey_completed: false }).select();
    if (error) throw error;
    return data;
}

export const checkPreferenceFormCompleted = async () => {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!userData || !userData.user) {
        throw new Error('User not authenticated');
    }

    const response = await supabase.from('preference_users').select('preference_survey_completed').eq('id', userData.user.id).single();



    if (response.data.preference_survey_completed === true) {
        return true;
    } else {
        return false;
    }
}

export const updatePreferenceCheck = async () => {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!userData || !userData.user) {
        throw new Error('User not authenticated');
    }

    const response = await supabase.from('preference_users').select('preference_survey_completed').eq('id', userData.user.id).single();
    if (!response) {
        throw new Error('Preference for user not found');
    }
    const updatedResponse = await supabase.from('preference_users').update({ preference_survey_completed: true }).eq('id', userData.user.id).select();
    return updatedResponse;
}


