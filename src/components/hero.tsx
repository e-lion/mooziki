"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Music, DollarSign, Zap, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

interface DJHeroSectionProps {
  className?: string;
}

const DJHeroSection: React.FC<DJHeroSectionProps> = ({ className = '' }) => {
  const contentWrapperRef = useRef<HTMLDivElement>(null);
  const [activeWord, setActiveWord] = useState(0);

  const words = ['REQUEST', 'VIBE', 'PARTY'];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveWord((prev) => (prev + 1) % words.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const contentWrapper = contentWrapperRef.current;
    if (!contentWrapper) return;
    const handleMouseMoveForParallax = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = clientX / window.innerWidth - 0.5;
      const y = clientY / window.innerHeight - 0.5;
      const parallaxFactor = 15;
      contentWrapper.style.transform = `translate3d(${-x * parallaxFactor}px, ${-y * parallaxFactor}px, 0)`;
    };
    window.addEventListener('mousemove', handleMouseMoveForParallax);
    return () => {
      window.removeEventListener('mousemove', handleMouseMoveForParallax);
    };
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  return (
    <div className={`relative w-full min-h-screen bg-transparent text-white overflow-hidden ${className}`}>
      <motion.div
        ref={contentWrapperRef}
        className="relative z-10 w-full min-h-screen flex flex-col"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.header className="py-6 px-4 md:px-8" variants={itemVariants}>
          <nav className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Music className="w-8 h-8 text-purple-500" />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Mooziki
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium">
              <a href="#features" className="hover:text-purple-400 transition-colors">
                Features
              </a>
              <a href="#pricing" className="hover:text-purple-400 transition-colors">
                Pricing
              </a>
              <a href="#djs" className="hover:text-purple-400 transition-colors">
                For DJs
              </a>
            </div>
            <Button variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white">
              Sign In
            </Button>
          </nav>
        </motion.header>

        <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-8 py-12">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div variants={itemVariants} className="mb-6">
              <Badge className="bg-purple-500/20 text-purple-300 border border-purple-500/50 px-4 py-1.5 text-sm">
                <Zap className="w-4 h-4 mr-2 inline" />
                Live Now
              </Badge>
            </motion.div>

            <motion.h1
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight"
              variants={itemVariants}
            >
              <span className="block">YOUR SONG,</span>
              <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={activeWord}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-block"
                  >
                    YOUR {words[activeWord]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </motion.h1>

            <motion.p
              className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-10"
              variants={itemVariants}
            >
              Request songs instantly at your favorite venues. Pay a small fee, skip the line, and hear your track played live by the DJ.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              variants={itemVariants}
            >
              <Link href="/login">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-white text-black hover:bg-zinc-200 h-14 px-8 text-lg font-medium shadow-lg shadow-white/10"
                >
                  Request a Song
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800 h-14 px-8 text-lg font-medium backdrop-blur-sm"
                >
                  <Music className="w-5 h-5 mr-2" />
                  I'm a DJ
                </Button>
              </Link>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16" // Added mt-16 to maintain spacing
              variants={containerVariants}
            >
              <motion.div
                variants={itemVariants}
                className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6 hover:border-purple-500/50 transition-all text-left"
              >
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
                  <DollarSign className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Pay Per Request</h3>
                <p className="text-sm text-zinc-400">
                  Simple pricing. Pay only when you want to hear your song. No subscriptions.
                </p>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6 hover:border-pink-500/50 transition-all text-left"
              >
                <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-pink-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Instant Queue</h3>
                <p className="text-sm text-zinc-400">
                  Your request goes straight to the DJ's queue. No waiting, no hassle.
                </p>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6 hover:border-blue-500/50 transition-all text-left"
              >
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Live Updates</h3>
                <p className="text-sm text-zinc-400">
                  Track your request in real-time and see when it's about to play.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </main>
      </motion.div>
    </div>
  );
};

export default DJHeroSection;
