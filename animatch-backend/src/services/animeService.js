import {fetchAnime } from "../utils/fetchKitsuApi.js";
import { KITSU_API_URL, ANILIST_API_URL } from "../config/apiConfig.js";
import fetch from "node-fetch";
import supabaseAdmin from "../config/databaseAdminConfig.js";

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

// Helper function to extract platform name from URL
const extractPlatformName = (url) => {
    if (url.includes('crunchyroll.com')) return 'Crunchyroll';
    if (url.includes('hulu.com')) return 'Hulu';
    if (url.includes('funimation.com')) return 'Funimation';
    if (url.includes('netflix.com')) return 'Netflix';
    if (url.includes('hidive.com')) return 'HIDIVE';
    if (url.includes('vrv.co')) return 'VRV';
    // Add more platforms as needed
    return 'Unknown';
};

// Helper function to process streaming links from API response
const processStreamingLinks = (apiResponse) => {
    if (!apiResponse || !apiResponse.data || !Array.isArray(apiResponse.data)) {
        return [];
    }
    
    return apiResponse.data.map(link => ({
        platform_url: link.attributes.url,
        subtitles: link.attributes.subs || [],
        dubs: link.attributes.dubs || [],
        platform_name: extractPlatformName(link.attributes.url)
    }));
};

const batchGetStreamingLinks = async (animeIds) => {
    const streamingLinksMap = {};
    
    // Use Promise.allSettled to handle individual failures gracefully
    const results = await Promise.allSettled(
        animeIds.map(async (animeId) => {
            try {
                const url = `${KITSU_API_URL}/${animeId}/streaming-links`;
                const apiResponse = await fetchAnime(url);
                const processedLinks = processStreamingLinks(apiResponse);
                return { animeId, streamingLinks: processedLinks };
            } catch (error) {
                console.error(`Error fetching streaming links for anime ${animeId}:`, error);
                return { animeId, streamingLinks: [] };
            }
        })
    );
    
    results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
            const { animeId, streamingLinks } = result.value;
            streamingLinksMap[animeId] = streamingLinks;
        } else {
            console.error('Failed to fetch streaming links:', result.reason);
            // Set empty array for failed requests
            const animeId = animeIds[index]
            streamingLinksMap[animeId] = [];
        }
    });
    
    return streamingLinksMap;
}; 

// Function to enrich anime data with streaming links
export const enrichAnimeWithStreaming = async (animeList) => {
    try {
        const animeIds = animeList.map(anime => anime.kitsu_id);
        const streamingLinksMap = await batchGetStreamingLinks(animeIds);
        
        return animeList.map(anime => {
            const streamingLinks = streamingLinksMap[anime.kitsu_id] || [];
            
            // Debug logging to help identify issues
            if (!Array.isArray(streamingLinks)) {
                console.error(`Streaming links for anime ${anime.kitsu_id} is not an array:`, streamingLinks);
                return {
                    ...anime,
                    streaming_links: [],
                };
            }
            
            return {
                ...anime,
                streaming_links: streamingLinks,
            };
        });
    } catch (error) {
        console.error('Error in enrichAnimeWithStreaming:', error);
        // Return original anime list without streaming data if enrichment fails
        return animeList.map(anime => ({
            ...anime,
            streaming_links: [],
        }));
    }
};

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

const fetchTrendingFromAniList = async (perPage = 20, page = 1) => {
    const query = `
        query ($page: Int, $perPage: Int) {
        Page(page: $page, perPage: $perPage) {
            media(sort: TRENDING_DESC, type: ANIME) {
            id
            title {
                romaji
                english
                native
            }
            coverImage {
                large
                medium
            }
            trailer{
                id
            }
            description(asHtml: false)
            averageScore
            popularity
            format
            status
            episodes
            genres
            startDate {
                month
                day
                year
            }
            endDate {
                month
                day
                year
            }
            }
        }
        }
    `;

    const variables = {page, perPage}

    const res = await fetch(ANILIST_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({query, variables})
    });

    const data = await res.json();

    if (data.errors) {
        throw new Error(`AniList error: ${JSON.stringify(data.errors)}`);
    }

    return data.data.Page.media;
}

export const getTrendingAnime = async (perPage = 20, page = 1) => {
    //check cache (latest timestamp)
    const {data: cache, error} = await supabaseAdmin.from('trending').select('*').order('cached_at', {ascending: false});

    if (error) throw error;

    const stillValid = cache?.length > 0 && new Date(cache[0].expires_at) > new Date();

    if (stillValid) {
        return cache.map((anime) => ({
            id: anime.id,
            title: {
                romaji: anime.title_romaji,
                english: anime.title_english,
                native: anime.title_native,
            },
            coverImage: {
                large: anime.large_image,
                medium: anime.medium_image
            },
            description: anime.description,
            averageScore: anime.average_score,
            popularity: anime.popularity,
            youtube_id: anime.youtube_id,
            cached_at: anime.cached_at,
            expires_at: anime.expires_at,
        }))
    }

    //fetch from AniList
    const freshData = await fetchTrendingFromAniList(perPage, page);

    //update anime data using fresh data
    await supabaseAdmin.from("trending").delete().not('id','is', null)

    const insertData = freshData.map((a) => ({
        anime_id: a.id,
        title_romaji: a.title.romaji,
        title_english: a.title.english,
        title_native: a.title.native,
        large_image: a.coverImage.large,
        medium_image: a.coverImage.medium,
        description: a.description,
        average_score: a.averageScore,
        popularity: a.popularity,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        ...(a.trailer?.id && {youtube_id: a.trailer.id})
    }));
    const {response, error: insertFreshDataError} = await supabaseAdmin.from("trending").insert(insertData).select();
    
    return freshData;
}