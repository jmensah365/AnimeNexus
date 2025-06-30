import React, {useState} from 'react'

function MainContentArea({data, error, success}) {

    const [modalData, setModalData] = useState(null);

    const openModal = (anime) => { setModalData(anime); }

    const closeModal = () => { setModalData(null); }
    return (
        <>
            {/* Main content area */}
            <div className="flex-1 p-6 mt-10">
                <p className="text-gray-400 mb-4">Discover your next favorite anime with personalized recommendations.</p>
                <div className="flex gap-4 overflow-x-auto">
                    {success && data.map((anime, index) => (
                        <div key={index} className='flex-shrink-0 cursor-pointer' onClick={() => openModal(anime)}>
                            <div className='bg-gray-800 border-gray-700 aspect-auto'>
                                <img src={anime.image_url} alt={anime.title} className='object-cover w-48 h-64'/>
                            </div>
                            <p className='text-gray-300 text-sm mt-2'>{anime.title}</p>
                        </div>

                    ))}
                </div>
                {modalData && (
                    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: "rgba(0,0,0,0.8)" }}>
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
                            <a href={`https://www.youtube.com/watch?v=${modalData.youtube_id}`} target='_blank' >Watch Trailer</a>
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