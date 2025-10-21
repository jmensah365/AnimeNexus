import React, { useEffect, useState } from 'react'
import { SparkleIcon, CaretLeftIcon, CaretRightIcon, BookmarkSimpleIcon, HeartStraightIcon, ListIcon } from '@phosphor-icons/react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import AnimeModal from '../components/AniMatchHome/AnimeModal'
import { useAuth } from '../utils/Auth'
import { Tooltip } from 'flowbite-react'
import { useCreateWatchlist, useFetchWatchlistWithInfo, useDeleteWatchlistByAnimeId } from '../hooks/useWatchlist'
import { useCreateReaction, useFetchReactionsWithInfo, useDeleteReactionByAnimeId } from '../hooks/useReactions'
import { useFetchAnimeFromDB } from '../hooks/useAnime'

const SkeletonCard = () => {
    return (
        <div className='animate-pulse bg-gray-800 p-4 rounded-sm'>
            <div className='bg-gray-700 w-full h-96'></div>
        </div>
    )
};

const AnimeCard = ({ anime, onClick, isWatchlisted, onToggleWatchlist, isFavorited, onToggleReaction }) => {
    const [hovered, setHovered] = useState(false);
    const [reactionHovered, setReactionHovered] = useState(false);

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
                <div
                    className="absolute bottom-8 right-4 hover:scale-110 transition-all duration-300 z-50"
                    onMouseEnter={() => setReactionHovered(true)}
                    onMouseLeave={() => setReactionHovered(false)}
                >
                    <Tooltip
                        content={isFavorited ? "Remove liked" : "Add like"}
                        style="light"
                        placement="left"
                    >
                        <HeartStraightIcon
                            size={24}
                            color="red"
                            weight={reactionHovered || isFavorited ? "fill" : "regular"}
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggleReaction(anime.id, isFavorited);
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
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const deleteMutation = useDeleteWatchlistByAnimeId(session?.access_token);
    const createMutation = useCreateWatchlist(session?.access_token);

    // Fetch watchlist from backend
    const { data: watchlistWithAnimeInfo, isSuccess: watchlistSuccess, isLoading: watchlistLoading } = useFetchWatchlistWithInfo(session?.access_token);

    // Local watchlist state - will be synced with backend
    const [watchlist, setWatchlist] = useState([]);
    const [isWatchlistInitialized, setIsWatchlistInitialized] = useState(false);


    // Initialize watchlist from backend when data is available
    useEffect(() => {
        if (watchlistSuccess && watchlistWithAnimeInfo && !isWatchlistInitialized) {
            // Extract anime IDs from the backend response
            const backendWatchlistAnimeIds = watchlistWithAnimeInfo?.result.map(item => item.kitsu_anime_data.id);
            setWatchlist(backendWatchlistAnimeIds);
            setIsWatchlistInitialized(true);
            console.log('Watchlist initialized from backend:', backendWatchlistAnimeIds);
        }
    }, [watchlistSuccess, watchlistWithAnimeInfo, isWatchlistInitialized]);

    // Toggle function with optimistic updates
    const toggleWatchlist = async (animeId, isWatchlisted) => {
        try {
            if (isWatchlisted) {
                // Optimistically update UI first
                setWatchlist((prev) => prev.filter((id) => id !== animeId));

                // Then call backend
                await deleteMutation.mutateAsync({ anime_id: animeId });
                console.log('Removed from watchlist:', animeId);
            } else {
                // Optimistically update UI first
                setWatchlist((prev) => [...prev, animeId]);

                // Then call backend
                await createMutation.mutateAsync({ anime_id: animeId, status: "plan_to_watch" });
                console.log('Added to watchlist:', animeId);
            }
        } catch (err) {
            console.error("Watchlist update failed:", err);

            // Revert optimistic update on error
            if (isWatchlisted) {
                // If removal failed, add it back
                setWatchlist((prev) => [...prev, animeId]);
            } else {
                // If addition failed, remove it
                setWatchlist((prev) => prev.filter((id) => id !== animeId));
            }
        }
    };


    const createReactionMutation = useCreateReaction(session?.access_token);
    const deleteReactionMutation = useDeleteReactionByAnimeId(session?.access_token);

    // Fetch reactions from backend
    const { data: reactionsWithAnimeInfo, isSuccess: reactionsSuccess, isLoading: reactionsLoading } = useFetchReactionsWithInfo(session?.access_token);

    // Local watchlist state - will be synced with backend
    const [reactions, setReactions] = useState([]);
    const [isReactionsInitialized, setIsReactionsInitialized] = useState(false);


    // Initialize reactions from backend when data is available
    useEffect(() => {
        if (reactionsSuccess && reactionsWithAnimeInfo && !isReactionsInitialized) {
            // Extract anime IDs from the backend response
            const backendReactionAnimeIds = reactionsWithAnimeInfo?.result.map(item => item.kitsu_anime_data.id);
            setReactions(backendReactionAnimeIds);
            setIsReactionsInitialized(true);
            console.log('Reactions initialized from backend:', backendReactionAnimeIds);
        }
    }, [reactionsSuccess, reactionsWithAnimeInfo, isReactionsInitialized]);

    // Toggle function with optimistic updates
    const toggleReaction = async (animeId, isFavorited) => {
        try {
            if (isFavorited) {
                // Optimistically update UI first
                setReactions((prev) => prev.filter((id) => id !== animeId));

                // Then call backend
                await deleteReactionMutation.mutateAsync({ anime_id: animeId });
                console.log('Removed reaction:', animeId);
            } else {
                // Optimistically update UI first
                setReactions((prev) => [...prev, animeId]);

                // Then call backend
                await createReactionMutation.mutateAsync({ anime_id: animeId, reaction: "liked" });
                console.log('Added reaction:', animeId);
            }
        } catch (err) {
            console.error("Reaction update failed:", err);

            // Revert optimistic update on error
            if (isFavorited) {
                // If removal failed, add it back
                setReactions((prev) => [...prev, animeId]);
            } else {
                // If addition failed, remove it
                setReactions((prev) => prev.filter((id) => id !== animeId));
            }
        }
    };

    const [modalData, setModalData] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const animeFromDB = useFetchAnimeFromDB(session?.access_token);

    // Pagination
    // Dynamically set number of anime per page based on screen width
    const getAnimePerPage = () => {
        if (window.innerWidth < 640) return 6; // mobile (sm)
        if (window.innerWidth < 1024) return 12; // tablet (md)
        return 24; // desktop (lg+)
    };

    const [animePerPage, setAnimePerPage] = useState(getAnimePerPage());

    // Update on window resize
    useEffect(() => {
        const handleResize = () => {
            setAnimePerPage(getAnimePerPage());
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(animeFromDB?.data?.anime_data.length / animePerPage);
    const start = (currentPage - 1) * animePerPage;
    const end = start + animePerPage;
    const slicedData = animeFromDB.data ? animeFromDB.data.anime_data.slice(start, end) : [];

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
            window.scrollTo({top: 0, behavior: 'smooth'});
        };
    }
    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            window.scrollTo({top: 0, behavior: 'smooth'});
        };
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
        if (animeFromDB.isSuccess) {
            // console.log(animeFromDBData);
        }
        if (animeFromDB.isError) {
            setErrorMessage(animeFromDB.error);
            console.error(animeFromDB.error);
        }
    }, [animeFromDB.isSuccess, animeFromDB.isError]);

    // Show loading state while both anime data and watchlist are loading
    const isLoading = animeFromDB.isLoading || (session?.access_token && !isWatchlistInitialized && watchlistLoading);

    return (
        <>
            <div className='flex min-h-screen bg-black text-white relative overflow-hidden'>
                <div
                    className={`fixed inset-y-0 left-0 z-50 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                        } transition-transform duration-300 bg-black border-r border-gray-800 w-64 p-4 lg:hidden`}
                >
                    <Sidebar  />
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="absolute top-4 right-4 text-white text-2xl focus:outline-none"
                    >
                        ✕
                    </button>
                </div>

                {/*  Desktop Sidebar */}
                <div className="hidden lg:block">
                    <Sidebar />
                </div>

                <div className='flex-1 p-4 sm:p-6'>
                    <div className='flex items-center justify-between mb-4 lg:hidden'>
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-2 rounded-lg hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                            <ListIcon size={24} color="white" />
                        </button>
                        <h1 className="text-xl font-bold flex items-center gap-1">
                            Anime Recs <SparkleIcon size={18} />
                        </h1>
                    </div>

                    {/* Desktop Title */}
                    <h1 className="hidden lg:inline-flex text-3xl text-white font-bold p-6 gap-2">
                        Anime Recommendations <SparkleIcon size={24} />
                    </h1>

                    <div className='grid grid-cols-1 sm:gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
                        {isLoading && Array.from({ length: animePerPage }).map((_, i) => (
                            <SkeletonCard key={i} />
                        ))}
                        {animeFromDB.isSuccess && slicedData.map((anime) => (
                            <AnimeCard
                                key={anime.id}
                                anime={anime}
                                onClick={openModal}
                                onToggleWatchlist={toggleWatchlist}
                                isWatchlisted={watchlist.includes(anime.id)}
                                isFavorited={reactions.includes(anime.id)}
                                onToggleReaction={toggleReaction}
                            />
                        ))}
                    </div>
                    {/* Pagination */}
                    {animeFromDB.isSuccess && (
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
            {modalData && (
                <AnimeModal modalData={modalData} onClose={closeModal} />
            )}
        </>
    )
}

export default AnimeRecs