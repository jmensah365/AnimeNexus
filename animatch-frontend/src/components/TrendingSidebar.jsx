import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

export default function TrendingSidebar({ animeCache }) {
    const navigate = useNavigate();
    const [index, setIndex] = useState(0);

    // Auto-rotate every minute
    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 4) % animeCache.length);
        }, 60000);
        return () => clearInterval(interval);
    }, [animeCache]);

    // Show 3 at a time
    const visibleAnime = animeCache.slice(index, index + 4);

    return (
        <div >
            <h3 className="text-xl font-semibold mb-4">🔥 Trending Anime</h3>
            <ul className="space-y-3">
                {visibleAnime.map((anime, idx) => (
                    <li
                        key={anime.id || idx}
                        className="flex items-center gap-3 bg-gray-800/50 p-3 rounded-xl hover:bg-red-400/10 hover:scale-102 transition cursor-pointer group"
                    >
                        <img
                            src={anime.coverImage?.medium}
                            alt={anime.title?.english || anime.title?.romaji}
                            className="w-12 h-16 object-cover rounded-md "
                        />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate whitespace-nowrap overflow-hidden">
                                {anime.title?.english || anime.title?.romaji}
                            </p>
                            <p className="text-xs text-gray-400">Average Score: {anime.averageScore}</p>
                        </div>
                    </li>

                ))}
            </ul>
            <button
                onClick={() => navigate('/trending')}
                className="mt-4 w-full text-sm font-medium bg-red-600 hover:bg-red-700 transition text-white py-2 rounded-lg cursor-pointer"
            >
                See All
            </button>
        </div>
    );
}
