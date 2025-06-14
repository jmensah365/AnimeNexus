import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from './supabaseClient';
import Loader from '../components/LoadingScreen';
import { useQuery } from '@tanstack/react-query';
import StyledButton from '../components/StyledButton2'

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

const ProtectedRoute = ({ children }) => {
    const navigate = useNavigate();

    const {data, isLoading, isError} = useQuery({queryKey: ['validateSession'], queryFn: validateSession, retry: false, staleTime: 0});

    if (isLoading) {
        return <Loader />;
    }

    if (isError) {
        return (
            <div className="flex items-center justify-center h-screen bg-[url(/one-punch-man.jpg)] bg-cover bg-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4 text-white">Access Denied</h1>
                    <p className="mb-4 text-white">You must be logged in to view this page.</p>
                    {/* <button
                        onClick={() => navigate('/login')}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
                    >
                        Go to Login
                    </button> */}
                    <StyledButton text={'Log In'} path={'/login'} className="mt-4"/>
                        
                </div>
            </div>
        );
    }

    return <>{children}</>
};

export default ProtectedRoute;
