import React, { useState, useEffect, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon, CalendarIcon, PlayIcon, TelevisionIcon, UserIcon, StarFourIcon, ArrowCircleUpIcon } from '@phosphor-icons/react'
import Sidebar from '../components/Sidebar';

const fetchAnime = async ({ pageParam = 1, queryKey }) => {
    const [_key, { query, limit }] = queryKey;
    if (!query.trim()) return { data: [], pageInfo: {} };

    const gqlQuery = `
        query ($search: String, $page: Int, $perPage: Int) {
            Page(page: $page, perPage: $perPage) {
            pageInfo {
                currentPage
                hasNextPage
            }
            media(search: $search, type: ANIME) {
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
                description(asHtml: false)
                episodes
                status
                format
                startDate {
                year
                month
                day
                }
                endDate {
                year
                month
                day
                }
                trailer {
                id
                site
                }
            }
            }
        }
        `;

    const variables = {
        search: query,
        page: pageParam,
        perPage: limit,
    };

    const res = await fetch("https://graphql.anilist.co", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({ query: gqlQuery, variables }),
    });

    if (!res.ok) throw new Error("Failed to fetch anime");
    const json = await res.json();
    return json.data.Page;
};


const AnimeModal = ({ modalData, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (modalData) {
            setTimeout(() => setIsVisible(true), 10);
        }
    }, [modalData]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    const handleBackgroundClick = (event) => {
        if (event.target === event.currentTarget) {
            handleClose();
        }
    };

    const getStatusColor = (status) => {
        if (!status) return 'gray-400';
        switch (status.toLowerCase()) {
            case 'finished':
                return 'green-400';
            case 'releasing':
                return 'blue-400';
            case 'not_yet_released':
            case 'upcoming':
                return 'yellow-400';
            default:
                return 'gray-400';
        }
    };

    const formatDate = (date) => {
        if (!date?.year) return 'Unknown';
        const { year, month, day } = date;
        return `${year}${month ? `-${String(month).padStart(2, '0')}` : ''}${day ? `-${String(day).padStart(2, '0')}` : ''}`;
    };

    if (!modalData) return null;

    return (
        <AnimatePresence>
            {modalData && isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/80 backdrop-blur-sm"
                    onClick={handleBackgroundClick}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl max-w-4xl max-h-[90vh] overflow-hidden w-full relative border border-gray-700"
                    >
                        {/* Close Button */}
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 z-50 text-gray-400 hover:text-white transition-colors bg-black/20 hover:bg-black/40 rounded-full p-2 backdrop-blur-sm cursor-pointer"
                            aria-label="Close modal"
                        >
                            <XIcon size={20} weight="bold" />
                        </button>

                        <div className="overflow-y-auto max-h-[90vh]">
                            {/* Header */}
                            <div className="relative p-5 text-center">
                                <motion.h1
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-4xl md:text-5xl font-bold text-white mb-2 leading-tight"
                                >
                                    {modalData.title.english || modalData.title.romaji}
                                </motion.h1>
                            </div>

                            {/* Main Content */}
                            <div className="px-8 pb-8">
                                <div className="flex flex-col gap-8">
                                    {/* Image Section */}
                                    <motion.div
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                        className="flex-shrink-0 flex items-center justify-center mt-5"
                                    >
                                        <div className="relative group">
                                            <img
                                                src={modalData.coverImage?.large}
                                                alt={modalData.title.english || modalData.title.romaji}
                                                className="w-64 h-80 object-cover rounded-xl shadow-2xl mx-auto transition-transform group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl" />
                                        </div>
                                    </motion.div>

                                    {/* Info Section */}
                                    <motion.div
                                        initial={{ x: 20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                        className="flex-1 space-y-6"
                                    >
                                        {/* Stats Grid */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <TelevisionIcon className="w-4 h-4 text-blue-400" weight="bold" />
                                                    <span className="text-gray-400 text-sm">Episodes</span>
                                                </div>
                                                <span className="text-white font-semibold">
                                                    {modalData.episodes || 'N/A'}
                                                </span>
                                            </div>

                                            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <UserIcon className="w-4 h-4 text-purple-400" weight="bold" />
                                                    <span className="text-gray-400 text-sm">Format</span>
                                                </div>
                                                <span className="text-white font-semibold">
                                                    {modalData.format || 'N/A'}
                                                </span>
                                            </div>

                                            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <div className={`w-2 h-2 rounded-full bg-${getStatusColor(modalData.status)}`} />
                                                    <span className="text-gray-400 text-sm">Status</span>
                                                </div>
                                                <span className={`font-semibold text-${getStatusColor(modalData.status)}`}>
                                                    {modalData.status?.replace(/_/g, ' ') || 'Unknown'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/30">
                                            <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                                                <div className="w-1 h-6 bg-blue-500 rounded-full" />
                                                Synopsis
                                            </h3>
                                            <p className="text-gray-300 leading-relaxed">
                                                {modalData.description
                                                    ? modalData.description.replace(/<[^>]*>/g, "")
                                                    : 'No synopsis available.'}
                                            </p>
                                        </div>

                                        {/* Dates */}
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <div className="flex-1 bg-gray-800/30 rounded-lg p-4 border border-gray-700/30">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <CalendarIcon className="w-4 h-4 text-green-400" weight="bold" />
                                                    <span className="text-gray-400 text-sm">Start Date</span>
                                                </div>
                                                <span className="text-white font-medium">
                                                    {formatDate(modalData.startDate)}
                                                </span>
                                            </div>

                                            <div className="flex-1 bg-gray-800/30 rounded-lg p-4 border border-gray-700/30">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <CalendarIcon className="w-4 h-4 text-red-400" weight="bold" />
                                                    <span className="text-gray-400 text-sm">End Date</span>
                                                </div>
                                                <span className="text-white font-medium">
                                                    {formatDate(modalData.endDate)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Trailer Button */}
                                        {modalData.trailer?.site === "youtube" && (
                                            <motion.a
                                                href={`https://www.youtube.com/watch?v=${modalData.trailer.id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center justify-center gap-3 w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-red-500/25 group"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <PlayIcon className="w-5 h-5 group-hover:scale-110 transition-transform" weight="fill" />
                                                Watch Trailer
                                            </motion.a>
                                        )}
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};


export default function Search() {
    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [selectedAnime, setSelectedAnime] = useState(null);
    const limit = 12;

    // Debounce query input
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(query);
        }, 500);
        return () => clearTimeout(handler);
    }, [query]);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error,
    } = useInfiniteQuery({
        queryKey: ["animeSearch", { query: debouncedQuery, limit }],
        queryFn: fetchAnime,
        getNextPageParam: (lastPage) => {
            if (lastPage?.pageInfo?.hasNextPage) {
                return lastPage.pageInfo.currentPage + 1;
            }
            return undefined;
        },
        enabled: !!debouncedQuery.trim(),
        staleTime: 1000 * 60 * 5,
    });


    // Scroll to top on new search
    useEffect(() => {
        if (debouncedQuery.trim()) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [debouncedQuery]);

    // IntersectionObserver for preloading next page
    const loadMoreRef = useRef(null);
    useEffect(() => {
        if (!hasNextPage || isFetchingNextPage) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    fetchNextPage();
                }
            },
            { root: null, rootMargin: '300px', threshold: 0 }
        );

        if (loadMoreRef.current) observer.observe(loadMoreRef.current);
        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    // Close modal on ESC key
    useEffect(() => {
        const onKeyDown = (e) => {
            if (e.key === 'Escape') setSelectedAnime(null);
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, []);

    return (
        <div className="flex min-h-screen bg-black text-white animate-fade-down">
            <Sidebar />
            <main className="flex-grow max-w-7xl mx-auto p-6">
                {/* Search Bar */}
                <input
                    type="text"
                    placeholder="Search anime..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full max-w-lg mx-auto block mb-6 rounded-md border border-gray-700 bg-gray-900 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                />

                {/* Loading & Error */}
                {isLoading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {Array.from({ length: limit }).map((_, idx) => (
                            <SkeletonCard key={idx} />
                        ))}
                    </div>
                )}
                {isError && (
                    <p className="text-center text-red-500 font-semibold">{error.message}</p>
                )}

                {/* Results Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {data?.pages.map((page) =>
                        page.media.map((anime) => (
                            <motion.div
                                key={anime.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="cursor-pointer rounded-lg bg-gray-900 shadow-lg hover:shadow-red-600 transition-shadow overflow-hidden"
                                onClick={() => setSelectedAnime(anime)}
                                title={anime.title.english || anime.title.romaji}
                            >
                                <img
                                    src={anime.coverImage?.large}
                                    alt={anime.title.english || anime.title.romaji}
                                    className="w-full h-[450px] object-cover object-center"
                                    loading="lazy"
                                />
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold truncate">
                                        {anime.title.english || anime.title.romaji}
                                    </h3>
                                    <p className="mt-1 text-gray-400 text-sm line-clamp-3">
                                        {anime.description
                                            ? anime.description.replace(/<[^>]*>/g, "").slice(0, 120) + "..."
                                            : "No synopsis available."}
                                    </p>
                                </div>
                            </motion.div>
                        ))
                    )}


                    {/* Skeleton placeholders for next page */}
                    {isFetchingNextPage &&
                        Array.from({ length: limit }).map((_, idx) => (
                            <SkeletonCard key={`next-${idx}`} />
                        ))}
                </div>

                {/* Infinite scroll trigger */}
                <div ref={loadMoreRef} className="h-12 flex justify-center items-center mt-8">
                    {!hasNextPage && debouncedQuery && (
                        <button type='button' className='text-gray-300 animate-bounce cursor-pointer' onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                            <span className='inline-flex items-center justify-center gap-2'>Scroll back to the top <ArrowCircleUpIcon /></span>
                        </button>
                    )}
                </div>
            </main>

            {/* Modal */}
            <AnimeModal modalData={selectedAnime} />
        </div>
    );
}

// Skeleton Card Component
function SkeletonCard() {
    return (
        <div className="border border-gray-700 rounded-lg p-3 flex flex-col gap-3 animate-pulse bg-gray-800">
            <div className="w-full h-48 bg-gray-700 rounded"></div>
            <div className="flex flex-col gap-2 flex-1">
                <div className="h-5 bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-700 rounded w-5/6"></div>
            </div>
        </div>
    );
}
