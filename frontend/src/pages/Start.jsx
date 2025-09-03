import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Leaf from "../assets/leaf.png";

const Start = () => {
  return (
    <div 
      className="h-screen flex flex-col justify-center items-center bg-cover bg-center relative overflow-hidden text-white"
      style={{
        backgroundImage: "url(https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
      }}
    >
    
      <motion.div
        className="absolute w-72 h-72 bg-green-400 opacity-10 rounded-full top-10 left-10 blur-[120px]"
        animate={{ x: [0, 30, -30, 0], y: [0, 20, -20, 0], rotate: [0, 15, -15, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-60 h-60 bg-blue-400 opacity-30 rounded-full bottom-10 right-10 blur-[100px]"
        animate={{ x: [0, -25, 25, 0], y: [0, -25, 25, 0], rotate: [0, -10, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      
      <motion.img
        src={Leaf}
        alt="AI Crop Logo"
        className="w-24 md:w-28 lg:w-32 drop-shadow-lg"
        initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />

      
      <motion.div
        className="rounded-3xl  p-8 md:p-14 text-center w-11/12 max-w-lg"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <h2 className="text-4xl md:text-5xl font-extrabold text-[#f1f1f1] drop-shadow-lg">
          AI Crop Disease Detection 
        </h2>

        <p className="text-red-600 mt-4 text-lg md:text-xl leading-relaxed font-sans">
          Protect your crops with AI-powered disease detection.  
          Smart farming starts here
        </p>

        <motion.div
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            to="/home"
            className="mt-6 inline-block w-full bg-gradient-to-r bg-green-600 text-white font-semibold py-3 text-lg rounded-lg transition hover:opacity-90"
          >
            Get Started 
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Start;
