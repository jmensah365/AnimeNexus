import React, { useEffect, useState } from 'react'
import { SparkleIcon, CaretLeftIcon, CaretRightIcon, BookmarkSimpleIcon } from '@phosphor-icons/react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import AnimeModal from '../components/AniMatchHome/AnimeModal'
import { useAuth } from '../utils/Auth'
import { Tooltip } from 'flowbite-react'
import { useCreateWatchlist, useFetchWatchlistWithInfo, useDeleteWatchlist } from '../hooks/Watchlist/useWatchlist'

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

const useFetchAnimeFromDB = (token) => {
    return useQuery({
        queryKey: ['animeFromDB'],
        queryFn: () => fetchAnimeFromDB(token),
        refetchOnWindowFocus: false,
        retry: 3,
        enabled: !!token
    })
}

const SkeletonCard = () => {
    return (
        <div className='animate-pulse bg-gray-800 p-4 rounded-sm'>
            <div className='bg-gray-700 w-full h-96'></div>
        </div>
    )
};

const AnimeCard = ({ anime, onClick, isWatchlisted, onToggleWatchlist }) => {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            key={anime.id}
            onClick={() => onClick(anime)}
            className="relative p-2 group cursor-pointer transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl hover:shadow-red-600/70"
        >
            <div className="overflow-hidden mb-3">
                <img
                    src={anime.image_url}
                    alt={anime.title}
                    className="aspect-auto w-full h-96 rounded-sm object-fit transition-all duration-300"
                    loading="lazy"
                />
            </div>

            <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-80 transition-opacity duration-300 flex flex-col p-6">
                <h2 className="text-red-400 font-medium text-2xl">{anime.title}</h2>
                <p className="text-white">{anime.episode_count} Episodes</p>
                <p className="text-white">{anime.synopsis.slice(0, 100)}...</p>

                <div
                    className="absolute bottom-8 left-4 hover:scale-110 transition-all duration-300 z-50"
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                >
                    <Tooltip
                        content={isWatchlisted ? "Remove from watchlist" : "Add to watchlist"}
                        style="light"
                        placement="right"
                    >
                        <BookmarkSimpleIcon
                            size={24}
                            color="red"
                            weight={hovered || isWatchlisted ? "fill" : "regular"}
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggleWatchlist(anime.id, isWatchlisted);
                            }}
                        />
                    </Tooltip>
                </div>
            </div>
        </div>
    );
};




function AnimeRecs() {
    const { session } = useAuth();
    const navigate = useNavigate();

    const deleteMutation = useDeleteWatchlist(session?.access_token);
    const createMutation = useCreateWatchlist(session?.access_token);

    // --- Local watchlist state (persisted in localStorage) ---
    const [watchlist, setWatchlist] = useState(() => {
        const saved = localStorage.getItem("watchlist") || "[]";
        return JSON.parse(saved);
    });

    // Keep localStorage in sync whenever watchlist changes
    useEffect(() => {
        localStorage.setItem("watchlist", JSON.stringify(watchlist));
    }, [watchlist]);

    // Toggle function
    const toggleWatchlist = async (animeId, isWatchlisted) => {
        try {
            if (isWatchlisted) {
                console.log('Here');
                // remove
                setWatchlist((prev) => prev.filter((id) => id !== animeId));
                // Optionally call backend remove mutation here
                deleteMutation.mutate({anime_id: animeId})
            } else {
                // add
                setWatchlist((prev) => [...prev, animeId]);
                await createMutation.mutateAsync({ anime_id: animeId, status: "plan_to_watch" });
            }
        } catch (err) {
            console.error("Watchlist update failed:", err);
        }
    };

    const { data: watchlistWithAnimeInfo, isSuccess } = useFetchWatchlistWithInfo(session?.access_token);
    const [modalData, setModalData] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const { data: animeFromDBData, isLoading: animeFromDBLoading, error: animeFromDBError, isSuccess: animeFromDBSuccess } = useFetchAnimeFromDB(session?.access_token);
    //Pagination
    const animePerPage = 24;
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(animeFromDBData?.anime_data.length / animePerPage);
    const start = (currentPage - 1) * animePerPage;
    const end = start + animePerPage;
    const slicedData = animeFromDBData ? animeFromDBData.anime_data.slice(start, end) : [];
    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    }
    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    }


    const openModal = (anime) => { setModalData(anime); }
    const closeModal = () => { setModalData(null); }


    // Handle modal close using escape key
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape') closeModal();
        }

        if (modalData) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'auto';
        }
    }, [modalData]);

    useEffect(() => {
        if (animeFromDBSuccess) {
            // console.log(animeFromDBData);
        }
        if (animeFromDBError) {
            setErrorMessage(animeFromDBError);
            console.error(animeFromDBError);
        }
    }, [animeFromDBSuccess, animeFromDBError]);



    return (
        <>
            <div className='flex min-h-screen bg-black'>
                {/* Sidebar */}
                <Sidebar />
                <div className='flex flex-1 p-4 sm:p-6'>
                    <div className='flex-1'>
                        <h1 className='text-xl sm:text-3xl text-white font-bold p-6 inline-flex gap-1.5'>Anime Recommendations <SparkleIcon /></h1>
                        <div className='grid grid-cols-1 sm:gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
                            {animeFromDBLoading && Array.from({ length: animePerPage }).map((_, i) => (
                                <SkeletonCard key={i} />
                            ))}
                            {animeFromDBSuccess && slicedData.map((anime) => (
                                <AnimeCard
                                    key={anime.id}
                                    anime={anime}
                                    onClick={openModal}
                                    onToggleWatchlist={toggleWatchlist}
                                    isWatchlisted={watchlist.includes(anime.id)}
                                />
                            ))}
                        </div>
                        {/* Pagination */}
                        {animeFromDBSuccess && (
                            <div className="flex justify-between items-center mt-6 px-2">
                                <button
                                    onClick={handlePrevPage}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-black cursor-pointer hover:scale-105 duration-300"
                                    aria-label="Previous page"
                                >
                                    <CaretLeftIcon size={20} color='white' />
                                </button>
                                <span className="text-sm text-gray-400">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    onClick={handleNextPage}
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-black cursor-pointer hover:scale-105 duration-300"
                                    aria-label="Next page"
                                >
                                    <CaretRightIcon size={20} color='white' />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {modalData && (
                <AnimeModal modalData={modalData} onClose={closeModal} />
            )}
        </>
    )
}

export default AnimeRecs