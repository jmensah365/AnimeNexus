import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/Auth';
import Particles from '../styles/Galaxy';
import { useGenAndInsertAnime } from '../hooks/useAnime';
import { useGenAndInsetAIRecs } from '../hooks/useAI';



function WelcomePage() {
  const { session } = useAuth();
  const token = session?.access_token;
  const navigate = useNavigate();

  const genAndInsertAnime = useGenAndInsertAnime(token);
  const genAndInsertAIRecs = useGenAndInsetAIRecs(token, navigate)

  const handleClick = () => {
    genAndInsertAnime.mutate(token)
    genAndInsertAIRecs.mutate(token)
  }


  return (
    <>

      <div className="relative w-full h-screen">
        {/* Particles background */}
        <Particles
          particleColors={['#ffffff', '#ffffff']}
          particleCount={1000}
          particleSpread={20}
          speed={0.2}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
          className="absolute inset-0 z-0"
        />

        {/* Overlay content */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-white animate-fade-down bg-black/40">
          <img src={'/AniMatchLogo.png'} className="w-[600px] h-[600px]" />
          <p className='font-semibold'>Your adventure awaits...</p>
          <button
            onClick={() => handleClick()}
            className={`relative border hover:border-red-600 duration-500 group cursor-pointer text-sky-50 overflow-hidden h-14 w-56 rounded-md bg-red-800 p-2 flex justify-center items-center font-extrabold mt-3 ${genAndInsertAIRecs.isPending ? 'animate-pulse' : 'animate-none'
              }`}
          >
            <div className="absolute z-0 w-48 h-48 rounded-full group-hover:scale-150 transition-all duration-500 ease-in-out bg-red-900 delay-150 group-hover:delay-75"></div>
            <div className="absolute z-0 w-40 h-40 rounded-full group-hover:scale-150 transition-all duration-500 ease-in-out bg-red-800 delay-150 group-hover:delay-100"></div>
            <div className="absolute z-0 w-32 h-32 rounded-full group-hover:scale-150 transition-all duration-500 ease-in-out bg-red-700 delay-150 group-hover:delay-150"></div>
            <div className="absolute z-0 w-24 h-24 rounded-full group-hover:scale-150 transition-all duration-500 ease-in-out bg-red-600 delay-150 group-hover:delay-200"></div>
            <div className="absolute z-0 w-16 h-16 rounded-full group-hover:scale-150 transition-all duration-500 ease-in-out bg-red-500 delay-150 group-hover:delay-300"></div>
            <p className="z-10">{genAndInsertAIRecs.isPending ? 'Loading...' : 'Get Started'}</p>
          </button>
        </div>
      </div>


    </>
  );
}

export default WelcomePage;
