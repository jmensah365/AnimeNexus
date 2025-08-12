import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { HouseIcon, SparkleIcon, UserCircleGearIcon, TrendUpIcon, ClockIcon, CheckSquareOffsetIcon, SignOutIcon, CaretLeftIcon, CaretRightIcon, PlusCircleIcon, XIcon, CalendarIcon, PlayIcon, TelevisionIcon, UserIcon, StarFourIcon } from '@phosphor-icons/react'
import {motion, AnimatePresence} from 'framer-motion'
import AnimeModal from './AnimeModal'



function MainContentArea({ data, error, success }) {
    const slicedData = data ? data.anime_data.slice(0, 10) : [];

    const [modalData, setModalData] = useState(null);

    const openModal = (anime) => { setModalData(anime); }

    const closeModal = () => { setModalData(null); }

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


    //Handle click outside modal
    const handleBackgroundClick = (event) => {
        if (event.target === event.currentTarget) {
            closeModal();
        }
    }

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'finished':
                return 'green-400'
            case 'current':
                return 'blue-400'
            case 'upcoming':
                return 'yellow-400'
            default:
                return 'gray-400'
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
                                </div>
                            </div>
                            <p className='text-gray-400 text-sm mt-2 font-bold leading-tight'>{anime.title}</p>
                        </div>

                    ))}
                </div>
            </div>
            <div className='flex items-center justify-center'>
                <h1>Spin-The-Wheel</h1>
            </div>
            {modalData && createPortal (
                    <AnimeModal modalData={modalData} onClose={closeModal}/>, document.body
                )}
        </>
    )
}

export default MainContentArea