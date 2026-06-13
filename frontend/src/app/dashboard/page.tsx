"use client";

import Link from "next/link";

export default function DashboardHome() {
  const tools = [
    { name: "Background Remover", desc: "Remove backgrounds from images instantly.", href: "/dashboard/tools/bg-remover", icon: "🖼️", color: "from-blue-500 to-indigo-500" },
    { name: "GPT Assistant", desc: "Chat with an advanced AI model.", href: "/dashboard/tools/gpt", icon: "💬", color: "from-emerald-500 to-teal-500" },
    { name: "Voice to Text", desc: "Transcribe audio into text.", href: "/dashboard/tools/voice-to-text", icon: "🎙️", color: "from-purple-500 to-pink-500" },
    { name: "Text to Voice", desc: "Generate speech from text.", href: "/dashboard/tools/text-to-voice", icon: "🔊", color: "from-orange-500 to-red-500" },
    { name: "Image to Text", desc: "Extract text from images (OCR).", href: "/dashboard/tools/img-to-txt", icon: "📄", color: "from-cyan-500 to-blue-500" },
    { name: "Video Caption", desc: "Add subtitles to your videos.", href: "/dashboard/tools/video-caption", icon: "🎬", color: "from-fuchsia-500 to-purple-500" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Welcome to your Dashboard</h1>
        <p className="text-slate-400">Select an AI tool to get started with your creative workflow.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <Link key={tool.name} href={tool.href} className="group block">
            <div className="relative p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 transition-all h-full overflow-hidden">
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${tool.color} rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity`} />
              
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  {tool.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{tool.name}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">{tool.desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
