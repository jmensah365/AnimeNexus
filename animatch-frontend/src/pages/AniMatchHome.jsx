import React, {useState } from 'react'
import Carousel from '../components/AniMatchHome/Carousel'
import AIRecCards from '../components/Cards/AIRecCards'
import MainContentArea from '../components/AniMatchHome/MainContentArea'
import Sidebar from '../components/Sidebar'
import TrendingSidebar from '../components/TrendingSidebar'
import WatchlistSidebar from '../components/WatchlistSidebar'
import { useFetchKitsuAPI, useFetchAnimeFromDB, useFetchAIRecs, useGetTrendingAnime  } from '../hooks/useAnime'
import { useAuth } from '../utils/Auth.jsx'
import { useFetchWatchlistWithInfo } from '../hooks/useWatchlist'
import { useFetchReactionsWithInfo } from '../hooks/useReactions'
import ReactionsSidebar from '../components/ReactionsSidebar'



function AniMatchHome() {
    const [errorMessage, setErrorMessage] = useState('');

    const { session } = useAuth();
    const token = session?.access_token;

    const kitsuAPIQuery = useFetchKitsuAPI();
    const databaseAnimeQuery = useFetchAnimeFromDB(token);
    const AIRecsQuery = useFetchAIRecs(token);
    const trendingAnimeQuery = useGetTrendingAnime();
    const { data: watchlistWithAnimeInfo, isSuccess: watchlistSuccess } = useFetchWatchlistWithInfo(session?.access_token); 
    const { data: reactionsWithAnimeInfo, isSuccess: reactionsSuccess } = useFetchReactionsWithInfo(session?.access_token); 


    return (
        <div className='flex min-h-screen bg-black text-white animate-fade-down'>
            <Sidebar />


            <div className="flex flex-1 p-6">
                <div className="flex-1 space-y-6">
                    {/* Carousel Section */}
                    <div className=''>
                        <Carousel data={kitsuAPIQuery.data} autoSlide={true} autoSlideInterval={6000} />
                    </div>

                    {/* Ai Recs Cards Section */}
                    <AIRecCards data={AIRecsQuery.data} error={AIRecsQuery.isError} success={AIRecsQuery.isSuccess} />

                    {/* Anime Cards based on preferences */}
                    <MainContentArea data={databaseAnimeQuery.data} error={databaseAnimeQuery.isError} success={databaseAnimeQuery.isSuccess} />
                </div>
            </div>

            {/* Right sidebar */}
            <div className="w-60 bg-black border-l border-gray-800 text-white p-6">
                {trendingAnimeQuery.isPending && <p className="text-gray-400 text-sm italic">Loading Trending Anime...✨</p>}
                {trendingAnimeQuery.isSuccess && trendingAnimeQuery?.data.length > 0 && <TrendingSidebar animeCache={trendingAnimeQuery.data}/>}
                <hr className="border-gray-400 my-10" />
                <WatchlistSidebar watchlistWithAnimeInfo={watchlistWithAnimeInfo}/>
                <hr className="border-gray-400 my-10" />
                <ReactionsSidebar reactionsWithAnimeInfo={reactionsWithAnimeInfo}/>
            </div>
        </div>
    )
}

export default AniMatchHome;