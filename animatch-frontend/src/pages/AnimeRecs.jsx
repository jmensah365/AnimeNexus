import React, { useEffect, useState } from 'react'
import {  SparkleIcon, CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import AnimeModal from '../components/AniMatchHome/AnimeModal'
import {useAuth} from '../utils/Auth'

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

const AnimeCard = ({ anime, onClick }) => {
    return (
        <div
            key={anime.id}
            onClick={() => onClick(anime)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(anime); } }}
            className='relative p-2 group cursor-pointer transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl hover:shadow-red-600/70 focus:outline-none focus:ring-2 focus:ring-red-500'
            tabIndex={0}
            role='button'
            aria-label={`View details for ${anime.title}`}
        >
            <div className='overflow-hidden mb-3'>
                <img
                    src={anime.image_url}
                    alt={anime.title}
                    className='aspect-auto w-full h-96 rounded-sm object-fit object-fit transition-all duration-300  cursor-pointer'
                    loading='lazy' />
            </div>

            <div className='absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-80 transition-opacity duration-300 flex flex-col p-6'>
                <h2 className='text-red-400 font-medium text-2xl leading-tight'>{anime.title}</h2>
                <p className='text-white'>{anime.episode_count} Episodes</p>
                <p className=' text-white  leading-relaxed'>{anime.synopsis.slice(0, 100)}...</p>
            </div>
        </div>
    )
};



function AnimeRecs() {
    const {session} = useAuth();
    const navigate = useNavigate();
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