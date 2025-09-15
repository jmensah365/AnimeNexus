import { insertAnimeMetadata, fetchAnimeData } from "../models/animeModel.js";
import { getAnimeListByCategory, getAnimeListByName, getAnimeListByAgeRating, getAnimeListBySeasonYear, getAnimeListByStatus, getAnimeListBySeason, getEpisodesTest,getAllCategories, getTrendingAnime } from "../services/animeService.js";

export const fetchAllCategories = async (req, res, next) => {
    try {
        const categories = await getAllCategories();
        res.status(200).json(categories);
    } catch (error) {
        next(error)
    }
}

export const fetchAnimeListByCategory = async (req, res, next) => {
    try {
        const category = req.params.category; //extracts category from URL params
        const animeList = await getAnimeListByCategory(category); 
        res.status(200).json(animeList);
    } catch (error) {
        next(error)
    }
} 

export const fetchAnimeListByName = async (req, res, next) => {
    try {
        const name = req.params.name; //extracts name from URL params
        const animeList = await getAnimeListByName(name);
        res.status(200).json(animeList);
    } catch (error) {
        next(error)
    }
} 

export const fetchAnimeListByAgeRating = async (req, res, next) => {
    try {
        const ageRating = req.params.ageRating; //extracts age rating from URL params
        const animeList = await getAnimeListByAgeRating(ageRating);
        res.status(200).json(animeList);
    } catch (error) {
        next(error)
    }
}

export const fetchAnimeListBySeasonYear = async (req, res, next) => {
    try {
        const year = req.params.year; //extracts year from URL params
        const animeList = await getAnimeListBySeasonYear(year);
        res.status(200).json(animeList);
    } catch (error) {
        next(error)
    }
}

export const fetchAnimeListByStatus = async (req, res, next) => {
    try {
        const status = req.params.status; //extracts status from URL params
        const animeList = await getAnimeListByStatus(status);
        res.status(200).json(animeList);
    } catch (error) {
        next(error)
    }
}

export const fetchAnimeListBySeason = async (req, res, next) => {
    try {
        const season = req.params.season; //extracts season from URL params
        const animeList = await getAnimeListBySeason(season);
        res.status(200).json(animeList);
    } catch (error) {
        next(error)
    }
}

export const fetchAnimeEpisodes = async (req, res) => {
    try {
        const response = await getEpisodesTest();
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({
            error: true,
            message: `Failed to get anime episodes: ${error}`
        })
    }
}

export const addAnimeMetadata = async (req, res, next) => {
    try{
        const dataToInsert = await insertAnimeMetadata(req.supabase, req.user.id);
        if (!dataToInsert || dataToInsert.length === 0) {
            return res.status(404).json({
                error: true,
                message: 'No anime data found'
            });
        }
        if (dataToInsert.error) {
            return res.status(403).json({
                error: true,
                message: `Failed to insert anime metadata ${dataToInsert.error.message}`
            });
        }
        return res.status(201).json({
            anime_data: dataToInsert.data,
            message: 'Anime metadata inserted successfully'
        })
    }  catch (error) {
        next(error)
    }
}


export const getAnimeData = async(req, res) => {
    try {
        const animeData = await fetchAnimeData(req.supabase, req.user.id);
        if (!animeData || animeData.length === 0) {
            return res.status(404).json({
                error: true,
                message: 'No anime data found for this user'
            });
        }
        return res.status(200).json({
            anime_data: animeData,
            message: 'Anime data fetched successfully'
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: `Failed to fetch anime data: ${error.message}`
        });
    }
}

export const getTrendingAnimeController = async (req,res) => {
    try{
        const {perPage = 10, page = 1} = req.query;
        const anime = await getTrendingAnime(Number(perPage), Number(page));
        res.status(200).json(anime)
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: `Failed to fetch trending anime data: ${error.message}`
        });
    }
}
