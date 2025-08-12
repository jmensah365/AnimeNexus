import React, {useState, useEffect} from 'react'
import { HouseIcon, SparkleIcon, UserCircleGearIcon, TrendUpIcon, ClockIcon, CheckSquareOffsetIcon, SignOutIcon, CaretLeftIcon, CaretRightIcon, PlusCircleIcon, XIcon, CalendarIcon, PlayIcon, TelevisionIcon, UserIcon, StarFourIcon } from '@phosphor-icons/react'
import {motion, AnimatePresence} from 'framer-motion'

const AnimeModal = ({ modalData, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (modalData) {
            setTimeout(() => setIsVisible(true), 10)
        }
    }, [modalData]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    }

    const handleBackgroundClick = (event) => {
        if (event.target === event.currentTarget) {
            handleClose();
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

    const formatDate = (dateString) => {
        if (!dateString) return 'Ongoing';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    if (!modalData) return null;

    return (
        <AnimatePresence>
            {modalData && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/80 backdrop-blur-sm"
                    onClick={handleBackgroundClick}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl max-w-4xl max-h-[90vh] overflow-hidden w-full relative border border-gray-700"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-50 text-gray-400 hover:text-white transition-colors bg-black/20 hover:bg-black/40 rounded-full p-2 backdrop-blur-sm cursor-pointer"
                            aria-label="Close modal"
                        >
                            <XIcon size={20} weight="bold" />
                        </button>

                        <div className="overflow-y-auto max-h-[90vh]">
                            {/* Header with Background Gradient */}
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent z-10" />
                                <div className="p-5 relative z-20">
                                    <motion.h1
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="text-4xl md:text-5xl font-bold text-white mb-2 text-center leading-tight"
                                    >
                                        {modalData.title}
                                    </motion.h1>
                                </div>
                            </div>

                            {/* Main Content */}
                            <div className="px-8 pb-8">
                                <div className="flex flex-col  gap-8">
                                    {/* Image Section */}
                                    <motion.div
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                        className="flex-shrink-0 flex items-center justify-center mt-5"
                                    >
                                        <div className="relative group">
                                            <img
                                                src={modalData.image_url}
                                                alt={modalData.title}
                                                className="w-64 h-80 object-cover rounded-xl shadow-2xl mx-auto lg:mx-0 transition-transform group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl" />
                                        </div>
                                    </motion.div>

                                    {/* Info Section */}
                                    <motion.div
                                        initial={{ x: 20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                        className="flex-1 space-y-6"
                                    >
                                        {/* Stats Grid */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <StarFourIcon className="w-4 h-4 text-yellow-400" weight="fill" />
                                                    <span className="text-gray-400 text-sm">Age Rating</span>
                                                </div>
                                                <span className="text-white font-semibold">
                                                    {modalData.age_rating || 'N/A'}
                                                </span>
                                            </div>

                                            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <TelevisionIcon className="w-4 h-4 text-blue-400" weight="bold" />
                                                    <span className="text-gray-400 text-sm">Episodes</span>
                                                </div>
                                                <span className="text-white font-semibold">
                                                    {modalData.episode_count || 'N/A'}
                                                </span>
                                            </div>

                                            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <UserIcon className="w-4 h-4 text-purple-400" weight="bold" />
                                                    <span className="text-gray-400 text-sm">Type</span>
                                                </div>
                                                <span className="text-white font-semibold">
                                                    {/* {modalData.show_type.charAt(0).toUpperCase() + modalData.show_type.slice(1) || 'N/A'} */}
                                                </span>
                                            </div>

                                            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <div className={`w-2 h-2 rounded-full bg-${getStatusColor(modalData.status)}`} />
                                                    <span className="text-gray-400 text-sm">Status</span>
                                                </div>
                                                <span className={`font-semibold text-${getStatusColor(modalData.status)}`}>
                                                    {modalData.status.charAt(0).toUpperCase() + modalData.status.slice(1)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/30">
                                            <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                                                <div className="w-1 h-6 bg-blue-500 rounded-full" />
                                                Synopsis
                                            </h3>
                                            <p className="text-gray-300 leading-relaxed">
                                                {modalData.synopsis || 'No synopsis available for this anime.'}
                                            </p>
                                        </div>

                                        {/* Dates */}
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <div className="flex-1 bg-gray-800/30 rounded-lg p-4 border border-gray-700/30">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <CalendarIcon className="w-4 h-4 text-green-400" weight="bold" />
                                                    <span className="text-gray-400 text-sm">Start Date</span>
                                                </div>
                                                <span className="text-white font-medium">
                                                    {formatDate(modalData.start_date)}
                                                </span>
                                            </div>

                                            <div className="flex-1 bg-gray-800/30 rounded-lg p-4 border border-gray-700/30">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <CalendarIcon className="w-4 h-4 text-red-400" weight="bold" />
                                                    <span className="text-gray-400 text-sm">End Date</span>
                                                </div>
                                                <span className="text-white font-medium">
                                                    {formatDate(modalData.end_date)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Trailer Button */}
                                        {modalData.youtube_id && (
                                            <motion.a
                                                href={`https://www.youtube.com/watch?v=${modalData.youtube_id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center justify-center gap-3 w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-red-500/25 group"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <PlayIcon className="w-5 h-5 group-hover:scale-110 transition-transform" weight="fill" />
                                                Watch Trailer
                                            </motion.a>
                                        )}
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
};

export default AnimeModal