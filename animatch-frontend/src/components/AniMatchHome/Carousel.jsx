import React, { useEffect, useState } from 'react';
import { CaretCircleLeftIcon, CaretCircleRightIcon, PlayCircleIcon, ProhibitIcon, SmileySadIcon } from '@phosphor-icons/react';
import StyledButton from '../Buttons/StyledButton';

function Carousel({ data, autoSlide = true, autoSlideInterval = 6000 }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [activeYoutubeId, setActiveYoutubeId] = useState(null);

    const prev = () => setCurrentIndex((currentIndex) => (currentIndex === 0 ? data?.length - 1 : currentIndex - 1));
    const next = () => setCurrentIndex((currentIndex) => (currentIndex === data?.length - 1 ? 0 : currentIndex + 1));

    useEffect(() => {
        if (!autoSlide) return;
        const slideInterval = setInterval(next, autoSlideInterval);
        return () => clearInterval(slideInterval);
    }, [autoSlide, autoSlideInterval, next]);

    const openModal = (youtubeId) => {
        setActiveYoutubeId(youtubeId);
        setShowModal(true);
    }

    const closeModal = () => {
        setActiveYoutubeId(null);
        setShowModal(false);
    }


    if (!data || data.length === 0) {
        return <div className="text-white text-center py-10">Loading...</div>;
    }

    return (
        <>
            <div className="relative w-full h-[800px] overflow-hidden shadow-2xl aspect-auto">
                {/* Slides */}
                <div
                    className="flex transition-transform ease-out duration-700 h-full"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {data.map((item, index) => (
                        <div key={index} className={`w-full flex-shrink-0 relative h-full bg-cover bg-center`}>
                            <img
                                src={item.poster_image}
                                alt={item.title}
                                className="w-full h-full object-fit object-center"
                            />
                            <div className="absolute inset-0 z-50 pointer-events-auto bg-gradient-to-r from-black/50 via-black/20 to-transparent p-10 flex flex-col justify-end">
                                <h2 className="text-3xl font-extrabold text-white mb-2 max-w-md">{item.title}</h2>
                                <p className="text-white text-sm max-w-md">
                                    {item.synopsis.slice(0, 300)}...
                                </p>

                                {item.youtube_id === null ? (
                                    <button
                                        className="mt-6 relative z-50 bg-red-600 hover:bg-red-800 text-white font-semibold py-2 px-6 rounded w-fit cursor-pointer flex items-center gap-2"
                                    >
                                        <SmileySadIcon size={32}/>Trailer Not Available
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => openModal(item.youtube_id)}
                                        className="mt-6 relative z-50 bg-red-600 hover:bg-red-800 text-white font-semibold py-2 px-6 rounded w-fit cursor-pointer flex items-center gap-2"
                                    >
                                        <PlayCircleIcon size={32} /> Watch Trailer
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                {/* PopupModal for YouTube Trailer */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/90 bg-opacity-75 flex items-start justify-center z-50">
                        <div className="relative w-full max-w-3xl aspect-video p-4 mt-50">
                            <iframe
                                className="w-full h-full rounded-lg shadow-lg"
                                src={`https://www.youtube.com/embed/${activeYoutubeId}?autoplay=1&rel=0&mute=1&cc_load_policy=1`}
                                title="Anime Trailer"
                                allow='autoplay; encrypted-media; picture-in-picture'
                                allowFullScreen
                            ></iframe>
                            <button
                                onClick={closeModal}
                                className="absolute -top-15 -right-5 text-white text-2xl"
                                aria-label='Close Modal'
                            >
                                <label class="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" value="" class="sr-only peer" />
                                    <div class="peer ring-0 bg-rose-400  rounded-full outline-none duration-300 after:duration-500 w-12 h-12  shadow-md peer-checked:bg-emerald-500  peer-focus:outline-none  after:content-['✖️'] after:rounded-full after:absolute after:outline-none after:h-10 after:w-10 after:bg-gray-50 after:top-1 after:left-1 after:flex after:justify-center after:items-center  peer-hover:after:scale-75 peer-checked:after:content-['✔️'] after:-rotate-180 peer-checked:after:rotate-0">
                                    </div>
                                </label>
                            </button>
                        </div>
                    </div>
                )}
                {/* Navigation Arrows */}
                <div className="absolute inset-0 flex items-center justify-between px-6 pointer-events-none">
                    <button
                        onClick={prev}
                        className="text-gray-400 hover:scale-110 transition cursor-pointer pointer-events-auto"
                    >
                        <CaretCircleLeftIcon size={48} weight="fill" />
                    </button>
                    <button
                        onClick={next}
                        className="text-gray-400 hover:scale-110 transition cursor-pointer pointer-events-auto"
                    >
                        <CaretCircleRightIcon size={48} weight="fill" />
                    </button>
                </div>
                
                {/* Pagination Dots */}
                <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex gap-2 cursor-pointer pointer-events-auto">
                    {data.map((_, index) => (
                        <div
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`cursor-pointer transition-all duration-300 rounded-full border border-white ${currentIndex === index ? 'bg-white w-3 h-3' : 'bg-white/30 w-3 h-3'
                                }`}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}

export default Carousel;