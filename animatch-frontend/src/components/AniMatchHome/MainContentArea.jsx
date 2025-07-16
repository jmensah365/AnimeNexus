import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import {XCircleIcon} from '@phosphor-icons/react'

function MainContentArea({ data, error, success }) {
    const slicedData = data ? data.anime_data.slice(0, 12) : [];

    const [modalData, setModalData] = useState(null);

    const openModal = (anime) => { setModalData(anime); }

    const closeModal = () => { setModalData(null); }

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

    if (error) {
        return (
            <div className='flex-1 p-6 mt-10'>
                <div className='bg-red-900/20 border-red-500/50 rounded-lg p-4 text-center'>
                    <p className='text-red-400 font-medium'>Error loading anime reccommendations</p>
                    <p className='text-red-300 text-md mt-1'>{error}</p>
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
                        <div key={index} className='flex-shrink-0 cursor-pointer group transition-transform hover:scale-105' onClick={() => openModal(anime)}>
                            <div className='relative aspect-auto overflow-hidden rounded-lg'>
                                <img src={anime.image_url} alt={anime.title} className='object-cover transition-transform group-hover:scale-105' loading='lazy' />
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
                                </div>
                            </div>
                            <p className='text-gray-400 text-sm mt-2 font-bold leading-tight'>{anime.title}</p>
                        </div>

                    ))}
                </div>
                {modalData && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 mt-200" style={{ backgroundColor: "rgba(0,0,0,0.8)" }} onClick={handleBackgroundClick}>
                        <div className="bg-gray-900 p-6 rounded-xl shadow-2xl max-w-3xl max-h-[90vh] overflow-y-auto w-full space-y-4 mt-auto">
                        {/* <button
                                onClick={closeModal}
                                className="absolute top-50 right-50 z-10 text-gray-400 hover:text-white transition-colors  rounded-full p-2 cursor-pointer"
                                aria-label="Close modal"
                            >
                                <XCircleIcon size={100}/>
                            </button> */}
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
            <div className='flex items-center justify-center'>
                <h1>Spin-The-Wheel</h1>
            </div>
        </>
    )
}

export default MainContentArea