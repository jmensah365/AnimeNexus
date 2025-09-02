import AnimeCard from './AnimeCard'
import { CaretUpIcon, CaretDownIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { convertStatus } from '../../utils/watchlistHelpers'

export default function StatusSection({ title, items, onClick, setDeleteTarget, setUpdateTarget }) {
    const [isOpen, setIsOpen] = useState(true)
    if (!items || items.length === 0) return null

    return (
        <div className="mb-6">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full text-left px-4 py-3 bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
            >
                <h2 className="text-xl sm:text-2xl font-semibold text-red-400">{convertStatus(title)} ({items.length})</h2>
                {isOpen ? <CaretUpIcon size={20} className="text-red-400" /> : <CaretDownIcon size={20} className="text-red-400" />}
            </button>

            {isOpen && (
                <div className="mt-4 grid grid-cols-1 sm:gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {items.map((watchlist) => (
                        <AnimeCard key={watchlist.id} watchlist={watchlist} onClick={onClick} setDeleteTarget={setDeleteTarget} setUpdateTarget={setUpdateTarget} />
                    ))}
                </div>
            )}
        </div>
    )
}
