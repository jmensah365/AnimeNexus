import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HandPointingIcon } from '@phosphor-icons/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuth } from '../utils/Auth';
import Particles from '../styles/Galaxy';

const generateAndInsertAiRecs = async (token) => {
  const response = await fetch('http://localhost:3000/recommendations/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  })

  if (!response.ok) throw new Error(await response.text());
  return response.json();
}

const useGenerateAndInsertAiRecs = (token) => {
  return useMutation({ mutationFn: () => generateAndInsertAiRecs(token) });
}

const generateAndInsertAnimeMetadata = async (token) => {
  const response = await fetch('http://localhost:3000/api/anime/insert-metadata', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  })

  if (!response.ok) throw new Error(await response.text())
  return response.json();
}

const useGenerateAndInsertAnimeMetadata = (token) => {
  return useMutation({ mutationFn: () => generateAndInsertAnimeMetadata(token) });
}


function WelcomePage() {
  const { session } = useAuth();
  const token = session?.access_token;
  const navigate = useNavigate();

  const { mutate: useGenerateAndInsertAiRecsMutate, isError, error, isSuccess, isPending } = useGenerateAndInsertAiRecs(token);
  const { mutate: useGenerateAndInsertAnimeMutate } = useGenerateAndInsertAnimeMetadata(token);
  const handleClick = () => {
    useGenerateAndInsertAnimeMutate({ token }, {
      onSuccess: () => {
        console.log('Inserted anime metadata into DB');
      },
      onError: (error) => {
        console.error('Error inserting anime metadata into DB: ', error);
      }
    })
    useGenerateAndInsertAiRecsMutate({ token },
      {
        onSuccess: () => {
          navigate('/home');
        },
        onError: (error) => {
          console.error('Error generating AI recommendations:', error);
        }
      }
    );

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
            className={`relative border hover:border-red-600 duration-500 group cursor-pointer text-sky-50 overflow-hidden h-14 w-56 rounded-md bg-red-800 p-2 flex justify-center items-center font-extrabold mt-3 ${isPending ? 'animate-pulse' : 'animate-none'
              }`}
          >
            <div className="absolute z-0 w-48 h-48 rounded-full group-hover:scale-150 transition-all duration-500 ease-in-out bg-red-900 delay-150 group-hover:delay-75"></div>
            <div className="absolute z-0 w-40 h-40 rounded-full group-hover:scale-150 transition-all duration-500 ease-in-out bg-red-800 delay-150 group-hover:delay-100"></div>
            <div className="absolute z-0 w-32 h-32 rounded-full group-hover:scale-150 transition-all duration-500 ease-in-out bg-red-700 delay-150 group-hover:delay-150"></div>
            <div className="absolute z-0 w-24 h-24 rounded-full group-hover:scale-150 transition-all duration-500 ease-in-out bg-red-600 delay-150 group-hover:delay-200"></div>
            <div className="absolute z-0 w-16 h-16 rounded-full group-hover:scale-150 transition-all duration-500 ease-in-out bg-red-500 delay-150 group-hover:delay-300"></div>
            <p className="z-10">{isPending ? 'Loading...' : 'Get Started'}</p>
          </button>
        </div>
      </div>


    </>
  );
}

export default WelcomePage;
