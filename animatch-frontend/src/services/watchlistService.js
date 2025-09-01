
export const fetchWatchlistWithInfo = async (token) => {
    const response = await fetch('http://localhost:3000/watchlists/with-titles', {
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
    const response = await fetch('http://localhost:3000/api/anime/get-anime', {
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
    const response = await fetch('http://localhost:3000/watchlists/', {
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
    const response = await fetch(`http://localhost:3000/watchlists/${anime_id}`, {
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
    const response = await fetch(`http://localhost:3000/watchlists/${anime_id}`, {
        method: 'DELETE',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
}
