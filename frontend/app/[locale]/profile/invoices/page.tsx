'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Download, FileText, ArrowLeft, ArrowRight } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function MyInvoicesPage() {
  const { locale } = useParams();
  const router = useRouter();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const isRtl = locale === 'ar';

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push(`/${locale}/login`);
          return;
        }

        const res = await axios.get(`http://167.71.66.188:8080/api/invoices/my-invoices`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setInvoices(res.data.invoices || []);
      } catch (err) {
        console.error('Failed to fetch invoices', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoices();
  }, [locale, router]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-4 sm:p-6 lg:p-8" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-4xl mx-auto space-y-6">
        <button
          onClick={() => router.push(`/${locale}/profile`)}
          className="flex items-center gap-2 text-white/50 hover:text-white transition-colors"
        >
          {isRtl ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
          {isRtl ? "العودة للملف الشخصي" : "Back to Profile"}
        </button>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
              <FileText className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {isRtl ? "فواتيري الضريبية" : "My Tax Invoices"}
              </h1>
              <p className="text-white/50 mt-1">
                {isRtl ? "قائمة بجميع فواتير الاشتراكات الخاصة بك" : "A list of all your subscription invoices"}
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            </div>
          ) : invoices.length === 0 ? (
            <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/5">
              <FileText className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/60">
                {isRtl ? "لا توجد فواتير حالياً." : "No invoices found."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {invoices.map((invoice, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={invoice.invoiceNumber}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-white/40" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{invoice.invoiceNumber}</h3>
                      <p className="text-white/50 text-sm mt-1">
                        {new Date(invoice.date).toLocaleDateString(isRtl ? 'ar-EG' : 'en-US')} • {invoice.planName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6">
                    <div className="text-left sm:text-right">
                      <p className="font-bold text-indigo-400">
                        {invoice.totalAmount} {invoice.currency === 'EGP' ? (isRtl ? 'ج.م' : 'EGP') : invoice.currency}
                      </p>
                    </div>
                    {invoice.minioPdfUrl && (
                      <a
                        href={invoice.minioPdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-xl transition-colors shadow-lg shadow-indigo-500/20"
                      >
                        <Download size={18} />
                        <span className="hidden sm:inline">{isRtl ? "تحميل PDF" : "Download PDF"}</span>
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
