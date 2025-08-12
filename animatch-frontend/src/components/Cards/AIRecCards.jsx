import React, { useEffect, useState } from 'react'
import { CaretLeftIcon, CaretRightIcon, XCircleIcon, SparkleIcon, StarIcon, CalendarIcon, PlayIcon, TagIcon } from '@phosphor-icons/react';
import CloseButton from '../Buttons/CloseButton';

function AIRecCards({ data, error, success }) {
    const [currentPage, setCurrentPage] = useState(1);
    const cardsPerPage = 1;

    const [modalData, setModalData] = useState(null);
    const openModal = (aiRecs) => { setModalData(aiRecs); }
    const closeModal = () => { setModalData(null); }

    //Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }


    const totalPages = Math.ceil(data?.recommendations.length / cardsPerPage);
    const startIndex = (currentPage - 1) * cardsPerPage;
    const endIndex = startIndex + cardsPerPage;
    const paginatedCards = data?.recommendations.slice(startIndex, endIndex);

    const handleNextCard = () => setCurrentPage((currentPage) => (currentPage === totalPages ? 1 : currentPage + 1));

    const handlePrevCard = () => setCurrentPage((currentPage) => (currentPage === 1 ? totalPages : currentPage - 1));

    const handleKeyDown = (event) => {
        if (event.key === 'ArrowRight') handleNextCard();
        if (event.key == 'ArrowLeft') handlePrevCard();
        if (event.key === 'Escape') closeModal();
    }

    const formatSimilarityScore = (score) => {
        const percentage = Math.round(score * 10);
        return `${percentage}%`;
    }
    return (
        <>
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-800 p-6 rounded-lg ease-in-out space-y-6 hover:shadow-2xl transition-all duration-300" onKeyDown={handleKeyDown} tabIndex={0}>
                <div className='flex items-center justify-between'>
                    <h2 className="text-2xl font-bold flex items-center gap-2"><SparkleIcon size={30} color='yellow' /> Recommendations</h2>
                    <div>
                        <span className="text-sm text-gray-400">Total Recommendations: {data?.recommendations.length}</span>
                    </div>
                </div>
                {success && paginatedCards.map((rec) => (
                    <div
                        key={rec.id}
                        className="group p-6 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg shadow-lg hover:shadow-2xl animate-fade-right ease-in-out cursor-pointer hover:scale-103 transition-all duration-300 border border-gray-600/20 hover:border-gray-500/40"
                        onClick={() => openModal(rec)}
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && openModal(rec)}
                        aria-label={`Open details for ${rec.anime_title}`}
                    >
                        {/* Title and Similarity */}
                        <div className="flex items-center justify-between mb-4">
                            <div className='flex-1'>
                                <h3 className="text-xl font-semibold text-white">{rec.anime_title}</h3>
                                <div className='flex items-center gap-3 text-sm'>
                                    <span className='flex items-center gap-1 mt-1'>
                                        <StarIcon size={16} className='inline text-yellow-400' />
                                        Similarity: {formatSimilarityScore(rec.similarity_score)}
                                    </span>
                                    <span className='flex items-center gap-1 mt-1'>
                                        <CalendarIcon size={16} />
                                        Released:
                                        {rec.year}
                                    </span>
                                    <span className='flex items-center gap-1 mt-1'>
                                        <PlayIcon size={16} />
                                        {rec.show_type}
                                    </span>
                                    <span className={`px-1.5 py-0.5 mt-1 rounded text-xs font-semibold border border-current ${rec.age_rating === 'R' ? 'text-red-500' : 'text-white'}`}>
                                        {rec.age_rating}
                                    </span>
                                </div>

                            </div>
                        </div>

                        {/* Justification */}
                        <div className='mb-4'>
                            <p className="text-md text-gray-300 italic leading-relaxed">Justification: "{rec.justification}"</p>
                        </div>

                        {/* Genres */}
                        <div className='mb-4'>
                            <div className='flex items-center gap-2 mb-2'>
                                <TagIcon size={16} className='text-gray-400' />
                                <span className="text-sm text-gray-400 font-medium">Genres:</span>
                                {rec.genres.map((genre, index) => (
                                    <span key={index} className="bg-gray-700/60 text-gray-200 px-2.5 py-1 rounded-full text-xs hover:scale-105 hover:bg-gray-700/80 transition-colors cursor-default">
                                        {genre}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <p className="text-sm text-gray-400">
                            <strong>Status:</strong> {rec.status || 'Ongoing'}
                        </p>
                    </div>
                ))}
                {error && <p className="text-red-500">{error.message}</p>}
                {modalData && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/75 bg-opacity-75 z-50 p-4">
                        <div className="bg-gradient-to-br from-gray-700 to-gray-800 p-6 rounded-lg shadow-lg w-3xl">
                            <div className="flex items-start justify-between mb-4">
                                <div className='flex-1'>
                                    <h3 className="text-2xl font-semibold mb-2">{modalData.anime_title}</h3>
                                    <div className='flex items-center gap-3 text-sm mb-2'>
                                        <span className='flex items-center gap-1'>
                                            <StarIcon size={16} className='inline text-yellow-400' />
                                            Similarity: {formatSimilarityScore(modalData.similarity_score)}
                                        </span>
                                        <span className='flex items-center gap-1'>
                                            <CalendarIcon size={16} />
                                            Released: {modalData.year}
                                        </span>
                                        <span className='flex items-center gap-1'>
                                            <PlayIcon size={16} />
                                            {modalData.show_type}
                                        </span>
                                        <span className={`px-1.5 py-0.5  rounded text-xs font-semibold border border-current ${modalData.age_rating === 'R' ? 'text-red-500' : 'text-white'}`}>
                                            {modalData.age_rating}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div>
                                    <h4 className='text-lg mb-2 text-gray-200'>Synopsis:</h4>
                                    <p className="text-md text-gray-300 italic mb-4">"{modalData.synopsis}"</p>
                                </div>
                                <div className='flex justify-between items-center'>
                                    <p className="text-sm text-gray-200"><strong>Release Date:</strong> {formatDate(modalData.release_date)}</p>
                                    <p className="text-sm text-gray-200"><strong>End Date:</strong> {formatDate(modalData.end_date)}</p>
                                </div>          
                            </div>
                            <div className='flex items-center gap-2 mb-2 mt-2'>
                                <TagIcon size={16} className='text-gray-400' />
                                <span className="text-sm text-gray-400 font-medium">Genres:</span>
                                {modalData.genres.map((genre, index) => (
                                    <span key={index} className="bg-gray-700/60 text-gray-200 px-2.5 py-1 rounded-full text-xs hover:scale-105 hover:bg-gray-700/80 transition-colors cursor-default">
                                        {genre}
                                    </span>
                                ))}
                            </div>
                            <CloseButton onClick={closeModal} />
                        </div>
                    </div>
                )}
                <div className="flex justify-between items-center mb-4">
                    <button onClick={handlePrevCard}>
                        <CaretLeftIcon size={20} className='hover:text-gray-400 cursor-pointer' />
                    </button>
                    <span className="text-sm text-gray-400">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button onClick={handleNextCard}>
                        <CaretRightIcon size={20} className='hover:text-gray-400 cursor-pointer' />
                    </button>
                </div>
                {/* <div className='flex items-center justify-center'>
                    <p className="text-sm text-gray-400">
                                AI can make mistakes
                    </p>
                </div> */}
            </div>
        </>
    )
}

export default AIRecCards