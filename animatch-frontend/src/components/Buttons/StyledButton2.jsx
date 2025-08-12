import React from 'react';
import {useNavigate} from 'react-router-dom'

const Button = ({text,path, onClick}) => {
    const navigate = useNavigate();

    return (
        <button className="group/button relative inline-flex items-center justify-center overflow-hidden rounded-md bg-black backdrop-blur-lg px-6 py-2 text-base font-semibold text-white transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-xl hover:shadow-white/50 border border-white/20 cursor-pointer" onClick={() => navigate(path)}>
            <span className="text-lg">{text}</span>
            <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-13deg)_translateX(-100%)] group-hover/button:duration-1000 group-hover/button:[transform:skew(-13deg)_translateX(100%)]">
                <div className="relative h-full w-10 bg-white/30" />
            </div>
        </button>
    );
}

export default Button;
