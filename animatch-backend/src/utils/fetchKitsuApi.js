import fetch from "node-fetch";



export const fetchAnime = async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`There was an error fetching data: ${response.statusText}`);
    }

    return await response.json();
}
