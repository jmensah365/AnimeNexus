import React, { useEffect, useState } from 'react'
import { HouseIcon, SparkleIcon, UserCircleGearIcon, TrendUpIcon, ClockIcon, CheckSquareOffsetIcon, SignOutIcon } from '@phosphor-icons/react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'


const fetchAnimeFromDB = async () => {
    const response = await fetch('http://localhost:3000/api/anime/getAnime', {
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

const useFetchAnimeFromDB = () => {
    return useQuery({
        queryKey: ['animeFromDB'],
        queryFn: fetchAnimeFromDB,
        refetchOnWindowFocus: false,
        retry: 3,
    })
}

const useSignOut = () => {
    return useMutation({ mutationFn: signOut })
}

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

function AnimeRecs() {
    const navigate = useNavigate();
    const [modalData, setModalData] = useState(null);
    const { data: animeFromDBData, isLoading: animeFromDBLoading, error: animeFromDBError, isSuccess: animeFromDBSuccess } = useFetchAnimeFromDB();
    const { mutate: signOutMutation, isPending, isSuccess: signOutSuccess, isError: signOutError } = useSignOut();

    const slicedData = animeFromDBData ? animeFromDBData.anime_data.slice(0, 24) : [];

    const openModal = (anime) => { setModalData(anime); }
    const closeModal = () => { setModalData(null); }

    console.log(modalData);

    //Handle modal close using escape key
    useEffect(() => {
        const handleEscape = (event) => {
            console.log(event.key);
            if (event.key === 'Escape') closeModal();
        }

        if (modalData) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'auto'; // Re-enable scrolling when modal is closed
        }
    }, [modalData]);


    //Handle click outside modal
    const handleBackgroundClick = (event) => {
        if (event.target === event.currentTarget) {
            closeModal();
        }
    }

    //Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

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
    return (
        <>
            <div className='flex min-h-screen bg-black text-white animate-fade-down'>
                <div className="w-50 bg-black border-r border-gray-800 p-3.5">
                    {/* Menu Section */}
                    <div className="mb-8">
                        <div className='flex flex-row mb-8 items-center justify-start space-x-3'>
                            <img src={'/AniMatchLogo.png'} className='h-10 w-10' />
                            <h1 className='text-md font-bold '>AniMatch</h1>
                        </div>
                        <h3 className="text-sm font-medium text-gray-400 mb-4">Menu</h3>
                        <nav className="space-y-2">
                            <a href="/home" className="flex items-center space-x-3 text-red-500 hover:bg-red-400/10 px-3 py-2.5 rounded-lg">
                                <HouseIcon size={18} />
                                <span className="font-medium">Home</span>
                            </a>
                            <a href="/anime-recs" className="flex items-center space-x-3 text-gray-300 hover:text-white hover:bg-red-400/10 px-3 py-2.5 rounded-lg transition-colors">
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
                            <button onClick={handleSignOut} className="flex items-center space-x-3 text-gray-300 hover:text-white hover:bg-red-400/10 px-3 py-2.5 rounded-lg transition-colors cursor-pointer">
                                <SignOutIcon size={18} />
                                <span>Sign Out</span>
                            </button>
                        </nav>
                    </div>
                </div>

                <div className='flex flex-1 p-6'>
                    <div className='flex-1'>
                        <h1 className='text-2xl font-bold mb-4 inline-flex gap-1.5'>Anime Recommendations<SparkleIcon size={32} /></h1>
                        {/* Add your content here */}
                        {/* <div className='fixed inset-0 z-50 flex items-center justify-center'>
                            {animeFromDBLoading && <div className='border-b-2 border-t-2 border-red-400 animate-spin ease-linear rounded-full w-50 h-50'></div>}
                        </div> */}
                        <div className='grid grid-cols-2 gap-5 md:grid-cols-4'>
                            {animeFromDBSuccess && slicedData.map((anime) => {
                                return (
                                    <div key={anime.id} onClick={() => openModal(anime)} className='bg-gray-800 rounded-lg p-4 group hover:scale-105 transition-transform cursor-pointer'>
                                        <img src={anime.image_url} alt={anime.title} className='w-full h-64 object-fit rounded-t-lg mb-3' />
                                        <h2 className='text-lg font-semibold mb-2'>{anime.title}</h2>
                                        <p className='text-sm text-gray-400'>{anime.synopsis.slice(0, 100)}...</p>
                                    </div>
                                )
                            })}
                        </div>
                        {modalData && (
                            <div className="fixed inset-0 flex items-center justify-center z-50 p-4 mt-200" style={{ backgroundColor: "rgba(0,0,0,0.8)" }} onClick={handleBackgroundClick}>
                                <div className="bg-gray-900 p-6 rounded-xl shadow-2xl max-w-3xl max-h-[90vh] overflow-y-auto w-full space-y-4 mt-auto">
                                    {/* Modal content */}
                                    <div className='p-6 space-y-4'>
                                        <div className='flex items-center justify-center'><h1 className="text-4xl font-bold text-white mb-3">{modalData.title}</h1></div>

                                        <div className='flex flex-col md:flex-row gap-6'>

                                            <div>
                                                <img src={modalData.image_url} alt={modalData.title} className='w-48 h-64 object-cover mx-auto md:mx-0' />
                                            </div>
                                        </div>
                                        <div className='flex-1 space-x-4'>

                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <span className="text-gray-400">Age Rating:</span>
                                                    <span className="ml-2 font-medium text-white">
                                                        {modalData.age_rating || 'N/A'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-400">Episodes:</span>
                                                    <span className="ml-2 font-medium text-white">
                                                        {modalData.episode_count || 'N/A'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-400">Type:</span>
                                                    <span className="ml-2 font-medium text-white">
                                                        {modalData.show_type || 'N/A'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-400">Status:</span>
                                                    <span className={`ml-2 font-medium `}>
                                                        {modalData.status.slice(0, 1).toUpperCase() + modalData.status.slice(1, modalData.status.length) || 'N/A'}
                                                    </span>
                                                </div>
                                            </div>

                                        </div>
                                        <div className='space-y-2 mt-10'>
                                            <h3 className='text-lg text-gray-300'>Description:</h3>
                                            <p className='text-gray-300'>{modalData.synopsis ? modalData.synopsis : 'No synopsis available for this anime'}</p>
                                        </div>
                                        <div className="flex justify-between">
                                            <div className='text-sm'>
                                                <span className="text-gray-400 text-sm">Start Date:</span>
                                                <span className="ml-2 text-white">
                                                    {formatDate(modalData.start_date)}
                                                </span>
                                            </div>
                                            <div className='text-sm'>
                                                <span className="text-gray-400 text-sm">End Date:</span>
                                                <span className="ml-2 text-white">
                                                    {formatDate(modalData.end_date)}
                                                </span>
                                            </div>

                                        </div>
                                        <button className='flex items-center justify-center'>
                                            <a href={`https://www.youtube.com/watch?v=${modalData.youtube_id}`} target='_blank' rel='noopener noreferrer' className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors w-full text-center">
                                                Watch Trailer
                                            </a>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                  
                    </div>
                 
                </div>
            </div>
        </>
    )
}

export default AnimeRecs