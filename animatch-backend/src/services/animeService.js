import {fetchAnime } from "../utils/fetchKitsuApi.js";
import { KITSU_API_URL } from "../config/apiConfig.js";
import fetch from "node-fetch";

//this file contains the functions that interact with the Kitsu API to fetch anime data

//TODO: add the ability to paginate the results

export const getAllCategories = async () => {
    let allCategories = []
    let limit = 20;
    let offset = 0;

    while (true) {
        const url = `https://kitsu.io/api/edge/categories?page[limit]=${limit}&page[offset]=${offset}`

        const response = await fetchAnime(url);

        if (!response || response.data.length === 0 || !response.data.length) break;

        

        const slugs = response.data.map(category => category.attributes.slug);
        allCategories = allCategories.concat(slugs)
        offset += limit
    }

    return allCategories
}

export const getAnimeListByCategory = async (category) => {
    //maxPages and limit are set to 5 and 10 respectively
    let allAnimeData = [];
    let maxPages = 2;
    let limit = 20
    let offset = 0;

    for (let page = 0; page < maxPages; page++) {
        const url = `${KITSU_API_URL}?filter[categories]=${category}&page[limit]=${limit}&page[offset]=${offset}`;

        const apiResponse = await fetchAnime(url);
        
        if (!apiResponse || !apiResponse?.data || apiResponse.data.length === 0) {
            break; //no more data to be returned
        }
        const animeData =  apiResponse.data.map(item => ({
            kitsu_id: item.id,
            title: item.attributes.titles.en || item.attributes.titles.en_us || item.attributes.titles.en_jp || item.attributes.canonicalTitle,
            synopsis: item.attributes.synopsis,
            image_url: item.attributes.posterImage.small,
            original_image_url: item.attributes.posterImage.original,
            large_image_url: item.attributes.posterImage.large,
            start_date: item.attributes.startDate,
            end_date: item.attributes.endDate,
            rating_rank: item.attributes.ratingRank,
            age_rating: item.attributes.ageRating,
            age_rating_guide: item.attributes.ageRatingGuide,
            status: item.attributes.status,
            episode_count: item.attributes.episodeCount,
            show_type: item.attributes.showType,
            youtube_id: item.attributes.youtubeVideoId,
            origin_genre: category,
        }));

        allAnimeData = allAnimeData.concat(animeData);
        offset += limit;
    }
    return allAnimeData;
}

export const getAnimeListByName = async (name) => {
    //&page[limit]=${limit}&page[offset]=${offset}
    const url = `${KITSU_API_URL}?filter[text]=${name}`;
    const apiResponse = await fetchAnime(url);
    return apiResponse.data.map(item => ({
        kitsu_id: item.id,
        title: item.attributes.titles.en || item.attributes.titles.en_us || item.attributes.titles.en_jp || item.attributes.canonicalTitle,
        synopsis: item.attributes.synopsis,
        image_url: item.attributes.posterImage.small,
        original_image_url: item.attributes.posterImage.original,
        large_image_url: item.attributes.posterImage.large,
        start_date: item.attributes.startDate,
        end_date: item.attributes.endDate,
        rating_rank: item.attributes.ratingRank,
        age_rating: item.attributes.ageRating,
        age_rating_guide: item.attributes.ageRatingGuide,
        status: item.attributes.status,
        episode_count: item.attributes.episodeCount,
        show_type: item.attributes.showType,
        youtube_id: item.attributes.youtubeVideoId,
    }));
}

export const getAnimeListByAgeRating = async (ageRating) => {
    //&page[limit]=${limit}&page[offset]=${offset}
    const url = `${KITSU_API_URL}?filter[ageRating]=${ageRating}`;
    const apiResponse = await fetchAnime(url);
    return apiResponse.data.map(item => ({
        kitsu_id: item.id,
        title: item.attributes.titles.en || item.attributes.titles.en_us || item.attributes.titles.en_jp || item.attributes.canonicalTitle,
        synopsis: item.attributes.synopsis,
        image_url: item.attributes.posterImage.small,
        original_image_url: item.attributes.posterImage.original,
        large_image_url: item.attributes.posterImage.large,
        start_date: item.attributes.startDate,
        end_date: item.attributes.endDate,
        rating_rank: item.attributes.ratingRank,
        age_rating: item.attributes.ageRating,
        age_rating_guide: item.attributes.ageRatingGuide,
        status: item.attributes.status,
        episode_count: item.attributes.episodeCount,
        show_type: item.attributes.showType,
        youtube_id: item.attributes.youtubeVideoId,
    }));
}

