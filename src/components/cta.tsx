"use client";

import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="relative py-24 bg-transparent overflow-hidden" id="djs">

      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8">
        <div className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 md:p-16 text-center shadow-2xl overflow-hidden relative">
          
          <div className="relative z-20 flex flex-col items-center">
            <div className="bg-purple-500/20 p-3 rounded-2xl mb-6">
              <Sparkles className="w-8 h-8 text-purple-400" />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Ready to Monetize Your Sets?
            </h2>
            
            <p className="text-xl text-zinc-400 max-w-2xl mb-10 leading-relaxed">
              Join hundreds of professional DJs who are already increasing their earnings and engaging their crowds with Mooziki.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link href="/login" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto bg-white text-black hover:bg-zinc-200 h-14 px-8 text-lg font-medium shadow-lg shadow-white/10 transition-all hover:scale-105"
                >
                  Join as a DJ
                </Button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800 h-14 px-8 text-lg font-medium backdrop-blur-sm transition-all hover:scale-105"
                >
                  Get the App
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
