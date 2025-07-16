import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import SignInPage from "./pages/SignInPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import WelcomePage from './pages/WelcomePage.jsx'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import ProtectedRoute from "./utils/Wrapper.jsx";
import MoreInfo from "./pages/MoreInfo.jsx";
import AniMatchHome from "./pages/AniMatchHome.jsx";
import About from "./pages/About.jsx";
import AnimeRecs from "./pages/AnimeRecs.jsx";

export const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>

      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path='/login' element={<SignInPage/>} />
          <Route path='/register' element={<SignUpPage/>} />
          <Route path='/about' element={<About/>} />
          <Route path='/welcome' element={<ProtectedRoute> <WelcomePage/> </ProtectedRoute>} />
          <Route path='/home' element={<ProtectedRoute> <AniMatchHome/> </ProtectedRoute>} />
          <Route path='/more-info' element={<ProtectedRoute> <MoreInfo/> </ProtectedRoute>} />
          <Route path='/anime-recs' element={<ProtectedRoute> <AnimeRecs/> </ProtectedRoute>} />
        </Routes>
      </Router>
    </QueryClientProvider>
  )
}

export default App;