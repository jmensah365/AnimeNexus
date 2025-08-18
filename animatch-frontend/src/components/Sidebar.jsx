import React, { useEffect, useState } from 'react'
import { HouseIcon, SparkleIcon, UserCircleGearIcon, TrendUpIcon, ClockIcon, CheckSquareOffsetIcon, SignOutIcon, CaretLeftIcon, CaretRightIcon, PlusCircleIcon, MagnifyingGlassIcon } from '@phosphor-icons/react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

const signOut = async () => {
    const response = await fetch('http://localhost:3000/auth/sign-out', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    })
    if (!response.ok) throw new Error(await response.text());
    return response.json();
}


const useSignOut = () => {
    return useMutation({ mutationFn: signOut })
}
function Sidebar() {
    const navigate = useNavigate();
    const { mutate: signOutMutation, isPending, isSuccess: signOutSuccess, isError: signOutError } = useSignOut();

    const handleSignOut = () => {
        signOutMutation(undefined, {
            onSuccess: () => {
                console.log("Successfully signed out");
                navigate('/');
            },
            onError: (error) => {
                setErrorMessage(error);
                console.error("Failed to sign out: ", error);
            }
        });
    }

    useEffect(() => {
        if (signOutSuccess) {
            console.log("Successfully signed out");
            navigate('/');
        }
        if (isPending) {
            console.log("Signing out...");
        }
        if (signOutError) {
            setErrorMessage(signOutError);
            console.error("Failed to sign out: ", signOutError);
        }
    }, [signOutSuccess, isPending, signOutError, navigate]);
    return (
        <div className="w-64 bg-black border-r border-gray-800 p-3.5 hidden lg:block">
            {/* Menu Section */}
            <div className="mb-8">
                <div className='flex flex-row mb-8 items-center justify-start space-x-3'>
                    <img src={'/AniMatchLogo.png'} className='h-10 w-10' alt="AniMatch Logo" />
                    <h1 className='text-md font-bold text-white'>AniMatch</h1>
                </div>

                <div className="mb-8">
                    <h3 className="text-sm font-medium text-gray-400 mb-4">Search</h3>
                    <nav className="space-y-2" role="navigation" aria-label="Library navigation">
                        <a href="/search" className="flex items-center space-x-3 text-gray-300 hover:text-white hover:bg-red-400/10 px-3 py-2.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-black">
                            <MagnifyingGlassIcon size={18} aria-hidden="true" />
                            <span>Search</span>
                        </a>
                    </nav>
                </div>

                <h3 className="text-sm font-medium text-gray-400 mb-4">Menu</h3>
                <nav className="space-y-2" role="navigation" aria-label="Main navigation">
                    <a href="/home" className="flex items-center space-x-3 text-red-500 hover:bg-red-400/10 px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black transition-colors">
                        <HouseIcon size={18} aria-hidden="true" />
                        <span className="font-medium">Home</span>
                    </a>
                    <a href="/anime-recs" className="flex items-center space-x-3 text-gray-300 hover:text-white hover:bg-red-400/10 px-3 py-2.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black">
                        <SparkleIcon size={18} aria-hidden="true" />
                        <span>Recs</span>
                    </a>
                    <a href="#" className="flex items-center space-x-3 text-gray-300 hover:text-white hover:bg-red-400/10 px-3 py-2.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black">
                        <TrendUpIcon size={18} aria-hidden="true" />
                        <span>Trending Anime</span>
                    </a>
                </nav>
            </div>
            <div className="mb-8">
                <h3 className="text-sm font-medium text-gray-400 mb-4">Library</h3>
                <nav className="space-y-2" role="navigation" aria-label="Library navigation">
                    <a href="/watchlist" className="flex items-center space-x-3 text-gray-300 hover:text-white hover:bg-red-400/10 px-3 py-2.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-black">
                        <ClockIcon size={18} aria-hidden="true" />
                        <span>Watchlist</span>
                    </a>
                    <a href="#" className="flex items-center space-x-3 text-gray-300 hover:text-white hover:bg-red-400/10 px-3 py-2.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-black">
                        <CheckSquareOffsetIcon size={18} aria-hidden="true" />
                        <span>Reactions</span>
                    </a>
                </nav>
            </div>
            <div className="mb-8">
                <h3 className="text-sm font-medium text-gray-400 mb-4">General</h3>
                <nav className="space-y-2" role="navigation" aria-label="General navigation">
                    <a href="/settings" className="flex items-center space-x-3 text-gray-300 hover:text-white hover:bg-red-400/10 px-3 py-2.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black">
                        <UserCircleGearIcon size={18} aria-hidden="true" />
                        <span>Settings</span>
                    </a>
                    <a
                        onClick={handleSignOut}
                        className="flex items-center space-x-3 text-gray-300 hover:text-white hover:bg-red-400/10 px-3 py-2.5 rounded-lg transition-colors cursor-pointer w-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black"
                        aria-label="Sign out of your account"
                    >
                        <SignOutIcon size={18} aria-hidden="true" />
                        <span>Sign Out</span>
                    </a>
                </nav>
            </div>

            {/* Main Content */}
        </div>
    )
}

export default Sidebar