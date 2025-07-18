
 import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Inscription from "../components/Inscription";

import Connexion from "../components/Connexion";

import  Screen from "../components/Screen"

import img1 from '../assets/icons8-logo-google-240.png'

import img2 from '../assets/icons8-microsoft-240.png'

import img3 from '../assets/github-6980894_1280.webp'



import DetailsBooks from "../components/DetailsBooks";

import InteractionEtRecommendation from "../pages/InteractionEtRecommendation";

import CardRecommendation from "../components/CardRecommendation";

import Interraction from "../components/Interractions";

import ForgotPassword from "../components/ForgotPassword";


import ResetPassword from "../components/ResetPassword";
  

import ErrorBoundary from "../components/ErrorBoundary";

import BigView from "../components/BigView";

import BigViewRecommendation from "../components/BigViewRecommendation";

import SplashScreen from '../components/SplashScreen';

import { useState, useEffect } from 'react';  

import { useLocation } from 'react-router-dom';
  
const Routes1 = () => {

    const [showSplash, setShowSplash] = useState(false);
  const location = useLocation();


   useEffect(() => {
    setShowSplash(true);
    const timeout = setTimeout(() => {
      setShowSplash(false);
    }, 4000); // durée d'affichage du splash
    return () => clearTimeout(timeout);
  }, [location.pathname])

      return(

           
      <>
      
          {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
    {!showSplash && (
      <Routes>
        <Route path="/Accueil" element={<Screen />} />
        <Route path="/AddRecommendation" element={<InteractionEtRecommendation />} />
        <Route path="/CardRecommendation" element={<CardRecommendation />} />
        <Route path="/Interraction" element={<Interraction />} />
        <Route path="/BigView/:id" element={<BigView />} />
        <Route path="/BigViewRecommendation/:id" element={<BigViewRecommendation />} />
        <Route path="/books/:livreId" element={<DetailsBooks />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/Inscription" element={<Inscription />} />
        <Route path="/" element={<Connexion img1={img1} img2={img2} img3={img3} />} />
        <Route path="/ErrorBoundary" element={<ErrorBoundary />} />
      </Routes>
    )}
      
      </>
        
     
      )


}

export default Routes1