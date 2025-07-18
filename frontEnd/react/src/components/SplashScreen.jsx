/* eslint-disable no-unused-vars */
// SplashScreen.jsx
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import logo1 from '../assets/logo1.svg';

import store from '../librairies/zustand';


const SplashScreen = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 3000); // 3 secondes (modifie selon ton besoin)
    return () => clearTimeout(timer);
  }, [onFinish]);

   const changetheme = store((state) => state.changetheme);


  return (
    
     <div  className =   {   `min-h-screen   ${changetheme ?  `bg-[#000000d1] text-white` : ``} `}>
       <motion.div
      className={`fixed inset-0 flex items-center  ${changetheme ?  `bg-[#000000d1] text-white` : ``}  justify-center  z-50`}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
    >
      <motion.div
        className="w-36 h-36 border-4 border-indigo-500 border-dashed rounded-full animate-spin flex items-center justify-center"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1 }}
      >
        <img src={logo1} alt="Logo" className="w-20 h-20" />
      </motion.div>
    </motion.div>
     </div>
   
  );
};

export default SplashScreen;
