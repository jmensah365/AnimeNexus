import { useState, useEffect } from 'react'
import { XIcon, PlusCircleIcon, CheckCircleIcon } from '@phosphor-icons/react'
import { getStatusColor } from '../../utils/watchlistHelpers'

export default function AddWatchlistModal({ isOpen, onClose, userAnime, onSubmit, isLoading, isSuccess, resetMutation }) {
    const [selectedAnime, setSelectedAnime] = useState('')
    const [selectedStatus, setSelectedStatus] = useState('')

    useEffect(() => {
        if (isSuccess) {
            const timer = setTimeout(() => handleClose(), 1000)
            return () => clearTimeout(timer)
        }
    }, [isSuccess])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (selectedAnime && selectedStatus) {
            onSubmit({ anime_id: selectedAnime, status: selectedStatus })
            setSelectedAnime('')
            setSelectedStatus('')
        }
    }

    const handleClose = () => {
        setSelectedAnime('')
        setSelectedStatus('')
        resetMutation()
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center z-50 p-4">
            <div className="bg-zinc-900 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-zinc-700 mt-10">
                <div className="flex items-center justify-between p-6 border-b border-zinc-700">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <PlusCircleIcon size={20} />
                        Add to Watchlist
                    </h2>
                    <button onClick={handleClose} className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                        <XIcon size={24} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Select Anime</label>
                        <select
                            value={selectedAnime}
                            onChange={(e) => setSelectedAnime(e.target.value)}
                            className="w-full bg-zinc-800 text-white px-4 py-2 rounded-lg border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-red-500 max-h-32"
                            required
                        >
                            <option value="">Choose an anime...</option>
                            {userAnime.map((anime) => (
                                <option key={anime.id} value={anime.id}>{anime.title}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                        <div className="grid grid-cols-1 gap-2">
                            {[
                                { value: 'watching', label: 'Watching' },
                                { value: 'plan_to_watch', label: 'Plan to Watch' },
                                { value: 'completed', label: 'Completed' },
                                { value: 'on_hold', label: 'On Hold' },
                                { value: 'dropped', label: 'Dropped' }
                            ].map((status) => (
                                <button
                                    key={status.value}
                                    type="button"
                                    onClick={() => setSelectedStatus(status.value)}
                                    className={`cursor-pointer p-3 rounded-lg text-left transition-all ${selectedStatus === status.value
                                        ? `${getStatusColor(status.value)} text-white`
                                        : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'
                                    }`}
                                >
                                    {status.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={!selectedAnime || !selectedStatus || isLoading}
                            className={`flex-1 px-4 py-2 ${isSuccess ? 'bg-green-400' : 'bg-red-600 hover:bg-red-700'} text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer`}
                        >
                            {isSuccess ? (
                                <>
                                    <CheckCircleIcon size={16} className="text-white" />
                                    Added!
                                </>
                            ) : isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Adding...
                                </>
                            ) : (
                                <>
                                    <CheckCircleIcon size={16} />
                                    Add to Watchlist
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
