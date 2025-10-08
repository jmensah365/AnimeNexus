
export const fetchWatchlistWithInfo = async (token) => {
    const response = await fetch(`${import.meta.env.VITE_PROD_URL}/watchlists/with-titles`, {
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
    const response = await fetch(`${import.meta.env.VITE_PROD_URL}/watchlists/`, {
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
    const response = await fetch(`${import.meta.env.VITE_PROD_URL}/watchlists/${anime_id}`, {
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

export const deleteWatchlist = async ({ watchlist_id }, token) => {
    const response = await fetch(`${import.meta.env.VITE_PROD_URL}/watchlists/${watchlist_id}`, {
        method: 'DELETE',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });

    if (!response.ok) throw new Error(await response.text());
    return;
}

export const deleteWatchlistByAnimeId = async({anime_id}, token) => {
    const response = await fetch(`${import.meta.env.VITE_PROD_URL}/watchlists/anime-id/${anime_id}`, {
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
