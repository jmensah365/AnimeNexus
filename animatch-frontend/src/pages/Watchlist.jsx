import React, { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import { useQuery } from '@tanstack/react-query'

const fetchWatchlistWithInfo = async () => {
    const response = await fetch('http://localhost:3000/watchlists/with-titles', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    });
    if (!response.ok) throw new Error(await response.text())

    return response.json();
}

const useFetchWatchlistWithInfo = () => {
    return useQuery({
        queryKey: ['fetchWatchlistWithInfo'],
        queryFn: fetchWatchlistWithInfo,
        refetchOnWindowFocus: false,
        retry: 3,
    })
}
function Watchlist() {
    const [errorMessage, setErrorMessage] = useState('');
    const {data: watchlistWithAnimeInfo, isLoading, isSuccess, isError, error} = useFetchWatchlistWithInfo();

    useEffect(() => {
        if (isSuccess) {
            console.log(watchlistWithAnimeInfo);
        }
        if (isError) {
            setErrorMessage(error);
            console.error(error);
        }
    }, [isSuccess, error, isError]);


    return (
        <>
        <div className='flex min-h-screen bg-black'>
            <Sidebar />
            <div className='flex flex-1'>
            </div>
        </div>
        </>
    )
}

export default Watchlist