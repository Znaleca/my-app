"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

const FLOATERS_COUNT = 90;

// --- Custom SVGs ---

const HeartIcon = ({ className, fill = "currentColor" }) => (
  <svg viewBox="0 0 24 24" fill={fill} className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const SparkleIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
  </svg>
);

const CloudIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
  </svg>
);

const Tulip = ({ color, leafColor, delay }) => {
  const swayDuration = 2 + Math.random() * 2;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, y: 50 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: delay, type: "spring" }}
      className="relative flex flex-col items-center justify-end h-64 w-24"
    >
      <motion.div
        className="relative z-10"
        animate={{ rotate: [Math.random() * -5, Math.random() * 5] }}
        transition={{ repeat: Infinity, repeatType: "mirror", duration: swayDuration, ease: "easeInOut" }}
      >
        <svg width="60" height="60" viewBox="0 0 100 100" className={`drop-shadow-sm ${color}`} fill="currentColor">
          <path d="M30 80 C 10 70, 0 40, 30 20 C 40 40, 45 60, 50 80" opacity="0.9" />
          <path d="M70 80 C 90 70, 100 40, 70 20 C 60 40, 55 60, 50 80" opacity="0.9" />
          <path d="M50 80 C 30 50, 30 20, 50 5 C 70 20, 70 50, 50 80" />
        </svg>
      </motion.div>
      <div className={`w-1.5 h-full rounded-full -mt-2 shadow-inner ${leafColor || 'bg-emerald-400'}`} />
      <motion.div
        className={`absolute bottom-10 left-6 w-8 h-20 rounded-tr-[100%] rounded-bl-[100%] origin-bottom-right shadow-sm ${leafColor || 'bg-emerald-400'}`}
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: -45 }}
        transition={{ delay: delay + 0.5, duration: 0.8 }}
      />
      <motion.div
        className={`absolute bottom-16 right-6 w-8 h-16 rounded-tl-[100%] rounded-br-[100%] origin-bottom-left shadow-sm ${leafColor || 'bg-emerald-300'}`}
        initial={{ scale: 0, rotate: 30 }}
        animate={{ scale: 1, rotate: 45 }}
        transition={{ delay: delay + 0.7, duration: 0.8 }}
      />
    </motion.div>
  );
};

