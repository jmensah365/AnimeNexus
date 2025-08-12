import React, { useState } from 'react';
import { XIcon, EyeIcon, EyeSlashIcon } from '@phosphor-icons/react';
import Sidebar from '../components/Sidebar';
import ErrorCard from '../components/Cards/ErrorCard';
import { useMutation } from '@tanstack/react-query';
import {Alert} from 'flowbite-react'

// API functions
const updateEmail = async (newEmail) => {
    const response = await fetch('http://localhost:3000/auth/updateEmail', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newEmail }),
        credentials: 'include',
    });

    console.log(response);
    if (!response.ok) throw new Error(await response.text());
    return response.json();
};

const updatePassword = async ({ newPassword }) => {
    const response = await fetch('http://localhost:3000/auth/updatePassword', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword }),
        credentials: 'include',
    });

    if (!response.ok) throw new Error(await response.text());
    return response.json();
};

const updatePreferences = async ({ genres, mood, anime_eras, episode_counts }) => {
    const response = await fetch('http://localhost:3000/preference/updatePreference', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ genres, mood, anime_eras, episode_counts }),
        credentials: 'include',
    });

    if (!response.ok) throw new Error(await response.text());
    return response.json();
};

// Data constants
const genresList = [
    'Action', 'Adventure', 'Comedy', 'Sci-Fi', 'Drama', 'Romance', 'Police', 'Space',
    'Mystery', 'Magic', 'Supernatural', 'Fantasy', 'Sports', 'Cars',
    'Racing', 'Horror', 'Psychological', 'Thriller', 'Assassin', 'Ninja', 'Ghost', 'Mecha', 'Historical', 'Past', 'Present',
];

const animeErasMapping = {
    'The Foundations (Pre-1960s)': 'The_Foundations',
    'The Classics (1960s-1980s)': 'The_Classics',
    'The Boom (1990s)': 'The_Boom',
    'The Digital Revolution (2000s-2010s)': 'The_Digital_Revolution',
    'The Streaming Era (2010s-2020s)': 'The_Streaming_Era',
    'The Current Era (2020s-Current)': 'The_Current_Era'
}

const moods = {
    "😊 Happy": "happy",
    "😢 Sad": "sad",
    "😐 Neutral": "neutral",
    "😴 Tired": "tired",
    "🤔 Thoughtful": "thoughtful",
    "🔥 Excited": "excited",
    "😌 Relaxed": "relaxed"
}

const animeEras = [
    'The_Foundations', 'The_Classics', 'The_Boom', 'The_Digital_Revolution',
    'The_Streaming_Era', 'The_Current_Era'
];

const episodeCounts = ['1-13', '13-26', '26-50+', '50+'];

