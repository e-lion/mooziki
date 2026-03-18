"use client";

import React from 'react';
import { Music, DollarSign, ListOrdered, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  step: number;
}

function FeatureCard({ icon, title, description, step }: FeatureCardProps) {
  return (
    <div className="group relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl -z-10" />
        
        <div className="flex items-start gap-4 mb-6">
          <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            {icon}
          </div>
          <div className="flex-shrink-0 w-8 h-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold text-white/60">{step}</span>
          </div>
        </div>
        
        <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
        <p className="text-gray-400 leading-relaxed flex-grow">{description}</p>
        
        <div className="mt-6 flex items-center gap-2 text-sm text-blue-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span>Learn more</span>
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function DJAppFeatures() {
  const features = [
    {
      icon: <Music className="w-7 h-7 text-white" />,
      title: "Request",
      description: "Guests can easily browse your music library and request their favorite songs in real-time. Create an interactive experience that keeps the dance floor packed.",
      step: 1,
    },
    {
      icon: <ListOrdered className="w-7 h-7 text-white" />,
      title: "Queue",
      description: "Manage all song requests in one organized queue. Prioritize tracks, see what's coming up next, and maintain perfect flow throughout your event.",
      step: 2,
    },
    {
      icon: <DollarSign className="w-7 h-7 text-white" />,
      title: "Cash Out",
      description: "Accept tips and payments seamlessly through the app. Track your earnings in real-time and get paid faster with integrated payment processing.",
      step: 3,
    },
  ];

  return (
    <div className="relative min-h-screen w-full bg-transparent overflow-hidden py-20" id="features">

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full mb-6">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-sm text-gray-300 font-medium">How It Works</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
            Elevate Your DJ Experience
          </h2>
          <p className="text-xl text-gray-400 leading-relaxed">
            Transform the way you interact with your audience. Three simple steps to create unforgettable events.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              step={feature.step}
            />
          ))}
        </div>

        <div className="mt-16 flex items-center justify-center gap-4">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 border-2 border-black flex items-center justify-center"
              >
                <Check className="w-5 h-5 text-white" />
              </div>
            ))}
          </div>
          <p className="text-gray-400">
            Trusted by <span className="text-white font-semibold">2,500+</span> professional DJs
          </p>
        </div>
      </div>
    </div>
  );
}

export default DJAppFeatures;
