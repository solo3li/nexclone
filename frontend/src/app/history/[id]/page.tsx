"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function HistoryDetail() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-fade-in">
      
      <Link href="/history" className="inline-flex items-center space-x-2 text-sm text-[var(--color-bento-muted)] hover:text-white mb-6 transition-colors group">
        <i className="fas fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
        <span>Back to History</span>
      </Link>

      <div className="bento-card p-8">
        <div className="flex justify-between items-start mb-6 border-b border-[var(--color-bento-border)] pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">Generation Details</h1>
            <p className="text-[var(--color-bento-muted)] font-mono text-sm">ID: {id}</p>
          </div>
          <span className="px-3 py-1.5 bg-green-500/10 text-green-400 font-bold text-xs rounded border border-green-500/20 uppercase tracking-wider">
            Completed
          </span>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#0a0a0a] p-4 rounded-xl border border-[var(--color-bento-border)]">
              <span className="text-xs text-[#52525b] uppercase font-bold tracking-wider block mb-1">Type</span>
              <span className="text-white font-bold text-sm">Text-to-Voice</span>
            </div>
            <div className="bg-[#0a0a0a] p-4 rounded-xl border border-[var(--color-bento-border)]">
              <span className="text-xs text-[#52525b] uppercase font-bold tracking-wider block mb-1">Date</span>
              <span className="text-white font-bold text-sm">24 Oct 2024</span>
            </div>
            <div className="bg-[#0a0a0a] p-4 rounded-xl border border-[var(--color-bento-border)]">
              <span className="text-xs text-[#52525b] uppercase font-bold tracking-wider block mb-1">Duration</span>
              <span className="text-white font-bold text-sm">1:24</span>
            </div>
            <div className="bg-[#0a0a0a] p-4 rounded-xl border border-[var(--color-bento-border)]">
              <span className="text-xs text-[#52525b] uppercase font-bold tracking-wider block mb-1">Model</span>
              <span className="text-white font-bold text-sm">Aurora v2</span>
            </div>
          </div>

          <div>
            <h3 className="text-white font-bold mb-3">Prompt / Content</h3>
            <div className="bg-[#0a0a0a] p-4 rounded-xl border border-[var(--color-bento-border)] text-sm text-[var(--color-bento-muted)] leading-relaxed">
              "Welcome to the future of AI generation. This is a sample text representing the content that was processed in this operation. You can download the resulting audio file or regenerate using the same parameters."
            </div>
          </div>

          <div className="pt-6 border-t border-[var(--color-bento-border)] flex space-x-3">
            <button className="bento-btn-primary px-6 py-3 text-sm flex items-center space-x-2">
              <i className="fas fa-play"></i>
              <span>Play Result</span>
            </button>
            <button className="bento-btn px-6 py-3 text-sm flex items-center space-x-2">
              <i className="fas fa-download"></i>
              <span>Download MP3</span>
            </button>
            <button className="bento-btn px-6 py-3 text-sm flex items-center space-x-2 border-red-500/20 text-red-400 hover:bg-red-500/10">
              <i className="fas fa-trash"></i>
              <span>Delete</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
