
import supabase from '../config/databaseConfig.js'
import { getAnimeListByCategory} from '../services/animeService.js'
import { fetchPreferences } from './preferenceModel.js'

/* This model handles getting anime from the kitsu API based on a user preferences and inserting them into the DB for ease of access */

/*
    Get User is in each function to ensure the user is valid and authenticated before performing any operations.
*/

export const insertAnimeMetadata = async () => {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!userData || !userData.user) {
        throw new Error('User not authenticated');
    }

    const preferences = await fetchPreferences();
    const genres = preferences.flatMap(preference => preference.genres);

    //get exisiting anime data for user to avoid duplicate inserts
    const { data: existingAnimeData, error: fetchError } = await supabase
        .from('kitsu_anime_data')
        .select('kitsu_id')
        .eq('user_id', userData.user.id);
    
        if (fetchError) throw fetchError;

    const existingAnimeDataIds = new Set(existingAnimeData.map(anime => anime.kitsu_id));

    //get the original size of the set to compare after insertion
    const originalExistingAnimeDataIdsSize = existingAnimeDataIds.size;


    let allAnimeData = []

    for (const genre of genres) {
        try {
            const animeData = await getAnimeListByCategory(genre);

            if (!animeData || animeData.length === 0) {
                console.warn(`No anime data found for category: ${genre}`);
                continue; //Skip this genre so the loop doesnt end on an error
            }

            // Filter out anime that already exist in the database for this user
            const animeDataWithUser = animeData.filter(anime => !existingAnimeDataIds.has(anime.kitsu_id)).map(anime => ({...anime, user_id: userData.user.id}));


            if (animeDataWithUser.length > 0) {
                allAnimeData = allAnimeData.concat(animeDataWithUser);
                // Add the new anime IDs to the existing set to avoid duplicates in the next iteration
                // kitsu_id is a string, so we need to parse it to an integer
                animeDataWithUser.forEach(anime => existingAnimeDataIds.add(parseInt(anime.kitsu_id)))
            }

        } catch (error) {
            console.error(`Error getting anime data for genre ${genre}:`, error);
        }
    }

    

    // Now comparing the size of the original set with the new set to see if any new anime data was added
    // If not throw an error
    if (originalExistingAnimeDataIdsSize === existingAnimeDataIds.size) throw new Error('No anime data found - all anime may already exist for this user');

    const response = await supabase.from('kitsu_anime_data').insert(allAnimeData).select();

    if(!response || response.length === 0) throw new Error('Failed to insert anime metadata');

    return response;
}

export const fetchAnimeData = async () => {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!userData || !userData.user) {
        throw new Error('User not authenticated');
    }

    // Limit the number of anime data fetched to 10 for performance reasons
    const {data, error} = await supabase.from('kitsu_anime_data').select().eq('user_id', userData.user.id).limit(10);
    if (error) throw error;

    if (!data || data.length === 0) throw new Error('No anime found for this user');

    return data;
}
