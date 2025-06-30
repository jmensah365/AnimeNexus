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



function WelcomePage() {
  const navigate = useNavigate();

  const { mutate: useGenerateAndInsertAiRecsMutate, isError, error, isSuccess, isPending } = useGenerateAndInsertAiRecs();
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
    <>
      {/* <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-10 animate-bounce animate-twice">Please click below</div> */}

      <div
        className="flex items-center justify-center min-h-screen bg-cover bg-center relative animate-fade-right"
        style={{ backgroundImage: `url('/1311994.jpeg')` }}
        aria-label="Welcome Page Background"
      >
        <div className="absolute w-72 h-24 top-40 left-[540px] animate-bounce animate-thrice">
          <div className="relative group">
            <div className="relative w-96 h-14 opacity-90 overflow-hidden rounded-xl bg-black z-10">
              <div className="absolute z-10 -translate-x-44 group-hover:translate-x-[30rem] ease-in transistion-all duration-700 h-full w-44 bg-gradient-to-r from-gray-500 to-white/10 opacity-30 -skew-x-12" />
              <div className="absolute flex items-center justify-center text-white z-[1] opacity-90 rounded-2xl inset-0.5 bg-black">
                <button name="text" className="input font-semibold text-lg h-full opacity-90 w-full px-16 py-3 rounded-xl bg-black" disabled={true}>
                  {isPending ? 'Loading...' : 'Please click below to enter 👇🏿'}
                </button>
              </div>
              <div className="absolute duration-1000 group-hover:animate-spin w-full h-[100px] bg-gradient-to-r from-red-500 to-yellow-500 blur-[30px]" />
            </div>
          </div>
        </div>
        <button
          onClick={() => handleClick()}
          className="absolute cursor-pointer w-[175px] h-[300px] left-[720px] top-1/2 transform -translate-x-1/2 -translate-y-1/2 focus:outline-none focus:ring-4 focus:ring-blue-500 "
          aria-label="Enter through the door to access the home page"
          disabled={isPending}
        >
          {isPending && <div>
            <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-blue-500 mx-auto mt-20"></div>
            </div>}
        </button>
      </div>
    </>
  );
}

export default WelcomePage;
