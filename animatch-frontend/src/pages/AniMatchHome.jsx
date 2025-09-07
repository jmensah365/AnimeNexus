import React, { useEffect, useState } from 'react'
import { HouseIcon, SparkleIcon, UserCircleGearIcon, TrendUpIcon, ClockIcon, CheckSquareOffsetIcon, SignOutIcon, SealCheckIcon, MagnifyingGlassIcon } from '@phosphor-icons/react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import Carousel from '../components/AniMatchHome/Carousel'
import AIRecCards from '../components/Cards/AIRecCards'
import MainContentArea from '../components/AniMatchHome/MainContentArea'
import { useFetchWatchlistWithInfo } from '../hooks/Watchlist/useWatchlist'
import Sidebar from '../components/Sidebar'
import { useAuth } from '../utils/Auth.jsx'
import TrendingSidebar from '../components/TrendingSidebar'
import WatchlistSidebar from '../components/WatchlistSidebar'



const fetchKitsuApi = async () => {
    const response = await fetch('http://localhost:3000/api/anime/status/upcoming', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })

    const data = await response.json();

    const formattedData = data.map(anime => ({
        id: anime.kitsu_id,
        title: anime.title,
        synopsis: anime.synopsis,
        age_rating: anime.age_rating,
        poster_image: anime.original_image_url,
        youtube_id: anime.youtube_id,
    }))

    if (!response.ok) throw new Error(await response.text());
    return formattedData;
}

const fetchAnimeFromDB = async (token) => {
    const response = await fetch('http://localhost:3000/api/anime/get-anime', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
}

const fetchAiRecs = async (token) => {
    const response = await fetch('http://localhost:3000/recommendations/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
}

async function getTrendingAnime() {
    const response = await fetch("http://localhost:3000/api/anime/trending?perPage=20&page=1", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",

        },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(await response.text())
    return data
}

const useFetchKitsuApi = () => {
    return useQuery({
        queryKey: ['kitsuApi'],
        queryFn: fetchKitsuApi,
        refetchOnWindowFocus: false,
        retry: 3,
    })
}

const useFetchAnimeFromDB = (token) => {
    return useQuery({
        queryKey: ['animeFromDB'],
        queryFn: () => fetchAnimeFromDB(token),
        refetchOnWindowFocus: false,
        retry: 3,
        enabled: !!token
    })
}

const useFetchAiRecs = (token) => {
    return useQuery({
        queryKey: ['aiRecs'],
        queryFn: () => fetchAiRecs(token),
        refetchOnWindowFocus: false,
        retry: 3,
        enabled: !!token,
    })
}


function AniMatchHome() {
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const { session } = useAuth();
    const { data: kitsuAPIData, isLoading, error: kitsuAPIError, isSuccess: kitsuAPISuccess } = useFetchKitsuApi();
    const { data: animeFromDBData, isLoading: animeFromDBLoading, error: animeFromDBError, isSuccess: animeFromDBSuccess } = useFetchAnimeFromDB(session?.access_token);
    const { data: aiRecsData, isLoading: aiRecsLoading, error: aiRecsError, isSuccess: aiRecsSuccess } = useFetchAiRecs(session?.access_token);
    const { data: watchlistWithAnimeInfo, isSuccess } = useFetchWatchlistWithInfo(session?.access_token); 

    const { data: animeCache, isLoading: trendingAnimeLoading, isSuccess: trendingAnimeSuccess } = useQuery({
        queryKey: ['getTrendingAnime'],
        queryFn: getTrendingAnime
    });


    // console.log(animeCache);


    return (
        <div className='flex min-h-screen bg-black text-white animate-fade-down'>
            <Sidebar />


            <div className="flex flex-1 p-6">
                <div className="flex-1 space-y-6">
                    {/* Carousel Section */}
                    <div className=''>
                        <Carousel data={kitsuAPIData} autoSlide={true} autoSlideInterval={6000} />
                    </div>

                    {/* Ai Recs Cards Section */}
                    <AIRecCards data={aiRecsData} error={aiRecsError} success={aiRecsSuccess} />

                    {/* Anime Cards based on preferences */}
                    <MainContentArea data={animeFromDBData} error={animeFromDBError} success={animeFromDBSuccess} />
                </div>
            </div>

            {/* Right sidebar */}
            <div className="w-60 bg-black border-l border-gray-800 text-white p-6">
                {/* Going to contain watchlist anime and popular anime (rotating) */}
                {/* <div className="mb-4">
                    <h3 className="text-xl font-medium mb-2">Trending Anime</h3>
                    <ul className="space-y-2">
                        <li className="bg-gray-800/50 p-3 rounded-lg">{animeCache[0].title.english}</li>
                        <li className="bg-gray-800/50 p-3 rounded-lg">{animeCache[1].title.english}</li>
                        <li className="bg-gray-800/50 p-3 rounded-lg">{animeCache[2].title.english}</li>
                    </ul>
                </div> */}
                {animeCache && animeCache.length > 0 && <TrendingSidebar animeCache={animeCache}/>}
                <hr className="border-gray-400 my-10" />
                {/* <div className="mb-4">
                    <h3 className="text-xl font-medium mb-2">Watchlist</h3>
                    <ul className="space-y-2">
                        <li className="bg-gray-800/50 p-3 rounded-lg">{watchlistWithAnimeInfo.result[0].kitsu_anime_data.title}</li>
                        <li className="bg-gray-800/50 p-3 rounded-lg">{watchlistWithAnimeInfo.result[1].kitsu_anime_data.title}</li>
                        <li className="bg-gray-800/50 p-3 rounded-lg">Anime 3</li>
                    </ul>
                </div> */}
                <WatchlistSidebar watchlistWithAnimeInfo={watchlistWithAnimeInfo}/>
            </div>
        </div>
    )
}

export default AniMatchHome;