export default function Home() {
  const [accepted, setAccepted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [noMoved, setNoMoved] = useState(false);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const noButtonRef = useRef(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const floaters = useMemo(() => {
    if (!isClient) return [];
    
    const cinnaImages = [
      "/images/cinnamoroll1.png",
      "/images/cinnamoroll2.png",
      "/images/cinnamoroll3.png",
      "/images/cinnamoroll4.png",
      "/images/cinnamoroll5.png",
      "/images/cinnamoroll6.png",
    ];

    return Array.from({ length: FLOATERS_COUNT }).map((_, index) => {
      const randomType = Math.random();
      let type, imgSrc;

      if (randomType < 0.30) {
        type = "cloud";
      } else if (randomType < 0.60) {
        type = "heart";
      } else {
        type = "cinna";
        imgSrc = cinnaImages[Math.floor(Math.random() * cinnaImages.length)];
      }

      const baseSize = type === "cinna" ? 70 : 25;
      const randomSizeAdd = type === "cinna" ? 80 : 50; 

      return {
        id: index,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 12 + Math.random() * 15,
        size: baseSize + Math.random() * randomSizeAdd,
        rotate: Math.random() * 360,
        type: type,
        imgSrc: imgSrc,
      };
    });
  }, [isClient]);

  const moveNoButton = () => {
    if (typeof window === "undefined") return;
    
    setNoMoved(true);

    const padding = 40;
    const buttonWidth = noButtonRef.current?.offsetWidth ?? 140;
    const buttonHeight = noButtonRef.current?.offsetHeight ?? 56;
    
    const maxX = window.innerWidth - buttonWidth - padding;
    const maxY = window.innerHeight - buttonHeight - padding;
    
    setNoPosition({
      x: Math.floor(Math.random() * (maxX - padding)) + padding,
      y: Math.floor(Math.random() * (maxY - padding)) + padding,
    });
  };

  const handleAccept = () => {
    setAccepted(true);

    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 50 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    });

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 text-slate-800 font-sans selection:bg-sky-200">
      
      {/* --- Floating Background --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {isClient && floaters.map((item) => (
          <motion.div
            key={item.id}
            className="absolute text-sky-300" 
            style={{
              left: `${item.left}%`,
              top: `${item.top}%`,
              width: `${item.size}px`,
            }}
            animate={{
              y: [0, -150],
              opacity: [0, 0.7, 0],
              x: [0, Math.sin(item.id) * 60]
            }}
            transition={{
              duration: item.duration,
              repeat: Infinity,
              delay: item.delay,
              ease: "linear",
            }}
          >
            {item.type === 'cinna' ? (
              <img src={item.imgSrc} alt="floating cinna" className="w-full h-auto object-contain drop-shadow-md" />
            ) : item.type === 'cloud' ? (
              <CloudIcon />
            ) : (
              <HeartIcon />
            )}
          </motion.div>
        ))}
      </div>

      {/* --- Main Card Container --- */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-12">
        <motion.div
          layout
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="relative w-full max-w-3xl overflow-hidden rounded-[2.5rem] border border-white/80 bg-white/50 p-8 text-center shadow-[0_30px_60px_-15px_rgba(186,230,253,0.5)] backdrop-blur-xl md:p-14"
        >
          {/* Decorative Sparkles on Card */}
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} 
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute top-6 left-8 text-sky-400 w-8 h-8"
          >
            <SparkleIcon />
          </motion.div>
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} 
            transition={{ repeat: Infinity, duration: 2.5, delay: 0.5 }}
            className="absolute bottom-8 right-8 text-indigo-300 w-6 h-6"
          >
            <SparkleIcon />
          </motion.div>

          <div className="flex flex-col items-center gap-8">
            
            {/* Image Section */}
            <AnimatePresence mode="wait">
              {!accepted ? (
                <motion.div
                  key="question-img"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0, rotate: -10 }}
                  transition={{ duration: 0.5 }}
                  className="relative"
                >
                  <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
                    <Image src="/images/cinna.png" alt="Cinnamoroll Asking" width={240} height={240} priority className="drop-shadow-2xl" />
                  </motion.div>
                  <motion.div
                    className="absolute -right-2 top-4 text-sky-400"
                    animate={{ y: [0, -15, 0], opacity: [0, 1, 0], scale: [0.8, 1, 0.8] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  >
                    <HeartIcon className="w-8 h-8" />
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="success-img"
                  initial={{ scale: 0.5, opacity: 0, rotate: 10 }}
                  animate={{ scale: 1.2, opacity: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="relative"
                >
                  <Image src="/images/Cinnamoroll.png" alt="Happy Cinnamoroll" width={280} height={280} priority className="drop-shadow-2xl" />
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }} className="absolute -top-4 -right-4 text-pink-400 w-10 h-10">
                      <HeartIcon />
                   </motion.div>
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4 }} className="absolute bottom-0 -left-6 text-sky-400 w-8 h-8">
                      <HeartIcon />
                   </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Text Content */}
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-sky-600"
              >
                <SparkleIcon className="w-3 h-3" />
                {accepted ? "Celebration Time!" : "Special Invite"}
                <SparkleIcon className="w-3 h-3" />
              </motion.div>

              <motion.h1 layout className="font-serif text-4xl font-extrabold leading-tight text-sky-950 md:text-6xl">
                {accepted ? "I Love You Bebi!" : "Will you be my Valentine?"}
              </motion.h1>

              {!accepted && (
                <p className="text-lg text-slate-500 md:text-xl font-medium">
                  Say yes… because ‘no’ isn’t allowed 😉
                </p>
              )}
            </div>

            {/* Buttons Area */}
            {!accepted && (
              <div className="flex flex-wrap items-center justify-center gap-6 mt-4 relative z-20">
                {/* UPDATED YES BUTTON: 
                  - Default: Sky Blue Gradient
                  - Hover: RED Gradient + Red Shadow
                  - Transition: Smooth color fade
                */}
                <motion.button
                  whileHover={{ y: -2 }} 
                  whileTap={{ scale: 0.95 }}
                  animate={{ 
                    scale: [1, 1.05, 1],
                    rotate: [0, -1, 1, 0] 
                  }}
                  transition={{ 
                    scale: { duration: 0.15 }, 
                    default: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
                  }}
                  onClick={handleAccept}
                  className="relative group px-12 py-5 bg-gradient-to-br from-sky-400 to-blue-600 hover:from-red-500 hover:to-rose-600 text-white rounded-full font-extrabold text-2xl shadow-[0px_10px_30px_rgba(56,189,248,0.6)] hover:shadow-[0px_10px_30px_rgba(225,29,72,0.6)] border-[6px] border-white overflow-visible transition-all duration-300"
                >
                  {/* Gloss Shine */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-gradient-to-b from-white/40 to-transparent rounded-full blur-[2px]" />
                  
                  <span className="relative flex items-center gap-3 drop-shadow-sm">
                    YES <HeartIcon className="w-8 h-8 fill-sky-100 group-hover:fill-rose-100 animate-pulse transition-colors duration-300" />
                  </span>
                </motion.button>

                {!noMoved && (
                   <motion.button
                     onMouseEnter={moveNoButton}
                     className="rounded-full border border-sky-100 bg-white/90 backdrop-blur-sm px-10 py-4 text-xl font-bold text-slate-400 shadow-lg hover:bg-sky-50 transition-colors whitespace-nowrap"
                   >
                     No
                   </motion.button>
                )}
              </div>
            )}

            {/* Success Animation */}
            <AnimatePresence>
              {accepted && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="w-full">
                  <div className="flex justify-center items-end gap-2 md:gap-8 h-64 overflow-visible px-4 pt-10">
                    <Tulip color="text-sky-300" leafColor="bg-emerald-300" delay={0.2} />
                    <Tulip color="text-blue-400" leafColor="bg-emerald-400" delay={0.4} />
                    <Tulip color="text-indigo-300" leafColor="bg-teal-400" delay={0.6} />
                    <Tulip color="text-sky-100" leafColor="bg-emerald-300" delay={0.8} />
                    <Tulip color="text-blue-200" leafColor="bg-teal-300" delay={1.0} />
                  </div>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="mt-8 flex flex-col items-center justify-center gap-2 text-slate-400">
                      <p className="text-sm font-medium uppercase tracking-widest">Forever & Always</p>
                      <div className="flex gap-2">
                         <HeartIcon className="w-4 h-4 text-sky-300" />
                         <HeartIcon className="w-4 h-4 text-blue-400" />
                         <HeartIcon className="w-4 h-4 text-indigo-300" />
                      </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* FLYING NO BUTTON (Actual) */}
      {!accepted && noMoved && (
        <motion.button
          ref={noButtonRef}
          initial={{ x: noPosition.x, y: noPosition.y }}
          animate={{ x: noPosition.x, y: noPosition.y }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          onMouseEnter={moveNoButton}
          onClick={moveNoButton}
          style={{ position: 'fixed', left: 0, top: 0, zIndex: 9999 }}
          className="rounded-full border border-sky-100 bg-white/90 backdrop-blur-sm px-10 py-4 text-xl font-bold text-slate-400 shadow-lg hover:bg-sky-50 transition-colors whitespace-nowrap"
        >
          No
        </motion.button>
      )}
    </div>
  );
}