export const getAnimeListBySeasonYear = async (year) => {
    //&page[limit]=${limit}&page[offset]=${offset}
    const url = `${KITSU_API_URL}?filter[seasonYear]=${year}`;
    const apiResponse = await fetchAnime(url);
    return apiResponse.data.map(item => ({
        kitsu_id: item.id,
        title: item.attributes.titles.en || item.attributes.titles.en_us || item.attributes.titles.en_jp || item.attributes.canonicalTitle,
        synopsis: item.attributes.synopsis,
        image_url: item.attributes.posterImage.small,
        original_image_url: item.attributes.posterImage.original,
        large_image_url: item.attributes.posterImage.large,
        start_date: item.attributes.startDate,
        end_date: item.attributes.endDate,
        rating_rank: item.attributes.ratingRank,
        age_rating: item.attributes.ageRating,
        age_rating_guide: item.attributes.ageRatingGuide,
        status: item.attributes.status,
        episode_count: item.attributes.episodeCount,
        show_type: item.attributes.showType,
        youtube_id: item.attributes.youtubeVideoId,
    }));
}

export const getAnimeListByStatus = async (status) => {
    //&page[limit]=${limit}&page[offset]=${offset}
    const url = `${KITSU_API_URL}?filter[status]=${status}`;
    const apiResponse = await fetchAnime(url);

    return apiResponse.data.map(item => ({
        kitsu_id: item.id,
        title: item.attributes.titles.en || item.attributes.titles.en_us || item.attributes.titles.en_jp || item.attributes.canonicalTitle,
        synopsis: item.attributes.synopsis,
        image_url: item.attributes.posterImage.small,
        original_image_url: item.attributes.posterImage.original,
        large_image_url: item.attributes.posterImage.large,
        start_date: item.attributes.startDate,
        end_date: item.attributes.endDate,
        rating_rank: item.attributes.ratingRank,
        age_rating: item.attributes.ageRating,
        age_rating_guide: item.attributes.ageRatingGuide,
        status: item.attributes.status,
        episode_count: item.attributes.episodeCount,
        show_type: item.attributes.showType,
        youtube_id: item.attributes.youtubeVideoId,
    }));
}

export const getAnimeListBySeason = async (season) => {
    //&page[limit]=${limit}&page[offset]=${offset}
    const url = `${KITSU_API_URL}?filter[season]=${season}`;
    const apiResponse = await fetchAnime(url);
    return apiResponse.data.map(item => ({
        kitsu_id: item.id,
        title: item.attributes.titles.en || item.attributes.titles.en_us || item.attributes.titles.en_jp || item.attributes.canonicalTitle,
        synopsis: item.attributes.synopsis,
        image_url: item.attributes.posterImage.small,
        original_image_url: item.attributes.posterImage.original,
        large_image_url: item.attributes.posterImage.large,
        start_date: item.attributes.startDate,
        end_date: item.attributes.endDate,
        rating_rank: item.attributes.ratingRank,
        age_rating: item.attributes.ageRating,
        age_rating_guide: item.attributes.ageRatingGuide,
        status: item.attributes.status,
        episode_count: item.attributes.episodeCount,
        show_type: item.attributes.showType,
        youtube_id: item.attributes.youtubeVideoId,
    }));
}

export const getEpisodesTest = async () => {
    const url = `${KITSU_API_URL}?filter[text]=wolfs rain`;
    const response = await fetchAnime(url);
    const episodes = response.data.map(item => ({
        episodes: item.relationships.episodes.links.related,
    }))
    const results = await Promise.all(episodes.map(element => fetchAnime(element.episodes)));
    results.forEach(result => console.log(result.data.map(ep => {console.log(ep.attributes.canonicalTitle);})));

    return episodes;
    
}