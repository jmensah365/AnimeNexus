import {fetchAnime } from "../utils/fetchKitsuApi.js";
import { KITSU_API_URL } from "../config/apiConfig.js";

//this file contains the functions that interact with the Kitsu API to fetch anime data

//TODO: add the ability to paginate the results

export const getAnimeListByCategory = async (category) => {
    //&page[limit]=${limit}&page[offset]=${offset}
    const url = `${KITSU_API_URL}?filter[categories]=${category}`;
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