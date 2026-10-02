"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Key, Copy, Check, Eye, EyeOff, RefreshCw, Sparkles, Terminal,
  Cpu, ShieldCheck, ExternalLink, HelpCircle, AlertTriangle, Layers, Video, Image as ImageIcon
} from "lucide-react";
import api from "../../utils/api";

interface ProfileMcpProps {
  user: any;
  isRtl: boolean;
}

export default function ProfileMcp({ user, isRtl }: ProfileMcpProps) {
  const [apiKey, setApiKey] = useState<string>("");
  const [keyPrefix, setKeyPrefix] = useState<string>("");
  const [lastUsedAt, setLastUsedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<boolean>(false);
  const [copiedConfig, setCopiedConfig] = useState<string | null>(null);
  const [regenerating, setRegenerating] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [activeConfigTab, setActiveConfigTab] = useState<"claude" | "cursor" | "curl">("claude");

  useEffect(() => {
    fetchKey();
  }, []);

  const fetchKey = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/apikey/my-key");
      if (res.data) {
        if (res.data.apiKey) {
          setApiKey(res.data.apiKey);
          setIsRevealed(true);
        }
        if (res.data.prefix) setKeyPrefix(res.data.prefix);
        if (res.data.lastUsedAt) setLastUsedAt(res.data.lastUsedAt);
      }
    } catch (err) {
      console.error("Failed to load API key:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateKey = async () => {
    setRegenerating(true);
    try {
      const res = await api.post("/api/apikey/regenerate");
      if (res.data && res.data.apiKey) {
        setApiKey(res.data.apiKey);
        setKeyPrefix(res.data.prefix);
        setIsRevealed(true);
        setShowConfirmModal(false);
      }
    } catch (err) {
      console.error("Failed to regenerate key:", err);
    } finally {
      setRegenerating(false);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    if (type === "key") {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    } else {
      setCopiedConfig(type);
      setTimeout(() => setCopiedConfig(null), 2000);
    }
  };

  const currentKeyDisplay = apiKey || (keyPrefix ? `${keyPrefix}••••••••••••••••` : "nex_live_••••••••••••••••••••••••••••••••");
  const sseEndpoint = `https://nexmediaai.com/api/mcp/sse?apiKey=${apiKey || "YOUR_API_KEY"}`;

  const claudeConfig = JSON.stringify(
    {
      mcpServers: {
        nexmedia: {
          url: sseEndpoint
        }
      }
    },
    null,
    2
  );

  const cursorConfig = JSON.stringify(
    {
      mcp: {
        servers: {
          nexmedia: {
            url: sseEndpoint,
            transport: "sse"
          }
        }
      }
    },
    null,
    2
  );

  const curlTest = `curl -N -H "Accept: text/event-stream" "${sseEndpoint}"`;

  return (
    <div className="space-y-6">
      {/* ── Top Overview Banner ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-violet-600/20 via-fuchsia-600/10 to-transparent border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300 text-xs font-semibold">
              <Cpu className="w-3.5 h-3.5" />
              <span>Model Context Protocol (MCP) • SSE</span>
            </div>
            <h2 className="text-2xl font-bold text-white">
              {isRtl ? "ربط الذكاء الاصطناعي الخارجي (MCP & API)" : "External AI Integration (MCP & API)"}
            </h2>
            <p className="text-white/60 text-sm max-w-2xl leading-relaxed">
              {isRtl
                ? "اربط منصة NexMedia AI مباشرة مع كلود ديسكتوب (Claude Desktop) أو كورسور (Cursor) أو ChatGPT لإنشاء الفيديوهات والصور وفحص الرصيد من أي بيئة عمل محلية أو سحابية."
                : "Connect NexMedia AI directly to Claude Desktop, Cursor, or ChatGPT to generate videos, images, and check credits from your local or remote workspace."}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-emerald-500/15 border border-emerald-500/30 px-3.5 py-2 rounded-2xl flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold text-emerald-400">
                {isRtl ? "الخادم نشط وجاهز" : "Server Online"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Card 1: API Key Management ── */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {isRtl ? "مفتاح الربط الخاص بك (API Key)" : "Your Personal API Key"}
              </h3>
              <p className="text-xs text-white/50">
                {isRtl ? "يُستخدم هذا المفتاح لمصادقة برامج الـ MCP والاتصال بالمنصة بأمان" : "Used to authenticate MCP clients and external tools securely"}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowConfirmModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white text-xs font-semibold transition-all hover:scale-[1.02]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{isRtl ? "إعادة توليد المفتاح" : "Regenerate Key"}</span>
          </button>
        </div>

        {/* API Key Box */}
        <div className="relative flex items-center bg-black/40 border border-white/15 rounded-2xl p-2.5 sm:p-3">
          <input
            type={isRevealed ? "text" : "password"}
            readOnly
            value={currentKeyDisplay}
            className="w-full bg-transparent px-3 text-sm sm:text-base font-mono text-violet-300 focus:outline-none select-all"
          />

          <div className="flex items-center gap-2 shrink-0">
            {apiKey && (
              <button
                onClick={() => setIsRevealed(!isRevealed)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"
                title={isRevealed ? (isRtl ? "إخفاء" : "Hide") : (isRtl ? "إظهار" : "Show")}
              >
                {isRevealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            )}

            <button
              onClick={() => copyToClipboard(apiKey || keyPrefix, "key")}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-xs font-bold hover:shadow-lg hover:shadow-violet-500/25 transition-all"
            >
              {copiedKey ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copiedKey ? (isRtl ? "تم النسخ!" : "Copied!") : (isRtl ? "نسخ المفتاح" : "Copy Key")}</span>
            </button>
          </div>
        </div>

        {lastUsedAt && (
          <div className="flex items-center gap-2 text-xs text-white/40">
            <ShieldCheck className="w-4 h-4 text-emerald-400/80" />
            <span>{isRtl ? `آخر استخدام للربط: ${new Date(lastUsedAt).toLocaleString()}` : `Last connected: ${new Date(lastUsedAt).toLocaleString()}`}</span>
          </div>
        )}
      </div>

      {/* ── Card 2: Configuration Snippets for Claude & Cursor ── */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-fuchsia-500/20 border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-400">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {isRtl ? "كود الإعداد الجاهز للربط الفوري" : "One-Click MCP Configuration"}
              </h3>
              <p className="text-xs text-white/50">
                {isRtl ? "انسخ الكود أدناه والصقه في ملف إعدادات برنامجك المفضل" : "Copy and paste into your Claude Desktop or Cursor configuration"}
              </p>
            </div>
          </div>

          {/* Config Tabs */}
          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/10">
            <button
              onClick={() => setActiveConfigTab("claude")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeConfigTab === "claude" ? "bg-violet-600 text-white shadow-md" : "text-white/50 hover:text-white"
              }`}
            >
              Claude Desktop
            </button>
            <button
              onClick={() => setActiveConfigTab("cursor")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeConfigTab === "cursor" ? "bg-violet-600 text-white shadow-md" : "text-white/50 hover:text-white"
              }`}
            >
              Cursor / Codex
            </button>
            <button
              onClick={() => setActiveConfigTab("curl")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeConfigTab === "curl" ? "bg-violet-600 text-white shadow-md" : "text-white/50 hover:text-white"
              }`}
            >
              cURL / Test
            </button>
          </div>
        </div>

        {/* Code Snippet Box */}
        <div className="relative bg-[#05010a] border border-white/15 rounded-2xl p-4 sm:p-5 font-mono text-xs sm:text-sm text-fuchsia-300 overflow-x-auto shadow-inner">
          <div className="flex items-center justify-between mb-3 text-white/40 border-b border-white/10 pb-2">
            <span className="text-[11px]">
              {activeConfigTab === "claude"
                ? "claude_desktop_config.json"
                : activeConfigTab === "cursor"
                ? "cursor-settings.json"
                : "Terminal"}
            </span>
            <button
              onClick={() =>
                copyToClipboard(
                  activeConfigTab === "claude" ? claudeConfig : activeConfigTab === "cursor" ? cursorConfig : curlTest,
                  activeConfigTab
                )
              }
              className="flex items-center gap-1.5 text-xs text-white/70 hover:text-white bg-white/10 hover:bg-white/15 px-2.5 py-1 rounded-lg transition-all"
            >
              {copiedConfig === activeConfigTab ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedConfig === activeConfigTab ? (isRtl ? "تم النسخ!" : "Copied!") : (isRtl ? "نسخ الإعداد" : "Copy Code")}</span>
            </button>
          </div>
          <pre className="whitespace-pre-wrap leading-relaxed">
            {activeConfigTab === "claude" ? claudeConfig : activeConfigTab === "cursor" ? cursorConfig : curlTest}
          </pre>
        </div>
      </div>

      {/* ── Card 3: Available Tools & Credit Safeguard ── */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              {isRtl ? "أدوات الـ MCP المتاحة وحماية الرصيد" : "Available Tools & Credit Protection"}
            </h3>
            <p className="text-xs text-white/50">
              {isRtl ? "يفحص الخادم رصيد حسابك قبل كل عملية؛ لن يتم خصم أي رصيد إذا لم يكن كافياً" : "The server checks your balance prior to execution; safe failure if credits are insufficient"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-violet-400 font-semibold text-sm">
              <Video className="w-4 h-4" />
              <span>generate_video</span>
            </div>
            <p className="text-xs text-white/60 leading-relaxed">
              {isRtl
                ? "توليد فيديوهات سينمائية بنماذج Google Veo 3.1 و ByteDance Seedance 2.0 و xAI Grok مع فحص الرصيد مسبقاً."
                : "Generate cinematic videos with Veo 3.1, Seedance 2.0, or Grok with pre-flight credit check."}
            </p>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
              <ImageIcon className="w-4 h-4" />
              <span>generate_image</span>
            </div>
            <p className="text-xs text-white/60 leading-relaxed">
              {isRtl
                ? "توليد صور بدقة فائقة بنموذج Grok Imagine مع فحص الرصيد وتحديد الأبعاد المناسبة."
                : "Generate ultra high-res images with Grok Imagine with pre-flight credit checks."}
            </p>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>get_user_credits</span>
            </div>
            <p className="text-xs text-white/60 leading-relaxed">
              {isRtl
                ? "استعلام مباشر عن رصيد الكريدت القياسي والمميز وتفاصيل خطة الاشتراك الحالية."
                : "Real-time query for standard credits, premium credits, and active plan details."}
            </p>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-pink-400 font-semibold text-sm">
              <Layers className="w-4 h-4" />
              <span>check_task_status</span>
            </div>
            <p className="text-xs text-white/60 leading-relaxed">
              {isRtl
                ? "متابعة تقدم المهمة برقم الـ Task ID وجلب رابط التحميل المباشر للنتيجة فور انتهائها."
                : "Poll task progress via Task ID and fetch the direct downloadable result URL."}
            </p>
          </div>
        </div>
      </div>

      {/* ── Confirm Regenerate Modal ── */}
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-[#0f021f] border border-white/20 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center space-y-5"
            >
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white">
                {isRtl ? "هل أنت متأكد من إعادة توليد المفتاح؟" : "Regenerate API Key?"}
              </h3>
              <p className="text-sm text-white/60 leading-relaxed">
                {isRtl
                  ? "سيتم إبطال المفتاح القديم فوراً، ولن تتمكن أي تطبيقات خارجية مرتبطة به من العمل حتى تقوم بتحديث المفتاح الجديد فيها."
                  : "Your current API key will be revoked immediately. Any external integrations will stop working until you update them with the new key."}
              </p>
              <div className="flex items-center gap-3 justify-center pt-2">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  disabled={regenerating}
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-all"
                >
                  {isRtl ? "إلغاء" : "Cancel"}
                </button>
                <button
                  onClick={handleRegenerateKey}
                  disabled={regenerating}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold transition-all shadow-lg shadow-red-500/25 flex items-center gap-2"
                >
                  {regenerating && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isRtl ? "نعم، أعد التوليد الآن" : "Yes, Regenerate"}</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
