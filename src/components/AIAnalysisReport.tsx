import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, Brain, Globe, Zap, BarChart3, AlertTriangle, 
  ArrowRight, CheckCircle2, XCircle, ChevronLeft, 
  ShieldCheck, AlertCircle, Info, RefreshCw, Smartphone, MapPin, Scale,
  Sparkles, Globe as GlobeIcon, Zap as ZapIcon, Smartphone as SmartphoneIcon
} from 'lucide-react';
import { Screen, Transaction, InvestigationReport, InvestigationStatus } from '../types';
import { translations } from '../lib/translations';
import InvestigationReportView from './InvestigationReportView';

interface AIAnalysisReportProps {
  transaction: Transaction | null;
  onNavigate: (screen: Screen) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  darkMode: boolean;
  isLoading?: boolean;
  lang: 'en' | 'ar';
  reports?: InvestigationReport[];
  onUpdateReportStatus?: (reportId: string, status: InvestigationStatus) => void;
  onUpdateReportComplianceNotes?: (reportId: string, notes: string) => void;
  addToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export default function AIAnalysisReport({ 
  transaction, 
  onNavigate, 
  onApprove, 
  onReject, 
  darkMode,
  isLoading = false,
  lang,
  reports = [],
  onUpdateReportStatus = () => {},
  onUpdateReportComplianceNotes = () => {},
  addToast = () => {}
}: AIAnalysisReportProps) {
  const t = translations[lang];
  const isRTL = lang === 'ar';
  const [comments, setComments] = useState('');
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [animatedProgress, setAnimatedProgress] = useState(0);

  // Default pre-baked high-fidelity SAMA report data for our target transaction if not analyzed live
  const defaultAnalysis = {
    risk_level: 'High' as const,
    fraud_probability: 85,
    reasons: [
      "Originating IP address is associated with a blacklisted VPN subnet (IP: 185.2.44.112) in Riyadh.",
      "Velocity spike detected with multiple successive transaction attempts within 180 seconds.",
      "Transaction amount is 14.5x larger than customer's historical baseline average of SAR 240.00."
    ],
    recommendations: [
      "Trigger temporary card freeze and prompt for instant biometrics verification in the Saudi Digital Bank app.",
      "Request SMS/OTP authentication verification using registered SAMA phone number.",
      "Hold transaction for manual override and senior officer audit."
    ],
    arabic_explanation: "تم رصد محاولة إتمام عملية شراء عالية القيمة بقيمة 4,299.00 ريال سعودي من متجر (Elite Workstation Pro). تم تصنيف المعاملة بأنها عالية الخطورة (85%) وذلك لوجود مؤشرات اشتباه قوية: أولاً، تم تقديم الطلب عبر شبكة افتراضية (VPN) مجهولة المصدر من عنوان آي بي (185.2.44.112)، وهو أمر يخالف النمط الجغرافي المعتاد للعميل. ثانياً، رصد النظام نشاطاً متسارعاً للغاية في وقت قصير (Velocity Spike) لا يتماشى مع السلوك المالي الطبيعي للحساب. يوصى بتجميد البطاقة مؤقتاً والتحقق من هوية العميل فوراً عبر تطبيق النفاذ الوطني الموحد."
  };

  const activeTransaction = transaction || {
    id: '#TXN-8812',
    customerName: 'Sarah M.',
    customerInitials: 'SM',
    amount: 12850.50,
    status: 'Medium' as const,
    aiRiskScore: 58,
    time: '14:05:45 GMT',
    type: 'Credit' as const,
    merchantName: 'Elite Workstation Pro',
    mcc: '5732',
    ipAddress: '185.2.44.112',
    deviceId: 'df882-xa11-0092',
    location: 'Riyadh, Saudi Arabia',
    riskIndicators: {
      firstTimeMerchant: true,
      highVelocity: true,
      mismatchedGeo: false,
      vpnUse: true,
      unusualSurge: true,
    }
  };

  const analysis = activeTransaction.aiAnalysis || defaultAnalysis;

  useEffect(() => {
    if (isLoading) {
      setAnimatedProgress(0);
      return;
    }
    const timer = setTimeout(() => {
      setAnimatedProgress(analysis.fraud_probability);
    }, 150);
    return () => clearTimeout(timer);
  }, [analysis.fraud_probability, isLoading]);

  const handleApproveAction = () => {
    setIsApproving(true);
    setTimeout(() => {
      onApprove(activeTransaction.id);
      setIsApproving(false);
    }, 1200);
  };

  const handleRejectAction = () => {
    setIsRejecting(true);
    setTimeout(() => {
      onReject(activeTransaction.id);
      setIsRejecting(false);
    }, 1200);
  };

  // Determine risk badges and branding styles
  const getRiskColors = (level: string) => {
    switch (level.toUpperCase()) {
      case 'CRITICAL':
      case 'HIGH':
        return {
          text: 'text-red-600 dark:text-red-400',
          bg: 'bg-red-50 dark:bg-red-950/40',
          border: 'border-red-200 dark:border-red-900/60',
          badge: 'bg-red-600 text-white',
          accent: '#ba1a1a'
        };
      case 'MEDIUM':
        return {
          text: 'text-amber-600 dark:text-amber-400',
          bg: 'bg-amber-50 dark:bg-amber-950/30',
          border: 'border-amber-200 dark:border-amber-900/50',
          badge: 'bg-amber-500 text-white',
          accent: '#fd8b00'
        };
      default:
        return {
          text: 'text-[#006A4E] dark:text-emerald-400',
          bg: 'bg-emerald-50 dark:bg-emerald-950/30',
          border: 'border-emerald-100 dark:border-emerald-900/40',
          badge: 'bg-[#006A4E] text-white',
          accent: '#006A4E'
        };
    }
  };

  const riskStyle = getRiskColors(analysis.risk_level);

  // SVG Gauge calculations
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedProgress / 100) * circumference;

