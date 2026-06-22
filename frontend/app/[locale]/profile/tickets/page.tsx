"use client";
import { useEffect, useState } from "react";
import api from "@/utils/api";
import { useAppStore } from "@/store/useAppStore";
import { Link } from "@/i18n/routing";
import { useRouter } from "next/navigation";

export default function TicketsList() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const { isAuthenticated } = useAppStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      fetchTickets();
    }
  }, [isAuthenticated]);

  const fetchTickets = async () => {
    try {
      const res = await api.get("/api/tickets");
      setTickets(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/api/tickets", { subject, message });
      setShowCreate(false);
      router.push(`/profile/tickets/${res.data.id}` as any);
    } catch (err) {
      console.error(err);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="bg-white/5 border border-white/10 p-8 rounded-3xl">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-white">Support Tickets</h2>
        <button 
          onClick={() => setShowCreate(!showCreate)}
          className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl transition-colors font-medium text-sm"
        >
          {showCreate ? "Cancel" : "New Ticket"}
        </button>
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="bg-white/5 border border-white/10 p-6 rounded-2xl mb-8 flex flex-col gap-4">
          <input 
            type="text" 
            placeholder="Subject" 
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50"
          />
          <textarea 
            placeholder="How can we help you?" 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={4}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 resize-none"
          />
          <button type="submit" className="self-end px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl transition-colors font-medium text-sm">
            Submit Ticket
          </button>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : tickets.length === 0 ? (
        <p className="text-center text-white/40 py-12">You have no support tickets.</p>
      ) : (
        <div className="space-y-4">
          {tickets.map(ticket => (
            <Link href={`/profile/tickets/${ticket.id}` as any} key={ticket.id} className="block group">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-violet-500/50 transition-colors flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-violet-400 transition-colors">
                    {ticket.subject}
                  </h3>
                  <div className="text-xs text-white/40">
                    Last updated: {new Date(ticket.updatedAt).toLocaleDateString()} at {new Date(ticket.updatedAt).toLocaleTimeString()}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    ticket.status === 'Open' ? 'bg-red-500/20 text-red-400' :
                    ticket.status === 'InProgress' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {ticket.status === 'InProgress' ? 'In Progress' : ticket.status}
                  </span>
                  <span className="text-violet-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
                    View →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
