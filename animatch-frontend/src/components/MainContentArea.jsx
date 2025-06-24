import React from 'react'

function MainContentArea() {
    return (
        <>
            {/* Main content area */}
            <div className="flex-1 p-6 mt-10">
                <p className="text-gray-400 mb-4">Discover your next favorite anime with personalized recommendations.</p>
                <div className="grid grid-cols-3 gap-4">
                    {kitsuAPIData && kitsuAPIData.map((anime, index) => (
                        <div key={index} className="bg-gray-800/50 p-4 rounded-lg space-y-2">
                            <img src={anime.image_url} alt={anime.title} className="w-full h-32 object-cover rounded-lg mb-2" />
                            <h3 className="text-lg font-medium">{anime.title}</h3>
                            <p className='text-gray-400'>{anime.age_rating}</p>
                            <button onClick={() => openModal(anime)} type='button' >
                                <span className="text-red-500 hover:text-red-400 cursor-pointer">View Details</span>
                            </button>
                        </div>
                    ))}
                </div>
                {modalData && (
                    <div className="fixed inset-0flex items-center justify-center z-50" style={{ backgroundColor: "rgba(0,0,0,0.8)" }}>
                        <div className="bg-gray-900 p-6 rounded-lg shadow-lg max-w-md w-full space-y-4">
                            <h2 className="text-2xl font-bold text-white">{modalData.title}</h2>
                            <p className="text-gray-400">{modalData.synopsis}</p>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500">
                                    Age Rating: <span className="font-medium text-white">{modalData.age_rating || 'N/A'}</span>
                                </span>
                                <span className="text-sm text-gray-500">
                                    Episodes: <span className="font-medium text-white">{modalData.episode_count || 'N/A'}</span>
                                </span>
                            </div>
                            <h2>{modalData.start_date}</h2>
                            <h2>{modalData.end_date}</h2>
                            <h2>{modalData.status}</h2>
                            <h2>{modalData.show_type}</h2>
                            <button
                                onClick={closeModal}
                                className="mt-4 inline-block bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors w-full text-center"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default MainContentArea