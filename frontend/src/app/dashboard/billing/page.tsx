"use client";

export default function Billing() {
  const plans = [
    {
      name: "Starter",
      price: "$0",
      period: "forever",
      desc: "Perfect for trying out NexMedia AI.",
      features: ["5 AI Image Generations", "10 GPT Queries", "Basic Background Removal", "Standard Support"],
      buttonText: "Current Plan",
      isPopular: false,
    },
    {
      name: "Pro",
      price: "$29",
      period: "per month",
      desc: "For content creators and professionals.",
      features: ["Unlimited AI Image Generations", "Unlimited GPT-4 Queries", "HD Background Removal", "Video Captioning (10hrs)", "Priority Support"],
      buttonText: "Upgrade to Pro",
      isPopular: true,
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "per month",
      desc: "For teams requiring scale and API access.",
      features: ["Everything in Pro", "API Access", "Custom AI Models", "Dedicated Account Manager", "SSO Authentication"],
      buttonText: "Contact Sales",
      isPopular: false,
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-white mb-4">Simple, transparent pricing</h1>
        <p className="text-slate-400 text-lg">No hidden fees. No surprise charges. Upgrade whenever you're ready.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div 
            key={plan.name} 
            className={`relative p-8 rounded-3xl bg-white/5 border ${
              plan.isPopular ? 'border-indigo-500 shadow-[0_0_40px_rgba(79,70,229,0.2)]' : 'border-white/10'
            } flex flex-col`}
          >
            {plan.isPopular && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 rounded-full bg-indigo-500 text-white text-xs font-bold tracking-wider uppercase">
                Most Popular
              </div>
            )}
            
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                <span className="text-slate-400">/{plan.period}</span>
              </div>
              <p className="text-slate-400 text-sm">{plan.desc}</p>
            </div>

            <ul className="space-y-4 mb-8 flex-1 text-slate-300 text-sm">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="text-indigo-400">✓</span>
                  {feature}
                </li>
              ))}
            </ul>

            <button 
              className={`w-full py-3 rounded-xl font-bold transition-all ${
                plan.isPopular 
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white' 
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              {plan.buttonText}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
