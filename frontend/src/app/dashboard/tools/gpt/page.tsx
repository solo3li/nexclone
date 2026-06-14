"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAiStore } from "../../../../store/useAiStore";
import { useAuthStore } from "../../../../store/useAuthStore";

export default function GPTAssistant() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! I am your AI assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { chatWithGpt } = useAiStore();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert("You must be logged in to use this tool.");
      router.push("/login");
      return;
    }
    if (!input.trim()) return;

    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const reply = await chatWithGpt(userMsg);
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch (err: any) {
      setMessages(prev => [...prev, { role: "assistant", content: `Error: ${err.message || 'Failed to communicate with GPT'}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">GPT Assistant</h1>
        <p className="text-slate-400">Ask questions, write content, or generate code.</p>
      </div>

      <div className="flex-1 bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col overflow-hidden">
        {/* Chat window */}
        <div className="flex-1 overflow-y-auto space-y-6 mb-6 pr-4 scrollbar-hide">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0 ${
                msg.role === 'user' ? 'bg-indigo-600' : 'bg-teal-500/20 text-teal-400'
              }`}>
                {msg.role === 'user' ? '👤' : '🤖'}
              </div>
              <div className={`p-4 rounded-2xl max-w-[80%] ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-white/10 text-slate-200 rounded-tl-none border border-white/10'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center text-xl animate-pulse">🤖</div>
              <div className="p-4 rounded-2xl bg-white/10 text-slate-400 rounded-tl-none border border-white/10 flex gap-2 items-center">
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          )}
        </div>

        {/* Input box */}
        <form onSubmit={handleSend} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="w-full pl-6 pr-16 py-4 rounded-2xl bg-black/40 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
            placeholder="Type your message here..."
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-2 top-2 bottom-2 aspect-square rounded-xl bg-teal-500 text-white flex items-center justify-center hover:bg-teal-400 disabled:opacity-50 disabled:hover:bg-teal-500 transition-colors"
          >
            ➤
          </button>
        </form>
      </div>
    </div>
  );
}
