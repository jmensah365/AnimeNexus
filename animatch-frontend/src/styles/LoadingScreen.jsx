import React from 'react';

const Loader = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="relative">
                <div className="relative w-32 h-32">
                    <div className="absolute w-full h-full rounded-full border-[3px] border-gray-100/10 border-r-[#0ff] border-b-[#0ff] animate-spin" style={{ animationDuration: '3s' }} />
                    <div className="absolute w-full h-full rounded-full border-[3px] border-gray-100/10 border-t-[#0ff] animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }} />
                </div>
                <div className="absolute inset-0 bg-gradient-to-tr from-[#0ff]/10 via-transparent to-[#0ff]/5 animate-pulse rounded-full blur-sm" />
            </div>
            <p className="mt-5 text-gray-500 text-lg animate-pulse">Loading...</p>
            <p className="text-gray-500 text-lg animate-pulse">Your adventure is about to begin</p>
        </div>
    );
}

export default Loader;
