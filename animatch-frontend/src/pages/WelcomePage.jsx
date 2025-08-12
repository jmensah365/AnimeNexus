import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HandPointingIcon } from '@phosphor-icons/react';
import { useMutation, useQuery } from '@tanstack/react-query';

const generateAndInsertAiRecs = async () => {
  const response = await fetch('http://localhost:3000/ai/insert', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  })

  if (!response.ok) throw new Error(await response.text());
  return response.json();
}

const useGenerateAndInsertAiRecs = () => {
  return useMutation({ mutationFn: generateAndInsertAiRecs });
}

const generateAndInsertAnimeMetadata = async () => {
  const response = await fetch('http://localhost:3000/api/anime/insertMetadata', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  })

  if (!response.ok) throw new Error(await response.text())
  return response.json();
}

const useGenerateAndInsertAnimeMetadata = () => {
  return useMutation({ mutationFn: generateAndInsertAnimeMetadata });
}


function WelcomePage() {
  const navigate = useNavigate();

  const { mutate: useGenerateAndInsertAiRecsMutate, isError, error, isSuccess, isPending } = useGenerateAndInsertAiRecs();
  const { mutate: useGenerateAndInsertAnimeMutate } = useGenerateAndInsertAnimeMetadata();
  const handleClick = () => {
    useGenerateAndInsertAnimeMutate({}, {
      onSuccess: () => {
        console.log('Inserted anime metadata into DB');
      },
      onError: (error) => {
        console.error('Error inserting anime metadata into DB: ', error);
      }
    })
    useGenerateAndInsertAiRecsMutate({},
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

      <div className='bg-black min-h-screen flex flex-col items-center justify-center text-white animate-fade-down'>
        <img src={'/AniMatchLogo.png'} className='w-[700px] h-[700px]' />
        <p>Your adventure awaits...</p>
        <button onClick={() => handleClick()} class={`relative border hover:border-red-600 duration-500 group cursor-pointer text-sky-50  overflow-hidden h-14 w-56 rounded-md bg-red-800 p-2 flex justify-center items-center font-extrabold mt-3 ${isPending ? 'animate-pulse' : 'animate-none'}`}>
          <div class="absolute z-10 w-48 h-48 rounded-full group-hover:scale-150 transition-all  duration-500 ease-in-out bg-red-900 delay-150 group-hover:delay-75"></div>
          <div class="absolute z-10 w-40 h-40 rounded-full group-hover:scale-150 transition-all  duration-500 ease-in-out bg-red-800 delay-150 group-hover:delay-100"></div>
          <div class="absolute z-10 w-32 h-32 rounded-full group-hover:scale-150 transition-all  duration-500 ease-in-out bg-red-700 delay-150 group-hover:delay-150"></div>
          <div class="absolute z-10 w-24 h-24 rounded-full group-hover:scale-150 transition-all  duration-500 ease-in-out bg-red-600 delay-150 group-hover:delay-200"></div>
          <div class="absolute z-10 w-16 h-16 rounded-full group-hover:scale-150 transition-all  duration-500 ease-in-out bg-red-500 delay-150 group-hover:delay-300"></div>
          <p class="z-10">{isPending ? 'Loading...' : 'Get Started'}</p>
        </button>
      </div>

    </>
  );
}

export default WelcomePage;