function Settings() {
    // Email state
    const [newEmail, setNewEmail] = useState('');
    const [emailSuccess, setEmailSuccess] = useState('');

    // Password state
    const [newPassword, setNewPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [passwordSuccess, setPasswordSuccess] = useState('');

    // Preferences state
    const [genres, setGenres] = useState([]);
    const [mood, setMood] = useState('');
    const [anime_eras, setAnimeEras] = useState([]);
    const [episode_counts, setEpisodeCounts] = useState([]);
    const [preferencesSuccess, setPreferencesSuccess] = useState('');

    console.log(emailSuccess);

    // Error states
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [preferencesError, setPreferencesError] = useState('');

    // Mutations
    const emailMutation = useMutation({
        mutationFn: updateEmail,
        onSuccess: (response) => {
            setEmailSuccess(response.message);
            setNewEmail('');
            setEmailError('');
        },
        onError: (error) => {
            try {
                const parsedError = JSON.parse(error.message);
                setEmailError(parsedError.message || "Failed to update email.");
            } catch (e) {
                setEmailError("Failed to update email. Please try again.");
            }
            setEmailSuccess('');
        }
    });

    const passwordMutation = useMutation({
        mutationFn: updatePassword,
        onSuccess: (data) => {
            setPasswordSuccess(data.message);
            setNewPassword('');
            setPasswordError('');
        },
        onError: (error) => {
            try {
                const parsedError = JSON.parse(error.message);
                setPasswordError(parsedError.message || "Failed to update password.");
            } catch (e) {
                setPasswordError("Failed to update password. Please try again.");
            }
            setPasswordSuccess('');
        }
    });

    const preferencesMutation = useMutation({
        mutationFn: updatePreferences,
        onSuccess: () => {
            setPreferencesSuccess('Preferences updated successfully!');
            setPreferencesError('');
        },
        onError: (error) => {
            try {
                const parsedError = JSON.parse(error.message);
                setPreferencesError(parsedError.message || "Failed to update preferences.");
            } catch (e) {
                setPreferencesError("Failed to update preferences. Please try again.");
            }
            setPreferencesSuccess('');
        }
    });

    // Handlers
    const handleEmailSubmit = (e) => {
        e.preventDefault();
        if (!newEmail.trim()) {
            setEmailError('Please enter a new email address.');
            return;
        }
        emailMutation.mutate(newEmail);
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();

        if (newPassword.length < 6) {
            setPasswordError('New password must be at least 6 characters long.');
            return;
        }
        passwordMutation.mutate({ newPassword });
    };

    const handlePreferencesSubmit = (e) => {
        e.preventDefault();
        preferencesMutation.mutate({ genres, mood, anime_eras, episode_counts });
    };

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
        <div className="flex bg-black min-h-screen animate-fade-down">
            <Sidebar />

            {/* Main content */}
            <div className="flex flex-col text-white flex-1 p-10">

                {/* Email & Password side-by-side */}
                <div className="flex flex-row gap-10 mb-10">

                    {/* Update Email */}
                    <div className="flex-1 bg-gray-900 rounded-lg p-6 ">
                        <h2 className="text-lg font-semibold mb-4">Update Email</h2>
                        <form onSubmit={handleEmailSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    New Email Address
                                </label>
                                <input
                                    type="email"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-red-500 focus:border-red-500"
                                    placeholder="Enter new email address"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={emailMutation.isPending}
                                className="w-full bg-gradient-to-tr from-red-500 to-red-700 disabled:opacity-50 text-white px-4 py-2 rounded-md font-medium cursor-pointer hover:scale-102 transition duration-500"
                            >
                                {emailMutation.isPending ? "Updating..." : "Update Email"}
                            </button>
                            {emailSuccess && <Alert color='success'>
                                Success! {emailSuccess}
                            </Alert> }
                            {emailError && <Alert color='failure'>
                                {emailError}
                            </Alert> }
                        </form>
                    </div>

                    {/* Update Password */}
                    <div className="flex-1 bg-gray-900 rounded-lg p-6">
                        <h2 className="text-lg font-semibold mb-4">Update Password</h2>
                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-red-500 focus:border-red-500"
                                    placeholder="Enter new password"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={passwordMutation.isPending}
                                className="w-full bg-gradient-to-tr from-red-500 to-red-700 disabled:opacity-50 text-white px-4 py-2 rounded-md font-medium hover:scale-102 transition duration-500 cursor-pointer"
                            >
                                {passwordMutation.isPending ? "Updating..." : "Update Password"}
                            </button>
                            {passwordSuccess && <Alert color='success'>
                                {passwordSuccess}
                            </Alert> }
                            {passwordError && <Alert color='failure'>
                                {passwordError}
                            </Alert> }
                        </form>
                    </div>
                </div>

                {/* Preference section */}
                <div className='bg-gray-900 h-screen p-6 rounded-lg'>
                    <form className="space-y-6" id='form' method='POST' >
                        {/* Genre Selection */}
                        <div>
                            <label className="block text-lg font-medium text-white">Genres</label>
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
                            <label className="block text-lg font-medium text-white">Mood</label>
                            <input
                                type="text"
                                value={mood}
                                onChange={(e) => setMood(e.target.value)}
                                className="mt-2 block w-full rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 text-sm px-3 py-2"
                                placeholder="Describe your mood..."
                            />
                        </div>

                        {/* Anime Era Selection */}
                        <div>
                            <label className="block text-lg font-medium text-white">Anime Era</label>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                {Object.entries(animeErasMapping).map(([label, era]) => (
                                    <label key={era} className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={anime_eras.includes(era)}
                                            onChange={() => handleCheckboxChange(setAnimeEras, era)}
                                            className="text-red-500 focus:ring-red-500 border-gray-300 rounded"
                                        />
                                        <span className="text-sm text-white">{label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Episode Count Selection */}
                        <div>
                            <label className="block text-lg font-medium text-white">Episode Count</label>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                {episodeCounts.map((count) => (
                                    <label key={count} className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={episode_counts.includes(count)}
                                            onChange={() => handleCheckboxChange(setEpisodeCounts, count)}
                                            className="text-red-500 focus:ring-red-500 border-gray-300 rounded"
                                        />
                                        <span className="text-sm text-white">{count}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            id='submitBtn'
                            type="submit"
                            className="w-full py-2 px-4 bg-gradient-to-r from-red-500 to-red-700 text-white text-sm font-medium rounded-md shadow focus:outline-none cursor-pointer hover:scale-102 transition-all duration-500"
                        >
                            Update Preferences
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );

}

export default Settings;