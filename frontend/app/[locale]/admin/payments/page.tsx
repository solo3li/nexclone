"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocale } from 'next-intl';
import { Check, X, Eye } from 'lucide-react';
import Sidebar from '@/components/AdminSidebar';

interface PendingPayment {
  id: number;
  amount: number;
  currency: string;
  receiptUrl: string;
  createdAt: string;
  userEmail: string;
  planName: string;
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PendingPayment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const fetchPayments = async () => {
    try {
      setIsLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      const token = localStorage.getItem('token');
      const response = await axios.get(`${apiUrl}/api/ManualPayments/pending`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPayments(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleAction = async (id: number, action: 'approve' | 'reject') => {
    if (!confirm(`Are you sure you want to ${action} this payment?`)) return;
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      const token = localStorage.getItem('token');
      await axios.post(`${apiUrl}/api/ManualPayments/${id}/${action}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Refresh the list
      fetchPayments();
    } catch (error) {
      console.error(error);
      alert('Action failed');
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">{isRtl ? 'المدفوعات اليدوية المعلقة' : 'Pending Manual Payments'}</h1>

        {isLoading ? (
          <div>Loading...</div>
        ) : payments.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center text-gray-400">
            {isRtl ? 'لا توجد مدفوعات معلقة.' : 'No pending payments.'}
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
            <table className="w-full text-left" dir={isRtl ? 'rtl' : 'ltr'}>
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="p-4">{isRtl ? 'المستخدم' : 'User'}</th>
                  <th className="p-4">{isRtl ? 'الباقة' : 'Plan'}</th>
                  <th className="p-4">{isRtl ? 'المبلغ' : 'Amount'}</th>
                  <th className="p-4">{isRtl ? 'التاريخ' : 'Date'}</th>
                  <th className="p-4 text-center">{isRtl ? 'الإيصال' : 'Receipt'}</th>
                  <th className="p-4 text-center">{isRtl ? 'إجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {payments.map(payment => (
                  <tr key={payment.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="p-4">{payment.userEmail}</td>
                    <td className="p-4">{payment.planName}</td>
                    <td className="p-4">{payment.amount} {payment.currency}</td>
                    <td className="p-4 text-sm text-gray-400">{new Date(payment.createdAt).toLocaleString()}</td>
                    <td className="p-4 text-center">
                      <a href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}${payment.receiptUrl}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 bg-blue-400/10 px-3 py-1.5 rounded-lg">
                        <Eye className="w-4 h-4" /> {isRtl ? 'عرض' : 'View'}
                      </a>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => handleAction(payment.id, 'approve')}
                          className="p-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-lg"
                          title={isRtl ? 'موافقة' : 'Approve'}
                        >
                          <Check className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleAction(payment.id, 'reject')}
                          className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg"
                          title={isRtl ? 'رفض' : 'Reject'}
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
