import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import SignInPage from "./pages/SignInPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import Welcome from './pages/welcome.jsx'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import ProtectedRoute from "./utils/Wrapper.jsx";
import MoreInfo from "./pages/MoreInfo.jsx";

export const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>

      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path='/login' element={<SignInPage/>} />
          <Route path='/register' element={<SignUpPage/>} />
          <Route path='/welcome' element={<ProtectedRoute> <Welcome/> </ProtectedRoute>} />
          <Route path='/more-info' element={<ProtectedRoute> <MoreInfo/> </ProtectedRoute>} />
        </Routes>
      </Router>
    </QueryClientProvider>
  )
}

export default App;