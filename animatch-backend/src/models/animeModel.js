
import supabase from '../config/databaseConfig.js'
import { getAnimeListByCategory} from '../services/animeService.js'
import {fetchAnimeListByCategory} from '../controllers/animeController.js'
import { fetchPreferences } from './preferenceModel.js'

export const insertAnimeMetadata = async () => {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!userData || !userData.user) {
        throw new Error('User not authenticated');
    }

    const preferences = await fetchPreferences();
    const genres = preferences.flatMap(preference => preference.genres);

    //console.log(genres);

    let allAnimeData = []

    for (const genre of genres) {
        console.log(`Fetching anime data for category: ${genre}`);
        const animeData = await getAnimeListByCategory(genre);
        if (!animeData || animeData.length === 0) {
            console.warn(`No anime data found for category: ${genre}`);
            continue;
        }

        const animeDataWithUser = animeData.map(anime => ({
            ...anime,
            user_id: userData.user.id,
        }));

        allAnimeData = allAnimeData.concat(animeDataWithUser);
    }
    


    if (!allAnimeData) throw new Error('No anime data found');

    const response = await supabase.from('kitsu_anime_data').insert(allAnimeData).select();

    if(!response || response.length === 0) throw new Error('Failed to insert anime metadata');

    return response;
}
