import React, { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query';
import Sidebar from '../components/Sidebar';
import { useGetTrendingAnime } from '../hooks/useAnime';


const SkeletonCard = () => {
    return (
        <div className='animate-pulse bg-gray-800 p-4 rounded-sm'>
            <div className='bg-gray-700 w-full h-96'></div>
        </div>
    )
};

function timeAgo(date) {
    if (!date) return "";
    const diff = (new Date() - new Date(date)) / 1000; // seconds
    if (diff < 60) return `${Math.floor(diff)}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
}

function TrendingAnime() {
    const getTrendingAnime = useGetTrendingAnime();



    const cachedAt = getTrendingAnime?.data?.[0]?.cached_at;
    const expiresAt = getTrendingAnime?.data?.[0]?.expires_at;


    const AnimeCard = ({ anime, onClick }) => {
        const stripHtml = (html) => {
            if (!html) return '';
            return html
                .replace(/<[^>]*>/g, '') // Remove HTML tags
                .replace(/&quot;/g, '"') // Decode common entities
                .replace(/&amp;/g, '&')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&#x27;/g, "'")
                .replace(/&nbsp;/g, ' ')
                .trim();
        };
        return (
            <div
                key={anime.id}
                onClick={() => onClick(anime)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(anime); } }}
                className='relative p-2 group cursor-pointer transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl hover:shadow-red-600/70 focus:outline-none focus:ring-2 focus:ring-red-500'
                tabIndex={0}
                role='button'
                aria-label={`View details for ${anime.title.english}`}
            >
                <div className='overflow-hidden mb-3'>
                    <img
                        src={anime.coverImage.large}
                        alt={anime.title.english}
                        className='aspect-auto w-full h-96 rounded-sm object-cover transition-all duration-300  cursor-pointer'
                        loading='lazy' />
                </div>
    
                <div className='absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-80 transition-opacity duration-300 flex flex-col p-6'>
                    <h2 className='text-red-400 font-medium text-2xl leading-tight'>{anime.title.english}</h2>
                    {/* <p className='text-white'>{anime.episode_count} Episodes</p> */}
                    <p className=' text-white  leading-relaxed'>{stripHtml(anime.description).slice(0, 100)}...</p>
                </div>
            </div>
        )
    };

    return (
        <div className='flex animate-fade-down bg-black min-h-screen'>
            <Sidebar />
            <div className='flex flex-1 p-4 sm:p-6'>
                <div className='flex-1 space-y-2'>
                    <h1 className='text-white text-xl sm:text-3xl'>Trending Anime</h1>
                    <p className='text-sm text-white'>
                        Last updated {timeAgo(cachedAt)}. Next refresh is at {new Date(expiresAt).toLocaleString()}
                    </p>
                    <div className='grid grid-cols-1 sm:gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
                        {getTrendingAnime.isLoading && Array.from({ length: 20 }).map((_, i) => (
                            <SkeletonCard key={i} />
                        ))}
                        {getTrendingAnime.isSuccess && getTrendingAnime.data.map((anime) => (
                                <AnimeCard
                                    key={anime.id}
                                    anime={anime}
                                    // onClick={openModal}
                                />
                            ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TrendingAnime

