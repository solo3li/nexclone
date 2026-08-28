'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from 'next-intl';
import { X } from 'lucide-react';
import api from '@/utils/api';

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  slug: string;
}

export default function PolicyModal({ isOpen, onClose, slug }: PolicyModalProps) {
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && slug) {
      setLoading(true);
      setError('');
      setContent(null);

      api.get(`/api/client/platform/custom-page/${slug}`)
        .then(res => {
          setContent(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Failed to load policy', err);
          setError(isRtl ? 'حدث خطأ أثناء تحميل السياسة.' : 'Failed to load policy.');
          setLoading(false);
        });
    }
  }, [isOpen, slug, isRtl]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-3xl max-h-[85vh] bg-[#0a0015] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          dir={isRtl ? 'rtl' : 'ltr'}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
            <h2 className="text-2xl font-bold text-white">
              {loading ? (isRtl ? 'جاري التحميل...' : 'Loading...') : 
               content ? (isRtl ? content.titleAr : content.titleEn) : 
               (isRtl ? 'سياسة' : 'Policy')}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
            {loading && (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-violet-500" />
              </div>
            )}
            
            {error && (
              <div className="text-center text-red-400 py-10">
                {error}
              </div>
            )}

            {!loading && !error && content && (
              <div 
                className="prose prose-invert prose-violet max-w-none prose-p:text-white/70 prose-headings:text-white/90 prose-a:text-violet-400"
                dangerouslySetInnerHTML={{ __html: isRtl ? content.contentAr : content.contentEn }}
              />
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
