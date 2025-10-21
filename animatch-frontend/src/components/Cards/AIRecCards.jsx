import React, { useState } from 'react'
import { CaretLeftIcon, CaretRightIcon, SparkleIcon, StarIcon, CalendarIcon, PlayIcon, TagIcon } from '@phosphor-icons/react';
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
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-800 p-4 sm:p-6 rounded-lg ease-in-out space-y-4 sm:space-y-6 hover:shadow-2xl transition-all duration-300" onKeyDown={handleKeyDown} tabIndex={0}>
                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
                    <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2"><SparkleIcon size={30} color='yellow' /> Recommendations</h2>
                    <div>
                        <span className="text-xs sm:text-sm text-gray-400">Total Recommendations: {data?.recommendations.length}</span>
                    </div>
                </div>
                {success && paginatedCards.map((rec) => (
                    <div
                        key={rec.id}
                        className="group p-4 sm:p-6 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg shadow-lg hover:shadow-2xl animate-fade-right ease-in-out cursor-pointer hover:scale-103 transition-all duration-300 border border-gray-600/20 hover:border-gray-500/40"
                        onClick={() => openModal(rec)}
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && openModal(rec)}
                        aria-label={`Open details for ${rec.anime_title}`}
                    >
                        {/* Title */}
                        <div className="mb-3 sm:mb-4">
                            <h3 className="text-lg sm:text-xl font-semibold text-white">{rec.anime_title}</h3>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-300 mt-1">
                                <span className="flex items-center gap-1">
                                    <StarIcon size={16} className="text-yellow-400" />
                                    {formatSimilarityScore(rec.similarity_score)}
                                </span>
                                <span className="flex items-center gap-1">
                                    <CalendarIcon size={16} />
                                    {rec.year}
                                </span>
                                <span className="flex items-center gap-1">
                                    <PlayIcon size={16} />
                                    {rec.show_type}
                                </span>
                                <span
                                    className={`px-1.5 py-0.5 rounded text-xs font-semibold border border-current ${rec.age_rating === 'R' ? 'text-red-500' : 'text-white'
                                        }`}
                                >
                                    {rec.age_rating}
                                </span>
                            </div>
                        </div>

                        {/* Justification */}
                        <p className="text-sm sm:text-base text-gray-300 italic mb-4">
                            “{rec.justification}”
                        </p>

                        {/* Genres */}
                        <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
                            <TagIcon size={16} className="text-gray-400" />
                            {rec.genres.map((genre, i) => (
                                <span
                                    key={i}
                                    className="bg-gray-700/60 text-gray-200 px-2 py-0.5 rounded-full text-xs sm:text-sm hover:bg-gray-700/80 transition-colors"
                                >
                                    {genre}
                                </span>
                            ))}
                        </div>

                        <p className="text-xs sm:text-sm text-gray-400">
                            <strong>Status:</strong> {rec.status || 'Ongoing'}
                        </p>
                    </div>
                ))}

                {error && <p className="text-red-500">{error.message}</p>}

                {/* Modal */}
                {modalData && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50 p-4 sm:p-6">
                        <div className="bg-gradient-to-br from-gray-700 to-gray-800 p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-3xl mx-4 relative">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-2">
                                <h3 className="text-xl sm:text-2xl font-semibold text-white">
                                    {modalData.anime_title}
                                </h3>
                            </div>

                            <div className="space-y-3 sm:space-y-4">
                                <p className="text-sm sm:text-base text-gray-300 italic">
                                    “{modalData.synopsis}”
                                </p>
                                <div className="flex flex-col sm:flex-row justify-between text-xs sm:text-sm text-gray-200">
                                    <p>
                                        <strong>Release:</strong> {formatDate(modalData.release_date)}
                                    </p>
                                    <p>
                                        <strong>End:</strong> {formatDate(modalData.end_date)}
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <TagIcon size={16} className="text-gray-400" />
                                    {modalData.genres.map((genre, i) => (
                                        <span
                                            key={i}
                                            className="bg-gray-700/60 text-gray-200 px-2 py-0.5 rounded-full text-xs sm:text-sm"
                                        >
                                            {genre}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <CloseButton onClick={closeModal} />
                        </div>
                    </div>
                )}

                {/* Pagination */}
                <div className="flex justify-center sm:justify-between items-center gap-6">
                    <button
                        onClick={handlePrevCard}
                        className="p-2 rounded-full hover:bg-gray-700 transition-colors"
                    >
                        <CaretLeftIcon size={22} className="text-gray-300 hover:text-gray-100" />
                    </button>
                    <span className="text-xs sm:text-sm text-gray-400">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={handleNextCard}
                        className="p-2 rounded-full hover:bg-gray-700 transition-colors"
                    >
                        <CaretRightIcon size={22} className="text-gray-300 hover:text-gray-100" />
                    </button>
                </div>
            </div>
        </>
    );
}

export default AIRecCards