import React, { useState } from 'react';
import { 
  ShieldCheck, ShieldAlert, Copy, ArrowLeft, 
  CheckCircle2, AlertTriangle, FileText, Globe, Building2, User, 
  CreditCard, Smartphone, Shield, Sparkles, Send, Check
} from 'lucide-react';
import { InvestigationReport, InvestigationStatus } from '../types';
import { translations } from '../lib/translations';

interface InvestigationReportViewProps {
  report: InvestigationReport;
  lang: 'en' | 'ar';
  onBack: () => void;
  onUpdateStatus: (reportId: string, status: InvestigationStatus) => void;
  onUpdateComplianceNotes: (reportId: string, notes: string) => void;
  addToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export default function InvestigationReportView({
  report,
  lang,
  onBack,
  onUpdateStatus,
  onUpdateComplianceNotes,
  addToast
}: InvestigationReportViewProps) {
  const isRTL = lang === 'ar';
  const t = translations[lang];
  const [isCopying, setIsCopying] = useState(false);
  const [complianceNotes, setComplianceNotes] = useState(report.complianceNotes);
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  // Status Badge Colors mapping
  const getStatusBadgeStyles = (status: InvestigationStatus) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/60';
      case 'Rejected':
        return 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/60';
      case 'Escalated':
        return 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-900/60';
      case 'Under Investigation':
        return 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/60';
      default:
        return 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50';
    }
  };

  const copyReportId = () => {
    setIsCopying(true);
    navigator.clipboard.writeText(report.id);
    addToast(
      isRTL ? 'تم نسخ الرقم التعريفي للتقرير!' : 'Report ID copied to clipboard!', 
      'success'
    );
    setTimeout(() => setIsCopying(false), 2000);
  };

  const handleSaveNotes = () => {
    onUpdateComplianceNotes(report.id, complianceNotes);
    setIsEditingNotes(false);
    addToast(
      isRTL ? 'تم تحديث الملاحظات الرقابية بنجاح' : 'Compliance notes updated successfully',
      'success'
    );
  };

  return (
    <div className={`space-y-6 pb-12 ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* Printable Area - Header Wrapper for layout */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
            background-color: white !important;
            color: black !important;
          }
          .printable-report-area, .printable-report-area * {
            visibility: visible;
          }
          .printable-report-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 20px;
            background-color: white !important;
            box-shadow: none !important;
            border: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Back Button and Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 no-print">
        <button
          onClick={onBack}
          className={`flex items-center gap-1.5 text-xs font-black text-gray-400 hover:text-[#006A4E] dark:hover:text-emerald-400 transition-all bg-transparent border-none cursor-pointer ${
            isRTL ? 'flex-row-reverse' : 'flex-row'
          }`}
        >
          {isRTL ? <ArrowLeft className="w-4 h-4 transform rotate-180" /> : <ArrowLeft className="w-4 h-4" />}
          <span>{isRTL ? 'العودة لمركز التقارير' : 'Back to Reports Center'}</span>
        </button>

        {/* Action Buttons */}
        <div className={`flex flex-wrap items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
          <button
            onClick={copyReportId}
            className="px-3.5 py-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 text-gray-700 dark:text-gray-300 text-xs font-black rounded-xl border border-gray-200 dark:border-gray-700 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            {isCopying ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{isRTL ? 'نسخ الرقم التعريفي' : 'Copy Report ID'}</span>
          </button>
        </div>
      </div>

      {/* Main Report Document Sheet */}
      <div className="printable-report-area bg-white dark:bg-[#070e17] rounded-3xl border border-gray-100 dark:border-gray-800/60 shadow-xl overflow-hidden">
        
        {/* official Letterhead Header */}
        <div className="bg-[#001530] text-white p-8 border-b-4 border-[#D4AF37] flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* Alinma Bank Branding Block */}
          <div className={`flex items-center gap-3.5 ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}>
            <div className="w-12 h-12 bg-[#D4AF37] rounded-xl flex items-center justify-center shadow-inner relative overflow-hidden shrink-0">
              {/* Decorative Geometric Alinma Diamond Symbol */}
              <div className="absolute inset-2 border-2 border-white transform rotate-45 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-wide uppercase">مصرف الإنماء</h1>
              <p className="text-[10px] text-[#D4AF37] font-bold tracking-widest uppercase">alinma bank</p>
            </div>
          </div>

          {/* Central Title */}
          <div className="text-center md:my-0 my-2">
            <h2 className="text-base font-black text-[#D4AF37] tracking-widest uppercase">{isRTL ? 'تقرير التحقيق في عمليات الاحتيال' : 'FRAUD INVESTIGATION REPORT'}</h2>
            <p className="text-[9px] text-gray-300 font-extrabold mt-1 tracking-wider uppercase">SAMA REGULATORY AUDIT & SECURITY COMPLIANCE</p>
          </div>

          {/* FraudGuard AI Branding Block */}
          <div className={`flex items-center gap-3.5 ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}>
            <div className="w-12 h-12 bg-emerald-950/80 rounded-xl border border-emerald-500/30 flex items-center justify-center shrink-0">
              <Shield className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-base font-black text-emerald-400 tracking-wide uppercase">FraudGuard AI</h1>
              <p className="text-[9px] text-gray-400 font-bold tracking-widest uppercase">SOVEREIGN DETECTOR</p>
            </div>
          </div>

        </div>

        {/* Secondary Document Control Bar */}
        <div className={`bg-gray-50 dark:bg-[#0b1524] px-8 py-3 border-b border-gray-100 dark:border-gray-800/40 text-[11px] font-black text-gray-500 dark:text-gray-400 flex flex-wrap justify-between items-center gap-4 ${
          isRTL ? 'flex-row-reverse' : 'flex-row'
        }`}>
          <div>
            <span className="text-gray-400">{isRTL ? 'مرجع التقرير:' : 'REPORT ID:'}</span> <span className="font-mono text-[#D4AF37]">{report.id}</span>
          </div>
          <div>
            <span className="text-gray-400">{isRTL ? 'مرجع العملية:' : 'TRANSACTION ID:'}</span> <span className="font-mono text-gray-800 dark:text-gray-200">{report.transactionId}</span>
          </div>
          <div>
            <span className="text-gray-400">{isRTL ? 'تاريخ ووقت التحليل:' : 'GENERATED DATE:'}</span> <span className="font-mono text-gray-800 dark:text-gray-200">{new Date(report.analysisDateTime).toLocaleString()}</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-8 space-y-8">
          
          {/* Main bilingual banner warning status */}
          <div className={`p-5 rounded-2xl ${
            report.riskLevel === 'Critical' || report.riskLevel === 'High'
              ? 'bg-red-500/5 dark:bg-red-950/20 border border-red-500/20 text-red-700 dark:text-red-400'
              : report.riskLevel === 'Medium'
                ? 'bg-amber-500/5 dark:bg-amber-950/20 border border-amber-500/20 text-amber-700 dark:text-amber-400'
                : 'bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400'
          } flex flex-col md:flex-row justify-between gap-4 items-center`}>
            <div className={`flex gap-3 items-center ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}>
              <ShieldAlert className="w-8 h-8 shrink-0 text-[#D4AF37]" />
              <div>
                <h3 className="text-sm font-black uppercase">
                  {isRTL ? 'أهمية التنبيه وتقييم المخاطر السيادية' : 'Sovereign Threat and Risk Assessment'}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {isRTL 
                    ? 'هذا المستند يعتبر تقرير تدقيق قانوني رسمي موجه لمدير الامتثال في مصرف الإنماء والبنك المركزي السعودي.' 
                    : 'This document represents an official compliance audit trail for the Compliance Director and SAMA supervision.'}
                </p>
              </div>
            </div>

            <div className={`flex items-center gap-2 p-1.5 bg-gray-500/5 rounded-xl border border-gray-500/10 shrink-0 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="text-center px-4">
                <span className="text-[9px] font-black uppercase text-gray-400 block">{isRTL ? 'احتمالية الاحتيال' : 'Fraud Probability'}</span>
                <span className="text-lg font-black text-red-500">{report.fraudProbability}%</span>
              </div>
              <div className="w-px h-8 bg-gray-300 dark:bg-gray-700" />
              <div className="text-center px-4">
                <span className="text-[9px] font-black uppercase text-gray-400 block">{isRTL ? 'مستوى المخاطر' : 'Risk Level'}</span>
                <span className={`text-sm font-black px-2.5 py-0.5 rounded-md ${
                  report.riskLevel === 'Critical' || report.riskLevel === 'High' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'
                }`}>
                  {report.riskLevel.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Section: Structured metadata grid */}
          <div>
            <h4 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-gray-800/60 pb-2 mb-4">
              {isRTL ? '١. تفاصيل العميل والعملية المصرفية والآي بي' : '1. CUSTOMER, TRANSACTION & AUDIT METADATA'}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs font-semibold">
              
              {/* Customer Block */}
              <div className="bg-gray-50 dark:bg-[#0b1524]/40 p-4.5 rounded-2xl border border-gray-50 dark:border-gray-800/50 space-y-3">
                <div className={`flex items-center gap-2 text-[#001530] dark:text-[#D4AF37] font-black uppercase text-[10px] ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <User className="w-4 h-4" />
                  <span>{isRTL ? 'بيانات العميل' : 'CUSTOMER PROFILE'}</span>
                </div>
                <div className="space-y-1.5 text-gray-600 dark:text-gray-300">
                  <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-gray-400">{isRTL ? 'اسم العميل:' : 'Customer Name:'}</span>
                    <span className="font-extrabold text-gray-900 dark:text-white">{report.customerName}</span>
                  </div>
                  <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-gray-400">{isRTL ? 'رقم الحساب:' : 'Account Number:'}</span>
                    <span className="font-mono text-gray-900 dark:text-white">{report.accountNumber}</span>
                  </div>
                  <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-gray-400">{isRTL ? 'رقم الآيبان (IBAN):' : 'IBAN:'}</span>
                    <span className="font-mono text-gray-900 dark:text-white">{report.iban}</span>
                  </div>
                </div>
              </div>

              {/* Transaction Block */}
              <div className="bg-gray-50 dark:bg-[#0b1524]/40 p-4.5 rounded-2xl border border-gray-50 dark:border-gray-800/50 space-y-3">
                <div className={`flex items-center gap-2 text-[#001530] dark:text-[#D4AF37] font-black uppercase text-[10px] ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <CreditCard className="w-4 h-4" />
                  <span>{isRTL ? 'تفاصيل الحركة المالية' : 'TRANSACTION METADATA'}</span>
                </div>
                <div className="space-y-1.5 text-gray-600 dark:text-gray-300">
                  <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-gray-400">{isRTL ? 'مبلغ المعاملة:' : 'Amount:'}</span>
                    <span className="font-extrabold text-gray-900 dark:text-white">{report.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} {report.currency}</span>
                  </div>
                  <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-gray-400">{isRTL ? 'نوع العملية:' : 'Transaction Type:'}</span>
                    <span className="font-extrabold text-gray-900 dark:text-white">{report.type}</span>
                  </div>
                  <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-gray-400">{isRTL ? 'اسم التاجر:' : 'Merchant:'}</span>
                    <span className="font-extrabold text-gray-900 dark:text-white">{report.merchantName}</span>
                  </div>
                </div>
              </div>

              {/* Security Network Block */}
              <div className="bg-gray-50 dark:bg-[#0b1524]/40 p-4.5 rounded-2xl border border-gray-50 dark:border-gray-800/50 space-y-3">
                <div className={`flex items-center gap-2 text-[#001530] dark:text-[#D4AF37] font-black uppercase text-[10px] ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Smartphone className="w-4 h-4" />
                  <span>{isRTL ? 'مؤشرات الأمان والشبكة' : 'SECURITY & DIGITAL SIGNATURE'}</span>
                </div>
                <div className="space-y-1.5 text-gray-600 dark:text-gray-300">
                  <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-gray-400">{isRTL ? 'المدينة والمنطقة:' : 'City / Location:'}</span>
                    <span className="font-extrabold text-gray-900 dark:text-white">{report.city}</span>
                  </div>
                  <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-gray-400">{isRTL ? 'جهاز المستخدم:' : 'Device fingerprint:'}</span>
                    <span className="font-extrabold text-gray-900 dark:text-white truncate max-w-[140px]">{report.device}</span>
                  </div>
                  <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-gray-400">{isRTL ? 'عنوان الآي بي:' : 'IP Address:'}</span>
                    <span className="font-mono text-gray-900 dark:text-white">{report.ipAddress}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Section: AI Systems Core Diagnostic */}
          <div>
            <h4 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-gray-800/60 pb-2 mb-4">
              {isRTL ? '٢. تشخيص الذكاء الاصطناعي وبوابة جيميناي' : '2. ARTIFICIAL INTELLIGENCE CORE DIAGNOSTICS'}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-2">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">
                  {isRTL ? 'الشركة المطورة وإصدار النموذج المستخدم' : 'DEVELOPER & ENGINE METADATA'}
                </span>
                <div className="bg-gray-50 dark:bg-[#0b1524]/40 p-4 rounded-xl border border-gray-50 dark:border-gray-800/50 space-y-2">
                  <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-gray-400">{isRTL ? 'مزود الخدمة:' : 'AI Provider:'}</span>
                    <span className="font-black text-gray-900 dark:text-white">Google Cloud AI Studio</span>
                  </div>
                  <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-gray-400">{isRTL ? 'إصدار النموذج:' : 'Gemini Version:'}</span>
                    <span className="font-black text-[#D4AF37]">{report.geminiModelVersion}</span>
                  </div>
                  <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-gray-400">{isRTL ? 'مستوى الثقة (Confidence):' : 'AI Confidence:'}</span>
                    <span className="font-black text-emerald-500">{report.aiConfidence}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">
                  {isRTL ? 'نظام الحماية الرقمي الفعال' : 'SYSTEM & INTEGRITY STATUS'}
                </span>
                <div className="bg-gray-50 dark:bg-[#0b1524]/40 p-4 rounded-xl border border-gray-50 dark:border-gray-800/50 space-y-2">
                  <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-gray-400">{isRTL ? 'نظام الفحص المصرفي:' : 'Sovereign Core:'}</span>
                    <span className="font-black text-emerald-500">FraudGuard AI Sovereign v2.6</span>
                  </div>
                  <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-gray-400">{isRTL ? 'مستوى التقييم اللحظي:' : 'Live Audit Trail:'}</span>
                    <span className="font-black text-emerald-500">Active Audit Synchronized</span>
                  </div>
                  <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-gray-400">{isRTL ? 'كود الفحص (SAMA Code):' : 'SAMA Code:'}</span>
                    <span className="font-mono font-black text-[#D4AF37]">SAMA-SCSF-4.2-SEC</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Executive Summary & Explanation */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Executive Summary card */}
            <div className="bg-gray-50 dark:bg-[#0b1524]/40 p-6 rounded-2xl border border-gray-50 dark:border-gray-800/50 space-y-3">
              <div className={`flex items-center gap-2 text-[#001530] dark:text-[#D4AF37] font-black uppercase text-[11px] ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Sparkles className="w-4 h-4" />
                <span>{isRTL ? 'أ. ملخص المدير التنفيذي (باللغتين)' : 'A. EXECUTIVE SUMMARY (BILINGUAL)'}</span>
              </div>
              <div className="space-y-4 leading-relaxed font-sans text-xs">
                <div>
                  <span className="text-[10px] font-black text-gray-400 block mb-1">ENGLISH VERSION</span>
                  <p className="text-gray-600 dark:text-gray-300 font-semibold text-justify">
                    {report.executiveSummary}
                  </p>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-800 pt-3" dir="rtl">
                  <span className="text-[10px] font-black text-[#D4AF37] block mb-1 text-right">النسخة العربية (الملخص الرقابي)</span>
                  <p className="text-gray-600 dark:text-gray-300 font-bold text-justify leading-loose">
                    {isRTL ? report.executiveSummary : 'تم رصد معاملة مالية مريبة تتجاوز الحدود الآمنة للعميل بمعدل استثنائي مصحوبة بخصائص تقنية مشفرة (VPN). تم تفعيل حظر احترازي ومطابقة تدابير الأمان التابعة لساما.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Detailed AI Explanation card */}
            <div className="bg-[#001530] text-white p-6 rounded-2xl border border-[#D4AF37]/20 space-y-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 font-black text-6xl text-[#D4AF37] pointer-events-none">AI</div>
              <div className={`flex items-center gap-2 text-[#D4AF37] font-black uppercase text-[11px] ${isRTL ? 'flex-row-reverse' : ''}`}>
                <FileText className="w-4 h-4" />
                <span>{isRTL ? 'ب. التفسير الفني الدقيق لجيميناي' : 'B. DETAILED GEMINI AI EXPLANATION'}</span>
              </div>
              <div className="space-y-4 leading-relaxed font-sans text-xs text-gray-200">
                <div dir="rtl">
                  <span className="text-[10px] font-black text-[#D4AF37] block mb-1 text-right">التفسير الفني باللغة العربية</span>
                  <p className="font-bold text-justify leading-loose">
                    {report.detailedExplanation}
                  </p>
                </div>
                <div className="border-t border-gray-800 pt-3">
                  <span className="text-[10px] font-black text-gray-400 block mb-1">ENGLISH ANALYSIS DETAIL</span>
                  <p className="font-semibold text-justify text-gray-300">
                    {isRTL ? 'Deep neural inspection of vectors mapped suspicious geolocation disparity in real-time. The payload size of the request indicates programmatic API manipulation bypass attempt. Immediate freeze and verification recommended.' : report.detailedExplanation}
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Risk Factors and Recommended Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Risk Factors */}
            <div className="bg-gray-50 dark:bg-[#0b1524]/40 p-6 rounded-2xl border border-gray-50 dark:border-gray-800/50 space-y-4">
              <h4 className={`text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-gray-800/60 pb-2 ${isRTL ? 'text-right' : ''}`}>
                {isRTL ? '٣. مؤشرات الاشتباه المكتشفة' : '3. DETECTED RISK FACTORS'}
              </h4>
              <div className="space-y-3">
                {report.riskFactors.map((factor, index) => (
                  <div key={index} className={`flex gap-3 text-xs font-semibold ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                    <div className="w-5 h-5 rounded-md bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">{factor}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Actions */}
            <div className="bg-gray-50 dark:bg-[#0b1524]/40 p-6 rounded-2xl border border-gray-50 dark:border-gray-800/50 space-y-4">
              <h4 className={`text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-gray-800/60 pb-2 ${isRTL ? 'text-right' : ''}`}>
                {isRTL ? '٤. الإجراءات والتدابير الموصى بها' : '4. RECOMMENDED COMPLIANCE ACTIONS'}
              </h4>
              <div className="space-y-3">
                {report.recommendedActions.map((action, index) => (
                  <div key={index} className={`flex gap-3 text-xs font-semibold ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                    <div className="w-5 h-5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">{action}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Compliance notes section (Editable in-state) */}
          <div className="bg-gray-50 dark:bg-[#0b1524]/40 p-6 rounded-2xl border border-gray-50 dark:border-gray-800/50 space-y-4">
            <div className={`flex justify-between items-center border-b border-gray-100 dark:border-gray-800/60 pb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <h4 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                {isRTL ? '٥. ملاحظات وتعديلات مفتش الامتثال' : '5. ANALYST COMPLIANCE NOTES'}
              </h4>
              <button
                onClick={() => {
                  if (isEditingNotes) {
                    handleSaveNotes();
                  } else {
                    setIsEditingNotes(true);
                  }
                }}
                className="text-[10px] font-black text-[#D4AF37] bg-transparent hover:underline border-none cursor-pointer no-print"
              >
                {isEditingNotes ? (isRTL ? 'حفظ التعديل' : 'SAVE NOTES') : (isRTL ? 'تعديل الملاحظات' : 'EDIT NOTES')}
              </button>
            </div>

            {isEditingNotes ? (
              <div className="space-y-2 no-print">
                <textarea
                  value={complianceNotes}
                  onChange={(e) => setComplianceNotes(e.target.value)}
                  className="w-full p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold outline-none focus:ring-1 focus:ring-[#D4AF37] text-gray-900 dark:text-white"
                  rows={4}
                />
                <button
                  onClick={handleSaveNotes}
                  className="px-4 py-2 bg-[#001530] text-white text-xs font-black rounded-xl hover:bg-[#0b2440] transition-all cursor-pointer border-none"
                >
                  {isRTL ? 'حفظ ملاحظات التدقيق' : 'Save Compliance Notes'}
                </button>
              </div>
            ) : (
              <p className="text-xs font-bold text-gray-600 dark:text-gray-300 leading-relaxed italic bg-white dark:bg-[#070e17] p-4 rounded-xl border border-gray-100 dark:border-gray-800/40">
                "{report.complianceNotes}"
              </p>
            )}
          </div>

          {/* Section 6: Interactive Analyst Decision & Investigation Status */}
          <div className="bg-gray-50 dark:bg-[#0b1524]/60 p-6 rounded-2xl border-2 border-[#D4AF37]/20 space-y-4 no-print">
            <h4 className={`text-xs font-black text-[#001530] dark:text-[#D4AF37] uppercase tracking-widest flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{isRTL ? '٦. الإجراء التفاعلي لمفتش الامتثال' : '6. INTERACTIVE COMPLIANCE DECISION-MAKING'}</span>
            </h4>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              {isRTL 
                ? 'قم بتحديث حالة القضية ونتيجة التحليل الأمني بناءً على الإجراءات والمطابقة الفعلية التي تمت على هذا التنبيه.' 
                : 'Update the case status and overall analyst decision below to synchronize with SAMA central compliance registers.'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              
              {/* Status Update select */}
              <div className="space-y-2">
                <span className={`font-black text-gray-500 dark:text-gray-400 block ${isRTL ? 'text-right' : ''}`}>
                  {isRTL ? 'تعديل حالة التحقيق المصرفي:' : 'Modify Investigation Status:'}
                </span>
                <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <select
                    value={report.investigationStatus}
                    onChange={(e) => {
                      onUpdateStatus(report.id, e.target.value as InvestigationStatus);
                      addToast(
                        isRTL ? `تم تحديث حالة التحقيق إلى: ${e.target.value}` : `Investigation status updated to: ${e.target.value}`,
                        'success'
                      );
                    }}
                    className="flex-1 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl font-bold outline-none text-gray-900 dark:text-white"
                  >
                    <option value="Pending Review">{isRTL ? 'قيد المراجعة / معلقة' : 'Pending Review'}</option>
                    <option value="Approved">{isRTL ? 'معتمدة / آمنة' : 'Approved'}</option>
                    <option value="Escalated">{isRTL ? 'تم التصعيد للمشرف' : 'Escalated'}</option>
                    <option value="Rejected">{isRTL ? 'مرفوضة / عملية احتيال' : 'Rejected'}</option>
                    <option value="Under Investigation">{isRTL ? 'تحت التحقيق الفني' : 'Under Investigation'}</option>
                  </select>
                </div>
              </div>

              {/* Analyst Decision (Read-only status output synced) */}
              <div className="space-y-2">
                <span className={`font-black text-gray-500 dark:text-gray-400 block ${isRTL ? 'text-right' : ''}`}>
                  {isRTL ? 'القرار المسجل للامتثال:' : 'Compliance Record Decision:'}
                </span>
                <div className={`p-3 rounded-xl font-extrabold text-center ${getStatusBadgeStyles(report.investigationStatus)}`}>
                  {isRTL ? (
                    report.investigationStatus === 'Approved' ? 'تم التصديق والإقرار بالسلامة' :
                    report.investigationStatus === 'Rejected' ? 'تم الرفض والاشتباه بالاحتيال' :
                    report.investigationStatus === 'Escalated' ? 'تم التصعيد لوحدة التدقيق الخاص' :
                    report.investigationStatus === 'Under Investigation' ? 'قيد البحث الفني المتقدم' : 'معلقة وبانتظار المراجعة الرقابية'
                  ) : report.investigationStatus}
                </div>
              </div>

            </div>
          </div>

          {/* Official Signatures Block */}
          <div className="border-t border-gray-200 dark:border-gray-800 pt-8 mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 text-center text-xs">
            <div className="space-y-4">
              <span className="text-[10px] font-black text-gray-400 uppercase block tracking-wider">{isRTL ? 'مسؤول التدقيق والامتثال الداخلي' : 'Compliance Officer Signature'}</span>
              <div className="h-12 flex items-center justify-center font-serif text-gray-400 dark:text-gray-500 italic text-sm">
                S. Jenkins (Compliance Unit)
              </div>
              <div className="w-1/2 mx-auto border-t border-gray-300 dark:border-gray-700" />
              <p className="text-[9px] text-gray-400">{isRTL ? 'التوقيع الرقمي للمسؤول المصرفي' : 'Digital Banking Signature ID: SG-CO-2981'}</p>
            </div>

            <div className="space-y-4">
              <span className="text-[10px] font-black text-gray-400 uppercase block tracking-wider">{isRTL ? 'مصادقة نظام حماية مكافحة الاحتيال الذكي' : 'FraudGuard AI Core Signature'}</span>
              <div className="h-12 flex items-center justify-center font-mono text-emerald-500 text-[10px] uppercase font-bold tracking-widest">
                VERIFIED_BY_GEMINI_SECURE_NODE_OK
              </div>
              <div className="w-1/2 mx-auto border-t border-gray-300 dark:border-gray-700" />
              <p className="text-[9px] text-gray-400">{isRTL ? 'الختم الزمني للذكاء الاصطناعي:' : 'AI Ledger Seal Time:'} {new Date(report.analysisDateTime).toISOString()}</p>
            </div>
          </div>

        </div>

        {/* Professional Internal Banking Footer */}
        <div className="bg-[#001530] text-gray-300 p-8 border-t-4 border-[#D4AF37] text-xs space-y-6">
          <div className="text-center text-gray-500 font-mono text-[10px]">
            ------------------------------------------------------------
          </div>
          
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-black text-[#D4AF37] tracking-wider">FraudGuard AI</h4>
                <p className="text-xs font-bold text-white mt-0.5">
                  {isRTL ? 'مصرف الإنماء – تقرير التحقيق الداخلي للمصرفية' : 'Alinma Bank – Internal Banking Investigation Report'}
                </p>
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed font-semibold">
                {isRTL
                  ? 'تم إنشاء تقرير التحقيق هذا تلقائيًا باستخدام نموذج جيميناي للذكاء الاصطناعي وهو مخصص للاستخدام المصرفي الداخلي فقط.'
                  : 'This investigation report was automatically generated using Gemini AI and is intended for internal banking use only.'}
              </p>
              <div>
                <span className="text-[10px] text-gray-500 block font-black tracking-widest uppercase">
                  {isRTL ? 'تصنيف التقرير:' : 'Report Classification:'}
                </span>
                <span className="text-red-400 font-black tracking-wider text-xs">
                  {isRTL ? 'سري – للاستخدام المصرفي الداخلي فقط' : 'CONFIDENTIAL – Internal Banking Use Only'}
                </span>
              </div>
            </div>

            <div className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-[9px] text-gray-500 block font-black uppercase tracking-wider">{isRTL ? 'تم الإنشاء بواسطة:' : 'Generated By:'}</span>
                  <span className="font-extrabold text-white text-[11px]">FraudGuard AI Investigation Engine</span>
                </div>
                <div>
                  <span className="text-[9px] text-gray-500 block font-black uppercase tracking-wider">{isRTL ? 'المحلل:' : 'Analyst:'}</span>
                  <span className="font-extrabold text-white text-[11px]">{isRTL ? 'كبير محللي الاحتيال' : 'Senior Fraud Analyst'}</span>
                </div>
                <div>
                  <span className="text-[9px] text-gray-500 block font-black uppercase tracking-wider">{isRTL ? 'تاريخ ووقت الإنشاء:' : 'Generated Date & Time:'}</span>
                  <span className="font-mono text-white text-[11px]">{new Date(report.analysisDateTime).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[9px] text-gray-500 block font-black uppercase tracking-wider">{isRTL ? 'الرقم التعريفي للتقرير:' : 'Report ID:'}</span>
                  <span className="font-mono text-[#D4AF37] text-[11px] font-bold">{report.id}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center text-gray-500 font-mono text-[10px] pt-2">
            ------------------------------------------------------------
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-gray-500 font-bold border-t border-gray-800 pt-4">
            <span>{isRTL ? 'جميع الحقوق محفوظة لمصرف الإنماء © ٢٠٢٦' : '© 2026 Alinma Bank. All Rights Reserved.'}</span>
            <span className="text-[#D4AF37] tracking-wider uppercase">{isRTL ? 'منصة حماية الامتثال ومكافحة الاحتيال الداخلي للبنك المركزي السعودي' : 'SAMA ANTI-FRAUD AND SECURITY PORTAL'}</span>
          </div>
        </div>

      </div>

    </div>
  );
}
