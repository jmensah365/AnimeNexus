import React, { useState } from 'react'
import Carousel from '../components/AniMatchHome/Carousel'
import AIRecCards from '../components/Cards/AIRecCards'
import MainContentArea from '../components/AniMatchHome/MainContentArea'
import Sidebar from '../components/Sidebar'
import TrendingSidebar from '../components/TrendingSidebar'
import WatchlistSidebar from '../components/WatchlistSidebar'
import ReactionsSidebar from '../components/ReactionsSidebar'
import {
    useFetchKitsuAPI,
    useFetchAnimeFromDB,
    useFetchAIRecs,
    useGetTrendingAnime
} from '../hooks/useAnime'
import { useAuth } from '../utils/Auth.jsx'
import { useFetchWatchlistWithInfo } from '../hooks/useWatchlist'
import { useFetchReactionsWithInfo } from '../hooks/useReactions'

function AniMatchHome() {
    const [errorMessage, setErrorMessage] = useState('')
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const { session } = useAuth()
    const token = session?.access_token

    const kitsuAPIQuery = useFetchKitsuAPI()
    const databaseAnimeQuery = useFetchAnimeFromDB(token)
    const AIRecsQuery = useFetchAIRecs(token)
    const trendingAnimeQuery = useGetTrendingAnime()
    const { data: watchlistWithAnimeInfo } = useFetchWatchlistWithInfo(token)
    const { data: reactionsWithAnimeInfo } = useFetchReactionsWithInfo(token)

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-black text-white animate-fade-down relative">

            {/* --- Mobile Top Bar --- */}
            <div className="flex items-center justify-between p-4 bg-black border-b border-gray-800 lg:hidden">
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="text-gray-300 focus:outline-none"
                    aria-label="Open menu"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m0 6H4" />
                    </svg>
                </button>
                <div className="flex items-center space-x-2">
                    <img src="/AniMatchLogo.png" alt="AniMatch Logo" className="h-8 w-8" />
                    <h1 className="text-lg font-bold">AniMatch</h1>
                </div>
            </div>

            {/* --- Mobile Slide-In Sidebar --- */}
            <div
                className={`fixed inset-y-0 left-0 z-50 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } transition-transform duration-300 bg-black border-r border-gray-800 w-64 p-4 lg:hidden`}
            >
                <Sidebar />
                <button
                    onClick={() => setSidebarOpen(false)}
                    className="absolute top-4 right-4 text-gray-400"
                    aria-label="Close menu"
                >
                    ✕
                </button>
            </div>

            {/* --- Overlay when mobile sidebar is open --- */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* --- Desktop Sidebar --- */}
            <div className="hidden lg:block">
                <Sidebar />
            </div>

            {/* --- Main Content Area --- */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
                {/* Carousel Section */}
                <Carousel data={kitsuAPIQuery.data} autoSlide={true} autoSlideInterval={6000} />

                {/* AI Recommendations */}
                <AIRecCards
                    data={AIRecsQuery.data}
                    error={AIRecsQuery.isError}
                    success={AIRecsQuery.isSuccess}
                />

                {/* Anime Cards based on preferences */}
                <MainContentArea
                    data={databaseAnimeQuery.data}
                    error={databaseAnimeQuery.isError}
                    success={databaseAnimeQuery.isSuccess}
                />
            </div>

            {/* --- Right Sidebar (hidden on mobile/tablet) --- */}
            <div className="hidden xl:block w-64 bg-black border-l border-gray-800 text-white p-6 overflow-y-auto">
                {trendingAnimeQuery.isPending && (
                    <p className="text-gray-400 text-sm italic">Loading Trending Anime...✨</p>
                )}
                {trendingAnimeQuery.isSuccess && trendingAnimeQuery.data?.length > 0 && (
                    <TrendingSidebar animeCache={trendingAnimeQuery.data} />
                )}
                <hr className="border-gray-400 my-10" />
                <WatchlistSidebar watchlistWithAnimeInfo={watchlistWithAnimeInfo} />
                <hr className="border-gray-400 my-10" />
                <ReactionsSidebar reactionsWithAnimeInfo={reactionsWithAnimeInfo} />
            </div>
        </div>
    )
}

export default AniMatchHome
