import { XIcon, TrashIcon } from '@phosphor-icons/react'
import React, { useEffect } from 'react'

export default function DeleteModal({ isOpen, onClose, onConfirm, anime }) {
    if (!isOpen) return null


    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-md w-full p-6 relative">
                <button onClick={onClose} className="absolute top-5 right-5 text-gray-200 hover:text-gray-400 cursor-pointer">
                    <XIcon size={20} />
                </button>
                <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-100 text-red-600 mb-4">
                        <TrashIcon size={24} />
                    </div>
                    <h2 className="text-xl font-semibold text-white">Deleting {anime?.kitsu_anime_data.title}</h2>
                    <p className="text-gray-500 mt-2">Are you sure you want to remove this anime from your watchlist? This action cannot be undone.</p>
                </div>
                <div className="flex gap-3 mt-6 justify-center">
                    <button onClick={onClose} className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition text-white cursor-pointer">Cancel</button>
                    <button onClick={onConfirm} className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition cursor-pointer">Delete</button>
                </div>
            </div>
        </div>
    )
}
