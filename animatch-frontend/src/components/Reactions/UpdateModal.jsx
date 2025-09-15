import { PencilIcon, XIcon, CheckCircleIcon } from '@phosphor-icons/react';
import React, { useState, useEffect } from 'react'

function UpdateModal({ isOpen, onClose, onSubmit, anime, isLoading, isSuccess, resetMutation }) {
    const [selectedReaction, setSelectedReaction] = useState('');

    useEffect(() => {
        if (isSuccess) {
            const timer = setTimeout(() => handleClose(), 1000)
            return () => clearTimeout(timer)
        }
    }, [isSuccess]);

    const handleSubmit = (e) => {
        e.preventDefault()
        if (selectedReaction) {
            onSubmit(selectedReaction)
            setSelectedReaction('')
        }
    }

    const handleClose = () => {
        setSelectedReaction('')
        resetMutation()
        onClose()
    }

    const getReactionColor = (reaction) => {
        switch (reaction) {
            case 'liked': return 'bg-green-400'
            case 'disliked': return 'bg-red-400'
            case 'not_interested': return 'bg-gray-400'
            default: return reaction
        }
    }

    if (!isOpen) return null

    return (
        <div className='fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
            <div className="bg-zinc-900 rounded-xl max-w-md w-full max-h-[65vh] overflow-y-auto border border-zinc-700 mt-10">
                <div className="flex items-center justify-between p-6 border-b border-zinc-700">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <PencilIcon size={20} />
                        Update {anime?.kitsu_anime_data.title}
                    </h2>
                    <button onClick={handleClose} className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                        <XIcon size={24} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Reaction</label>
                        <div className="grid grid-cols-1 gap-2">
                            {[
                                { value: 'liked', label: 'Liked' },
                                { value: 'disliked', label: 'Disliked' },
                                { value: 'not_interested', label: 'Not Interested' },
                            ].map((reaction) => (
                                <button
                                    key={reaction.value}
                                    type="button"
                                    onClick={() => setSelectedReaction(reaction.value)}
                                    className={`cursor-pointer p-3 rounded-lg text-left transition-all ${selectedReaction === reaction.value
                                        ? `${getReactionColor(reaction.value)} text-white`
                                        : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'
                                        }`}
                                >
                                    {reaction.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={!selectedReaction || isLoading}
                            className={`flex-1 px-4 py-2 ${isSuccess ? 'bg-green-400' : 'bg-red-600 hover:bg-red-700'} text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer`}
                        >
                            {isSuccess ? (
                                <>
                                    <CheckCircleIcon size={16} className="text-white" />
                                    Updated!
                                </>
                            ) : isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <CheckCircleIcon size={16} />
                                    Update Reaction
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UpdateModal