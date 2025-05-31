
import supabase from '../config/databaseConfig.js'
import { getAnimeListByCategory} from '../services/animeService.js'
import {fetchAnimeListByCategory} from '../controllers/animeController.js'

export const insertAnimeMetadata = async (category) => {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!userData || !userData.user) {
        throw new Error('User not authenticated');
    }

    const animeDataList = await getAnimeListByCategory(category);
    const animeDataWithUser = animeDataList.map(anime => ({
        ...anime,
        user_id: userData.user.id,
    }));

    if (!animeDataList) throw new Error('No anime data found');

    const response = await supabase.from('kitsu_anime_data').insert(animeDataWithUser).select();

    if(!response || response.length === 0) throw new Error('Failed to insert anime metadata');

    return response;
}
