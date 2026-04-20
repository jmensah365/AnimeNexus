import React, { useState } from 'react';
import { XIcon } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import { Alert } from 'flowbite-react';
import { useAuth } from '../utils/Auth';
import { useInsertPreferences, useUpdateFormCompletionStatus } from '../hooks/usePreference';



const genresList = [
    'Action', 'Adventure', 'Comedy', 'Sci-Fi', 'Drama', 'Romance', 'Police', 'Space',
    'Mystery', 'Magic', 'Supernatural', 'Fantasy', 'Sports', 'Cars',
    'Racing', 'Horror', 'Psychological', 'Thriller', 'Assassin', 'Ninja', 'Ghost', 'Mecha', 'Space', 'Historical', 'Past', 'Present',
];

const animeErasMapping = {
    'The Foundations (Pre-1960s)': 'The_Foundations',
    'The Classics (1960s-1980s)': 'The_Classics',
    'The Boom (1990s)': 'The_Boom',
    'The Digital Revolution (2000s-2010s)': 'The_Digital_Revolution',
    'The Streaming Era (2010s-2020s)': 'The_Streaming_Era',
    'The Current Era (2020s-Current)': 'The_Current_Era'
}

const moodMappings = {
    "😊 Happy": "happy",
    "😢 Sad": "sad",
    "😐 Neutral": "neutral",
    "😴 Tired": "tired",
    "🤔 Thoughtful": "thoughtful",
    "🔥 Excited": "excited",
    "😌 Relaxed": "relaxed",
    "😡 Mad": "mad"
}

const episodeCounts = ['1-13', '13-26', '26-50+', '50+'];

export default function AnimePreferencesForm() {
    //Auth session
    const { session } = useAuth();
    const token = session?.access_token;

    const [genres, setGenres] = useState([]);
    const [mood, setMood] = useState('');
    const [moods, setMoods] = useState([]);
    const [anime_era, setAnimeEras] = useState([]);
    const [episode_count, setEpisodeCounts] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    const updateFormCompletionStatus = useUpdateFormCompletionStatus(token);
    const insertPreferencesMutation = useInsertPreferences(updateFormCompletionStatus, token, navigate, setErrorMessage);

    const handleSubmit = (e) => {
        e.preventDefault();
        insertPreferencesMutation.mutate({ genres, mood, moods, anime_era, episode_count })
    }

    const handleAddGenre = (genre) => {
        if (!genres.includes(genre)) {
            setGenres([...genres, genre]);
        }
    };

    const handleRemoveGenre = (genre) => {
        setGenres(genres.filter((g) => g !== genre));
    };

    const handleCheckboxChange = (setter, value) => {
        setter((prev) =>
            prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
        );
    };

    return (
        <div className="min-h-screen bg-[url('/the-climber-1.jpg')] bg-cover bg-center flex items-center justify-center py-6 sm:py-10 px-4">
            <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-8 w-full max-w-md sm:max-w-3xl animate-fade-up">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">
                    Anime Preferences
                </h1>

                <form className="space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
                    {/* Genre Selection */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Genres</label>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {genres.map((genre) => (
                                <span
                                    key={genre}
                                    className="flex items-center rounded-full px-3 py-1 bg-red-500 text-white text-xs sm:text-sm"
                                >
                                    {genre}
                                    <XIcon
                                        className="ml-2 h-4 w-4 cursor-pointer"
                                        onClick={() => handleRemoveGenre(genre)}
                                    />
                                </span>
                            ))}
                        </div>
                        <div className="relative mt-3">
                            <select
                                className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 text-sm sm:text-base py-2 px-3"
                                onChange={(e) => {
                                    handleAddGenre(e.target.value);
                                    e.target.value = '';
                                }}
                            >
                                <option value="">Select genre(s)</option>
                                {genresList.map((genre) => (
                                    <option key={genre} value={genre}>
                                        {genre}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Mood Selection */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Mood</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                            {Object.entries(moodMappings).map(([label, mood]) => (
                                <label key={mood} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={moods.includes(mood)}
                                        onChange={() => handleCheckboxChange(setMoods, mood)}
                                        className="text-red-500 focus:ring-red-500 border-gray-300 rounded"
                                    />
                                    <span className="text-sm text-gray-700">{label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Mood Text Input */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Describe your mood (optional)</label>
                        <input
                            type="text"
                            value={mood}
                            onChange={(e) => setMood(e.target.value)}
                            className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 text-sm sm:text-base px-3 py-2"
                            placeholder="Feeling chill? Hype? Thoughtful?"
                        />
                    </div>

                    {/* Anime Era Selection */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Anime Era</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                            {Object.entries(animeErasMapping).map(([label, era]) => (
                                <label key={era} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={anime_era.includes(era)}
                                        onChange={() => handleCheckboxChange(setAnimeEras, era)}
                                        className="text-red-500 focus:ring-red-500 border-gray-300 rounded"
                                    />
                                    <span className="text-sm text-gray-700">{label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Episode Count */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Episode Count</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                            {episodeCounts.map((count) => (
                                <label key={count} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={episode_count.includes(count)}
                                        onChange={() => handleCheckboxChange(setEpisodeCounts, count)}
                                        className="text-red-500 focus:ring-red-500 border-gray-300 rounded"
                                    />
                                    <span className="text-sm text-gray-700">{count}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-2.5 sm:py-3 px-4 bg-gradient-to-br from-red-500 to-red-700 hover:scale-[1.02] transition-all duration-300 text-white text-sm sm:text-base font-semibold rounded-md shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                        {insertPreferencesMutation.isPending ? 'Submitting Preferences...' : 'Submit Preferences'}
                    </button>
                </form>

                {insertPreferencesMutation.isError && (
                    <Alert color="failure" className="mt-4 text-sm">
                        {errorMessage}
                    </Alert>
                )}
            </div>
        </div>
    );
}