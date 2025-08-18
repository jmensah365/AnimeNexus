import { useMutation } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { data, useNavigate } from 'react-router-dom';
import { GoogleLogoIcon, FacebookLogoIcon, XIcon, EyeClosedIcon, EyeIcon, CheckIcon } from '@phosphor-icons/react'
import HomeNavBar from '../components/HomeNavBar.jsx';
import SuccessCard from '../components/Cards/SuccessCard.jsx';
import ErrorCard from '../components/Cards/ErrorCard.jsx';

const signUp = async ({ email, password }) => {
    const response = await fetch('http://localhost:3000/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
        throw new Error(await response.text());
    }

    return response.json();
}

const useSignUp = () => {
    return useMutation({ mutationFn: signUp });
}

function SignUpPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const passwordLength = password.length >= 6;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasDigitAndSymbol = /^(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>~`_\-+=\[\]\\\/])/.test(password);

    const navigate = useNavigate();

    const { mutate, isError, error, isPending, isSuccess } = useSignUp();


    const handleSubmit = (e) => {
        e.preventDefault();
        

        mutate(
            { email, password },
            {
                onSuccess: () => {
                    setSuccessMessage("Please check your email to confirm your account!");
                },
                onError: (error) => {
                    try {
                        const parsedError = JSON.parse(error.message);
                        setErrorMessage(parsedError.message || "An error occurred during sign up.");
                    }  catch (e) {
                        setErrorMessage("An error occurred during sign up. Please try again.");
                        console.error(e);
                    }
                }
            }
        )
    }

    return (
        <>
            <div className='animate-fade-down'>
                <HomeNavBar />
                <div className='flex items-center justify-center bg-cover bg-center min-h-screen bg-[url(/samurai-champloo-1.jpg)]'>
                    <div className='flex flex-col items-center mt-10'>
                        <h2 className='text-black text-3xl mb-5'>Welcome To AniMatch!</h2>
                        <div className='space-y-4'>
                            <form id='form' method='POST' onSubmit={handleSubmit} className='space-y-4'>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email">Email</label>
                                    <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        type="email"
                                        id="email"
                                        name='email'
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="jmensah123@example.com" r
                                        required />
                                </div>
                                <div className=" relative space-y-2">
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="password">Password</label>
                                    <div>
                                        <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            type={isVisible ? "text" : "password"}
                                            id="password"
                                            name='password'
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder='••••••••' required />
                                        <button type='button' onClick={() => setIsVisible(!isVisible)} className='absolute right-5 top-9'>{isVisible ? (<EyeClosedIcon />) : (<EyeIcon />)}</button>
                                    </div>
                                </div>
                                <div className='space-y-0.5 text-sm font-semibold'>
                                    <div className="">
                                        <span className='inline-flex items-center'> {passwordLength ? <CheckIcon size={16} color='black' /> : <XIcon size={16} color='red' />} <p>At least 8 chars.</p></span>
                                    </div>
                                    <div className=" ">
                                        <span className='inline-flex items-center'>{hasUppercase ? <CheckIcon size={16} color='black' /> : <XIcon size={16} color='red' />}<p>At least 1 uppercase</p></span>
                                    </div>
                                    <div className=" ">
                                        <span className='inline-flex items-center'>{hasLowercase ? <CheckIcon size={16} color='black' /> : <XIcon size={16} color='red' />}<p>At least 1 lowercase</p></span>
                                    </div>
                                    <div className="">
                                        <span className='inline-flex items-center'>{hasDigitAndSymbol ? <CheckIcon size={16} color='black' /> : <XIcon size={16} color='red' />}<p>At least 1 digit & symbol</p></span>
                                    </div>
                                </div>

                                <button id='submitBtn' type='submit' disabled={isPending} className="inline-flex items-center justify-center rounded-lg h-10 px-4 py-2 w-full bg-[#4285F4] text-white hover:cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed">
                                    <div className="flex items-center justify-center">
                                        {isPending ? 'Creating Account...' : 'Create Account'}
                                    </div>
                                </button>
                            </form>

                            <p className='text-black'>Already signed up? <a onClick={() => navigate('/login')} className='text-black hover:underline cursor-pointer'>Sign in!</a></p>
                        </div>
                            {isSuccess && <SuccessCard successMsg={'Signed up successfully! Please check your email to confirm your account!'}/>}
                            {isError && <ErrorCard errorMsg={errorMessage} />}
                    </div>
                </div>
            </div>
        </>
    );
}

export default SignUpPage;