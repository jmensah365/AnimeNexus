import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { BookmarkSimpleIcon, HeartStraightIcon} from '@phosphor-icons/react'
import AnimeModal from './AnimeModal'
import { Tooltip } from 'flowbite-react'
import { useNavigate } from 'react-router-dom'
import { useCreateWatchlist, useFetchWatchlistWithInfo, useDeleteWatchlistByAnimeId } from '../../hooks/useWatchlist'
import { useCreateReaction, useFetchReactionsWithInfo, useDeleteReactionByAnimeId } from '../../hooks/useReactions'
import { useAuth } from '../../utils/Auth'



function MainContentArea({ data, error, success }) {
    const { session } = useAuth();

    const slicedData = data ? data.anime_data.slice(0, 10) : [];

    const [modalData, setModalData] = useState(null);

    const openModal = (anime) => { setModalData(anime); }

    const closeModal = () => { setModalData(null); }

    const [hovered, setHovered] = useState(false);
    const [reactionHovered, setReactionHovered] = useState(false);

    const navigate = useNavigate();

    //Handle modal close using escape key
    useEffect(() => {
        const handleEscape = (event) => {
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




    if (error) {
        return (
            <div className='flex-1 p-6 mt-10'>
                <div className='bg-red-900/20 border-red-500/50 rounded-lg p-4 text-center'>
                    <p className='text-red-400 font-medium'>Error loading anime recommendations</p>
                    <p className='text-red-300 text-md mt-1'>{error?.message || String(error)}</p>
                </div>
            </div>
        )
    }
    return (
        <>
            {/* Main content area */}
            <div className="flex-1 p-6 mt-10">
                <p className="text-gray-400 mb-4 text-lg">Discover your next favorite anime with personalized recommendations.</p>
                <div className="flex gap-6 overflow-x-auto pb-4">
                    {success && slicedData.map((anime, index) => (
                        <div key={index} className='flex-shrink-0 cursor-pointer group transition-transform hover:scale-105' onClick={() => openModal(anime)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    openModal(anime)
                                }
                            }}>
                            <div className='relative aspect-auto  rounded-lg ' tabIndex={0}>
                                <img src={anime.image_url} alt={anime.title} className='object-cover transition-transform ' loading='lazy' />
                                <div className='absolute inset-0 bg-gradient-to-b from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity'>
                                    <div className='absolute top-4 left-3 text-white'>
                                        <p className="text-xs font-medium">{anime.title}</p>
                                    </div>
                                    <div className='absolute top-8 left-3 text-white'>
                                        <p className="text-xs font-medium">{anime.episode_count} Episodes</p>
                                    </div>
                                    <div className='absolute top-15 left-3 text-white'>
                                        <p className="text-xs font-medium">{anime.synopsis.slice(0, 200)}...</p>
                                    </div>
                                    <div className='absolute bottom-4 left-2 hover:scale-110 transition-all duration-300' onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
                                        <Tooltip
                                            content={watchlist.includes(anime.id) ? "Remove from watchlist" : "Add to watchlist"}
                                            style="light"
                                            placement="right"
                                        >
                                            <BookmarkSimpleIcon
                                                size={24}
                                                color="red"
                                                weight={hovered || watchlist.includes(anime.id) ? "fill" : "regular"}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleWatchlist(anime.id, watchlist.includes(anime.id));
                                                }}
                                            />
                                        </Tooltip>
                                    </div>
                                    <div
                                        className="absolute bottom-4 right-2 hover:scale-110 transition-all duration-300 z-50"
                                        onMouseEnter={() => setReactionHovered(true)}
                                        onMouseLeave={() => setReactionHovered(false)}
                                    >
                                        <Tooltip
                                            content={reactions.includes(anime.id) ? "Remove liked" : "Add like"}
                                            style="light"
                                            placement="left"
                                        >
                                            <HeartStraightIcon
                                                size={24}
                                                color="red"
                                                weight={reactionHovered || reactions.includes(anime.id) ? "fill" : "regular"}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleReaction(anime.id, reactions.includes(anime.id));
                                                }}
                                            />
                                        </Tooltip>
                                    </div>
                                </div>
                            </div>
                            {anime.title.length > 40 ? (<p className='text-gray-400 text-sm mt-2 font-bold leading-tight'>{anime.title.slice(0, 40)}...</p>) : <p className='text-gray-400 text-sm mt-2 font-bold leading-tight'>{anime.title}</p>}
                        </div>

                    ))}
                </div>
                <button
                    onClick={() => navigate('/anime-recs')}
                    className="mt-4 w-full text-sm font-medium bg-red-600 hover:bg-red-700 transition text-white py-2 rounded-lg cursor-pointer hover:scale-102 duration-300"
                >
                    See All
                </button>
            </div>
            <div className='flex items-center justify-center'>
                <h1>Spin-The-Wheel</h1>
            </div>
            {modalData && createPortal(
                <AnimeModal modalData={modalData} onClose={closeModal} />, document.body
            )}
        </>
    )
}

export default MainContentArea