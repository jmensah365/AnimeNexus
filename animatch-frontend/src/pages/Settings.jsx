import React, { useState } from 'react';
import { XIcon, EyeIcon, EyeSlashIcon, ListIcon } from '@phosphor-icons/react';
import Sidebar from '../components/Sidebar';
import { useMutation } from '@tanstack/react-query';
import { Alert } from 'flowbite-react'
import supabase from '../utils/supabaseClient';
import { useAuth } from '../utils/Auth'
import { useFetchPreferences } from '../hooks/usePreference';
import { useGenAndInsertAnime } from '../hooks/useAnime';
import { useGenAndInsetAIRecs } from '../hooks/useAI';
import { useNavigate } from 'react-router-dom';

// API functions
const updateEmail = async (newEmail) => {
    const { response, error } = await supabase.auth.updateUser({
        email: newEmail
    });

    if (error) throw error;
    return response;
};

const updatePassword = async (newPassword) => {
    const { response, error } = await supabase.auth.updateUser({
        password: newPassword
    });

    if (error) throw error;
    return response;
};


const updatePreferences = async ({ genres, mood, moods, anime_eras, episode_counts, preferenceId }, token) => {
    if (mood !== '') moods.push(mood);
    const response = await fetch(`${import.meta.env.VITE_PROD_URL}/preferences/${preferenceId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ genres, moods, anime_eras, episode_counts }),
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

function Settings() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    //Auth session
    const { session } = useAuth();
    const token = session?.access_token;
    // Email state
    const [newEmail, setNewEmail] = useState('');
    const [emailSuccess, setEmailSuccess] = useState('');

    // Password state
    const [newPassword, setNewPassword] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const passwordLength = newPassword.length >= 8;
    const hasUppercase = /[A-Z]/.test(newPassword);
    const hasLowercase = /[a-z]/.test(newPassword);
    const hasDigitAndSymbol = /^(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>~`_\-+=\[\]\\\/])/.test(newPassword);

    // Preferences state
    const [genres, setGenres] = useState([]);
    const [mood, setMood] = useState('');
    const [anime_eras, setAnimeEras] = useState([]);
    const [episode_counts, setEpisodeCounts] = useState([]);
    const [preferencesSuccess, setPreferencesSuccess] = useState('');
    const [moods, setMoods] = useState([]);
    const [insertAISuccess, setInsertAISuccess] = useState('');
    const [insertAnimeSuccess, setInsertAnimeSuccess] = useState('');


    // Error states
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [preferencesError, setPreferencesError] = useState('');
    const [insertAIError, setInsertAIError] = useState('');
    const [insertAnimeError, setInsertAnimeError] = useState('');


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
                setEmailError(error.message);
            } catch (e) {
                setEmailError("Failed to update email. Please try again.");
            }
            setEmailSuccess('');
        }
    });

    const passwordMutation = useMutation({
        mutationFn: updatePassword,
        onSuccess: () => {
            setPasswordSuccess('Updated password successfully!');
            setNewPassword('');
            setPasswordError('');
        },
        onError: (error) => {
            try {
                setPasswordError(error.message);
            } catch (e) {
                setPasswordError("Failed to update password. Please try again.");
            }
            setPasswordSuccess('');
        }
    });

    const genAndInsertAnime = useGenAndInsertAnime(token);
    const genAndInsertAIRecs = useGenAndInsetAIRecs(token, navigate);


    const preferencesMutation = useMutation({
        mutationFn: (preferenceData) => updatePreferences(preferenceData, token),
        onSuccess: () => {
            setPreferencesSuccess('Preferences updated successfully!');
            setPreferencesError('');
            setGenres([]);
            setMood('');
            setMoods([]);
            setAnimeEras([]);
            setEpisodeCounts([]);
            genAndInsertAnime.mutate(token);
            genAndInsertAIRecs.mutate(token);
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

    //Queries
    const preferences = useFetchPreferences(token);
    const preferenceId = preferences.data?.preference?.[0].id;



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

        if (!passwordLength || !hasUppercase || !hasLowercase || !hasDigitAndSymbol) {
            setPasswordError('New password must be at least 8 characters long, have at least 1 uppercase and lowercase letter, and a symbol.');
            return;
        }

        passwordMutation.mutate(newPassword)
    };

    const handlePreferencesSubmit = (e) => {
        e.preventDefault();
        preferencesMutation.mutate({ genres, moods, mood, anime_eras, episode_counts, preferenceId });
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
        <div className="flex flex-col lg:flex-row bg-black min-h-screen text-white">
            <div
                className={`fixed inset-y-0 left-0 z-50 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } transition-transform duration-300 bg-black border-r border-gray-800 w-64 p-4 lg:hidden`}
            >
                <Sidebar />
                <button
                    onClick={() => setSidebarOpen(false)}
                    className="absolute top-4 right-4 text-white text-2xl focus:outline-none"
                >
                    ✕
                </button>
            </div>
            {/* Sidebar */}
            <div className="hidden lg:block">
                <Sidebar />
            </div>



            {/* Main content */}
            <div className="flex-1 flex flex-col p-4 sm:p-6 md:p-8 lg:p-10 overflow-y-auto">
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                    <ListIcon size={24} color="white" />
                </button>
                {/* Email & Password Section */}
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 mb-10">
                    {/* Update Email */}
                    <div className="flex-1 bg-gray-900 rounded-lg p-4 sm:p-6">
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
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-red-500 focus:border-red-500 text-sm"
                                    placeholder="Enter new email address"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={emailMutation.isPending}
                                className="w-full bg-gradient-to-tr from-red-500 to-red-700 disabled:opacity-50 text-white px-4 py-2 rounded-md font-medium hover:scale-105 transition-transform duration-300"
                            >
                                {emailMutation.isPending ? "Updating..." : "Update Email"}
                            </button>
                            {emailSuccess && <Alert color="success">Success! {emailSuccess}</Alert>}
                            {emailError && <Alert color="failure">{emailError}</Alert>}
                        </form>
                    </div>

                    {/* Update Password */}
                    <div className="flex-1 bg-gray-900 rounded-lg p-4 sm:p-6">
                        <h2 className="text-lg font-semibold mb-4">Update Password</h2>
                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    New Password
                                </label>
                                <input
                                    type={isVisible ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-red-500 focus:border-red-500 text-sm"
                                    placeholder="Enter new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setIsVisible(!isVisible)}
                                    className="absolute right-4 top-9 hover:text-red-400 transition-colors"
                                >
                                    {isVisible ? <EyeSlashIcon /> : <EyeIcon />}
                                </button>
                            </div>
                            <button
                                type="submit"
                                disabled={passwordMutation.isPending}
                                className="w-full bg-gradient-to-tr from-red-500 to-red-700 disabled:opacity-50 text-white px-4 py-2 rounded-md font-medium hover:scale-105 transition-transform duration-300"
                            >
                                {passwordMutation.isPending ? "Updating..." : "Update Password"}
                            </button>
                            {passwordSuccess && <Alert color="success">{passwordSuccess}</Alert>}
                            {passwordError && <Alert color="failure">{passwordError}</Alert>}
                        </form>
                    </div>
                </div>

                {/* Preferences Section */}
                <div className="bg-gray-900 rounded-lg p-4 sm:p-6 overflow-y-auto max-h-[85vh]">
                    <form
                        className="space-y-6"
                        id="form"
                        method="POST"
                        onSubmit={handlePreferencesSubmit}
                    >
                        {/* Genre */}
                        <div>
                            <label className="block text-lg font-medium text-white">
                                Genres<span className="text-red-500">*</span>
                            </label>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {genres.map((genre) => (
                                    <span
                                        key={genre}
                                        className="flex items-center rounded-full px-3 py-1 bg-red-500 text-sm"
                                    >
                                        {genre}
                                        <XIcon
                                            className="ml-2 h-4 w-4 cursor-pointer"
                                            onClick={() => handleRemoveGenre(genre)}
                                        />
                                    </span>
                                ))}
                            </div>
                            <select
                                className="block w-full mt-2 border border-gray-700 rounded-md bg-gray-800 text-white text-sm focus:ring-red-500 focus:border-red-500"
                                onChange={(e) => {
                                    handleAddGenre(e.target.value);
                                    e.target.value = "";
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

                        {/* Mood */}
                        <div>
                            <label className="block text-lg font-medium text-white">
                                Mood<span className="text-red-500">*</span>
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                                {Object.entries(moodMappings).map(([label, mood]) => (
                                    <label key={mood} className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={moods.includes(mood)}
                                            onChange={() => handleCheckboxChange(setMoods, mood)}
                                            className="text-red-500 focus:ring-red-500 border-gray-700 rounded"
                                        />
                                        <span className="text-sm">{label}</span>
                                    </label>
                                ))}
                            </div>
                            <input
                                type="text"
                                value={mood}
                                onChange={(e) => setMood(e.target.value)}
                                className="mt-3 w-full rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 text-sm px-3 py-2 bg-gray-800 border border-gray-700 text-white"
                                placeholder="Describe your mood... (optional)"
                            />
                        </div>

                        {/* Anime Era & Episode Count */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-lg font-medium text-white">
                                    Anime Era<span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                                    {Object.entries(animeErasMapping).map(([label, era]) => (
                                        <label key={era} className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                checked={anime_eras.includes(era)}
                                                onChange={() => handleCheckboxChange(setAnimeEras, era)}
                                                className="text-red-500 focus:ring-red-500 border-gray-700 rounded"
                                            />
                                            <span className="text-sm">{label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-lg font-medium text-white">
                                    Episode Count<span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    {episodeCounts.map((count) => (
                                        <label key={count} className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                checked={episode_counts.includes(count)}
                                                onChange={() => handleCheckboxChange(setEpisodeCounts, count)}
                                                className="text-red-500 focus:ring-red-500 border-gray-700 rounded"
                                            />
                                            <span className="text-sm">{count}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <button
                            id="submitBtn"
                            type="submit"
                            className="w-full py-2 px-4 bg-gradient-to-r from-red-500 to-red-700 text-white text-sm font-medium rounded-md shadow focus:outline-none cursor-pointer hover:scale-105 transition-transform duration-300"
                        >
                            {preferencesMutation.isPending
                                ? "Updating Preferences..."
                                : "Update Preferences"}
                        </button>
                    </form>

                    {preferencesSuccess && (
                        <Alert color="success" onDismiss={() => setPreferencesSuccess("")}>
                            {preferencesSuccess}
                        </Alert>
                    )}
                    {preferencesError && (
                        <Alert color="failure" onDismiss={() => setPreferencesError("")}>
                            {preferencesError}
                        </Alert>
                    )}
                </div>
            </div>
        </div>
    );


}

export default Settings;