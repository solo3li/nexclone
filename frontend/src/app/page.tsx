"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const [billingCycle, setBillingCycle] = useState("month");

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">Welcome back, Sarah! 👋</h1>
          <p className="text-gray-500 mt-1">Here is what&apos;s happening with your projects today.</p>
        </div>
        <div className="flex space-x-4">
          <button className="clay-btn w-12 h-12 flex items-center justify-center text-gray-600">
            <i className="fas fa-bell"></i>
          </button>
          <button className="clay-btn-primary px-6 py-3 font-bold text-sm">
            <i className="fas fa-plus mr-2"></i> New Project
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="clay-card-blue p-6 flex items-center space-x-4">
          <div className="w-14 h-14 rounded-full bg-blue-500 bg-opacity-20 flex items-center justify-center text-blue-600 text-xl">
            <i className="fas fa-bolt"></i>
          </div>
          <div>
            <p className="text-blue-800 text-sm font-bold opacity-80">Total Generations</p>
            <h3 className="text-3xl font-extrabold text-blue-900 mt-1">12,340</h3>
          </div>
        </div>

        <div className="clay-card-peach p-6 flex items-center space-x-4">
          <div className="w-14 h-14 rounded-full bg-orange-500 bg-opacity-20 flex items-center justify-center text-orange-600 text-xl">
            <i className="fas fa-coins"></i>
          </div>
          <div>
            <p className="text-orange-800 text-sm font-bold opacity-80">Credits Remaining</p>
            <h3 className="text-3xl font-extrabold text-orange-900 mt-1">4,120</h3>
          </div>
        </div>

        <div className="clay-card-green p-6 flex items-center space-x-4">
          <div className="w-14 h-14 rounded-full bg-green-500 bg-opacity-20 flex items-center justify-center text-green-600 text-xl">
            <i className="fas fa-clock"></i>
          </div>
          <div>
            <p className="text-green-800 text-sm font-bold opacity-80">Time Saved</p>
            <h3 className="text-3xl font-extrabold text-green-900 mt-1">45 hrs</h3>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Tools Section */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-gray-700 ml-2">Quick Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            <Link href="/text-to-voice" className="block group">
              <div className="clay-card p-6 h-full flex flex-col items-start transition-transform group-hover:-translate-y-2">
                <div className="w-12 h-12 rounded-2xl clay-btn flex items-center justify-center text-blue-500 text-xl mb-4">
                  <i className="fas fa-volume-up"></i>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Text to Speech</h3>
                <p className="text-gray-500 text-sm mb-4">Convert your written text into lifelike spoken audio in seconds.</p>
                <div className="mt-auto text-blue-600 text-sm font-bold flex items-center">
                  Try it now <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                </div>
              </div>
            </Link>

            <Link href="/voice-to-text" className="block group">
              <div className="clay-card p-6 h-full flex flex-col items-start transition-transform group-hover:-translate-y-2">
                <div className="w-12 h-12 rounded-2xl clay-btn flex items-center justify-center text-pink-500 text-xl mb-4">
                  <i className="fas fa-microphone"></i>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Voice to Text</h3>
                <p className="text-gray-500 text-sm mb-4">Transcribe your audio files or live recordings with high accuracy.</p>
                <div className="mt-auto text-pink-600 text-sm font-bold flex items-center">
                  Try it now <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                </div>
              </div>
            </Link>

          </div>
        </div>

        {/* Pricing/Upgrade Section */}
        <div className="space-y-6" id="pricing">
          <h2 className="text-xl font-bold text-gray-700 ml-2">Subscription</h2>
          
          <div className="clay-card-pink p-8 text-center relative overflow-hidden">
            <div className="absolute -top-10 -right-10 text-pink-200 opacity-50" style={{fontSize: '120px'}}>
              <i className="fas fa-crown"></i>
            </div>
            
            <h3 className="text-2xl font-extrabold text-pink-900 mb-2 relative z-10">Pro Plan</h3>
            <p className="text-pink-800 text-sm mb-6 relative z-10">Unlock unlimited generations and premium voices.</p>
            
            <div className="flex justify-center mb-6 relative z-10">
              <div className="clay-btn p-1 flex rounded-full">
                <button 
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${billingCycle === 'month' ? 'bg-pink-500 text-white shadow-lg' : 'text-gray-500'}`}
                  onClick={() => setBillingCycle('month')}
                >
                  Monthly
                </button>
                <button 
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${billingCycle === 'year' ? 'bg-pink-500 text-white shadow-lg' : 'text-gray-500'}`}
                  onClick={() => setBillingCycle('year')}
                >
                  Yearly
                </button>
              </div>
            </div>

            <div className="mb-6 relative z-10">
              <span className="text-4xl font-extrabold text-pink-900">${billingCycle === 'month' ? '29' : '290'}</span>
              <span className="text-pink-700 text-sm">/{billingCycle === 'month' ? 'mo' : 'yr'}</span>
            </div>

            <button className="clay-btn-primary w-full py-3 font-bold shadow-pink-500/50 relative z-10">
              Upgrade Now
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
