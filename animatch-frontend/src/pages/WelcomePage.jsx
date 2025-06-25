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

  if(!response.ok) throw new Error(await response.text());
  return response.json();
}

const useGenerateAndInsertAiRecs = () => {
  return useMutation({mutationFn: generateAndInsertAiRecs});
}



function WelcomePage() {
  const navigate = useNavigate();

  const {mutate: useGenerateAndInsertAiRecsMutate, isError, error, isSuccess, isPending} = useGenerateAndInsertAiRecs();
  const handleClick = () => {
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
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url('/1311994.jpeg')` }}
      aria-label="Welcome Page Background"
    >
      <button
        onClick={() => handleClick()}
        className="absolute cursor-pointer w-[175px] h-[300px] left-[720px] top-1/2 transform -translate-x-1/2 -translate-y-1/2 focus:outline-none focus:ring-4 focus:ring-blue-500 "
        aria-label="Enter through the door to access the home page"
        disabled={isPending}
      >
        Please click here to continue
      </button>
    </div>
  );
}

export default WelcomePage;
