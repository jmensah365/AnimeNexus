import React, { useState } from 'react';
import { CheckIcon, XIcon, PlusCircleIcon } from '@phosphor-icons/react';
import AniMatchLogo from '/AniMatchLogo.png'
import ShinyText from '../styles/ShinyText';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import ErrorCard from '../components/Cards/ErrorCard';
import { Alert } from 'flowbite-react';

const insertPreferences = async ({ genres, mood, anime_era, episode_count }) => {
    const response = await fetch('http://localhost:3000/preferences/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ genres, mood, anime_era, episode_count }),
        credentials: 'include',
    });


    if (!response.ok) throw new Error(await response.text());

    return response.json();

}

const updatePreferenceFormCompletion = async () => {
    const response = await fetch('http://localhost:3000/preferences/', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    });

    if (!response.ok) throw new Error(await response.text());
    return response.json();

}


const useInsertPreferences = () => {
    return useMutation({ mutationFn: insertPreferences });
}



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

const animeEras = [
    'The_Foundations', 'The_Classics', 'The_Boom', 'The_Digital_Revolution',
    'The_Streaming_Era', 'The_Current_Era'
];

const episodeCounts = ['1-13', '13-26', '26-50+', '50+'];

export default function AnimePreferencesForm() {
    const [genres, setGenres] = useState([]);
    const [mood, setMood] = useState('');
    const [anime_era, setAnimeEras] = useState([]);
    const [episode_count, setEpisodeCounts] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    console.log(anime_era);

    const { mutate: insertPreferenceMutate, isError, isPending } = useInsertPreferences();
    const updatePreferenceFormCompletionMutate = useMutation({
        mutationFn: updatePreferenceFormCompletion,
        onSuccess: (data) => {
            console.log("Preference form completed");
        },
        onError: (error) => {
            console.error("Failed to update preference form completion status: ", error);
            setErrorMessage("Failed to update preference form completion status.");
        }
    });

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        insertPreferenceMutate({ genres, mood, anime_era, episode_count },
            {
                onSuccess: async (data) => {
                    updatePreferenceFormCompletionMutate.mutate();
                    navigate('/welcome');
                },

                onError: (error) => {
                    try {
                        const parsedError = JSON.parse(error.message);
                        setErrorMessage(parsedError.message || "An error occurred during sign in.");
                    } catch (e) {
                        setErrorMessage("An error occurred during submitting preferences. Please try again.");
                        console.error(e);
                    }
                }
            })
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
        <div className="min-h-screen bg-[url(/the-climber-1.jpg)] bg-contain bg-center flex items-center justify-center py-10 animate-fade-up">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl w-full">
                <div className='flex flex-row items-center justify-center'>
                    {/* <img src={AniMatchLogo}  className='h-12 w-12' alt='AniMatch Logo'/> */}
                    <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Anime Preferences</h1>
                </div>

                <form className="space-y-6" id='form' method='POST' onSubmit={handleSubmit}>
                    {/* Genre Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Genres</label>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {genres.map((genre) => (
                                <span
                                    key={genre}
                                    className="flex items-center rounded-full px-3 py-1 bg-red-500"
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
                                className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 text-sm"
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
                            className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 text-sm px-3 py-2"
                            placeholder="Describe your mood..."
                        />
                    </div>

                    {/* Anime Era Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Anime Era</label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
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

                    {/* Episode Count Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Episode Count</label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
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
                        id='submitBtn'
                        type="submit"
                        className="w-full py-2 px-4 bg-gradient-to-br from-red-500 to-red-700 cursor-pointer hover:scale-102 transtion-all duration-500 text-white text-sm font-medium rounded-md shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                        {isPending ? 'Submitting Preferences...' : 'Submit Preferences'}
                    </button>
                </form>
                {isError &&
                    <Alert color='failure'>
                        {errorMessage}
                    </Alert>}
            </div>
        </div>
    );
}