
export const checkifFormIsCompleted = async (token) => {
    const response = await fetch(`${import.meta.env.VITE_PROD_URL}/preferences/completed`, {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    })
    if (!response.ok) throw new Error(await response.text());
    return response.json();
}

export const fetchPreferences = async (token) => {
    const response = await fetch(`${import.meta.env.VITE_PROD_URL}/preferences/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });

    if (!response.ok) throw new Error(await response.text());
    return response.json();
}

export const insertPreferences = async ({ genres, mood, moods, anime_era, episode_count},token) => {
    const finalMoods = mood ? [...moods, mood] : moods
    const response = await fetch(`${import.meta.env.VITE_PROD_URL}/preferences/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ genres, moods: finalMoods, anime_era, episode_count }),
    });


    if (!response.ok) throw new Error(await response.text());

    return response.json();

}

export const updatePreferences = async ({ genres, mood, moods, anime_eras, episode_counts, preferenceId }, token) => {
    if (mood !== '') moods.push(mood);
    const response = await fetch(`${import.meta.env.VITE_PROD_URL}/preferences/${preferenceId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ genres, moods, anime_eras, episode_counts }),
    });

    if (!response.ok) throw new Error(await response.text());
    return response.json();
};

export const updatePreferenceFormCompletion = async (token) => {
    const response = await fetch(`${import.meta.env.VITE_PROD_URL}/preferences/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });

    if (!response.ok) throw new Error(await response.text());
    return response.json();

}