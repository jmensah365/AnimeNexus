export const fetchReactionsWithInfo = async (token) => {
    const response = await fetch(`${import.meta.env.VITE_LOCAL_URL}/user-reactions/with-titles`, {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
}

export const createReaction = async ({ anime_id, reaction }, token) => {
    const response = await fetch(`${import.meta.env.VITE_LOCAL_URL}/user-reactions/`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ anime_id, reaction }),
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
}

export const updateReaction = async ({ anime_id, reaction }, token) => {
    const response = await fetch(`${import.meta.env.VITE_LOCAL_URL}/user-reactions/${anime_id}`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reaction }),
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
}

export const deleteReaction = async ({ reaction_id }, token) => {
    const response = await fetch(`${import.meta.env.VITE_LOCAL_URL}/user-reactions/${reaction_id}`, {
        method: 'DELETE',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });

    if (!response.ok) throw new Error(await response.text());
    return;
}

export const deleteReactionByAnimeId = async ({ anime_id }, token) => {
    const response = await fetch(`${import.meta.env.VITE_LOCAL_URL}/user-reactions/anime-id/${anime_id}`, {
        method: 'DELETE',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });

    if (!response.ok) throw new Error(await response.text());
    return;
}