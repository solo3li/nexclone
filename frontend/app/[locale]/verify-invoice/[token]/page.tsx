'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CheckCircle, XCircle, FileText, Download } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function VerifyInvoicePage() {
  const { token } = useParams();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (token) {
      axios.get(`http://167.71.66.188:8080/api/invoices/verify/${token}`)
        .then(res => {
          setData(res.data);
          setIsLoading(false);
        })
        .catch(err => {
          setIsError(true);
          setIsLoading(false);
        });
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center font-sans" dir="rtl">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-indigo-600 px-6 py-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white text-indigo-600 mb-4">
            <FileText size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white">التحقق من الفاتورة</h2>
          <p className="text-indigo-100 mt-2 text-sm">نظام NexMedia AI للفواتير الضريبية</p>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
              <p className="text-gray-500 dark:text-gray-400">جاري التحقق من الفاتورة...</p>
            </div>
          )}

          {isError && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <XCircle size={64} className="text-red-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">فاتورة غير صالحة</h3>
              <p className="text-gray-500 dark:text-gray-400">عذراً، لم نتمكن من العثور على هذه الفاتورة. قد يكون الرابط خاطئاً أو الفاتورة مزيفة.</p>
            </div>
          )}

          {data?.success && (
            <div className="animate-fade-in-up">
              <div className="flex flex-col items-center justify-center mb-8 text-center">
                <CheckCircle size={56} className="text-green-500 mb-3" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">فاتورة أصلية وموثقة</h3>
                <span className="inline-flex mt-2 items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                  تم الدفع بنجاح
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-500 dark:text-gray-400">رقم الفاتورة</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{data.invoice.invoiceNumber}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-500 dark:text-gray-400">تاريخ الإصدار</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{new Date(data.invoice.date).toLocaleDateString('ar-EG')}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-500 dark:text-gray-400">اسم العميل</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{data.invoice.customerName}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-500 dark:text-gray-400">الباقة</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{data.invoice.planName}</span>
                </div>
                {data.invoice.transactionId && (
                  <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-500 dark:text-gray-400">رقم العملية (Transaction ID)</span>
                    <span className="font-semibold text-gray-900 dark:text-white font-mono text-sm">{data.invoice.transactionId}</span>
                  </div>
                )}
                
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mt-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-500 dark:text-gray-400 text-sm">المبلغ الإجمالي (شامل الضريبة)</span>
                    <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                      {data.invoice.totalAmount} {data.invoice.currency === 'EGP' ? 'ج.م' : data.invoice.currency}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 dark:text-gray-400">طريقة الدفع</span>
                    <span className="text-gray-700 dark:text-gray-300">{data.invoice.paymentGateway} - {data.invoice.paymentMethod}</span>
                  </div>
                </div>

                {data.invoice.minioPdfUrl && (
                  <div className="mt-8 pt-4">
                    <a
                      href={data.invoice.minioPdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-lg shadow-indigo-200 dark:shadow-none"
                    >
                      <Download className="ml-2" size={20} />
                      تحميل الفاتورة (PDF)
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50 dark:bg-gray-800/80 px-6 py-4 text-center border-t border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            تم إصدار هذه الفاتورة إلكترونياً من نظام NexMedia AI.
          </p>
        </div>
      </div>
    </div>
  );
}
