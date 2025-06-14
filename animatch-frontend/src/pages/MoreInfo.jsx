import React, { useState } from 'react';
import { CheckIcon, XIcon, PlusCircleIcon } from '@phosphor-icons/react';
import AniMatchLogo from '/AniMatchLogo.png'
const genresList = [
    'Action', 'Adventure', 'Comedy', 'Sci-Fi', 'Drama', 'Romance', 'Police', 'Space',
    'Mystery', 'Magic', 'Supernatural', 'Fantasy', 'Sports', 'Cars', 'Slice of Life',
    'Racing', 'Horror', 'Psychological', 'Thriller'
];

const animeEras = [
    'The Foundations', 'The Classics', 'The Boom', 'The Digital Revolution',
    'The Streaming Era', 'The Current Era'
];

const episodeCounts = ['1-13', '13-26', '26-50+', '50+'];

export default function AnimePreferencesForm() {
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [mood, setMood] = useState('');
    const [selectedEras, setSelectedEras] = useState([]);
    const [selectedEpisodes, setSelectedEpisodes] = useState([]);

    const handleAddGenre = (genre) => {
        if (!selectedGenres.includes(genre)) {
            setSelectedGenres([...selectedGenres, genre]);
        }
    };

    const handleRemoveGenre = (genre) => {
        setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    };

    const handleCheckboxChange = (setter, value) => {
        setter((prev) =>
            prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
        );
    };

    return (
        <div className="min-h-screen bg-[url(/the-climber-1.jpg)] bg-contain bg-center flex items-center justify-center py-10 animate-fade-up">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl w-full">
                <div className='flex flex-row items-center justify-center'>
                    {/* <img src={AniMatchLogo}  className='h-12 w-12' alt='AniMatch Logo'/> */}
                    <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Anime Preferences</h1>
                </div>

                <form className="space-y-6">
                    {/* Genre Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Genres</label>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {selectedGenres.map((genre) => (
                                <span
                                    key={genre}
                                    className="flex items-center bg-purple-500 text-white text-sm rounded-full px-3 py-1"
                                >
                                    {genre}
                                    <XIcon
                                        className="ml-2 h-4 w-4 cursor-pointer"
                                        onClick={() => handleRemoveGenre(genre)}
                                    />
                                </span>
                            ))}
                        </div>
                        <div className="relative mt-2">
                            <select
                                className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 text-sm"
                                onChange={(e) => {
                                    handleAddGenre(e.target.value);
                                    e.target.value = '';
                                }}
                            >
                                <option value="">Select a genre</option>
                                {genresList.map((genre) => (
                                    <option key={genre} value={genre}>
                                        {genre}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Mood Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Mood</label>
                        <input
                            type="text"
                            value={mood}
                            onChange={(e) => setMood(e.target.value)}
                            className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 text-sm px-3 py-2"
                            placeholder="Describe your mood..."
                        />
                    </div>

                    {/* Anime Era Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Anime Era</label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            {animeEras.map((era) => (
                                <label key={era} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={selectedEras.includes(era)}
                                        onChange={() => handleCheckboxChange(setSelectedEras, era)}
                                        className="text-purple-500 focus:ring-purple-500 border-gray-300 rounded"
                                    />
                                    <span className="text-sm text-gray-700">{era}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Episode Count Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Episode Count</label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            {episodeCounts.map((count) => (
                                <label key={count} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={selectedEpisodes.includes(count)}
                                        onChange={() => handleCheckboxChange(setSelectedEpisodes, count)}
                                        className="text-purple-500 focus:ring-purple-500 border-gray-300 rounded"
                                    />
                                    <span className="text-sm text-gray-700">{count}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-purple-600 text-white text-sm font-medium rounded-md shadow hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                        Submit Preferences
                    </button>
                </form>
            </div>
        </div>
    );
}