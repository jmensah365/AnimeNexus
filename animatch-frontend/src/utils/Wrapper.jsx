import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from './supabaseClient';
import Loader from '../styles/LoadingScreen';
import { useQuery, useMutation } from '@tanstack/react-query';
import StyledButton from '../components/Buttons/StyledButton2'

const validateSession = async () => {
    const response = await fetch('http://localhost:3000/auth/validateSession', {
        method: 'GET',
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error('Session not valid or expired');
    }

    return response.json();
}

// const refreshSession = async () => {
//     const response = await fetch('http://localhost:3000/auth/refreshToken', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//     })

//     if(!response.ok) throw new Error(await response.text());
//     return response.json();
// }

// const useRefreshSession = () => {
//     return useMutation({mutationFn: refreshSession});
// }
const ProtectedRoute = ({ children }) => {
    const navigate = useNavigate();

    const {data, isLoading, isError} = useQuery({queryKey: ['validateSession'], queryFn: validateSession, retry: false, staleTime: 0});
    // const {mutate: refreshToken, isLoading: isRefreshing, isError: refreshError, isSuccess: refreshSuccess} = useRefreshSession();

    // useEffect(() => {
    //     if (refreshSuccess) {
    //         console.log('Session refreshed successfully');
    //         navigate('/home');
    //     }
    //     if (refreshError) {
    //         console.error('Failed to refresh session:', refreshError);
    //         navigate('/login');
    //     }
    // })

    // const handleRefresh = () => {
    //     refreshToken({
    //         onSuccess: () => {
    //             console.log('Session refreshed successfully');
    //             navigate('/home');
    //         },
    //         onError: (error) => {
    //             console.error('Failed to refresh session:', error);
    //             navigate('/login');
    //         }
    //     })
    // }

    if (isLoading) {
        return <Loader />;
    }

    if (isError) {
        return (
            <div className="flex items-center justify-center h-screen bg-[url(/one-punch-man.jpg)] bg-cover bg-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4 text-white">Access Denied</h1>
                    <p className="mb-4 text-white">You must be logged in to view this page.</p>
                    <StyledButton text={'Log In'} path={'/login'} className="mt-4"/>
                    {/* <button className='bg-white text-black cursor-pointer' onClick={handleRefresh}>
                        Refresh Session
                    </button> */}
                    {/* <StyledButton text={'Refresh Session'} className="mt-4" onClick={handleRefresh} disabled={isRefreshing}/> */}
                </div>
            </div>
        );
    }

    return <>{children}</>
};

export default ProtectedRoute;
