import { CheckSquareOffsetIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import { convertText, getStatusColor } from "../utils/watchlistHelpers";
export default function ReactionsSidebar({ reactionsWithAnimeInfo }) {
    const navigate = useNavigate();
    const watchlist = reactionsWithAnimeInfo?.result || [];

    return (
        <div>
            <h3 className="text-xl font-semibold mb-4">🎭 Reactions</h3>
            {watchlist.length === 0 ? (
                <p className="text-gray-400 text-sm italic">You haven't reacted to any anime yet... time to react ✨</p>
            ) : (
                <ul className="space-y-3">
                    {watchlist.slice(0, 4).map((item, idx) => (
                        <li
                            key={item.id || idx}
                            className={`flex items-center gap-3 bg-gray-800/50 p-3 rounded-xl transition cursor-pointer hover:scale-102`}
                        >
                            <img
                                src={item.kitsu_anime_data?.image_url}
                                alt={item.kitsu_anime_data?.title}
                                className="w-12 h-16 object-cover rounded-md"
                            />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate whitespace-nowrap overflow-hidden text-white">{item.kitsu_anime_data?.title}</p>
                                <p className='text-xs text-gray-400'>{convertText(item?.reaction)}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            <button
                onClick={() => navigate('/reactions')}
                className="mt-4 w-full text-sm font-medium bg-red-600 hover:bg-red-700 transition text-white py-2 rounded-lg cursor-pointer hover:scale-102 duration-300"
            >
                See All
            </button>
        </div>
    );
}
