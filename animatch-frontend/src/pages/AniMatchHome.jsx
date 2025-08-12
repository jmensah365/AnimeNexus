import React, { useEffect, useState } from 'react'
import { HouseIcon, SparkleIcon, UserCircleGearIcon, TrendUpIcon, ClockIcon, CheckSquareOffsetIcon, SignOutIcon, SealCheckIcon, MagnifyingGlassIcon } from '@phosphor-icons/react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import Carousel from '../components/AniMatchHome/Carousel'
import AIRecCards from '../components/Cards/AIRecCards'
import MainContentArea from '../components/AniMatchHome/MainContentArea'
import Search from '../components/AniMatchHome/Search'
import Sidebar from '../components/Sidebar'

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
        poster_image:  anime.original_image_url,
        youtube_id: anime.youtube_id,
    }))

    if (!response.ok) throw new Error(await response.text());
    return formattedData;
}

const fetchAnimeFromDB = async () => {
    const response = await fetch('http://localhost:3000/api/anime/getAnime', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
}

const fetchAiRecs = async () => {
    const response = await fetch('http://localhost:3000/ai/fetch', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
}
const signOut = async () => {
    const response = await fetch('http://localhost:3000/auth/signOut', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    })
    if (!response.ok) throw new Error(await response.text());
    return response.json();
}

const useFetchKitsuApi = () => {
    return useQuery({
        queryKey: ['kitsuApi'],
        queryFn: fetchKitsuApi,
        refetchOnWindowFocus: false,
        retry: 3,
    })
}

const useFetchAnimeFromDB = () => {
    return useQuery({
        queryKey: ['animeFromDB'],
        queryFn: fetchAnimeFromDB,
        refetchOnWindowFocus: false,
        retry: 3,
    })
}

const useFetchAiRecs = () => {
    return useQuery({
        queryKey: ['aiRecs'],
        queryFn: fetchAiRecs,
        refetchOnWindowFocus: false,
        retry: 3,
    })
}

const useSignOut = () => {
    return useMutation({mutationFn: signOut})
}

function AniMatchHome() {
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const { data: kitsuAPIData, isLoading, error: kitsuAPIError, isSuccess: kitsuAPISuccess } = useFetchKitsuApi();
    const { data: animeFromDBData, isLoading: animeFromDBLoading, error: animeFromDBError, isSuccess: animeFromDBSuccess } = useFetchAnimeFromDB();
    const { data: aiRecsData, isLoading: aiRecsLoading, error: aiRecsError, isSuccess: aiRecsSuccess } = useFetchAiRecs();
    const { mutate: signOutMutation, isPending, isSuccess: signOutSuccess, isError: signOutError } = useSignOut();

    useEffect(() => {
        if (kitsuAPISuccess) {
            console.log(kitsuAPIData);
        }
        if (kitsuAPIError) {
            setErrorMessage(kitsuAPIError);
            console.error(kitsuAPIError);
        }
    }, [kitsuAPISuccess, kitsuAPIError]);

    useEffect(() => {
        if (animeFromDBSuccess) {
            // console.log(animeFromDBData);
        }
        if (animeFromDBError) {
            setErrorMessage(animeFromDBError);
            console.error(animeFromDBError);
        }
    }, [animeFromDBSuccess, animeFromDBError]);

    useEffect(() => {
        if (aiRecsSuccess) {
            // console.log(aiRecsData);
        }
        if (aiRecsError) {
            setErrorMessage(aiRecsError);
            console.error(aiRecsError);
        }
    }, [aiRecsSuccess, aiRecsError, aiRecsData]);

    useEffect(() => {
        if (signOutSuccess) {
            console.log("Successfully signed out");
            navigate('/');
        }
        if (isPending) {
            console.log("Signing out...");
        }
        if (signOutError) {
            setErrorMessage(signOutError);
            console.error("Failed to sign out: ", signOutError);
        }
    }, [signOutSuccess, isPending, signOutError, navigate]);

    const handleSignOut = () => {
        signOutMutation({
            onSuccess: () => {
                console.log("Successfully signed out");
                navigate('/');
            },
            onError: (error) => {
                setErrorMessage(error);
                console.error("Failed to sign out: ", error);
            }
        });
    }




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
                    <AIRecCards data={aiRecsData} error={aiRecsError} success={aiRecsSuccess}/> 

                    {/* Anime Cards based on preferences */}
                    <MainContentArea data={animeFromDBData} error={animeFromDBError} success={animeFromDBSuccess}/>
                </div>
            </div>

            {/* Right sidebar */}
            <div className="w-60 bg-black border-l border-gray-800 text-white p-6">
                {/* Going to contain watchlist anime and popular anime (rotating) */}
                <div className="mb-4">
                    <h3 className="text-xl font-medium mb-2">Trending Anime</h3>
                    <ul className="space-y-2">
                        <li className="bg-gray-800/50 p-3 rounded-lg">Anime 1</li>
                        <li className="bg-gray-800/50 p-3 rounded-lg">Anime 2</li>
                        <li className="bg-gray-800/50 p-3 rounded-lg">Anime 3</li>
                    </ul>
                </div>
                <hr className="border-gray-400 my-10" />
                <div className="mb-4">
                    <h3 className="text-xl font-medium mb-2">Watchlist</h3>
                    <ul className="space-y-2">
                        <li className="bg-gray-800/50 p-3 rounded-lg">Anime 1</li>
                        <li className="bg-gray-800/50 p-3 rounded-lg">Anime 2</li>
                        <li className="bg-gray-800/50 p-3 rounded-lg">Anime 3</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default AniMatchHome;