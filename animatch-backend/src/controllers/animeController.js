import { insertAnimeMetadata } from "../models/animeModel.js";
import { getAnimeListByCategory, getAnimeListByName, getAnimeListByAgeRating, getAnimeListBySeasonYear, getAnimeListByStatus, getAnimeListBySeason } from "../services/animeService.js";
import { supabaseAuthMiddleware } from "../middlewares/supabaseMiddleware.js";

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

export const addAnimeMetadata = async (req, res, next) => {
    const {data: {session}, error} = await supabaseAuthMiddleware(req);
    if (error || !session) {
        return res.status(401).json({
            error: true,
            message: 'Unauthorized: Please log in to add preferences'
        });
    }
    //const category = req.params.category; //extracts category from URL params
    try{
        const dataToInsert = await insertAnimeMetadata();
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

