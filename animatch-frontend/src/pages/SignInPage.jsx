import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GoogleLogoIcon, FacebookLogoIcon, EyeClosedIcon, EyeIcon } from '@phosphor-icons/react'
import HomeNavbar from '../components/HomeNavBar'
import { useQuery, useMutation } from '@tanstack/react-query'
import ErrorCard from '../components/Cards/ErrorCard'

const signIn = async ({email, password}) => {
    const response = await fetch('http://localhost:3000/auth/sign-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
    })

    if (!response.ok) {
        throw new Error(await response.text());
    }


    return response.json();
}

const useSignIn = () => {
    return useMutation({mutationFn: signIn});
}

const checkifFormIsCompleted = async () => {
    const response = await fetch('http://localhost:3000/preferences/completed', {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
    })
    if (!response.ok) throw new Error(await response.text());
    return response.json();
}






function SignInPage() {
    const [isVisible, setIsVisible] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const navigateTo = (path) => {
        navigate(path);
    }

    const { mutate: signInMutate, isError, isPending } = useSignIn();
    const formCheckMutation = useMutation({
        mutationFn: checkifFormIsCompleted, 
        onSuccess: (data) => {
            if (data.isCompleted) navigateTo('/home');
            else navigateTo('/more-info');
        }, 
        onError: (error) => {console.error("Failed to check form completion status: ", error);
    }});




    const handleSubmit = (e) => {
        e.preventDefault();

        signInMutate(
            {email, password},
            {
                onSuccess: async () => {
                    formCheckMutation.mutate(); // Check if the user has completed the preference form
                },

                onError: (error) => {
                    try {
                        const parsedError = JSON.parse(error.message);
                        setErrorMessage(parsedError.message || "An error occurred during sign in.");
                    } catch (e) {
                        setErrorMessage("An error occurred during sign in. Please try again.");
                        console.error(e);
                    }
                }
            }
        )
    }
    return (
        <>
            <div className='animate-fade-down'>
                <HomeNavbar />
                <div className='flex justify-center bg-cover bg-center min-h-screen bg-[url(/samurai-champloo-2.jpg)]'>
                    <div className='flex flex-col justify-center items-center'>
                        <h2 className='text-black text-3xl mb-5'>
                            Welcome Back!
                        </h2>
                        <div className='space-y-4'>
                        <form id='form' method='POST' onSubmit={handleSubmit} className='space-y-4'>
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email">Email</label>
                                <input className="flex text-black h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                type="email" 
                                id="email" 
                                name='email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="jmensa123@example.com" 
                                required />
                            </div>
                            <div className=" relative space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="password">Password</label>
                                <div>
                                    <input className="flex text-black h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    type={isVisible ? "text" : "password"} 
                                    id="password" 
                                    name='password' 
                                    placeholder='••••••••' 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required />
                                    <button type='button' onClick={() => setIsVisible(!isVisible)} className='absolute right-5 top-9 hover:cursor-pointer'>{isVisible ? (<EyeClosedIcon />) : (<EyeIcon />)}</button>
                                </div>
                            </div>
                            <p className='text-right text-sm text-black hover:underline cursor-pointer'>Forgot Password?</p>

                            <button id='submitBtn' type='submit' disabled={isPending} className="inline-flex items-center justify-center rounded-lg h-10 px-4 py-2 w-full bg-[#4285F4] text-white hover:cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed">
                                <div className="flex items-center justify-center">
                                    {isPending ? 'Logging In...' : 'Log In'}
                                </div>
                            </button>
                        </form>
                        <p className='text-black'>Haven't signed up? <a onClick={() => navigateTo('/register')} className='text-black hover:underline cursor-pointer'>Sign up!</a></p>
                        </div>
                        {/* { isSuccess && <LoadingScreen/>} */}
                        {isError && <ErrorCard errorMsg={errorMessage} />}
                    </div>
                </div>
            </div>
        </>
    )
}

export default SignInPage