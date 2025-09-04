import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const prompts = [
  "How can I help you today?",
  "Ask me anything!",
  "Need assistance?",
  "Let's chat!",
  "I'm here to help",
  "What's on your mind?"
];

export default function ChatButton({ setIsChatOpen, isChatOpen }) {
  const [currentPrompt, setCurrentPrompt] = useState(prompts[0]);
  const [typingText, setTypingText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const promptIndex = useRef(0);

  // Typing effect
  useEffect(() => {
    let index = 0;
    let timeout;

    const typeText = () => {
      if (index <= currentPrompt.length) {
        setTypingText(currentPrompt.slice(0, index));
        index++;
        timeout = setTimeout(typeText, 50 + Math.random() * 30);
      } else {
        setIsTyping(false);
      }
    };

    setIsTyping(true);
    typeText();

    return () => clearTimeout(timeout);
  }, [currentPrompt]);

  
  useEffect(() => {
    const interval = setInterval(() => {
      promptIndex.current = (promptIndex.current + 1) % prompts.length;
      setCurrentPrompt(prompts[promptIndex.current]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  
  const floatingVariants = {
    float: {
      y: [-5, 5],
      transition: {
        y: {
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }
      }
    },
    hover: {
      y: 0,
      scale: 1.1,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="fixed  flex  items-end flex-col z-50 bottom-6 right-6">
    
      {!isChatOpen && (
        <>
         
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPrompt}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-900 text-white px-4 py-3 rounded-xl shadow-xl mb-3 text-sm font-medium max-w-xs"
              style={{
                backdropFilter: "blur(10px)",
                backgroundColor: "rgba(17, 24, 39, 0.9)",
                border: "1px solid rgba(255, 255, 255, 0.1)"
              }}
            >
              <div className="flex items-center">
                <div className="relative mr-2">
                  <div className="w-2 h-2  rounded-full animate-pulse bg-blue-400"></div>
                  <div className="absolute top-0 left-0 w-2 h-2 bg-blue-400 rounded-full opacity-75 animate-ping"></div>
                </div>
                <span>
                  {typingText}
                  <span className={`inline-block w-1 h-5 ml-1 bg-white ${isTyping ? 'opacity-0' : 'animate-blink'}`}></span>
                </span>
              </div>
          
              <div className="absolute -bottom-1 right-6 w-4 h-4 bg-gray-900 transform rotate-45" 
                   style={{
                     backgroundColor: "rgba(17, 24, 39, 0.9)",
                     borderRight: "1px solid rgba(255, 255, 255, 0.1)",
                     borderBottom: "1px solid rgba(255, 255, 255, 0.1)"
                   }}></div>
            </motion.div>
          </AnimatePresence>

       
          <motion.button
  onClick={() => setIsChatOpen(true)}
  className="bg-gradient-to-br bg-green-600 text-white font-bold py-3 px-6 rounded-full shadow-lg flex items-center gap-2 transition-transform duration-200 active:scale-95"
  variants={floatingVariants}
  initial="float"
  whileHover="hover"
>
  <span>🤖</span>
  <span>Ask the Farm AI</span>
</motion.button>

        </>
      )}
    </div>
  );
}
