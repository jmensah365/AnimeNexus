import React from 'react'
import LoginButton from '../../components/Buttons/LoginButton'
import AniMatchOverview from '../../components/AniMatchOverview'
import HowItWorks from '../../components/HowItWorks'
import SignUpButton from '../../components/Buttons/SignUpButton'
import '../../App.css'
import HomeNavBar from '../../components/HomeNavBar'
import SplitText from '../../styles/SplitText'

function HomePage() {
  return (
    <>
    <div className='animate-fade-down animate-delay-200'>
    <HomeNavBar/>
      <div className='flex flex-col items-center justify-center bg-cover bg-center min-h-screen bg-[url(/afro_samurai.webp)] '>
          <div className='flex flex-col items-center justify-center'>
            <SplitText
              text="Discover Your Next Anime Adventure"
              className="text-4xl font-semibold text-center mb-8 "
              delay={70}
              duration={0.3}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-100px"
              textAlign="center"
            />
          </div>
          {/* Overview Section */}
          <AniMatchOverview />
          {/* Login/Signup Section */}
          <div className='flex flex-row items-center justify-center gap-4 md:gap-10'>
            <LoginButton />
            <SignUpButton />
          </div>
          </div>

          {/* How It Works Section */}
          <HowItWorks />
          </div>
    </>
  )
}

export default HomePage