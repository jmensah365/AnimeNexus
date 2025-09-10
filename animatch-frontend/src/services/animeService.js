export const generateAndInsertAnimeMetadata = async (token) => {
        const response = await fetch(`${import.meta.env.VITE_LOCAL_URL}/api/anime/insert-metadata`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        })
    
        if (!response.ok) throw new Error(await response.text())
        return response.json();
}

export const fetchKitsuApi = async () => {
    const response = await fetch(`${import.meta.env.VITE_LOCAL_URL}/api/anime/status/upcoming`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })

    const data = await response.json();

    const formattedData = data.map(anime => ({
        id: anime.kitsu_id,
        title: anime.title,
        synopsis: anime.synopsis,
        age_rating: anime.age_rating,
        poster_image: anime.original_image_url,
        youtube_id: anime.youtube_id,
    }))

    if (!response.ok) throw new Error(await response.text());
    return formattedData;
}

export const fetchAnimeFromDB = async (token) => {
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

export const fetchAiRecs = async (token) => {
    const response = await fetch(`${import.meta.env.VITE_LOCAL_URL}/recommendations/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
}

export const getTrendingAnime = async () => {
    const response = await fetch(`${import.meta.env.VITE_LOCAL_URL}/api/anime/trending?perPage=20&page=1`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
    });

    const data = await response.json();
    console.log(data);
    if (!response.ok) throw new Error(await response.text())
    return data
}