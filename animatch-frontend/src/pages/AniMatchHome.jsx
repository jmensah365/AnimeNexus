import React, { useEffect, useState } from 'react'
import { HouseIcon, SparkleIcon, UserCircleGearIcon, TrendUpIcon, ClockIcon, CheckSquareOffsetIcon, SignOutIcon } from '@phosphor-icons/react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

const fetchKitsuApi = async () => {
    const response = await fetch('http://localhost:3000/api/anime/category/action', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })

    if (!response.ok) throw new Error(await response.text());
    return response.json();
}

const failureCount = 3;

const useFetchKitsuApi = () => {
    return useQuery({
        queryKey: ['kitsuApi'],
        queryFn: fetchKitsuApi,
        refetchOnWindowFocus: false,
        retry: failureCount,
    })
}

function AniMatchHome() {
    const [modalData, setModalData] = useState(null);
    const { data: kitsuAPIData, isLoading, error: kitsuAPIError, isSuccess: kitsuAPISuccess } = useFetchKitsuApi();

    useEffect(() => {
        if (kitsuAPISuccess) {
            console.log(kitsuAPIData);
        }
        if (kitsuAPIError) {
            console.error(kitsuAPIError);
        }
    }, [kitsuAPISuccess, kitsuAPIError]);

    const openModal = (anime) => { setModalData(anime); }

    const closeModal = () => { setModalData(null); }

    return (
        <div className='flex min-h-screen bg-black text-white animate-fade-down'>
            <div className="w-50 bg-black border-r border-gray-800 p-3.5">
                {/* Menu Section */}
                <div className="mb-8">
                    <h3 className="text-sm font-medium text-gray-400 mb-4">Menu</h3>
                    <nav className="space-y-2">
                        <a href="#" className="flex items-center space-x-3 text-red-500 hover:bg-red-400/10 px-3 py-2.5 rounded-lg">
                            <HouseIcon size={18} />
                            <span className="font-medium">Home</span>
                        </a>
                        <a href="#" className="flex items-center space-x-3 text-gray-300 hover:text-white hover:bg-red-400/10 px-3 py-2.5 rounded-lg transition-colors">
                            <SparkleIcon size={18} />
                            <span>Recs</span>
                        </a>
                        <a href="#" className="flex items-center space-x-3 text-gray-300 hover:text-white hover:bg-red-400/10 px-3 py-2.5 rounded-lg transition-colors">
                            <TrendUpIcon size={18} />
                            <span>Trending Anime</span>
                        </a>
                    </nav>
                </div>
                <div className="mb-8">
                    <h3 className="text-sm font-medium text-gray-400 mb-4">Library</h3>
                    <nav className="space-y-2">
                        <a href="#" className="flex items-center space-x-3 text-gray-300 hover:text-white hover:bg-gray-800/50 px-3 py-2.5 rounded-lg transition-colors">
                            <ClockIcon size={18} />
                            <span>Watchlist</span>
                        </a>
                        <a href="#" className="flex items-center space-x-3 text-gray-300 hover:text-white hover:bg-gray-800/50 px-3 py-2.5 rounded-lg transition-colors">
                            <CheckSquareOffsetIcon size={18} />
                            <span>Reactions</span>
                        </a>
                    </nav>
                </div>
                <div className="mb-8">
                    <h3 className="text-sm font-medium text-gray-400 mb-4">General</h3>
                    <nav className="space-y-2">
                        <a href="#" className="flex items-center space-x-3 text-gray-300 hover:text-white hover:bg-red-400/10 px-3 py-2.5 rounded-lg transition-colors">
                            <UserCircleGearIcon size={18} />
                            <span>Settings</span>
                        </a>
                        <a href="#" className="flex items-center space-x-3 text-gray-300 hover:text-white hover:bg-gray-800/50 px-3 py-2.5 rounded-lg transition-colors">
                            <SignOutIcon size={18} />
                            <span>Sign Out</span>
                        </a>
                    </nav>
                </div>
            </div>


            <div className="flex flex-1 p-6">
                <div className='flex flex-row items-start space-x-3'>
                    <img src={'/AniMatchLogo.png'} className='h-18 w-18' />
                    <h1 className='text-3xl absolute top-10 left-88'>AniMatch</h1>
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