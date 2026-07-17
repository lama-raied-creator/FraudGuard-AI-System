import React, { useState, useEffect } from 'react';
import { 
  X, ShieldAlert, Brain, Globe, MapPin, Zap, Smartphone, Check, Clock, 
  ShieldCheck, AlertTriangle, AlertCircle, FileText, ChevronRight, Play, Terminal, Cpu
} from 'lucide-react';
import { Transaction } from '../types';
import { translations } from '../lib/translations';

interface TransactionDetailsModalProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
  lang: 'en' | 'ar';
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onEscalate?: (id: string) => void;
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  darkMode?: boolean;
  onRunGeminiAnalysis?: (tx: Transaction) => void;
  isGeminiLoading?: boolean;
  onAnalyzeThisTransaction?: (tx: Transaction) => void;
}

export default function TransactionDetailsModal({
  transaction,
  isOpen,
  onClose,
  lang,
  onApprove,
  onReject,
  onEscalate,
  addToast,
  darkMode = true,
  onRunGeminiAnalysis,
  isGeminiLoading = false,
  onAnalyzeThisTransaction
}: TransactionDetailsModalProps) {
  const t = translations[lang];
  const isRTL = lang === 'ar';
  
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [comments, setComments] = useState('');
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isEscalating, setIsEscalating] = useState(false);

  useEffect(() => {
    if (!isOpen || !transaction) {
      setAnimatedProgress(0);
      return;
    }
    const score = transaction.aiRiskScore || 0;
    const timer = setTimeout(() => {
      setAnimatedProgress(score);
    }, 200);
    return () => clearTimeout(timer);
  }, [isOpen, transaction]);

  if (!isOpen || !transaction) return null;

  const defaultAnalysis = {
    risk_level: transaction.aiRiskScore > 75 ? 'High' as const : transaction.aiRiskScore > 35 ? 'Medium' as const : 'Safe' as const,
    fraud_probability: transaction.aiRiskScore,
    reasons: [
      isRTL 
        ? "بانتظار تشغيل فحص جيميناي للتحقق من متجهات السلوك والمخاطر الفورية."
        : "Awaiting Gemini analysis to verify active behavioral risk vectors.",
      isRTL
        ? `الموقع المسجل للعملية (${transaction.location || 'غير معروف'}) مستقر مؤقتاً.`
        : `Registered location (${transaction.location || 'unknown'}) is currently stable.`
    ],
    recommendations: [
      isRTL 
        ? "اضغط على زر 'تشغيل فحص جيميناي' أدناه لتوليد التقرير الأمني بالكامل."
        : "Click the 'RUN GEMINI ANALYSIS' button below to compile full security report.",
    ],
    arabic_explanation: isRTL 
      ? `لم يتم إخضاع هذه العملية رقم ${transaction.id} لتحليل جيميناي النشط حتى الآن. يرجى الضغط على زر التشغيل للاتصال بالذكاء الاصطناعي وإعداد تفسير معتمد لمؤسسة النقد (ساما).`
      : `This transaction (${transaction.id}) has not been analyzed by Gemini AI yet. Click 'RUN GEMINI ANALYSIS' below to build SAMA-compliant explanations.`
  };

  const analysis = transaction.aiAnalysis || defaultAnalysis;

  // Gauge calculations
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedProgress / 100) * circumference;

  const handleApproveAction = () => {
    setIsApproving(true);
    setTimeout(() => {
      onApprove(transaction.id);
      setIsApproving(false);
      addToast(
        isRTL 
          ? `تم اعتماد وتفويض العملية ${transaction.id} بنجاح وإزالة القيود.`
          : `Transaction ${transaction.id} successfully approved and limitations removed.`, 
        'success'
      );
      onClose();
    }, 1000);
  };

  const handleRejectAction = () => {
    setIsRejecting(true);
    setTimeout(() => {
      onReject(transaction.id);
      setIsRejecting(false);
      addToast(
        isRTL 
          ? `تم رفض العملية ${transaction.id} بنجاح وتجميد بطاقة العميل لمنع الاحتيال.`
          : `Transaction ${transaction.id} rejected and customer card locked to prevent fraud.`, 
        'error'
      );
      onClose();
    }, 1000);
  };

  const handleEscalateAction = () => {
    setIsEscalating(true);
    setTimeout(() => {
      setIsEscalating(false);
      addToast(
        isRTL 
          ? `تم رفع ملف القضية للبنك المركزي السعودي (ساما) للتحقيق الجنائي.`
          : `Case file escalated to SAMA Fraud Prevention Department.`, 
        'info'
      );
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/65 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative bg-white dark:bg-[#070e17] rounded-3xl border border-gray-100 dark:border-gray-800/80 shadow-2xl w-full max-w-5xl overflow-hidden transition-all duration-300 animate-scale-up my-8 max-h-[90vh] flex flex-col"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Modal Header */}
        <div className="p-6 bg-[#001939] dark:bg-[#050c16] text-white flex justify-between items-center border-b border-gray-100 dark:border-gray-800 shrink-0">
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}>
            <div className="p-2.5 bg-[#D4AF37]/20 text-[#D4AF37] rounded-xl border border-[#D4AF37]/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-[#D4AF37] font-black uppercase tracking-widest block">
                {isRTL ? 'الملف الرقابي للامتثال الفوري' : 'Central Compliance Audit Dossier'}
              </span>
              <h2 className="text-base md:text-lg font-black mt-0.5">
                {isRTL ? `تفاصيل المعاملة المصرفية ${transaction.id}` : `Transaction security verification • ${transaction.id}`}
              </h2>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-white/70 hover:text-white p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border-none cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 bg-[#fbfbfe] dark:bg-[#030712] transition-colors">
          
          {/* Section 1: Customer Profile Details & Bank account ledger info */}
          <div className="bg-white dark:bg-[#070e17] p-6 rounded-2xl border border-gray-100 dark:border-gray-850 shadow-sm space-y-4">
            <h3 className={`text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Check className="w-4 h-4 text-[#D4AF37]" />
              <span>{isRTL ? 'معلومات العميل والتحقق من الهوية' : 'Customer Account Profile & Dossier'}</span>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
              <div className="p-3 bg-gray-50 dark:bg-gray-800/30 rounded-xl">
                <span className="text-[10px] text-gray-400 font-bold block mb-1">{isRTL ? 'الاسم الكامل للعميل' : 'Full Customer Name'}</span>
                <span className="font-extrabold text-gray-800 dark:text-white">{transaction.customerName}</span>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800/30 rounded-xl">
                <span className="text-[10px] text-gray-400 font-bold block mb-1">{isRTL ? 'رقم الهوية الوطنية (أبشر)' : 'National ID / Iqama'}</span>
                <span className="font-mono font-black text-gray-800 dark:text-white">1098273614</span>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800/30 rounded-xl">
                <span className="text-[10px] text-gray-400 font-bold block mb-1">{isRTL ? 'رقم الآيبان (SDB IBAN)' : 'IBAN Account'}</span>
                <span className="font-mono text-gray-500 dark:text-gray-400 truncate block">SA80400001098827361001</span>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800/30 rounded-xl">
                <span className="text-[10px] text-gray-400 font-bold block mb-1">{isRTL ? 'تصنيف الموثوقية والالتزام' : 'Stability Rating'}</span>
                <span className="font-extrabold text-emerald-500 dark:text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{isRTL ? 'عقدة موثوقة (سنة+)' : 'SDB Trusted Ledger'}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Core Transaction Metadata with Red highlights for Risk vectors */}
          <div className="bg-white dark:bg-[#070e17] p-6 rounded-2xl border border-gray-100 dark:border-gray-850 shadow-sm space-y-4">
            <h3 className={`text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Clock className="w-4 h-4 text-[#D4AF37]" />
              <span>{isRTL ? 'تفاصيل العملية المصرفية وعلامات الخطورة' : 'Core Transaction Ledger & Danger Highlight Gates'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Value Amount */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-gray-100 dark:border-gray-800">
                <span className="text-[9px] text-gray-400 font-black uppercase tracking-wider block mb-1">{isRTL ? 'مبلغ العملية الإجمالي' : 'Transaction Amount'}</span>
                <p className="text-xl font-black text-[#001939] dark:text-white">
                  {isRTL ? `${transaction.amount.toLocaleString()} ر.س` : `SAR ${transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                </p>
                <span className="text-[9px] text-gray-400 block mt-1">{isRTL ? `قناة الدفع: ${transaction.type}` : `Channel Route: ${transaction.type}`}</span>
              </div>

              {/* IP address - Highlighted in Red if VPN is detected */}
              <div className={`p-4 rounded-xl border transition-all ${
                transaction.riskIndicators?.vpnUse 
                  ? 'bg-red-500/5 dark:bg-red-950/20 border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 animate-pulse' 
                  : 'bg-gray-50 dark:bg-gray-800/30 border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300'
              }`}>
                <div className={`flex justify-between items-center mb-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-[9px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-wider block">{isRTL ? 'عنوان الآي بي للشبكة' : 'Client IP address'}</span>
                  <Globe className="w-3.5 h-3.5" />
                </div>
                <p className="text-sm font-extrabold font-mono">{transaction.ipAddress || '185.2.44.112'}</p>
                {transaction.riskIndicators?.vpnUse && (
                  <span className="text-[9px] font-black uppercase tracking-widest text-red-600 dark:text-red-400 block mt-1">
                    ⚠️ {isRTL ? 'اتصال VPN مشبوه ومحظور' : 'vpn usage flag'}
                  </span>
                )}
              </div>

              {/* Location - Highlighted if Mismatched */}
              <div className={`p-4 rounded-xl border transition-all ${
                transaction.riskIndicators?.mismatchedGeo 
                  ? 'bg-red-500/5 dark:bg-red-950/20 border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 animate-pulse' 
                  : 'bg-gray-50 dark:bg-gray-800/30 border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300'
              }`}>
                <div className={`flex justify-between items-center mb-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-[9px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-wider block">{isRTL ? 'الموقع الفعلي للجهاز' : 'Terminal Location'}</span>
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <p className="text-sm font-extrabold">{transaction.location || 'Riyadh, Saudi Arabia'}</p>
                {transaction.riskIndicators?.mismatchedGeo && (
                  <span className="text-[9px] font-black uppercase tracking-widest text-red-600 dark:text-red-400 block mt-1">
                    ⚠️ {isRTL ? 'تباعد جغرافي غير متناسق' : 'distance mismatch flag'}
                  </span>
                )}
              </div>

              {/* Device Fingerprint with validation status */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800 rounded-xl text-gray-700 dark:text-gray-300">
                <div className={`flex justify-between items-center mb-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-[9px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-wider block">{isRTL ? 'بصمة ومصادقة الجهاز' : 'OS Hardware Device'}</span>
                  <Smartphone className="w-3.5 h-3.5" />
                </div>
                <p className="text-sm font-extrabold truncate">{transaction.deviceId || 'apple-iphone-15'}</p>
                <span className="text-[9px] text-emerald-500 dark:text-emerald-400 block mt-1 font-bold">
                  ✓ {isRTL ? 'الجهاز مسجل بالبنك' : 'Registered Device'}
                </span>
              </div>

            </div>

            {/* Extra Row: Merchant Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-50 dark:border-gray-850 text-xs">
              <div>
                <span className="text-gray-400 font-bold block">{isRTL ? 'التاجر المستفيد' : 'Beneficiary Merchant:'}</span>
                <span className="font-extrabold text-gray-800 dark:text-white mt-1 block">{transaction.merchantName || 'Noon Riyadh Superstore'}</span>
              </div>
              <div>
                <span className="text-gray-400 font-bold block">{isRTL ? 'رمز الفئة المعتمد (SAMA MCC)' : 'Merchant Category Code (MCC):'}</span>
                <span className="font-mono font-black text-gray-800 dark:text-white mt-1 block">{transaction.mcc || '5311'}</span>
              </div>
              <div>
                <span className="text-gray-400 font-bold block">{isRTL ? 'توقيت وتاريخ العملية' : 'Sovereign Transaction Time:'}</span>
                <span className="font-mono text-gray-800 dark:text-white mt-1 block">{transaction.time}</span>
              </div>
            </div>
          </div>

          {/* Section 3: Dual-Column AI Analysis Report with circular progress gauge */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Risk Gauge Panel */}
            <div className="lg:col-span-4 bg-white dark:bg-[#070e17] rounded-2xl p-6 border border-gray-100 dark:border-gray-850 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden">
              <div className={`absolute inset-0 pointer-events-none opacity-5 ${transaction.aiRiskScore > 75 ? 'bg-red-500' : 'bg-amber-500'}`} />
              <h4 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">
                {isRTL ? 'مستوى تهديد الاحتيال الذكي' : 'Gemini AI Threat Score'}
              </h4>

              <div className="relative w-36 h-36">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
                  <circle cx="70" cy="70" r={radius} fill="transparent" stroke={darkMode ? '#111b27' : '#f3f4f6'} strokeWidth="10" />
                  <circle
                    cx="70"
                    cy="70"
                    r={radius}
                    fill="transparent"
                    stroke={transaction.aiRiskScore > 75 ? '#ba1a1a' : transaction.aiRiskScore > 35 ? '#fd8b00' : '#006A4E'}
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-3xl font-black ${
                    transaction.aiRiskScore > 75 ? 'text-red-500' : transaction.aiRiskScore > 35 ? 'text-amber-500' : 'text-[#006A4E] dark:text-emerald-400'
                  }`}>
                    {animatedProgress}%
                  </span>
                  <span className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider mt-1">
                    {analysis.risk_level === 'High' ? (isRTL ? 'خطر مرتفع' : 'High') : analysis.risk_level === 'Medium' ? (isRTL ? 'خطر متوسط' : 'Medium') : (isRTL ? 'آمن' : 'Safe')}
                  </span>
                </div>
              </div>

              <div className="mt-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                {isRTL ? 'نموذج الفحص النشط: Gemini 3.5' : 'Active Model: Gemini 3.5'}
              </div>

              <button
                onClick={() => onRunGeminiAnalysis && onRunGeminiAnalysis(transaction)}
                disabled={isGeminiLoading}
                className="mt-4 w-full h-10 bg-[#006A4E] hover:bg-[#005a42] disabled:bg-gray-400 dark:disabled:bg-gray-800 text-white rounded-xl text-[10px] font-black tracking-wider transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer border-none shadow-md shadow-[#006A4E]/20"
              >
                <Zap className={`w-3.5 h-3.5 text-[#D4AF37] ${isGeminiLoading ? 'animate-spin' : ''}`} />
                <span>{isGeminiLoading ? (isRTL ? "جاري تشغيل جيميناي..." : "ANALYZING...") : (isRTL ? "تشغيل فحص جيميناي AI" : "RUN GEMINI ANALYSIS")}</span>
              </button>
            </div>

            {/* AI Explanation & Recommendations */}
            <div className="lg:col-span-8 bg-white dark:bg-[#070e17] rounded-2xl p-6 border border-gray-100 dark:border-gray-850 shadow-sm flex flex-col justify-between">
              <div>
                <div className={`flex items-center gap-2 border-b border-gray-50 dark:border-gray-800 pb-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Brain className="w-5 h-5 text-[#006A4E] dark:text-emerald-400 shrink-0" />
                  <h4 className="text-sm font-black text-[#001939] dark:text-white">
                    {isRTL ? 'رؤية الذكاء الاصطناعي وجدول التدقيق' : 'AI Analysis & Audit Explanations'}
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Anomaly reasons */}
                  <div className="space-y-4">
                    <h5 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                      {isRTL ? 'أسباب الشبهة الأمنية' : 'Anomalous Risk Vectors'}
                    </h5>
                    <div className="space-y-3">
                      {analysis.reasons.map((reason, idx) => (
                        <div key={idx} className={`flex gap-2.5 ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}>
                          <div className="h-5 w-5 rounded bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0 mt-0.5">
                            <AlertCircle className="w-3.5 h-3.5" />
                          </div>
                          <p className="text-[11px] text-gray-600 dark:text-gray-300 font-semibold leading-relaxed">
                            {reason}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* SAMA Recommendations */}
                  <div className="bg-gray-50 dark:bg-[#0b1524]/60 p-4 rounded-xl border border-gray-100 dark:border-gray-800 space-y-3">
                    <h5 className={`text-[10px] font-black text-[#001939] dark:text-white uppercase tracking-wider flex items-center gap-1.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <FileText className="w-4 h-4 text-[#D4AF37]" />
                      <span>{isRTL ? 'التوصيات الرقابية لساما' : 'SAMA Compliance Action Guide'}</span>
                    </h5>
                    <div className="space-y-2.5">
                      {analysis.recommendations.map((rec, idx) => (
                        <div key={idx} className={`flex gap-1.5 items-start ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                          <span className="text-[#006A4E] dark:text-emerald-400 font-bold mt-0.5">✓</span>
                          <span className="text-[10.5px] font-bold text-gray-600 dark:text-gray-300 leading-relaxed">
                            {rec}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Bilingual Arabic Explanation Block */}
          <div className="bg-[#0b1524] text-white rounded-2xl p-6 border border-[#D4AF37]/30 shadow-lg relative overflow-hidden">
            <div className={`flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-800 pb-3 mb-4 gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
                <h4 className="text-xs font-black text-[#D4AF37] tracking-wider uppercase">التفسير والتحليل الأمني الثنائي</h4>
                <p className="text-[9px] text-gray-400">SAMA-Audit Compliant Arabic Narrative Output</p>
              </div>
              <span className="px-2 py-0.5 bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 rounded text-[9.5px] font-bold">
                {isRTL ? 'تقرير جيميناي معتمد' : 'Gemini Core Verified'}
              </span>
            </div>

            <p className="text-xs md:text-sm font-semibold text-gray-100 leading-relaxed text-justify font-sans" dir="rtl">
              {analysis.arabic_explanation}
            </p>
          </div>

          {/* Section 4: Audit Verification Timeline / Trail */}
          <div className="bg-white dark:bg-[#070e17] p-6 rounded-2xl border border-gray-100 dark:border-gray-850 shadow-sm space-y-4">
            <h3 className={`text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Terminal className="w-4 h-4 text-[#D4AF37]" />
              <span>{isRTL ? 'مسار التدقيق والتحقق المالي للعملية' : 'Sequential Compliance Verification Timeline'}</span>
            </h3>

            <div className="relative border-l border-gray-150 dark:border-gray-800 ml-4 pl-6 space-y-5 text-xs">
              <div className="relative">
                <span className="absolute -left-[30px] top-0.5 bg-[#006A4E] text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black">1</span>
                <div>
                  <span className="font-extrabold text-gray-800 dark:text-white block">{isRTL ? 'تزامن البوابة المركزية' : 'SDB Gateway Synchronizer'}</span>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{isRTL ? 'تم استقبال متجهات العملية وفحص آيبان العميل والموقع.' : 'Client transaction metadata successfully received from Noon terminal Riyadh.'}</p>
                </div>
              </div>
              <div className="relative">
                <span className="absolute -left-[30px] top-0.5 bg-[#006A4E] text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black">2</span>
                <div>
                  <span className="font-extrabold text-gray-800 dark:text-white block">{isRTL ? 'تقييم نموذج الذكاء الاصطناعي' : 'Gemini Vector Classification'}</span>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                    {isRTL 
                      ? `تم تحليل العملية وإعطائها تقييم مخاطر بمقدار ${transaction.aiRiskScore}% ومطابقتها بالقائمة السوداء لعنوان IP.` 
                      : `Scoring logic calculated threat probability of ${transaction.aiRiskScore}% based on blacklisted proxy subnet check.`}
                  </p>
                </div>
              </div>
              <div className="relative">
                <span className="absolute -left-[30px] top-0.5 bg-amber-500 text-[#001025] w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black animate-pulse">3</span>
                <div>
                  <span className="font-extrabold text-[#D4AF37] block">{isRTL ? 'تدقيق ضابط الامتثال (بانتظار القرار)' : 'Compliance Officer Review (Awaiting Gate)'}</span>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{isRTL ? 'تم حجز العملية لمراجعة ضابط الامتثال يدوياً ومطابقة معايير الامتثال.' : 'Transaction frozen and queued in Riyadh central audit hub for compliance override.'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Internal comment textarea */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest block">
              {isRTL ? 'ملاحظات ضابط الامتثال للتقرير الرقابي' : 'Compliance Officer Case Justification Logs'}
            </label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="w-full p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition-all resize-none min-h-[90px] rounded-2xl text-xs font-semibold text-gray-850 dark:text-gray-100 shadow-sm"
              placeholder={isRTL ? "أضف تبرير فك تجميد البطاقة أو حظر العميل وملاحظات الامتثال لساما هنا..." : "Enter compliance override reason, override logs or block justification notes here..."}
            />
          </div>

        </div>

        {/* Modal Actions */}
        <div className="p-6 bg-gray-50 dark:bg-[#070e17] border-t border-gray-100 dark:border-gray-850 flex flex-wrap gap-4 shrink-0 justify-between items-center">
          
          <div className="flex gap-3">
            <button
              onClick={handleApproveAction}
              disabled={isApproving || isRejecting}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white h-11 px-5 rounded-xl font-black text-xs transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer border-none shadow-md shadow-emerald-500/10"
            >
              <Check className="w-4 h-4" />
              <span>{isApproving ? (isRTL ? 'جاري الاعتماد...' : 'APPROVING...') : (isRTL ? 'اعتماد وتحرير العملية' : 'APPROVE TRANSACTION')}</span>
            </button>
            <button
              onClick={handleRejectAction}
              disabled={isApproving || isRejecting}
              className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white h-11 px-5 rounded-xl font-black text-xs transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer border-none shadow-md shadow-red-500/10"
            >
              <X className="w-4 h-4" />
              <span>{isRejecting ? (isRTL ? 'جاري الرفض والحظر...' : 'LOCKING...') : (isRTL ? 'رفض وتجميد الحساب المصرفي' : 'REJECT & LOCK CARD')}</span>
            </button>
          </div>

          <div className="flex gap-3">
            {onAnalyzeThisTransaction && transaction && (
              <button
                onClick={() => {
                  onAnalyzeThisTransaction(transaction);
                  onClose();
                }}
                className="bg-[#D4AF37] hover:bg-[#C5A059] text-[#001025] h-11 px-4 rounded-xl font-black text-xs transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer border-none shadow-md shadow-[#D4AF37]/15"
              >
                <Cpu className="w-4.5 h-4.5" />
                <span>{isRTL ? 'تحليل هذه المعاملة يدوياً' : 'ANALYZE THIS TRANSACTION'}</span>
              </button>
            )}
            <button
              onClick={handleEscalateAction}
              disabled={isEscalating}
              className="bg-[#001939] dark:bg-gray-800 hover:bg-[#0b2b52] text-white h-11 px-4 rounded-xl font-bold text-xs transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer border-none"
            >
              <ShieldAlert className="w-4 h-4 text-[#D4AF37]" />
              <span>{isEscalating ? (isRTL ? 'جاري الرفع...' : 'ESCALATING...') : (isRTL ? 'تصعيد لمؤسسة النقد (ساما)' : 'ESCALATE TO SAMA')}</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
