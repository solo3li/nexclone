"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto pb-20">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pt-4 px-4">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">Hello, Sarah!</h1>
          <p className="text-slate-600 font-medium mt-1">AI SaaS web application dashboard</p>
        </div>
        <div className="clay-btn-peach clay-pill px-4 py-2 flex items-center space-x-4 mt-4 md:mt-0 relative">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-white/40 flex items-center justify-center font-bold text-slate-800 shadow-sm">
              S
            </div>
            <span className="font-bold text-slate-800 pr-2">Sarah J.</span>
          </div>
          <div className="relative cursor-pointer">
            <i className="fas fa-bell text-slate-700 text-lg"></i>
            <span className="absolute -top-1 -right-1 bg-red-400 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-[#faccae]">3</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-4">
        
        {/* Left Column (Workspace & Activities) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Your Workspace */}
          <div className="clay-card-peach p-8 pb-10">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Your Workspace</h2>
            
            <div className="flex space-x-6 mb-8 justify-center sm:justify-start">
              <div className="flex flex-col items-center">
                <Link href="/text-to-voice" className="w-16 h-16 clay-btn-peach clay-pill flex items-center justify-center mb-2 hover:-translate-y-1 transition-transform">
                  <div className="w-10 h-10 bg-white/40 rounded-full flex items-center justify-center text-orange-600 shadow-sm">
                    <i className="fas fa-file-alt text-lg"></i>
                  </div>
                </Link>
                <span className="text-sm font-bold text-slate-800">ContentGen</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-16 h-16 clay-btn-peach clay-pill flex items-center justify-center mb-2 hover:-translate-y-1 transition-transform cursor-pointer">
                  <div className="w-10 h-10 bg-white/40 rounded-full flex items-center justify-center text-green-600 shadow-sm">
                    <i className="fas fa-image text-lg"></i>
                  </div>
                </div>
                <span className="text-sm font-bold text-slate-800">Image AI</span>
              </div>

              <div className="flex flex-col items-center">
                <Link href="/voice-to-text" className="w-16 h-16 clay-btn-peach clay-pill flex items-center justify-center mb-2 hover:-translate-y-1 transition-transform">
                  <div className="w-10 h-10 bg-white/40 rounded-full flex items-center justify-center text-blue-600 shadow-sm">
                    <i className="fas fa-microphone text-lg"></i>
                  </div>
                </Link>
                <span className="text-sm font-bold text-slate-800">Voice AI</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <div className="flex justify-between text-sm font-bold text-slate-800 mb-2">
                  <span>75% Credits</span>
                </div>
                <div className="h-3 clay-inset-peach w-full relative overflow-hidden">
                  <div className="absolute top-0 left-0 h-full w-[75%] clay-btn bg-orange-400 clay-pill"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm font-bold text-slate-800 mb-2">
                  <span>45% Space</span>
                </div>
                <div className="h-3 clay-inset-peach w-full relative overflow-hidden">
                  <div className="absolute top-0 left-0 h-full w-[45%] clay-btn bg-green-400 clay-pill"></div>
                </div>
              </div>
            </div>

            <button className="w-full clay-btn py-4 clay-pill font-bold text-slate-800 flex items-center justify-center text-lg hover:-translate-y-1">
              <i className="fas fa-box-open text-orange-400 mr-3 text-xl"></i> New Project
            </button>
          </div>

          {/* Recent Activities */}
          <div className="clay-card p-8">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Recent Activities</h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 clay-btn clay-pill flex items-center justify-center bg-[#faccae] text-orange-600">
                    <i className="fas fa-file-alt"></i>
                  </div>
                  <span className="font-bold text-slate-800">AI Article Draft</span>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="w-6 h-6 rounded-full bg-green-200 flex items-center justify-center text-green-600 shadow-inner">
                    <i className="fas fa-check text-[10px]"></i>
                  </div>
                  <span className="text-slate-600 font-medium">35 min</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 clay-btn clay-pill flex items-center justify-center bg-[#a0bfe8] text-blue-600">
                    <i className="fas fa-search"></i>
                  </div>
                  <span className="font-bold text-slate-800">SEO Analysis</span>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="w-6 h-6 rounded-full bg-red-200 flex items-center justify-center text-red-500 shadow-inner">
                    <i className="fas fa-exclamation text-[10px]"></i>
                  </div>
                  <span className="text-slate-600 font-medium">12 min</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 clay-btn clay-pill flex items-center justify-center bg-[#b2e2cd] text-green-600">
                    <i className="fas fa-image"></i>
                  </div>
                  <span className="font-bold text-slate-800">Image Set</span>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center text-blue-600 shadow-inner">
                    <i className="fas fa-check text-[10px]"></i>
                  </div>
                  <span className="text-slate-600 font-medium">3 min</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column (Charts) */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* AI Performance */}
          <div className="clay-card p-8 h-72 relative">
            <h2 className="text-xl font-bold text-slate-800 mb-6">AI Performance</h2>
            <div className="absolute bottom-6 left-8 right-8 top-20 flex">
               {/* Decorative elements representing the 3D charts */}
               <div className="w-full h-full border-l-2 border-b-2 border-slate-300 relative">
                 {/* Fake 3D wavy line 1 (Peach) */}
                 <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="absolute bottom-0 w-full h-[80%] opacity-80" style={{filter: 'drop-shadow(4px 4px 6px rgba(0,0,0,0.15))'}}>
                    <path d="M0,50 L0,30 Q15,10 30,30 T60,10 T100,20 L100,50 Z" fill="#faccae"/>
                 </svg>
                 {/* Fake 3D wavy line 2 (Blue) */}
                 <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="absolute bottom-0 w-full h-[60%] opacity-90" style={{filter: 'drop-shadow(4px 4px 6px rgba(0,0,0,0.15))'}}>
                    <path d="M0,50 L0,40 Q15,45 30,25 T60,40 T100,20 L100,50 Z" fill="#9bbce3"/>
                 </svg>
               </div>
            </div>
            <div className="absolute left-2 top-20 bottom-8 flex flex-col justify-between text-xs font-bold text-slate-500">
              <span>100</span><span>80</span><span>60</span><span>40</span><span>20</span><span>0</span>
            </div>
            <div className="absolute bottom-2 left-10 right-8 flex justify-between text-xs font-bold text-slate-600">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Day</span>
            </div>
          </div>

          {/* Project Breakdown */}
          <div className="clay-card p-8 h-72 relative">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Project Breakdown</h2>
            <div className="absolute inset-0 flex items-center justify-center mt-10">
              <div className="w-40 h-40 rounded-full border-[20px] border-[#f7f4ef] clay-btn relative" style={{boxShadow: 'inset 6px 6px 12px #dacdc0, inset -6px -6px 12px #ffffff, 6px 6px 12px #dacdc0'}}>
                 {/* Decorative colorful segments representing the doughnut chart */}
                 <div className="absolute top-[-20px] left-[-20px] right-[-20px] bottom-[-20px] rounded-full border-[20px] border-t-[#faccae] border-r-[#fcd784] border-b-[#9bbce3] border-l-[#b2e2cd]" style={{filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.1))'}}></div>
              </div>
            </div>
            {/* Labels */}
            <div className="absolute top-16 left-8 text-center">
              <div className="text-sm font-bold text-slate-600">Content</div>
              <div className="text-lg font-extrabold text-slate-800">40%</div>
            </div>
            <div className="absolute top-24 right-8 text-center">
              <div className="text-sm font-bold text-slate-600">Design</div>
              <div className="text-lg font-extrabold text-slate-800">30%</div>
            </div>
            <div className="absolute bottom-6 right-10 text-center">
              <div className="text-sm font-bold text-slate-600">Marketing</div>
              <div className="text-lg font-extrabold text-slate-800">10%</div>
            </div>
            <div className="absolute bottom-6 left-12 text-center">
              <div className="text-sm font-bold text-slate-600">Voice</div>
              <div className="text-lg font-extrabold text-slate-800">20%</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
