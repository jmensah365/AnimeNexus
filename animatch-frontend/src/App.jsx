import React, {useEffect} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignInPage from "./pages/Home/SignInPage.jsx";
import SignUpPage from "./pages/Home/SignUpPage.jsx";
import HomePage from "./pages/Home/HomePage.jsx";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MoreInfo from "./pages/MoreInfo.jsx";
import AniMatchHome from "./pages/AniMatchHome.jsx";
import About from "./pages/Home/About.jsx";
import AnimeRecs from "./pages/AnimeRecs.jsx";
import Watchlist from "./pages/Watchlist.jsx";
import Search from "./pages/Search.jsx";
import SettingsPage from "./pages/Settings.jsx";
import WelcomePage from './pages/WelcomePage.jsx';
import AuthCallback from "./pages/AuthCallback.jsx";
import TrendingAnime from "./pages/TrendingAnime.jsx";
import Reactions from "./pages/Reactions.jsx";
import { RequireAuth } from "./utils/Auth.jsx";

export const queryClient = new QueryClient();



function App() {


  return (
    <QueryClientProvider client={queryClient}>

      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path='/login' element={<SignInPage />} />
          <Route path='/register' element={<SignUpPage />} />
          <Route path='/about' element={<About />} />
          <Route path='/auth/callback' element={<AuthCallback />} />

          <Route element={<RequireAuth redirectTo={'/login'} />}>
            <Route path='/welcome' element={ <WelcomePage /> } />
            <Route path='/home' element={ <AniMatchHome /> } />
            <Route path='/more-info' element={ <MoreInfo /> } />
            <Route path='/anime-recs' element={ <AnimeRecs /> } />
            <Route path='/watchlist' element={ <Watchlist /> } />
            <Route path='/search' element={ <Search /> } />
            <Route path='/reactions' element={ <Reactions /> } />
            <Route path='/trending' element={ <TrendingAnime /> } />
            <Route path='/settings' element={ <SettingsPage /> } />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  )
}

export default App;