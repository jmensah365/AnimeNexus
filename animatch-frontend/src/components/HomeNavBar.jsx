import React from 'react'
import StyledButton from './Buttons/StyledButton'
import { Button, Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from "flowbite-react";

function HomeNavBar() {
    return (
        <>
            <Navbar fluid className='!bg-transparent'>
                <NavbarBrand className='rtl:space-x-reverse'>
                    <a href='/' className='flex items-center space-x-1 h-10 md:h-15'>
                        <img src={'/AniMatchLogo2.png'} class="h-14" alt="AniMatch Logo" />
                        <span class="self-center text-2xl font-semibold whitespace-nowrap text-black">AniMatch</span>
                    </a>
                </NavbarBrand>
                <div className='flex md:order-2'>
                    <StyledButton Text='Get Started' />
                    <NavbarToggle />
                </div>
                <NavbarCollapse>
                    <NavbarLink href="/" className='text-lg !text-black hover:underline'>
                        Home
                    </NavbarLink>
                    <NavbarLink href="/about" className='text-lg !text-black hover:underline'>About</NavbarLink>
                </NavbarCollapse>
            </Navbar >
            {/* <nav class="bg-transparent fixed w-full z-20 top-0 start-0 left-0">
                <div class="max-w-screen flex flex-wrap items-center justify-between mx-auto p-4 px-8">
                    <a href="/" class="flex items-center space-x-3 rtl:space-x-reverse">
                        <img src={'/AniMatchLogo2.png'} class="h-14" alt="OncoTrials Logo"/>
                            <span class="self-center text-2xl font-semibold whitespace-nowrap text-black">AniMatch</span>
                    </a>
                    <div class="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                        <StyledButton Text="Get Started" />
                        <button data-collapse-toggle="navbar-sticky" type="button" class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-sticky" aria-expanded="false">
                            <span class="sr-only">Open main menu</span>
                            <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15" />
                            </svg>
                        </button>
                    </div>
                    <div class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
                        <ul class="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0">
                            <li>
                                <a href="/" class="block py-2 px-3 text-black rounded-sm md:bg-transparent md:p-0 md:hover:bg-transparent md:hover:underline cursor-pointer hover:text-red-500" aria-current="page">Home</a>
                            </li>
                            <li>
                                <a href="/about" class="block py-2 px-3 text-black rounded-sm md:hover:bg-transparen md:p-0 md:hover:underline cursor-pointer hover:text-red-500 ">About</a>
                            </li>                      
                        </ul>
                    </div>
                </div>
            </nav> */}
        </>
    )
}

export default HomeNavBar