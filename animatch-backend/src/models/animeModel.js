
import supabase from '../config/databaseConfig.js'
import { getAnimeListByCategory, enrichAnimeWithStreaming} from '../services/animeService.js'
import { fetchPreferences } from './preferenceModel.js'

/* This model handles getting anime from the kitsu API based on a user preferences and inserting them into the DB for ease of access */



export const insertAnimeMetadata = async (supabaseClient, userId) => {


    const preferences = await fetchPreferences(supabaseClient, userId);
    if (!preferences) throw new Error("Error fetching preferences");

    const genres = preferences.flatMap(preference => preference.genres);


    let allAnimeData = []

    for (const genre of genres) {
        try {
            const animeData = await getAnimeListByCategory(genre);
            const enrichedAnimeData = await enrichAnimeWithStreaming(animeData);
            

            if (!enrichedAnimeData || enrichedAnimeData.length === 0) {
                console.warn(`No anime data found for category: ${genre}`);
                continue; //Skip this genre so the loop doesnt end on an error
            }

            // Filter out anime that already exist in the database for this user
            const animeDataWithUser = enrichedAnimeData.map(anime => ({...anime, user_id: userId}));


            if (animeDataWithUser.length > 0) {
                // Concatenate the new anime data to the allAnimeData array
                allAnimeData = allAnimeData.concat(animeDataWithUser);
            }

        } catch (error) {
            console.error(`Error getting anime data for genre ${genre}:`, error);
        }
    }

    if (allAnimeData.length === 0) {
        throw new Error('Was unable to gather anime data for user')
    }

    
    // //de duplicate the allAnimeData array by kitsu_id
    const deduplicatedAnimeData = Array.from(new Map(allAnimeData.map(anime => [anime.kitsu_id, anime])).values());
    // deduplicatedAnimeData.forEach((anime) => {
    //     console.log(anime.kitsu_id);
    // })
    

    const response = await supabaseClient.from('kitsu_anime_data').insert(deduplicatedAnimeData).select();

    if(!response || response.length === 0) throw new Error('Failed to insert anime metadata');

    return response;
}

export const fetchAnimeData = async (supabaseClient, userId) => {


    // Limit the number of anime data fetched to 10 for performance reasons
    const {data, error} = await supabaseClient.from('kitsu_anime_data').select().eq('user_id', userId);
    if (error) throw error;

    if (!data || data.length === 0) throw new Error('No anime found for this user');

    return data;
}

export const deleteAnimeById = async (supabaseClient, animeId) => {
    const {data: anime, error: fetchError} = await supabaseClient.from('kitsu_anime_data').select().eq('id', animeId).single();
    if (!anime) {
        throw new Error('The anime could not be not found');

        
    }

    if (fetchError) throw fetchError;

    const response = await supabaseClient.from('kitsu_anime_data').delete().eq('id', animeId);

    return response;
}
