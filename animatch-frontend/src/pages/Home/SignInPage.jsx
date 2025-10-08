import React, {useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { EyeSlashIcon, EyeIcon } from '@phosphor-icons/react'
import HomeNavbar from '../../components/HomeNavBar'
import { useMutation } from '@tanstack/react-query'
import ErrorCard from '../../components/Cards/ErrorCard'
import GoogleButton from '../../components/Buttons/GoogleButton'
import supabase from '../../utils/supabaseClient'
import { useCheckifFormIsCompleted } from '../../hooks/usePreference'

const signIn = async ({ email, password }) => {
    const {data, error} = await supabase.auth.signInWithPassword({
        email,
        password,
    });


    if (error) throw error;
    return data;
}

const useSignIn = () => {
    return useMutation({ mutationFn: signIn });
}

// const checkifFormIsCompleted = async (token) => {
//     const response = await fetch(`${import.meta.env.VITE_PROD_URL}/preferences/completed`, {
//         method: 'GET',
//         headers: { 
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`
//         },
//     })
//     if (!response.ok) throw new Error(await response.text());
//     return response.json();
// }






function SignInPage() {
    const [isVisible, setIsVisible] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const navigateTo = (path) => {
        navigate(path);
    }

    const { mutate: signInMutate, isError, isPending } = useSignIn();
    const formCheckMutation = useCheckifFormIsCompleted(navigateTo, setErrorMessage);


    const handleGoogleSignUp = async () => {
        try {
            await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                }
            });
        } catch (error) {
            console.error('Google sign-in error:', error.message);
            setErrorMessage(error.message);
        }
    }




    const handleSubmit = (e) => {
        e.preventDefault();

        signInMutate(
            { email, password },
            {
                onSuccess: async (data) => {
                    const token = data.session.access_token;
                    formCheckMutation.mutate(token);
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
                <div className='flex justify-center items-center min-h-screen bg-cover bg-center bg-[url(/samurai-champloo-2.jpg)]'>
                    <div className='flex flex-col items-center justify-center bg-white/20 backdrop-blur-md rounded-xl shadow-lg p-8 w-[350px]'>
                        <h2 className='text-black text-3xl mb-5'>
                            Welcome Back!
                        </h2>
                        <div className='space-y-2'>
                            <form id='form' method='POST' onSubmit={handleSubmit} className='space-y-4'>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email">Email</label>
                                    <input className="flex text-black h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        type="email"
                                        id="email"
                                        name='email'
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="yourname@example.com"
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
                                        <button type='button' onClick={() => setIsVisible(!isVisible)} className='absolute right-5 top-9 hover:cursor-pointer'>{isVisible ? (<EyeSlashIcon />) : (<EyeIcon />)}</button>
                                    </div>
                                </div>
                                <p className='text-right text-sm text-black hover:underline cursor-pointer'>Forgot Password?</p>

                                <button id='submitBtn' type='submit' disabled={isPending} className="inline-flex items-center justify-center rounded-4xl h-10 px-4 py-2 w-full bg-[#4285F4] border border-black text-white hover:cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed hover:scale-105 transition-all duration-300">
                                    <div className="flex items-center justify-center">
                                        {isPending ? 'Logging In...' : 'Log In'}
                                    </div>
                                </button>
                            </form>
                            <div className="flex items-center space-x-2">
                                <hr className="flex-grow border-zinc-200 dark:border-zinc-700" />
                                <span className="text-black text-sm">Or Continue With</span>
                                <hr className="flex-grow border-zinc-200 dark:border-zinc-700" />
                            </div>
                            <div className='flex flex-row gap-5 justify-center'>
                                {/* <GoogleOAuth handleGoogleSignIn={handleGoogleSignIn} /> */}
                                <GoogleButton onClick={handleGoogleSignUp}/>
                            </div>
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