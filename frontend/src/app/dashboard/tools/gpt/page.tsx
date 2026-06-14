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
    <div className="max-w-5xl mx-auto pb-20 h-[calc(100vh-2rem)] flex flex-col animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">GPT Assistant</h1>
        <p className="text-[var(--color-bento-muted)] mt-2">Ask questions, write content, or generate code.</p>
      </div>

      <div className="flex-1 bento-card p-6 flex flex-col overflow-hidden relative">
        {/* Chat window */}
        <div className="flex-1 overflow-y-auto space-y-6 mb-6 pr-4 scrollbar-hide">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg ${
                msg.role === 'user' ? 'bg-[#262626] text-white' : 'bg-teal-500/10 border border-teal-500/20 text-teal-400'
              }`}>
                {msg.role === 'user' ? <i className="fas fa-user text-sm"></i> : <i className="fas fa-robot text-sm"></i>}
              </div>
              <div className={`p-4 rounded-2xl max-w-[80%] text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-[#262626] text-white rounded-tr-sm shadow-md' 
                  : 'bg-[#0a0a0a] border border-[#262626] text-[var(--color-bento-text)] rounded-tl-sm'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center shadow-lg animate-pulse">
                <i className="fas fa-robot text-teal-400 text-sm"></i>
              </div>
              <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-[#262626] text-[var(--color-bento-muted)] rounded-tl-sm flex gap-2 items-center">
                <span className="w-2 h-2 rounded-full bg-teal-500/50 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-teal-500/50 animate-bounce" style={{ animationDelay: '0.2s' }} />
                <span className="w-2 h-2 rounded-full bg-teal-500/50 animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          )}
        </div>

        {/* Input box */}
        <form onSubmit={handleSend} className="relative mt-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="bento-input w-full pl-6 pr-16 py-4 rounded-2xl text-sm"
            placeholder="Type your message here..."
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-2 top-2 bottom-2 aspect-square rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center hover:bg-teal-500/20 disabled:opacity-50 transition-colors"
          >
            <i className="fas fa-paper-plane text-xs"></i>
          </button>
        </form>
      </div>
    </div>
  );
}