  if (isLoading) {
    return (
      <div className={`space-y-8 animate-fade-in pb-12 ${darkMode ? 'dark' : ''}`}>
        {/* Loading Header */}
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          <div className="h-4 w-40 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        </div>

        {/* Skeleton Bento */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 bg-white dark:bg-[#070e17] rounded-3xl p-8 border border-gray-100 dark:border-gray-800/60 flex flex-col items-center justify-center text-center space-y-4">
            <div className="h-4 w-28 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            <div className="w-36 h-36 rounded-full border-8 border-gray-100 dark:border-gray-800 flex items-center justify-center animate-spin">
              <RefreshCw className="w-8 h-8 text-[#006A4E] dark:text-emerald-500" />
            </div>
            <div className="h-6 w-16 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          </div>

          <div className="lg:col-span-8 bg-white dark:bg-[#070e17] rounded-3xl p-8 border border-gray-100 dark:border-gray-800/60 space-y-6">
            <div className="flex justify-between items-center border-b border-gray-50 dark:border-gray-800 pb-4">
              <div className="h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              <div className="h-5 w-24 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse" />
            </div>
            <div className="space-y-4">
              <div className="h-4 w-full bg-gray-100 dark:bg-gray-800/60 rounded animate-pulse" />
              <div className="h-4 w-5/6 bg-gray-100 dark:bg-gray-800/60 rounded animate-pulse" />
              <div className="h-4 w-4/5 bg-gray-100 dark:bg-gray-800/60 rounded animate-pulse" />
            </div>
          </div>
        </div>

        {/* Skeleton Timeline */}
        <div className="bg-white dark:bg-[#070e17] rounded-3xl p-8 border border-gray-100 dark:border-gray-800/60 space-y-4">
          <div className="h-6 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          <div className="space-y-3 pt-4">
            <div className="h-10 w-full bg-gray-50 dark:bg-gray-800/30 rounded animate-pulse" />
            <div className="h-10 w-full bg-gray-50 dark:bg-gray-800/30 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // Find linked report
  const cleanId = (activeTransaction.id || '').replace('#', '').trim().toLowerCase();
  const linkedReport = reports.find(r => (r.transactionId || '').replace('#', '').trim().toLowerCase() === cleanId);

  if (linkedReport) {
    return (
      <InvestigationReportView
        report={linkedReport}
        lang={lang}
        onBack={() => onNavigate('alerts-feed')}
        onUpdateStatus={onUpdateReportStatus}
        onUpdateComplianceNotes={onUpdateReportComplianceNotes}
        addToast={addToast}
      />
    );
  }

  return (
    <div className={`space-y-8 animate-fade-in pb-12 ${darkMode ? 'dark text-gray-100' : 'text-gray-800'}`}>
      
      {/* Top Banner & Quick Back Navigation */}
      <div className={`flex flex-wrap items-center justify-between gap-4 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-1 text-xs font-black text-gray-400 hover:text-[#006A4E] dark:hover:text-emerald-400 transition-all bg-transparent border-none cursor-pointer"
          >
            {isRTL ? <ArrowRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            <span>{isRTL ? 'لوحة المراقبة' : 'Dashboard'}</span>
          </button>
          <span className="text-gray-300 dark:text-gray-700">/</span>
          <button
            onClick={() => onNavigate('alerts-feed')}
            className="text-xs font-black text-gray-400 hover:text-[#006A4E] dark:hover:text-emerald-400 transition-all bg-transparent border-none cursor-pointer"
          >
            {isRTL ? 'التنبيهات' : 'Alerts'}
          </button>
          <span className="text-gray-300 dark:text-gray-700">/</span>
          <span className="text-xs font-black text-[#001939] dark:text-white">
            {isRTL ? 'تقرير الفحص' : 'Report'} {activeTransaction.id}
          </span>
        </div>

        {/* Saudi Central Bank Regulation Badge */}
        <div className={`flex items-center gap-2 px-3 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] rounded-full text-[10px] font-bold uppercase tracking-wider ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Scale className="w-3.5 h-3.5" />
          <span>{isRTL ? 'تم تفعيل قاعدة امتثال ساما ٤.٢' : 'SAMA Compliance Rule 4.2 Enabled'}</span>
        </div>
      </div>

      {/* Hero Section: Bento Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Gauge Circular Graphic */}
        <div className="lg:col-span-4 bg-white dark:bg-[#070e17] rounded-3xl p-8 flex flex-col items-center justify-center text-center border border-gray-100 dark:border-gray-800/60 shadow-sm relative overflow-hidden">
          <div className={`absolute inset-0 pointer-events-none opacity-5 ${riskStyle.bg}`} />

          <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">
            {isRTL ? 'مؤشر احتمالية الاحتيال الذكي' : 'Fraud Probability Score'}
          </h3>

          <div className="relative w-44 h-44 my-2">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
              <circle 
                cx="80" 
                cy="80" 
                r={radius}
                fill="transparent" 
                stroke={darkMode ? '#111b27' : '#f3f4f6'} 
                strokeWidth="12" 
              />
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="transparent"
                stroke={riskStyle.accent}
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-4xl font-black tracking-tight ${riskStyle.text}`}>
                {animatedProgress}%
              </span>
              <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider mt-1">
                {analysis.risk_level === 'High' ? (isRTL ? 'خطر مرتفع' : 'High Risk') : analysis.risk_level === 'Medium' ? (isRTL ? 'خطر متوسط' : 'Medium Risk') : (isRTL ? 'آمن' : 'Safe')}
              </span>
            </div>
          </div>

          <div className={`flex items-center gap-1.5 px-4 py-2 ${riskStyle.bg} ${riskStyle.text} rounded-full text-xs font-black mt-4 border ${riskStyle.border} shadow-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
            <AlertTriangle className="w-4 h-4" />
            <span>{analysis.risk_level === 'High' ? (isRTL ? 'نمط تهديد مرتفع' : 'High Threat Pattern') : analysis.risk_level === 'Medium' ? (isRTL ? 'نمط تهديد متوسط' : 'Medium Threat Pattern') : (isRTL ? 'نمط آمن' : 'Safe Pattern')}</span>
          </div>
        </div>

        {/* AI Explanation details and Behavioral variance */}
        <div className="lg:col-span-8 bg-white dark:bg-[#070e17] rounded-3xl p-8 border border-gray-100 dark:border-gray-800/60 shadow-sm flex flex-col justify-between">
          <div className={`flex items-center justify-between border-b border-gray-50 dark:border-gray-800 pb-4 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Brain className="w-5 h-5 text-[#006A4E] dark:text-emerald-500" />
              <h3 className="text-lg font-bold text-[#001939] dark:text-white">{isRTL ? 'تحليل المساعد الذكي' : 'AI Copilot Analysis'}</h3>
            </div>
            <div className={`flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60 px-3 py-1 rounded-full text-[#006A4E] dark:text-emerald-400 text-xs font-bold ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span>{isRTL ? 'جيميناي ٣.٥ نشط' : 'Gemini 3.5 Active'}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h4 className={`text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                {isRTL ? 'نقاط الشبهة المرصودة' : 'Flagged Anomaly Points'}
              </h4>
              <div className="space-y-4">
                {analysis.reasons.map((reason, idx) => (
                  <div key={idx} className={`flex gap-3 ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}>
                    <div className="h-6 w-6 rounded-lg bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                      <AlertCircle className="w-4 h-4" />
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300 font-semibold leading-relaxed">
                      {reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations Panel */}
            <div className="bg-gray-50 dark:bg-[#0b1524] rounded-2xl p-6 border border-gray-100 dark:border-gray-800/60 space-y-4">
              <h4 className={`text-xs font-black text-[#001939] dark:text-white uppercase tracking-wider flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <ShieldAlert className="w-4 h-4 text-[#D4AF37]" />
                <span>{isRTL ? 'الإجراءات الأمنية الموصى بها' : 'Recommended Actions'}</span>
              </h4>
              <div className="space-y-3">
                {analysis.recommendations.map((rec, idx) => (
                  <div key={idx} className={`flex gap-2 items-start ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                    <CheckCircle2 className="w-4 h-4 text-[#006A4E] dark:text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-[11px] font-bold text-gray-600 dark:text-gray-300">
                      {rec}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PREMIUM BILINGUAL ARABIC REPORT BOARD (Saudi Regulation Compliance) */}
      <div className="bg-[#0b1524] dark:bg-[#050c16] rounded-3xl p-8 border border-[#D4AF37]/30 shadow-xl relative overflow-hidden">
        {/* Luxury Background Watermark */}
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-5 pointer-events-none bg-[radial-gradient(ellipse_at_bottom_right,var(--color-[#D4AF37]),transparent)]" />
        
        <div className={`flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-800 pb-4 mb-6 gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <div className={`flex items-center gap-2 text-[#D4AF37] ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Sparkles className="w-5 h-5 fill-current" />
              <h3 className="text-lg font-black tracking-tight uppercase">{isRTL ? 'التفسير الذكي بالذكاء الاصطناعي' : 'AI Smart Regulatory Interpretation'}</h3>
            </div>
            <p className="text-[10px] text-gray-400 mt-1 font-semibold">
              AI Smart Regulatory Translation • SAMA Audit Compliant Response
            </p>
          </div>
          <span className="px-3 py-1 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 rounded-lg text-[10px] font-black uppercase tracking-wider">
            {isRTL ? 'المراجعة الفورية المعتمدة' : 'Immediate Certified Review'}
          </span>
        </div>

        {/* Custom RTL Callout for beautiful Arabic typography */}
        <div className="space-y-4" dir="rtl">
          <p className="text-sm md:text-base font-bold text-gray-100 leading-loose text-justify font-sans">
            {analysis.arabic_explanation}
          </p>
        </div>

        {/* Highlighted Warning Banner for High Risk */}
        {analysis.fraud_probability > 40 && (
          <div className={`mt-6 flex items-center gap-3 p-4 bg-red-950/40 border border-red-900/60 rounded-2xl text-red-400 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <div className="text-xs font-bold leading-relaxed">
              <span className="font-extrabold text-red-300">{isRTL ? 'إجراء أمني مطلوب:' : 'Security action required:'}</span> {isRTL ? 'يتطلب هذا التنبيه اتخاذ إجراء فوري وتعليق العمليات المالية لهذا الحساب حتى إتمام التحقق الثنائي للأرقام والمصادقة الوطنية.' : 'This alert requires immediate action and suspension of financial operations for this account until two-factor authentication and national verification are complete.'}
            </div>
          </div>
        )}

        {/* Highlighted Success Banner for Low Risk */}
        {(analysis.risk_level?.toUpperCase() === 'LOW' || analysis.risk_level?.toUpperCase() === 'SAFE' || analysis.fraud_probability <= 40) && (
          <div className={`mt-6 flex items-center gap-3 p-4 bg-emerald-950/40 border border-emerald-900/60 rounded-2xl text-emerald-400 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <div className="text-xs font-bold leading-relaxed">
              <span className="font-extrabold text-emerald-300">{isRTL ? 'العملية آمنة:' : 'Transaction safe:'}</span> {isRTL ? 'تم فحص متجهات هذه العملية ومطابقتها بمعايير الأمان المصرفية بنجاح. لا توجد مؤشرات اشتباه حرج والعملية تبدو آمنة بالكامل.' : 'This transaction has been successfully analyzed and matched against SAMA compliance security baselines. No anomalies detected and the transaction appears completely safe.'}
            </div>
          </div>
        )}
      </div>

      {/* Transaction Details & Dangerous Field Highlights */}
      <div className="bg-white dark:bg-[#070e17] rounded-3xl p-8 border border-gray-100 dark:border-gray-800/60 shadow-sm">
        <h3 className={`text-lg font-bold text-[#001939] dark:text-white mb-6 ${isRTL ? 'text-right' : ''}`}>
          {isRTL ? 'بيانات الأمان وسجلات المراجعة الرقابية' : 'Security Metadata & Verification Log'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card: IP Address */}
          <div className={`p-5 rounded-2xl border transition-all ${
            activeTransaction.riskIndicators?.vpnUse 
              ? 'bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-400 animate-pulse'
              : 'bg-gray-50 dark:bg-[#0b1524] border-gray-100 dark:border-gray-800/60 text-gray-600 dark:text-gray-300'
          }`}>
            <div className={`flex justify-between items-start mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 dark:text-gray-500">
                {isRTL ? 'عنوان الآي بي' : 'IP Address'}
              </span>
              <Globe className="w-4 h-4" />
            </div>
            <p className="text-sm font-extrabold">{activeTransaction.ipAddress || '185.2.44.112'}</p>
            {activeTransaction.riskIndicators?.vpnUse && (
              <span className="text-[9px] font-black uppercase tracking-widest text-red-500 dark:text-red-400 block mt-2">
                ⚠️ {isRTL ? 'تم رصد اتصال VPN مشبوه' : 'SUSPICIOUS VPN DETECTED'}
              </span>
            )}
          </div>

          {/* Card: Geographic Location */}
          <div className={`p-5 rounded-2xl border transition-all ${
            activeTransaction.riskIndicators?.mismatchedGeo 
              ? 'bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-400 animate-pulse'
              : 'bg-gray-50 dark:bg-[#0b1524] border-gray-100 dark:border-gray-800/60 text-gray-600 dark:text-gray-300'
          }`}>
            <div className={`flex justify-between items-start mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 dark:text-gray-500">
                {isRTL ? 'موقع الجهاز' : 'Device Location'}
              </span>
              <MapPin className="w-4 h-4" />
            </div>
            <p className="text-sm font-extrabold">{activeTransaction.location || 'Riyadh, Saudi Arabia'}</p>
            {activeTransaction.riskIndicators?.mismatchedGeo && (
              <span className="text-[9px] font-black uppercase tracking-widest text-red-500 dark:text-red-400 block mt-2">
                ⚠️ {isRTL ? 'تباعد جغرافي غير متناسق' : 'GEOGRAPHIC MISMATCH'}
              </span>
            )}
          </div>

          {/* Card: Velocity Check */}
          <div className={`p-5 rounded-2xl border transition-all ${
            activeTransaction.riskIndicators?.highVelocity 
              ? 'bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-400'
              : 'bg-gray-50 dark:bg-[#0b1524] border-gray-100 dark:border-gray-800/60 text-gray-600 dark:text-gray-300'
          }`}>
            <div className={`flex justify-between items-start mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 dark:text-gray-500">
                {isRTL ? 'وتيرة العمليات' : 'Velocity Speed'}
              </span>
              <Zap className="w-4 h-4" />
            </div>
            <p className="text-sm font-extrabold">
              {activeTransaction.riskIndicators?.highVelocity ? (isRTL ? 'نشاط مفاجئ (١٢ عملية/د)' : 'Spike (12 tx/min)') : (isRTL ? 'طبيعي' : 'Normal')}
            </p>
            {activeTransaction.riskIndicators?.highVelocity && (
              <span className="text-[9px] font-black uppercase tracking-widest text-red-500 dark:text-red-400 block mt-2">
                ⚠️ {isRTL ? 'حظر العمليات السريعة المتتالية' : 'RAPID ATTEMPTS BLOCK'}
              </span>
            )}
          </div>

          {/* Card: Device Fingerprint */}
          <div className="p-5 bg-gray-50 dark:bg-[#0b1524] border border-gray-100 dark:border-gray-800/60 rounded-2xl text-gray-600 dark:text-gray-300">
            <div className={`flex justify-between items-start mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 dark:text-gray-500">
                {isRTL ? 'بصمة وتفاصيل الجهاز' : 'Device Fingerprint'}
              </span>
              <Smartphone className="w-4 h-4" />
            </div>
            <p className="text-sm font-extrabold truncate">{activeTransaction.deviceId || 'df882-xa11'}</p>
            <span className="text-[9px] font-semibold text-gray-400 dark:text-gray-500 block mt-2">
              {isRTL ? 'نظام تشغيل ومتصفح موثق' : 'Verified OS & Browser'}
            </span>
          </div>

        </div>
      </div>

      {/* Action triggers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        
        {/* Notes input */}
        <div className="bg-white dark:bg-[#070e17] rounded-3xl p-8 border border-gray-100 dark:border-gray-800/60 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className={`text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4 ${isRTL ? 'text-right' : ''}`}>
              {isRTL ? 'سجل التدقيق والملاحظات الداخلية للامتثال' : 'Audit Logs & Internal Comments'}
            </h3>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="w-full p-4 bg-gray-50 dark:bg-[#0b1524] border border-gray-100 dark:border-gray-800 focus:ring-2 focus:ring-[#006A4E] dark:focus:ring-emerald-500 focus:border-transparent outline-none transition-all resize-none min-h-[120px] rounded-2xl text-xs font-semibold text-gray-850 dark:text-gray-100"
              placeholder={isRTL ? "أضف تبرير فك تجميد البطاقة أو حظر العميل وملاحظات الامتثال لساما هنا..." : "Add SAMA compliance override notes or justification before approving..."}
            />
          </div>
        </div>

        {/* Action button container */}
        <div className="flex flex-col justify-between gap-4">
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleApproveAction}
              disabled={isApproving || isRejecting}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white h-14 rounded-2xl font-black text-xs shadow-lg shadow-emerald-500/10 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer border-none"
            >
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{isApproving ? (isRTL ? 'جاري الاعتماد والمصادقة...' : 'AUTHORIZING...') : (isRTL ? 'اعتماد وتحرير العملية' : 'APPROVE TRANSACTION')}</span>
            </button>
            <button
              onClick={handleRejectAction}
              disabled={isApproving || isRejecting}
              className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white h-14 rounded-2xl font-black text-xs shadow-lg shadow-red-500/10 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer border-none"
            >
              <XCircle className="w-5 h-5 shrink-0" />
              <span>{isRejecting ? (isRTL ? 'جاري الرفض وتجميد الحساب...' : 'REJECTING...') : (isRTL ? 'رفض وتجميد بطاقة العميل' : 'REJECT & LOCK CARD')}</span>
            </button>
          </div>

          <button className="bg-[#001939] dark:bg-[#002e59] hover:bg-[#0b2e59] text-white h-14 rounded-2xl font-black text-xs transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer border-none">
            <span>{isRTL ? 'تصعيد القضية للبنك المركزي السعودي (ساما)' : 'ESCALATE TO SAMA FRAUD INVESTIGATION'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
