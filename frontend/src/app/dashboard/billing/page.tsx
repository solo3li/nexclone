"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";

interface Plan {
  id: number;
  name: string;
  priceUsd: number;
  priceEgp: number;
  durationDays: number;
  monthlyCredits: number;
  allowedTools: string;
}

export default function Billing() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await api.get('/api/platform/plans');
        setPlans(res.data);
      } catch (error) {
        console.error("Failed to fetch plans", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-white mb-4">Simple, transparent pricing</h1>
        <p className="text-slate-400 text-lg">No hidden fees. No surprise charges. Upgrade whenever you're ready.</p>
      </div>

      {loading ? (
        <div className="text-center text-white">Loading plans...</div>
      ) : (

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, index) => {
          let parsedTools: string[] = [];
          try {
            parsedTools = JSON.parse(plan.allowedTools || "[]");
          } catch (e) {
            console.error("Failed to parse allowedTools for plan", plan.id);
          }

          const isPopular = index === 1; // Highlight the middle plan usually

          return (
            <div 
              key={plan.id} 
              className={`relative p-8 rounded-3xl bg-white/5 border ${
                isPopular ? 'border-indigo-500 shadow-[0_0_40px_rgba(79,70,229,0.2)]' : 'border-white/10'
              } flex flex-col`}
            >
              {isPopular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 rounded-full bg-indigo-500 text-white text-xs font-bold tracking-wider uppercase">
                  Most Popular
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-extrabold text-white">${plan.priceUsd}</span>
                  <span className="text-slate-400">/{plan.durationDays} days</span>
                </div>
                <p className="text-slate-400 text-sm">Includes {plan.monthlyCredits} Credits</p>
              </div>

              <ul className="space-y-4 mb-8 flex-1 text-slate-300 text-sm">
                <li className="flex items-center gap-3">
                  <span className="text-indigo-400">✓</span>
                  Access to {parsedTools.length} tools
                </li>
                {parsedTools.map((tool, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="text-indigo-400">✓</span>
                    {tool}
                  </li>
                ))}
              </ul>

              <button 
                className={`w-full py-3 rounded-xl font-bold transition-all ${
                  isPopular 
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white' 
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                Subscribe Now
              </button>
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
}
