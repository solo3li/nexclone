"use client";
import { use, useEffect, useState, useRef } from "react";
import api from "@/utils/api";
import { useAppStore } from "@/store/useAppStore";
import { Link } from "@/i18n/routing";
import * as signalR from "@microsoft/signalr";

export default function TicketChat({ params }: { params: Promise<{ id: string }> }) {
  // Next.js 15: params is a Promise
  const { id } = use(params);

  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [sending, setSending] = useState(false);

  const { isAuthenticated } = useAppStore();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);

  useEffect(() => {
    if (isAuthenticated && id) {
      fetchTicket();
    }
  }, [isAuthenticated, id]);

  useEffect(() => {
    if (ticket && !connection) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const newConnection = new signalR.HubConnectionBuilder()
        .withUrl(`${apiUrl}/hubs/ticket`)
        .withAutomaticReconnect()
        .build();

      setConnection(newConnection);
    }
  }, [ticket]);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          connection.invoke("JoinTicketGroup", id);

          connection.on("ReceiveMessage", (msg: any) => {
            if (msg.senderName === "Admin") {
              setTicket((prev: any) => {
                if (!prev) return prev;
                if (prev.messages.some((m: any) => m.id === msg.id)) return prev;
                return {
                  ...prev,
                  messages: [...prev.messages, msg],
                };
              });
            }
          });
        })
        .catch((e) => console.error("Connection failed: ", e));

      return () => {
        connection.invoke("LeaveTicketGroup", id).then(() => connection.stop());
      };
    }
  }, [connection, id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ticket?.messages]);

  const fetchTicket = async () => {
    try {
      const res = await api.get(`/api/tickets/${id}`);
      setTicket(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!message.trim() && !attachment) || sending || ticket?.status === "Closed") return;

    setSending(true);
    try {
      const formData = new FormData();
      if (message.trim()) formData.append("content", message);
      if (attachment) formData.append("attachment", attachment);

      const res = await api.post(`/api/tickets/${id}/message`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setTicket((prev: any) => ({
        ...prev,
        messages: [...prev.messages, res.data],
      }));

      setMessage("");
      setAttachment(null);
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  if (!isAuthenticated) return null;

  if (loading) {
    return (
      <div className="bg-white/5 border border-white/10 p-8 rounded-3xl flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="bg-white/5 border border-white/10 p-8 rounded-3xl text-center py-20">
        <h2 className="text-2xl font-bold text-white mb-4">Ticket Not Found</h2>
        <Link href="/profile/tickets" className="text-violet-400 hover:text-violet-300">
          ← Back to tickets
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-3xl flex flex-col h-[700px] max-h-[80vh]">
      <div className="flex justify-between items-center mb-6 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link href="/profile/tickets" className="text-white/40 hover:text-white transition-colors">
              ←
            </Link>
            <h2 className="text-xl md:text-2xl font-bold text-white">
              Ticket #{ticket.id}: {ticket.subject}
            </h2>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              ticket.status === "Open"
                ? "bg-red-500/20 text-red-400"
                : ticket.status === "InProgress"
                ? "bg-yellow-500/20 text-yellow-400"
                : "bg-green-500/20 text-green-400"
            }`}
          >
            {ticket.status === "InProgress" ? "In Progress" : ticket.status}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-6 mb-6">
        {ticket.messages.map((msg: any) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.isAdminMessage ? "items-start" : "items-end"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl p-4 ${
                msg.isAdminMessage ? "bg-white/10 rounded-tl-none" : "bg-violet-600 rounded-tr-none"
              }`}
            >
              <div className="flex justify-between items-center gap-4 mb-2">
                <span
                  className={`text-xs font-bold ${
                    msg.isAdminMessage ? "text-violet-400" : "text-white/80"
                  }`}
                >
                  {msg.senderName}
                </span>
                <span className="text-[10px] text-white/50">
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </span>
              </div>

              {msg.content && (
                <p className="text-white text-sm whitespace-pre-wrap mb-2">{msg.content}</p>
              )}

              {msg.attachmentUrl && (
                <div className="mt-2">
                  {msg.attachmentType === "image" ? (
                    <a href={msg.attachmentUrl.startsWith('/') ? `${process.env.NEXT_PUBLIC_API_URL}${msg.attachmentUrl}` : msg.attachmentUrl} target="_blank" rel="noreferrer">
                      <img 
                        src={msg.attachmentUrl.startsWith('/') ? `${process.env.NEXT_PUBLIC_API_URL}${msg.attachmentUrl}` : msg.attachmentUrl}
                        alt="Attachment" 
                        className="max-w-xs rounded-xl border border-white/10"
                      />
                    </a>
                  ) : msg.attachmentType === "audio" ? (
                    <audio src={msg.attachmentUrl.startsWith('/') ? `${process.env.NEXT_PUBLIC_API_URL}${msg.attachmentUrl}` : msg.attachmentUrl} controls className="max-w-full h-10" />
                  ) : (
                    <a
                      href={msg.attachmentUrl.startsWith('/') ? `${process.env.NEXT_PUBLIC_API_URL}${msg.attachmentUrl}` : msg.attachmentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block px-4 py-2 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 text-sm text-blue-400"
                    >
                      📎 View Attachment
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {ticket.status !== "Closed" ? (
        <form
          onSubmit={handleSend}
          className="mt-auto bg-white/5 border border-white/10 p-3 rounded-2xl flex flex-col gap-3"
        >
          {attachment && (
            <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-xl text-xs text-white/80">
              📎 {attachment.name}
              <button
                type="button"
                onClick={() => setAttachment(null)}
                className="ml-auto text-red-400 hover:text-red-300"
              >
                ✕
              </button>
            </div>
          )}
          <div className="flex items-center gap-3">
            <label className="cursor-pointer p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-white/60 hover:text-white">
              <input
                type="file"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setAttachment(e.target.files[0]);
                  }
                }}
              />
              📎
            </label>
            <input
              type="text"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 bg-transparent border-none text-white focus:outline-none text-sm placeholder-white/30"
            />
            <button
              type="submit"
              disabled={(!message.trim() && !attachment) || sending}
              className="px-6 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-xl transition-colors text-sm font-semibold"
            >
              {sending ? "..." : "Send"}
            </button>
          </div>
        </form>
      ) : (
        <div className="mt-auto text-center p-4 bg-white/5 border border-white/10 rounded-2xl text-white/40 text-sm">
          This ticket has been closed.
        </div>
      )}
    </div>
  );
}
