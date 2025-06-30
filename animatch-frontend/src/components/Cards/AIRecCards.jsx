import React, { useState } from 'react'
import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react';
import CloseButton from '../Buttons/CloseButton';

function AIRecCards({ data, error, success }) {
    const [currentPage, setCurrentPage] = useState(1);
    const cardsPerPage = 1;

    const [modalData, setModalData] = useState(null);
    const openModal = (aiRecs) => { setModalData(aiRecs); }

    const closeModal = () => { setModalData(null); }


    const totalPages = Math.ceil(data?.recommendations.length / cardsPerPage);
    const startIndex = (currentPage - 1) * cardsPerPage;
    const endIndex = startIndex + cardsPerPage;
    const paginatedCards = data?.recommendations.slice(startIndex, endIndex);

    const handleNextCard = () => setCurrentPage((currentPage) => (currentPage === totalPages  ? 1 : currentPage + 1));

    const handlePrevCard = () => setCurrentPage((currentPage) => (currentPage === 1 ? totalPages : currentPage - 1));
    return (
        <>
            <div className="bg-gray-800/50 p-6 rounded-lg animate-jump ease-in-out space-y-6">
                <h2 className="text-2xl font-bold mb-4">AI Recommendations</h2>
                {success && paginatedCards.map((rec) => (
                    <div
                        key={rec.id}
                        className="p-4 bg-gray-700 rounded-lg shadow-lg hover:shadow-2xl animate-fade-right ease-in-out cursor-pointer"
                        onClick={() => openModal(rec)}
                    >
                        {/* Title and Similarity */}
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-white">{rec.anime_title}</h3>
                            <span className="text-sm text-gray-400">Similarity: {rec.similarity_score}</span>
                        </div>

                        {/* Justification */}
                        <p className="text-sm text-gray-300 italic mb-4">Justification: "{rec.justification}"</p>

                        {/* Year and Genres */}
                        <div className="mb-2">
                            {/* <p className="text-sm text-gray-400"><strong>Year:</strong> {rec.year}</p> */}
                            <p className="text-sm text-gray-400">
                                <strong>Genres:</strong> {rec.genres.join(', ')}
                            </p>
                        </div>

                        {/* Release and End Dates */}
                        <div className="mb-2">
                            {/* <p className="text-sm text-gray-400">
                                <strong>Release Date:</strong> {rec.release_date}
                            </p>
                            <p className="text-sm text-gray-400">
                                <strong>End Date:</strong> {rec.end_date}
                            </p> */}
                            <p className="text-sm text-gray-400">
                                <strong>Status:</strong> {rec.status || 'Ongoing'}
                            </p>
                        </div>

                        {/* Age Rating and Show Type */}
                        <div className="mb-2">
                            {/* <p className={`text-sm ${rec.age_rating == 'R' ? 'text-red-400' : 'text-gray-400'}`}>
                                <strong>Age Rating:</strong> {rec.age_rating}
                            </p> */}
                            {/* <span className='inline-flex gap-0.5 text-sm font-bold text-gray-400'>Age Rating:<p className={`text-md ${rec.age_rating == 'R' ? 'text-red-400' : 'text-gray-400'}`}>{rec.age_rating}</p></span> */}
                            {/* <p className="text-sm text-gray-400">
                                <strong>Show Type:</strong> {rec.show_type}
                            </p> */}
                        </div>
                    </div>
                ))}
                {error && <p className="text-red-500">{error.message}</p>}
                {modalData && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
                        <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full">
                            <h3 className="text-xl font-semibold mb-4">{modalData.anime_title}</h3>
                            <p className="text-sm text-gray-300 mb-2">Similarity: {modalData.similarity_score}</p>
                            <p className="text-sm text-gray-300 italic mb-4">Description: "{modalData.synopsis}"</p>
                            <p className="text-sm text-gray-400"><strong>Year:</strong> {modalData.year}</p>
                            <p className="text-sm text-gray-400"><strong>Genres:</strong> {modalData.genres.join(', ')}</p>
                            <p className="text-sm text-gray-400"><strong>Release Date:</strong> {modalData.release_date}</p>
                            <p className="text-sm text-gray-400"><strong>End Date:</strong> {modalData.end_date}</p>
                            <p className={`text-sm ${modalData.age_rating == 'R' ? 'text-red-400' : 'text-gray-400'}`}>
                                <strong>Age Rating:</strong> {modalData.age_rating}
                            </p>
                            <p className="text-sm text-gray-400"><strong>Show Type:</strong> {modalData.show_type}</p>
                            <CloseButton onClick={closeModal}/>
                        </div>
                    </div>
                )}
                <div className="flex justify-between items-center mb-4">
                            <button onClick={handlePrevCard}>
                                <CaretLeftIcon size={20} className='hover:text-gray-400 cursor-pointer'/>
                            </button>
                            <span className="text-sm text-gray-400">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button onClick={handleNextCard}>
                                <CaretRightIcon size={20} className='hover:text-gray-400 cursor-pointer'/>
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