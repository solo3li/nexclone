"use client";

import { motion } from "framer-motion";
import { Zap, Shield, Cpu, Layers } from "lucide-react";

const features = [
  {
    icon: <Zap className="w-6 h-6 text-blue-400" />,
    title: "Lightning Fast",
    description: "Optimized for speed and performance. Experience real-time generations without any lag."
  },
  {
    icon: <Shield className="w-6 h-6 text-purple-400" />,
    title: "Secure by Design",
    description: "Enterprise-grade security built-in. Your data is encrypted and protected at all times."
  },
  {
    icon: <Cpu className="w-6 h-6 text-green-400" />,
    title: "Advanced AI",
    description: "Powered by the latest models to deliver unparalleled precision and creativity."
  },
  {
    icon: <Layers className="w-6 h-6 text-orange-400" />,
    title: "Seamless Integration",
    description: "Connects flawlessly with your existing workflows and tools with our powerful API."
  }
];

export default function Features() {
  return (
    <section id="features" className="py-24 px-8 relative z-10 bg-black/50 backdrop-blur-sm border-t border-white/10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500"
          >
            Supercharge Your Workflow
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-gray-400 max-w-2xl mx-auto text-lg"
          >
            Discover the tools that will transform how you create, manage, and deploy your next big idea.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group cursor-default"
            >
              <div className="w-12 h-12 rounded-xl bg-black/50 flex items-center justify-center mb-6 border border-white/5 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
