'use client';

import { motion } from "framer-motion";
import { LifeBuoy, MessageSquarePlus } from "lucide-react";
import { useRouter } from "../../../i18n/routing";

interface Props {
  isRtl: boolean;
  locale: string;
}

export default function ProfileSupport({ isRtl, locale }: Props) {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative overflow-hidden max-w-3xl"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center border border-violet-500/30">
            <LifeBuoy className="w-5 h-5 text-violet-400" />
          </div>
          <h2 className="text-xl font-bold text-white">
            {isRtl ? "تذاكر الدعم" : "Support Tickets"}
          </h2>
        </div>
        <p className="text-white/50 text-sm mb-5 leading-relaxed">
          {isRtl
            ? "هل واجهت مشكلة أو لديك سؤال؟ تواصل مع فريق الدعم مباشرة. نحن هنا لمساعدتك في أي وقت."
            : "Having an issue or a question? Contact our support team directly. We are here to help you anytime."}
        </p>
        
        <div className="flex gap-4">
          <button
            onClick={() => router.push(`/profile/tickets`)}
            className="flex-1 py-4 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl transition-colors"
          >
            <MessageSquarePlus className="w-5 h-5" />
            {isRtl ? "عرض تذاكري" : "My Tickets"}
          </button>
          
          <button
            onClick={() => router.push(`/profile/tickets/new`)}
            className="flex-1 py-4 flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold rounded-xl transition-colors shadow-lg shadow-violet-600/20"
          >
            <LifeBuoy className="w-5 h-5" />
            {isRtl ? "فتح تذكرة جديدة" : "New Ticket"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
