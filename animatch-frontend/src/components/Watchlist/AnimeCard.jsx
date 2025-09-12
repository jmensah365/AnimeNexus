import { TrashIcon, PencilIcon } from '@phosphor-icons/react'
import { Tooltip } from 'flowbite-react'
import { getStatusColor, convertText } from '../../utils/watchlistHelpers'

export default function AnimeCard({ watchlist, onClick, setDeleteTarget, setUpdateTarget }) {
    return (
        <div
            key={watchlist.id}
            onClick={() => onClick(watchlist)}
            className="relative p-2 group cursor-pointer transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl hover:shadow-red-600/70 focus:outline-none focus:ring-2 focus:ring-red-500"
            tabIndex={0}
            role="button"
            aria-label={`View details for ${watchlist.kitsu_anime_data.title}`}
        >
            <div className="overflow-hidden mb-3">
                <img
                    src={watchlist.kitsu_anime_data.image_url}
                    alt={watchlist.kitsu_anime_data.title}
                    className="aspect-auto w-full h-96 rounded-sm object-cover transition-all duration-300 cursor-pointer"
                    loading="lazy"
                />
                <div className={`absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(watchlist.status)} `}>
                    {convertText(watchlist.status)}
                </div>
            </div>
            <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-90 transition-opacity duration-300 flex flex-col p-6">
                <h2 className="text-red-400 font-medium text-2xl leading-tight">{watchlist.kitsu_anime_data.title}</h2>
                <div className='absolute bottom-8 left-4 hover:scale-105 transition-all duration-300'>
                    <Tooltip content='Update' style='light' placement='right'>
                        <PencilIcon size={24} color='red' onClick={(e) => {e.stopPropagation(); setUpdateTarget(watchlist)}} />
                    </Tooltip>
                </div>
                <div className='absolute bottom-8 right-4 hover:scale-105 transition-all duration-300'>
                    <Tooltip content='Delete' style='light' placement='left'>
                        <TrashIcon size={24} color='red' onClick={(e) => { e.stopPropagation(); setDeleteTarget(watchlist) }} />
                    </Tooltip>
                </div>
            </div>
        </div>
    )
}
