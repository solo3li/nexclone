"use client";

import React, { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import Navbar from "../../../src/components/Navbar";
import { Send, Loader2, MessageSquare, AlertCircle } from 'lucide-react';
import api from '@/utils/api';

export default function SupportPage() {
  const locale = useLocale();
  const isRtl = locale === 'ar';
  
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await api.get('/api/tickets');
      setTickets(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      setError(isRtl ? 'يرجى ملء جميع الحقول' : 'Please fill all fields');
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      await api.post('/api/tickets', { subject, message });
      setSuccess(true);
      setSubject('');
      setMessage('');
      fetchTickets();
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      setError(err.response?.data?.message || (isRtl ? 'حدث خطأ أثناء إرسال التذكرة' : 'Error submitting ticket'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0015]" dir={isRtl ? 'rtl' : 'ltr'}>
      <Navbar />
      
      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-white mb-4">
            {isRtl ? 'الدعم الفني' : 'Support Tickets'}
          </h1>
          <p className="text-white/60">
            {isRtl ? 'تواصل مع فريق الدعم الفني لحل مشكلتك.' : 'Contact our support team to resolve your issue.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Submit Ticket Form */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-white mb-6">
              {isRtl ? 'فتح تذكرة جديدة' : 'Open a New Ticket'}
            </h2>
            
            {success && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl mb-6 text-sm">
                {isRtl ? 'تم إرسال التذكرة بنجاح! سنرد عليك قريباً.' : 'Ticket submitted successfully! We will get back to you soon.'}
              </div>
            )}
            
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-sm flex items-center gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">
                  {isRtl ? 'الموضوع' : 'Subject'}
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
                  placeholder={isRtl ? 'عن ماذا تستفسر؟' : 'What is your inquiry about?'}
                />
              </div>
              
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">
                  {isRtl ? 'التفاصيل' : 'Details'}
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all resize-none"
                  placeholder={isRtl ? 'اكتب تفاصيل مشكلتك هنا...' : 'Write the details of your issue here...'}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-violet-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {isRtl ? 'إرسال التذكرة' : 'Submit Ticket'}
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Previous Tickets */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm flex flex-col h-[500px]">
            <h2 className="text-xl font-bold text-white mb-6">
              {isRtl ? 'تذاكرك السابقة' : 'Your Previous Tickets'}
            </h2>
            
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
                </div>
              ) : tickets.length === 0 ? (
                <div className="text-center py-12 text-white/40">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>{isRtl ? 'لا يوجد لديك أي تذاكر سابقة' : 'You do not have any previous tickets'}</p>
                </div>
              ) : (
                tickets.map(ticket => (
                  <div key={ticket.id} className="bg-white/5 border border-white/10 p-4 rounded-xl">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-white font-medium truncate pr-4">{ticket.subject}</h3>
                      <span className={`text-[10px] px-2 py-1 rounded-full whitespace-nowrap ${
                        ticket.status === 'Open' ? 'bg-emerald-500/20 text-emerald-400' :
                        ticket.status === 'Closed' ? 'bg-gray-500/20 text-gray-400' :
                        'bg-violet-500/20 text-violet-400'
                      }`}>
                        {ticket.status}
                      </span>
                    </div>
                    <div className="text-xs text-white/40">
                      {new Date(ticket.createdAt).toLocaleDateString(isRtl ? 'ar-EG' : 'en-US')}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
