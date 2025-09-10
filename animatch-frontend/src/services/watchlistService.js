
export const fetchWatchlistWithInfo = async (token) => {
    const response = await fetch(`${import.meta.env.VITE_LOCAL_URL}/watchlists/with-titles`, {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
}

export const fetchUserAnime = async (token) => {
    const response = await fetch(`${import.meta.env.VITE_LOCAL_URL}/api/anime/get-anime`, {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
}

export const createWatchlist = async ({ anime_id, status }, token) => {
    const response = await fetch(`${import.meta.env.VITE_LOCAL_URL}/watchlists/`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ anime_id, status }),
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
}

export const updateWatchlist = async ({ anime_id, status }, token) => {
    const response = await fetch(`${import.meta.env.VITE_LOCAL_URL}/watchlists/${anime_id}`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
}

export const deleteWatchlist = async ({ anime_id }, token) => {
    const response = await fetch(`${import.meta.env.VITE_LOCAL_URL}/watchlists/${anime_id}`, {
        method: 'DELETE',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
    console.log(response);
    if (!response.ok) throw new Error(await response.text());
    return;
}
