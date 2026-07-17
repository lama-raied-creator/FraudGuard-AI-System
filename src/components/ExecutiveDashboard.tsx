import React, { useState } from 'react';
import { 
  CreditCard, AlertTriangle, CheckCircle, Shield, Brain, Clock, 
  ShieldAlert, MoreVertical, Compass, Sparkles, TrendingUp, AlertCircle,
  Eye, HelpCircle, User, ArrowRight, ArrowLeft, ShieldCheck, FileText,
  Activity, Database, Cpu, Layers, Wifi, RefreshCw, AlertOctagon
} from 'lucide-react';
import { Transaction, Screen, InvestigationReport, Alert } from '../types';
import { translations } from '../lib/translations';

interface ExecutiveDashboardProps {
  transactions: Transaction[];
  onNavigate: (id: string) => void;
  onBlockTransaction: (id: string) => void;
  lang: 'en' | 'ar';
  darkMode?: boolean;
  onInspectTransaction: (txn: Transaction) => void;
  cases?: any[];
  reportsCount?: number;
  reports?: InvestigationReport[];
  isGeminiApiConnected?: boolean;
  alerts?: Alert[];
}

export default function ExecutiveDashboard({ 
  transactions, 
  onNavigate, 
  onBlockTransaction,
  lang,
  darkMode = true,
  onInspectTransaction,
  cases,
  reportsCount = 0,
  reports = [],
  isGeminiApiConnected = true,
  alerts = []
}: ExecutiveDashboardProps) {
  const t = translations[lang];
  const isRTL = lang === 'ar';
  const [hoveredHotspot, setHoveredHotspot] = useState<string | null>(null);
  const [selectedDays, setSelectedDays] = useState('7');

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterRisk, setFilterRisk] = useState<string>('All');
  const [filterType, setFilterType] = useState<string>('All');
  const [filterChannel, setFilterChannel] = useState<string>('All');
  const [filterMinAmount, setFilterMinAmount] = useState<number | ''>('');
  const [filterMaxAmount, setFilterMaxAmount] = useState<number | ''>('');
  const [filterCity, setFilterCity] = useState<string>('All');
  const [filterDate, setFilterDate] = useState<string>('');

  const getTxRiskLevel = (t: Transaction): 'Safe' | 'Medium' | 'High' | 'Critical' => {
    if (t.status === 'Safe') return 'Safe';
    if (t.status === 'Medium') return 'Medium';
    // Status is 'High' - split into High and Critical based on score >= 90
    if (t.aiRiskScore >= 90) return 'Critical';
    return 'High';
  };

  const uniqueCities = Array.from(
    new Set(
      transactions
        .map(t => {
          if (!t.location) return '';
          return t.location.split(',')[0].trim();
        })
        .filter(Boolean)
    )
  ).sort();

  const filteredTransactions = transactions.filter(txn => {
    // Risk filter
    if (filterRisk !== 'All') {
      const risk = getTxRiskLevel(txn);
      if (risk !== filterRisk) return false;
    }
    // Type filter
    if (filterType !== 'All' && txn.type !== filterType) return false;
    // Channel filter
    if (filterChannel !== 'All') {
      const channel = txn.channel || 'Online';
      if (channel !== filterChannel) return false;
    }
    // Date filter
    if (filterDate !== '') {
      if (!txn.time || !txn.time.startsWith(filterDate)) return false;
    }
    // City filter
    if (filterCity !== 'All') {
      const cityLower = filterCity.toLowerCase();
      if (!txn.location || !txn.location.toLowerCase().includes(cityLower)) return false;
    }
    // Amount range
    if (filterMinAmount !== '' && txn.amount < filterMinAmount) return false;
    if (filterMaxAmount !== '' && txn.amount > filterMaxAmount) return false;
    
    return true;
  });

  // Calculate dynamic volume & statistics from filteredTransactions
  const totalCount = filteredTransactions.length;
  const globalTotalCount = transactions.length;

  const totalVolume = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
  const globalTotalVolume = transactions.reduce((sum, t) => sum + t.amount, 0);

  // Categorize counts
  const safeCount = filteredTransactions.filter(t => getTxRiskLevel(t) === 'Safe').length;
  const mediumCount = filteredTransactions.filter(t => getTxRiskLevel(t) === 'Medium').length;
  const highCount = filteredTransactions.filter(t => getTxRiskLevel(t) === 'High').length;
  const criticalCount = filteredTransactions.filter(t => getTxRiskLevel(t) === 'Critical').length;

  // Percentage Calculations adjusted to sum to exactly 100%
  const getPerfectPercentages = () => {
    if (totalCount === 0) return { safe: '0.0', medium: '0.0', high: '0.0', critical: '0.0' };
    const pSafe = Math.round((safeCount / totalCount) * 1000) / 10;
    const pMedium = Math.round((mediumCount / totalCount) * 1000) / 10;
    const pHigh = Math.round((highCount / totalCount) * 1000) / 10;
    const pCritical = Math.max(0, Math.round((100 - pSafe - pMedium - pHigh) * 10) / 10);
    return {
      safe: pSafe.toFixed(1),
      medium: pMedium.toFixed(1),
      high: pHigh.toFixed(1),
      critical: pCritical.toFixed(1)
    };
  };
  const p = getPerfectPercentages();

  const averageRisk = totalCount > 0 ? (filteredTransactions.reduce((sum, t) => sum + t.aiRiskScore, 0) / totalCount).toFixed(1) : '0.0';

  // Total Suspicious Amount (SAR)
  const suspiciousVolume = filteredTransactions
    .filter(t => getTxRiskLevel(t) !== 'Safe')
    .reduce((sum, t) => sum + t.amount, 0);

  // AI Analyses count from filteredTransactions
  const analyzedCount = filteredTransactions.filter(t => t.aiAnalysis).length;

  // Analysis Coverage
  const getAnalysisCoverage = () => {
    const total = transactions.length;
    if (total === 0) return "0.0%";
    const analyzed = transactions.filter(t => t.aiAnalysis).length;
    return `${((analyzed / total) * 100).toFixed(1)}%`;
  };
  const modelAccuracyValue = getAnalysisCoverage();

  // Format currency
  const formatCurrency = (val: number) => {
    if (val >= 1000000) {
      return isRTL ? `${(val / 1000000).toFixed(2)} م. ر.س` : `SAR ${(val / 1000000).toFixed(2)}M`;
    } else if (val >= 1000) {
      return isRTL ? `${(val / 1000).toFixed(1)} أ. ر.س` : `SAR ${(val / 1000).toFixed(1)}k`;
    } else {
      return isRTL ? `${val.toLocaleString()} ر.س` : `SAR ${val.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
    }
  };

  // KPI Data structure for 12 cards
  const casesCount = cases ? cases.length : 0;
  const kpiData = [
    {
      label: isRTL ? "إجمالي عدد العمليات" : "Total Transactions",
      value: totalCount.toLocaleString(),
      change: isRTL ? `من أصل ${globalTotalCount}` : `out of ${globalTotalCount} total`,
      isPositive: true,
      color: "blue",
      icon: CreditCard
    },
    {
      label: isRTL ? "إجمالي قيمة العمليات" : "Total Transaction Value",
      value: formatCurrency(totalVolume),
      change: isRTL ? `من أصل ${formatCurrency(globalTotalVolume)}` : `out of ${formatCurrency(globalTotalVolume)}`,
      isPositive: true,
      color: "emerald",
      icon: TrendingUp
    },
    {
      label: isRTL ? "العمليات الآمنة" : "Safe Transactions",
      value: safeCount.toLocaleString(),
      change: `${p.safe}%`,
      isPositive: true,
      color: "green",
      icon: ShieldCheck
    },
    {
      label: isRTL ? "المعاملات ذات المخاطر المتوسطة" : "Medium Risk Transactions",
      value: mediumCount.toLocaleString(),
      change: `${p.medium}%`,
      isPositive: false,
      color: "amber",
      icon: AlertTriangle
    },
    {
      label: isRTL ? "المعاملات ذات المخاطر العالية" : "High Risk Transactions",
      value: highCount.toLocaleString(),
      change: `${p.high}%`,
      isPositive: false,
      color: "orange",
      icon: ShieldAlert
    },
    {
      label: isRTL ? "العمليات الحرجة" : "Critical Transactions",
      value: criticalCount.toLocaleString(),
      change: `${p.critical}%`,
      isPositive: criticalCount === 0,
      color: "red",
      icon: AlertCircle
    },
    {
      label: isRTL ? "متوسط مؤشر المخاطر" : "Average Risk Score",
      value: `${averageRisk}%`,
      change: isRTL ? "متوقع" : "Expected",
      isPositive: parseFloat(averageRisk) < 30,
      color: "amber",
      icon: HelpCircle
    },
    {
      label: isRTL ? "إجمالي المبالغ المشبوهة" : "Total Suspicious Amount",
      value: formatCurrency(suspiciousVolume),
      change: isRTL ? "تحت التدقيق" : "Under audit",
      isPositive: suspiciousVolume === 0,
      color: "red",
      icon: AlertTriangle
    },
    {
      label: isRTL ? "التنبيهات النشطة" : "Active Alerts",
      value: (alerts ? alerts.length : 0).toLocaleString(),
      change: isRTL ? "عاجل" : "Urgent",
      isPositive: (alerts ? alerts.length : 0) === 0,
      color: "amber",
      icon: AlertOctagon
    },
    {
      label: isRTL ? "حالات الاحتيال" : "Fraud Cases",
      value: casesCount.toLocaleString(),
      change: isRTL ? "نشط" : "Active",
      isPositive: casesCount === 0,
      color: "red",
      icon: ShieldAlert
    },
    {
      label: isRTL ? "المعاملات التي تم تحليلها" : "Analyzed Transactions",
      value: analyzedCount.toLocaleString(),
      change: isRTL ? "مكتمل" : "Complete",
      isPositive: true,
      color: "purple",
      icon: Brain
    },
    {
      label: isRTL ? "التقارير الرقابية المصدرة" : "Generated Reports",
      value: reportsCount.toLocaleString(),
      change: isRTL ? "مطابق لساما" : "SAMA Compliant",
      isPositive: true,
      color: "emerald",
      icon: FileText
    }
  ];

  // Dynamic Chart Calculations
  const bucketCount = 8;
  const sortedTxnsForChart = [...filteredTransactions].sort((a, b) => a.id.localeCompare(b.id));
  const fallbackSortedTxns = [...transactions].sort((a, b) => a.id.localeCompare(b.id));
  const activeTxnsForChart = sortedTxnsForChart.length >= 2 ? sortedTxnsForChart : fallbackSortedTxns;

  const chartBucketSize = Math.ceil(activeTxnsForChart.length / bucketCount) || 1;
  const chartBuckets = Array.from({ length: bucketCount }, (_, idx) => 
    activeTxnsForChart.slice(idx * chartBucketSize, (idx + 1) * chartBucketSize)
  );

  const chartBucketData = chartBuckets.map(chunk => {
    const safeVol = chunk.filter(t => getTxRiskLevel(t) === 'Safe').reduce((sum, t) => sum + t.amount, 0);
    const fraudVol = chunk.filter(t => getTxRiskLevel(t) !== 'Safe').reduce((sum, t) => sum + t.amount, 0);
    return { safeVol, fraudVol };
  });

  const maxSafeVol = Math.max(...chartBucketData.map(b => b.safeVol)) || 1;
  const maxFraudVol = Math.max(...chartBucketData.map(b => b.fraudVol)) || 1;

  const mapY = (val: number, max: number, defaultY: number) => {
    if (val === 0) return defaultY;
    const minHeight = 175;
    const maxHeight = 25;
    return minHeight - (val / max) * (minHeight - maxHeight);
  };

  const safePoints = chartBucketData.map((b, idx) => {
    const x = (idx / 7) * 800;
    const y = mapY(b.safeVol, maxSafeVol, 150);
    return { x, y };
  });

  const fraudPoints = chartBucketData.map((b, idx) => {
    const x = (idx / 7) * 800;
    const y = mapY(b.fraudVol, maxFraudVol, 170);
    return { x, y };
  });

  const safePath = safePoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ');
  const fraudPath = fraudPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ');

  const ptSafe2 = safePoints[2] || { x: 200, y: 70 };
  const ptFraud2 = fraudPoints[2] || { x: 200, y: 110 };
  const ptSafe6 = safePoints[6] || { x: 600, y: 30 };
  const ptFraud6 = fraudPoints[6] || { x: 600, y: 80 };


  // Donut chart calculations
  const totalDCount = transactions.length || 1;
  const donutSafeCount = transactions.filter(t => t.status === 'Safe').length;
  const donutThreatCount = totalDCount - donutSafeCount;
  const donutSafePct = (donutSafeCount / totalDCount) * 100;
  const donutThreatPct = 100 - donutSafePct;

  return (
    <div className={`space-y-8 animate-fade-in pb-12 text-gray-850 dark:text-gray-100 ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* SAMA Hub Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#001025] to-[#0b2440] p-8 text-white shadow-2xl border border-gray-100 dark:border-gray-800/40">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.25),transparent)] pointer-events-none" />
        <div className={`relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 ${isRTL ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}>
          <div>
            <div className={`flex flex-wrap items-center gap-2 mb-3 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
              <span className="px-2.5 py-0.5 bg-[#D4AF37]/20 text-[#D4AF37] rounded-md text-[9px] font-black uppercase tracking-widest border border-[#D4AF37]/30">
                {t.samaSandbox}
              </span>
              <span className="px-2.5 py-0.5 bg-emerald-950/40 text-emerald-400 rounded-md text-[9px] font-black uppercase tracking-widest border border-emerald-500/20 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {isRTL ? 'جميع الأنظمة تعمل بكفاءة' : 'ALL SYSTEMS OPERATIONAL'}
              </span>
              <span className="px-2.5 py-0.5 bg-[#006A4E]/30 text-white rounded-md text-[9px] font-black uppercase tracking-widest border border-[#006A4E]/40">
                {isRTL ? 'المراقبون النشطون: ٢٤' : 'OFFICERS ONLINE: 24'}
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white">
              {t.goodMorning}
            </h2>
            {/* Quick Session Stats */}
            <div className={`flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2.5 text-[10px] text-gray-300 font-bold ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="flex items-center gap-1.5">
                <span className="text-[#D4AF37]">●</span>
                <span>{isRTL ? 'المستخدم: منسوب مصرفي (أ. جينكينز)' : 'Compliance Officer: S. Jenkins (ID: 2981)'}</span>
              </div>
              <span className="hidden md:inline text-gray-500">|</span>
              <div className="flex items-center gap-1.5">
                <span>{isRTL ? 'آخر دخول: اليوم ٠٨:٤٤ صباحاً' : 'Last Login: Today at 08:44 AM (AST)'}</span>
              </div>
              <span className="hidden md:inline text-gray-500">|</span>
              <div className="flex items-center gap-1.5">
                <span>{isRTL ? 'امتثال ساما: ممتاز' : 'SAMA Compliance: Grade-A Secure'}</span>
              </div>
            </div>
            <p className="text-xs md:text-sm text-gray-300 mt-3 font-medium max-w-xl leading-relaxed">
              {t.dashboardSubText}
            </p>
          </div>
          <div className={`flex gap-3 shrink-0 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('#TXN-8812');
              }}
              className="px-4.5 py-3 bg-white/10 hover:bg-white/15 rounded-xl text-xs font-black border border-white/10 transition-all text-white flex items-center gap-2 active:scale-95 cursor-pointer decoration-none"
            >
              <Brain className="w-4 h-4 text-[#D4AF37]" />
              <span>{isRTL ? 'تقرير سارة جينكينز' : "Sarah Jenkins' Report"}</span>
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('#TXN-8812');
              }}
              className="px-4.5 py-3 bg-[#D4AF37] hover:bg-[#C5A059] text-[#001025] rounded-xl text-xs font-black transition-all shadow-lg shadow-[#D4AF37]/15 flex items-center gap-2 active:scale-95 cursor-pointer decoration-none"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isRTL ? 'تشغيل التحليل الفوري' : 'AI Analysis Report'}</span>
            </a>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5">
        {kpiData.map((kpi, idx) => {
          const IconComponent = kpi.icon || CreditCard;
          return (
            <div 
              key={idx} 
              className="bg-white dark:bg-[#070e17] p-5 rounded-2xl border border-gray-100 dark:border-gray-800/60 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className={`flex justify-between items-start ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`p-2 rounded-xl ${
                  kpi.color === 'emerald' ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600' :
                  kpi.color === 'red' ? 'bg-red-50 dark:bg-red-950/40 text-red-600' :
                  kpi.color === 'green' ? 'bg-green-50 dark:bg-green-950/40 text-green-600' :
                  kpi.color === 'amber' ? 'bg-[#D4AF37]/10 text-[#D4AF37]' :
                  kpi.color === 'purple' ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-600' :
                  kpi.color === 'orange' ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-600' :
                  'bg-blue-50 dark:bg-blue-950/40 text-blue-600'
                }`}>
                  <IconComponent className="w-4.5 h-4.5" />
                </div>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                  kpi.isPositive ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20' : 'text-red-500 bg-red-50 dark:bg-red-950/20'
                }`}>
                  {kpi.change}
                </span>
              </div>
              <div className="mt-4">
                <p className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider">{kpi.label}</p>
                <p className="text-xl font-black text-[#001939] dark:text-white mt-1">{kpi.value}</p>
              </div>
            </div>
          );
        })}
      </section>

      {/* Hackathon Demo Widgets: Last AI Analysis & System Status Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-2">
        {/* Last AI Analysis Card */}
        <div className="lg:col-span-8 bg-white dark:bg-[#070e17] rounded-3xl p-6 border border-gray-100 dark:border-gray-800/60 shadow-sm flex flex-col justify-between">
          <div>
            <div className={`flex items-center gap-2.5 mb-5 pb-3 border-b border-gray-50 dark:border-gray-800/40 ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}>
              <div className="p-1.5 bg-gradient-to-r from-amber-500/10 to-amber-600/10 dark:from-amber-500/20 dark:to-amber-600/20 rounded-xl text-[#D4AF37]">
                <Brain className="w-5 h-5 shrink-0" />
              </div>
              <div>
                <h3 className="text-sm font-black text-[#001939] dark:text-white">
                  {isRTL ? 'آخر فحص ذكاء اصطناعي نشط' : 'Last Active AI Analysis'}
                </h3>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                  {isRTL ? 'تدقيق فوري لمطابقة لوائح مؤسسة النقد العربي السعودي' : 'Real-time Alinma compliance scan telemetry'}
                </p>
              </div>
            </div>

            {(() => {
              const sortedReportsByAnalysisTime = reports && reports.length > 0
                ? [...reports].sort((a, b) => new Date(b.analysisDateTime).getTime() - new Date(a.analysisDateTime).getTime())
                : [];
              const latestReport = sortedReportsByAnalysisTime[0] || null;

              if (latestReport) {
                return (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-5 text-[11px]">
                    {/* Transaction ID */}
                    <div className={`space-y-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                      <span className="text-gray-400 dark:text-gray-500 block font-black uppercase tracking-wider text-[9px]">
                        {isRTL ? 'رقم العملية' : 'Transaction ID'}
                      </span>
                      <span className="font-mono text-xs font-black text-[#001939] dark:text-gray-300">
                        {latestReport.transactionId || 'Not Available'}
                      </span>
                    </div>

                    {/* Customer Name */}
                    <div className={`space-y-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                      <span className="text-gray-400 dark:text-gray-500 block font-black uppercase tracking-wider text-[9px]">
                        {isRTL ? 'اسم العميل' : 'Customer Name'}
                      </span>
                      <span className="font-extrabold text-[#001939] dark:text-gray-300">
                        {latestReport.customerName || 'Not Available'}
                      </span>
                    </div>

                    {/* Analysis Time */}
                    <div className={`space-y-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                      <span className="text-gray-400 dark:text-gray-500 block font-black uppercase tracking-wider text-[9px]">
                        {isRTL ? 'تاريخ وقت الفحص' : 'Analysis Date & Time'}
                      </span>
                      <span className="font-medium text-gray-600 dark:text-gray-400">
                        {(() => {
                          if (!latestReport.analysisDateTime) return 'Not Available';
                          try {
                            const d = new Date(latestReport.analysisDateTime);
                            return d.toLocaleString(isRTL ? 'ar-EG' : 'en-US', {
                              dateStyle: 'short',
                              timeStyle: 'short',
                            });
                          } catch (_) {
                            return latestReport.analysisDateTime;
                          }
                        })()}
                      </span>
                    </div>

                    {/* Risk Level */}
                    <div className={`space-y-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                      <span className="text-gray-400 dark:text-gray-500 block font-black uppercase tracking-wider text-[9px]">
                        {isRTL ? 'مستوى الخطورة' : 'Risk Level'}
                      </span>
                      <div>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-black border uppercase ${
                          latestReport.riskLevel === 'Critical' || latestReport.riskLevel === 'High'
                            ? 'bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400 border-red-200/40 dark:border-red-900/40'
                            : latestReport.riskLevel === 'Medium'
                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border-amber-200/40 dark:border-amber-900/40'
                            : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border-emerald-200/40 dark:border-emerald-900/40'
                        }`}>
                          {latestReport.riskLevel || 'Safe'}
                        </span>
                      </div>
                    </div>

                    {/* Risk Score */}
                    <div className={`space-y-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                      <span className="text-gray-400 dark:text-gray-500 block font-black uppercase tracking-wider text-[9px]">
                        {isRTL ? 'درجة الخطورة' : 'Risk Score'}
                      </span>
                      <span className="font-black text-xs text-[#001939] dark:text-white">
                        {latestReport.riskScore !== undefined ? `${latestReport.riskScore}%` : 'Not Available'}
                      </span>
                    </div>

                    {/* Investigation Status */}
                    <div className={`space-y-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                      <span className="text-gray-400 dark:text-gray-500 block font-black uppercase tracking-wider text-[9px]">
                        {isRTL ? 'حالة التحقيق' : 'Investigation Status'}
                      </span>
                      <div>
                        <span className="inline-flex items-center gap-1.5 font-bold text-[#001939] dark:text-gray-300">
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            latestReport.investigationStatus === 'Escalated' ? 'bg-amber-400 animate-pulse' :
                            latestReport.investigationStatus === 'Approved' ? 'bg-emerald-400' :
                            latestReport.investigationStatus === 'Rejected' ? 'bg-red-500' : 'bg-blue-400 animate-pulse'
                          }`} />
                          <span>
                            {isRTL 
                              ? (latestReport.investigationStatus === 'Pending Review' ? 'قيد المراجعة' :
                                 latestReport.investigationStatus === 'Approved' ? 'تمت الموافقة' :
                                 latestReport.investigationStatus === 'Escalated' ? 'تم التصعيد' : 'مرفوض')
                              : (latestReport.investigationStatus || 'Pending Review')
                            }
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div className="py-6 text-center text-xs text-gray-400 dark:text-gray-500 font-extrabold">
                    {isRTL 
                      ? 'لا توجد تقارير فحص ذكاء اصطناعي حية حتى الآن.' 
                      : 'No live AI analysis reports available in this session.'}
                  </div>
                );
              }
            })()}
          </div>

          {(() => {
            const sortedReportsByAnalysisTime = reports && reports.length > 0
              ? [...reports].sort((a, b) => new Date(b.analysisDateTime).getTime() - new Date(a.analysisDateTime).getTime())
              : [];
            const latestReport = sortedReportsByAnalysisTime[0] || null;

            if (latestReport) {
              return (
                <div className="mt-4 border-t border-gray-50 dark:border-gray-800/40 pt-4">
                  <button
                    onClick={() => onNavigate(latestReport.transactionId)}
                    className="w-full bg-[#006A4E] hover:bg-[#005a42] text-white py-2.5 px-4 rounded-xl text-xs font-black transition-all active:scale-95 flex items-center justify-center gap-2 border-none cursor-pointer"
                  >
                    <FileText className="w-4 h-4" />
                    <span>{isRTL ? 'عرض تقرير التحقيق المالي الكامل' : 'View Full Investigation Report'}</span>
                  </button>
                </div>
              );
            }
            return null;
          })()}
        </div>

        {/* System Status Section */}
        <div className="lg:col-span-4 bg-white dark:bg-[#070e17] rounded-3xl p-6 border border-gray-100 dark:border-gray-800/60 shadow-sm flex flex-col justify-between">
          <div>
            <div className={`flex items-center gap-2.5 mb-5 pb-3 border-b border-gray-50 dark:border-gray-800/40 ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}>
              <div className="p-1.5 bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 dark:from-emerald-500/20 dark:to-emerald-600/20 rounded-xl text-emerald-600">
                <Activity className="w-5 h-5 shrink-0" />
              </div>
              <div>
                <h3 className="text-sm font-black text-[#001939] dark:text-white">
                  {isRTL ? 'حالة النظام التشغيلية' : 'System Operational Status'}
                </h3>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                  {isRTL ? 'مؤشرات الأداء للبنية التحتية للبنك' : 'Core banking gateway telemetry logs'}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Gemini API */}
              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`flex items-center gap-2.5 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                  <Cpu className="w-4 h-4 text-purple-500 shrink-0" />
                  <span className="text-xs font-extrabold text-gray-700 dark:text-gray-300">
                    {isRTL ? 'واجهة Gemini API' : 'Gemini AI API Engine'}
                  </span>
                </div>
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                  <span className={`w-2 h-2 rounded-full ${isGeminiApiConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500 animate-pulse'}`} />
                  <span className={`text-[11px] font-black uppercase ${isGeminiApiConnected ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-500'}`}>
                    {isGeminiApiConnected ? (isRTL ? 'متصل (جيميناي)' : 'Connected (Gemini)') : (isRTL ? 'متصل محلياً (نمط احتياطي)' : 'Local Engine Active (Secure Fallback)')}
                  </span>
                </div>
              </div>

              {/* Transaction Dataset */}
              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`flex items-center gap-2.5 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                  <Database className="w-4 h-4 text-blue-500 shrink-0" />
                  <span className="text-xs font-extrabold text-gray-700 dark:text-gray-300">
                    {isRTL ? 'قاعدة بيانات العمليات CSV' : 'Transactions CSV Dataset'}
                  </span>
                </div>
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                  <span className={`w-2 h-2 rounded-full ${transactions.length > 0 ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                  <span className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 uppercase">
                    {transactions.length > 0 
                      ? (isRTL ? `مُحمّل (${transactions.length} سجل)` : `Loaded (${transactions.length} entries)`)
                      : (isRTL ? 'جاري التحميل...' : 'Loading...')
                    }
                  </span>
                </div>
              </div>

              {/* Fraud Monitoring */}
              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`flex items-center gap-2.5 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="text-xs font-extrabold text-gray-700 dark:text-gray-300">
                    {isRTL ? 'مراقب الاحتيال التلقائي' : 'Fraud Monitoring Agent'}
                  </span>
                </div>
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 uppercase">
                    {isRTL ? 'نشط وحي' : 'Active'}
                  </span>
                </div>
              </div>

              {/* Reports Synchronization */}
              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`flex items-center gap-2.5 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                  <RefreshCw className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="text-xs font-extrabold text-gray-700 dark:text-gray-300">
                    {isRTL ? 'مزامنة تقارير مؤسسة النقد' : 'Reports Sync Module'}
                  </span>
                </div>
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 uppercase">
                    {isRTL ? 'نشط ومزامن' : 'Active'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 border-t border-gray-50 dark:border-gray-800/40 pt-4 text-center">
            <span className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest block font-mono">
              {isRTL ? 'أمن بنكي ذكي من Alinma AI' : 'Alinma Bank Enterprise Security Platform'}
            </span>
          </div>
        </div>
      </section>

      {/* Advanced Filter Panel */}
      <div className="bg-white dark:bg-[#070e17] rounded-3xl p-6 border border-gray-100 dark:border-gray-800/60 shadow-sm space-y-4">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={`w-full flex items-center justify-between font-black text-sm text-[#001939] dark:text-white bg-transparent border-none cursor-pointer ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}
        >
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            <Compass className="w-5 h-5 text-[#D4AF37]" />
            <span>{isRTL ? 'تصفية وبحث متقدم عن العمليات' : 'Advanced Transaction Filters'}</span>
          </div>
          <span className="text-xs text-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-xl font-bold transition-all hover:bg-gray-100">
            {isFilterOpen ? (isRTL ? 'إخفاء الفلاتر' : 'Hide Filters') : (isRTL ? 'عرض الفلاتر' : 'Show Filters')}
          </span>
        </button>

        {isFilterOpen && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 pt-4 border-t border-gray-50 dark:border-gray-800/40 text-[11px] font-bold animate-fade-in">
            {/* Risk filter */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider block">{isRTL ? 'مستوى الخطورة' : 'Risk Level'}</label>
              <select
                value={filterRisk}
                onChange={(e) => setFilterRisk(e.target.value)}
                className="w-full bg-gray-50 dark:bg-[#0b1524] border border-gray-100 dark:border-gray-800 rounded-xl px-3.5 py-2.5 text-gray-800 dark:text-gray-100 outline-none cursor-pointer font-bold"
              >
                <option value="All">{isRTL ? 'جميع المستويات' : 'All Levels'}</option>
                <option value="Safe">{isRTL ? 'آمنة' : 'Safe'}</option>
                <option value="Medium">{isRTL ? 'متوسطة' : 'Medium'}</option>
                <option value="High">{isRTL ? 'مرتفعة' : 'High'}</option>
                <option value="Critical">{isRTL ? 'حرجة (احتيال)' : 'Critical'}</option>
              </select>
            </div>

            {/* Transaction Type */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider block">{isRTL ? 'نوع المعاملة' : 'Transaction Type'}</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full bg-gray-50 dark:bg-[#0b1524] border border-gray-100 dark:border-gray-800 rounded-xl px-3.5 py-2.5 text-gray-800 dark:text-gray-100 outline-none cursor-pointer font-bold"
              >
                <option value="All">{isRTL ? 'جميع الأنواع' : 'All Types'}</option>
                <option value="Debit">{isRTL ? 'مدى (Debit)' : 'Debit'}</option>
                <option value="Credit">{isRTL ? 'ائتمانية (Credit)' : 'Credit'}</option>
                <option value="Transfer">{isRTL ? 'حوالة (Transfer)' : 'Transfer'}</option>
              </select>
            </div>

            {/* Channel filter */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider block">{isRTL ? 'قناة العمليات' : 'Channel'}</label>
              <select
                value={filterChannel}
                onChange={(e) => setFilterChannel(e.target.value)}
                className="w-full bg-gray-50 dark:bg-[#0b1524] border border-gray-100 dark:border-gray-800 rounded-xl px-3.5 py-2.5 text-gray-800 dark:text-gray-100 outline-none cursor-pointer font-bold"
              >
                <option value="All">{isRTL ? 'جميع القنوات' : 'All Channels'}</option>
                <option value="ATM">{isRTL ? 'صراف آلي (ATM)' : 'ATM'}</option>
                <option value="POS">{isRTL ? 'نقاط بيع (POS)' : 'POS'}</option>
                <option value="Online">{isRTL ? 'عبر الإنترنت' : 'Online'}</option>
                <option value="Mobile App">{isRTL ? 'تطبيق الجوال' : 'Mobile App'}</option>
                <option value="Bank Transfer">{isRTL ? 'حوالة مصرفية' : 'Bank Transfer'}</option>
              </select>
            </div>

            {/* City Nodes */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider block">{isRTL ? 'العقدة الجغرافية' : 'City Node'}</label>
              <select
                value={filterCity}
                onChange={(e) => setFilterCity(e.target.value)}
                className="w-full bg-gray-50 dark:bg-[#0b1524] border border-gray-100 dark:border-gray-800 rounded-xl px-3.5 py-2.5 text-gray-800 dark:text-gray-100 outline-none cursor-pointer font-bold"
              >
                <option value="All">{isRTL ? 'جميع المدن' : 'All Cities'}</option>
                {uniqueCities.map(city => (
                  <option key={city} value={city}>
                    {isRTL && city === 'Riyadh' ? 'الرياض' : 
                     isRTL && city === 'Jeddah' ? 'جدة' : 
                     isRTL && city === 'Dammam' ? 'الدمام' : 
                     isRTL && city === 'Medina' ? 'المدينة المنورة' : 
                     isRTL && city === 'Makkah' ? 'مكة المكرمة' : city}
                  </option>
                ))}
              </select>
            </div>

            {/* Date filter */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider block">{isRTL ? 'تاريخ المعاملة' : 'Transaction Date'}</label>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full bg-gray-50 dark:bg-[#0b1524] border border-gray-100 dark:border-gray-800 rounded-xl px-3 py-2 text-gray-800 dark:text-gray-100 outline-none font-bold cursor-pointer"
              />
            </div>

            {/* Min Amount */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider block">{isRTL ? 'الحد الأدنى للمبلغ' : 'Min Amount (SAR)'}</label>
              <input
                type="number"
                placeholder={isRTL ? 'أقل قيمة' : 'Min value'}
                value={filterMinAmount}
                onChange={(e) => setFilterMinAmount(e.target.value !== '' ? Number(e.target.value) : '')}
                className="w-full bg-gray-50 dark:bg-[#0b1524] border border-gray-100 dark:border-gray-800 rounded-xl px-3.5 py-2 text-gray-800 dark:text-gray-100 outline-none font-bold"
              />
            </div>

            {/* Max Amount */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider block">{isRTL ? 'الحد الأقصى للمبلغ' : 'Max Amount (SAR)'}</label>
              <input
                type="number"
                placeholder={isRTL ? 'أعظم قيمة' : 'Max value'}
                value={filterMaxAmount}
                onChange={(e) => setFilterMaxAmount(e.target.value !== '' ? Number(e.target.value) : '')}
                className="w-full bg-gray-50 dark:bg-[#0b1524] border border-gray-100 dark:border-gray-800 rounded-xl px-3.5 py-2 text-gray-800 dark:text-gray-100 outline-none font-bold"
              />
            </div>
          </div>
        )}
      </div>

      {/* Main Charts Row */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Line Chart */}
        <div className="lg:col-span-8 bg-white dark:bg-[#070e17] p-6.5 rounded-3xl border border-gray-100 dark:border-gray-800/60 shadow-sm flex flex-col justify-between min-h-[380px]">
          <div className={`flex justify-between items-center mb-6 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            <div>
              <h3 className="text-base font-black text-[#001939] dark:text-white">{t.fraudPreventionAnalytics}</h3>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">{t.chartSubText}</p>
            </div>
            <select
              value={selectedDays}
              onChange={(e) => setSelectedDays(e.target.value)}
              className="bg-gray-50 dark:bg-[#0b1524] border border-gray-100 dark:border-gray-800 rounded-xl text-xs font-black px-3.5 py-1.5 text-[#001939] dark:text-gray-100 outline-none focus:ring-2 focus:ring-[#D4AF37] cursor-pointer"
            >
              <option value="7">{isRTL ? 'آخر ٧ أيام' : 'Last 7 Days'}</option>
              <option value="30">{isRTL ? 'آخر ٣٠ يوماً' : 'Last 30 Days'}</option>
            </select>
          </div>

          <div className="flex-1 w-full h-44 relative my-4 flex items-end">
            <div className="absolute inset-0 flex flex-col justify-between text-[9px] text-gray-400 dark:text-gray-500 opacity-60">
              <div className="border-b border-gray-50 dark:border-gray-800/80 pb-1 w-full">{isRTL ? '١٠٠٪ من العمليات' : '100% Vol'}</div>
              <div className="border-b border-gray-50 dark:border-gray-800/80 pb-1 w-full">{isRTL ? '٧٥٪ من العمليات' : '75% Vol'}</div>
              <div className="border-b border-gray-50 dark:border-gray-800/80 pb-1 w-full">{isRTL ? '٥٠٪ من العمليات' : '50% Vol'}</div>
              <div className="border-b border-gray-50 dark:border-gray-800/80 pb-1 w-full">{isRTL ? '٢٥٪ من العمليات' : '25% Vol'}</div>
              <div className="w-full">0% Vol</div>
            </div>

            <svg className="w-full h-full overflow-visible z-10" viewBox="0 0 800 200" preserveAspectRatio="none">
              <path
                d={safePath}
                fill="none"
                stroke="#006A4E"
                strokeWidth="4"
              />
              <path
                d={fraudPath}
                fill="none"
                stroke="#D4AF37"
                strokeDasharray="8,4"
                strokeWidth="3"
              />
              <circle cx={ptSafe2.x} cy={ptSafe2.y} r="6" fill="#006A4E" className="animate-pulse" />
              <circle cx={ptFraud2.x} cy={ptFraud2.y} r="6" fill="#D4AF37" />
              <circle cx={ptSafe6.x} cy={ptSafe6.y} r="6" fill="#006A4E" />
              <circle cx={ptFraud6.x} cy={ptFraud6.y} r="6" fill="#D4AF37" />
            </svg>
          </div>

          <div className={`flex gap-6 mt-2 pt-4 border-t border-gray-50 dark:border-gray-800 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#006A4E]" />
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                {isRTL ? 'العمليات المعتمدة لساما' : 'Processed SAMA Nodes'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#D4AF37]" />
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                {isRTL ? 'الهجمات المحظورة والوقاية' : 'Prevented Fraud Threat'}
              </span>
            </div>
          </div>
        </div>

        {/* Threat Distribution (Donut Chart) */}
        <div className="lg:col-span-4 bg-white dark:bg-[#070e17] p-6.5 rounded-3xl border border-gray-100 dark:border-gray-800/60 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-black text-[#001939] dark:text-white">{t.threatDistribution}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">{t.aggregateChannelSubText}</p>
          </div>

          <div className="relative w-36 h-36 mx-auto">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" fill="transparent" r="16" stroke={darkMode ? '#0b1524' : '#e7eefe'} strokeWidth="4.5" />
              {/* Safe */}
              <circle cx="18" cy="18" fill="transparent" r="16" stroke="#006A4E" strokeDasharray={`${parseFloat(p.safe)} 100`} strokeDashoffset="0" strokeWidth="4.5" />
              {/* Medium */}
              <circle cx="18" cy="18" fill="transparent" r="16" stroke="#D4AF37" strokeDasharray={`${parseFloat(p.medium)} 100`} strokeDashoffset={`-${parseFloat(p.safe)}`} strokeWidth="4.5" />
              {/* High */}
              <circle cx="18" cy="18" fill="transparent" r="16" stroke="#F97316" strokeDasharray={`${parseFloat(p.high)} 100`} strokeDashoffset={`-${parseFloat(p.safe) + parseFloat(p.medium)}`} strokeWidth="4.5" />
              {/* Critical */}
              <circle cx="18" cy="18" fill="transparent" r="16" stroke="#EF4444" strokeDasharray={`${parseFloat(p.critical)} 100`} strokeDashoffset={`-${parseFloat(p.safe) + parseFloat(p.medium) + parseFloat(p.high)}`} strokeWidth="4.5" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-black text-[#001939] dark:text-white">{parseFloat(p.safe).toFixed(0)}%</span>
              <span className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider">{isRTL ? 'آمن' : 'Secure'}</span>
            </div>
          </div>

          <div className="space-y-4 mt-6 pt-4 border-t border-gray-50 dark:border-gray-800">
            <div>
              <div className={`flex justify-between items-center text-xs font-bold text-gray-700 dark:text-gray-300 mb-1 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                <span>{isRTL ? 'العمليات الآمنة' : 'Safe Transactions'}</span>
                <span className="text-[#006A4E] dark:text-emerald-400">{p.safe}%</span>
              </div>
              <div className="w-full bg-[#e7eefe] dark:bg-[#0b1524] rounded-full h-1.5">
                <div className="bg-[#006A4E] h-1.5 rounded-full" style={{ width: `${p.safe}%` }} />
              </div>
            </div>
            <div>
              <div className={`flex justify-between items-center text-xs font-bold text-gray-700 dark:text-gray-300 mb-1 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                <span>{isRTL ? 'مخاطر متوسطة' : 'Medium Risk'}</span>
                <span className="text-[#D4AF37]">{p.medium}%</span>
              </div>
              <div className="w-full bg-[#e7eefe] dark:bg-[#0b1524] rounded-full h-1.5">
                <div className="bg-[#D4AF37] h-1.5 rounded-full" style={{ width: `${p.medium}%` }} />
              </div>
            </div>
            <div>
              <div className={`flex justify-between items-center text-xs font-bold text-gray-700 dark:text-gray-300 mb-1 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                <span>{isRTL ? 'مخاطر عالية' : 'High Risk'}</span>
                <span className="text-[#F97316]">{p.high}%</span>
              </div>
              <div className="w-full bg-[#e7eefe] dark:bg-[#0b1524] rounded-full h-1.5">
                <div className="bg-[#F97316] h-1.5 rounded-full" style={{ width: `${p.high}%` }} />
              </div>
            </div>
            <div>
              <div className={`flex justify-between items-center text-xs font-bold text-gray-700 dark:text-gray-300 mb-1 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                <span>{isRTL ? 'حالات احتيال حرجة' : 'Critical Cases'}</span>
                <span className="text-[#EF4444]">{p.critical}%</span>
              </div>
              <div className="w-full bg-[#e7eefe] dark:bg-[#0b1524] rounded-full h-1.5">
                <div className="bg-[#EF4444] h-1.5 rounded-full" style={{ width: `${p.critical}%` }} />
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* Dynamic City and Channel Distribution Charts Row */}
      {(() => {
        // 1. City distribution calculation
        const cityCounts = filteredTransactions.reduce((acc: Record<string, number>, t) => {
          if (!t.location) return acc;
          const city = t.location.split(',')[0].trim();
          if (city) {
            acc[city] = (acc[city] || 0) + 1;
          }
          return acc;
        }, {});

        const cityData = Object.entries(cityCounts)
          .map(([city, count]) => ({ city, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5); // top 5 cities

        const maxCityCount = Math.max(...cityData.map(d => d.count)) || 1;

        // 2. Channel distribution calculation
        const channelCounts = filteredTransactions.reduce((acc: Record<string, number>, t) => {
          const chan = t.channel || 'Online';
          acc[chan] = (acc[chan] || 0) + 1;
          return acc;
        }, {
          'ATM': 0,
          'POS': 0,
          'Online': 0,
          'Mobile App': 0,
          'Bank Transfer': 0
        });

        const channelData = Object.entries(channelCounts).map(([channel, count]) => ({ channel, count }));
        const maxChannelCount = Math.max(...channelData.map(d => d.count)) || 1;

        return (
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* City Bar Chart */}
            <div className="bg-white dark:bg-[#070e17] p-6.5 rounded-3xl border border-gray-100 dark:border-gray-800/60 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-base font-black text-[#001939] dark:text-white">
                  {isRTL ? 'العمليات حسب المدن' : 'Transactions by City'}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
                  {isRTL ? 'توزيع العمليات على المدن الرئيسية بالمملكة' : 'Distribution of transactions across Saudi cities'}
                </p>
              </div>

              <div className="space-y-4">
                {cityData.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-8">{isRTL ? 'لا توجد بيانات متاحة' : 'No data available'}</p>
                ) : (
                  cityData.map((d, idx) => {
                    const pct = (d.count / maxCityCount) * 100;
                    return (
                      <div key={idx} className="space-y-1">
                        <div className={`flex justify-between items-center text-xs font-bold text-gray-700 dark:text-gray-300 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                          <span>{isRTL && d.city === 'Riyadh' ? 'الرياض' : 
                                isRTL && d.city === 'Jeddah' ? 'جدة' : 
                                isRTL && d.city === 'Dammam' ? 'الدمام' : 
                                isRTL && d.city === 'Medina' ? 'المدينة المنورة' : 
                                isRTL && d.city === 'Makkah' ? 'مكة المكرمة' : d.city}</span>
                          <span>{d.count} {isRTL ? 'عملية' : 'txns'}</span>
                        </div>
                        <div className="w-full bg-[#e7eefe] dark:bg-[#0b1524] rounded-full h-2">
                          <div className="bg-[#D4AF37] h-2 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Channel Distribution Chart */}
            <div className="bg-white dark:bg-[#070e17] p-6.5 rounded-3xl border border-gray-100 dark:border-gray-800/60 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-base font-black text-[#001939] dark:text-white">
                  {isRTL ? 'توزيع القنوات' : 'Channel Distribution'}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
                  {isRTL ? 'توزيع العمليات حسب قناة التحويل المالي' : 'Transaction distribution across channels'}
                </p>
              </div>

              <div className="space-y-4">
                {channelData.map((d, idx) => {
                  const pct = (d.count / maxChannelCount) * 100;
                  const barColor = d.channel === 'ATM' ? 'bg-[#006A4E]' :
                                   d.channel === 'POS' ? 'bg-[#D4AF37]' :
                                   d.channel === 'Online' ? 'bg-[#3B82F6]' :
                                   d.channel === 'Mobile App' ? 'bg-[#8B5CF6]' : 'bg-[#EF4444]';
                  return (
                    <div key={idx} className="space-y-1">
                      <div className={`flex justify-between items-center text-xs font-bold text-gray-700 dark:text-gray-300 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                        <span>{isRTL && d.channel === 'ATM' ? 'صراف آلي (ATM)' : 
                              isRTL && d.channel === 'POS' ? 'نقاط بيع (POS)' : 
                              isRTL && d.channel === 'Online' ? 'عبر الإنترنت' : 
                              isRTL && d.channel === 'Mobile App' ? 'تطبيق الجوال' : 
                              isRTL && d.channel === 'Bank Transfer' ? 'حوالة مصرفية' : d.channel}</span>
                        <span>{d.count} {isRTL ? 'عملية' : 'txns'}</span>
                      </div>
                      <div className="w-full bg-[#e7eefe] dark:bg-[#0b1524] rounded-full h-2">
                        <div className={`${barColor} h-2 rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </section>
        );
      })()}

      {/* Regional Mapping & Live Transaction stream */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Heat Map Card */}
        <div className="xl:col-span-5 bg-white dark:bg-[#070e17] rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800/60 shadow-sm flex flex-col justify-between">
          <div className="p-6">
            <h3 className="text-base font-black text-[#001939] dark:text-white">{t.saudiRegionalAudit}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">{t.regionalSubText}</p>
          </div>

          <div className="flex-1 min-h-[250px] bg-[#f9f9ff] dark:bg-[#030712] relative overflow-hidden flex items-center justify-center border-y border-gray-50 dark:border-gray-800/40">
            <Compass className="absolute w-20 h-20 text-[#006A4E]/5 pointer-events-none" />

            {/* Riyadh hotspot */}
            <div
              className="absolute top-[42%] left-[52%] cursor-pointer z-10"
              onMouseEnter={() => setHoveredHotspot('riyadh')}
              onMouseLeave={() => setHoveredHotspot(null)}
            >
              <span className="absolute -inset-2 bg-red-500/25 rounded-full animate-ping pointer-events-none" />
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white text-xs font-black shadow-lg shadow-red-500/30">
                85
              </div>
              <div className="absolute top-9 left-1/2 -translate-x-1/2 bg-[#001025] text-white text-[9px] px-2.5 py-1.5 rounded-lg shadow-xl border border-white/10 whitespace-nowrap z-20 font-bold">
                <span className="font-extrabold text-[#D4AF37]">{isRTL ? 'بوابة الرياض للامتثال' : 'Riyadh Compliance Gate'}</span>
              </div>
            </div>

            {/* Jeddah Hotspot */}
            <div
              className="absolute top-[58%] left-[24%] cursor-pointer z-10"
              onMouseEnter={() => setHoveredHotspot('jeddah')}
              onMouseLeave={() => setHoveredHotspot(null)}
            >
              <span className="absolute -inset-1.5 bg-amber-500/20 rounded-full animate-ping pointer-events-none" />
              <div className="w-7 h-7 bg-[#D4AF37] rounded-full flex items-center justify-center text-[#001025] text-xs font-black shadow-lg shadow-orange-500/20">
                12
              </div>
              {hoveredHotspot === 'jeddah' && (
                <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-[#001025] text-white text-[9px] px-2.5 py-1.5 rounded-lg shadow-xl border border-white/10 whitespace-nowrap z-20 font-bold">
                  <span className="font-extrabold text-[#D4AF37]">{isRTL ? 'بوابة الغربية بجدة' : 'Jeddah Terminal Gate'}</span>
                </div>
              )}
            </div>

            {/* Dammam Hotspot */}
            <div
              className="absolute top-[38%] right-[22%] cursor-pointer z-10"
              onMouseEnter={() => setHoveredHotspot('dammam')}
              onMouseLeave={() => setHoveredHotspot(null)}
            >
              <div className="w-5 h-5 bg-[#006A4E] rounded-full border-2 border-white dark:border-gray-800 shadow-md" />
              {hoveredHotspot === 'dammam' && (
                <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-[#001025] text-white text-[9px] px-2.5 py-1.5 rounded-lg shadow-xl border border-white/10 whitespace-nowrap z-20 font-bold">
                  <span className="font-extrabold text-emerald-400">{isRTL ? 'تدقيق المنطقة الشرقية بالدمام' : 'Dammam SAMA Safe'}</span>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 bg-[#001530] text-white flex justify-between items-center text-xs">
            <span className="font-semibold text-gray-300">{isRTL ? 'مراقبة فورية عبر ١٣ منطقة إدارية' : 'Live monitoring across 13 regions'}</span>
            <span className="text-[#D4AF37] text-[10px] font-black uppercase">{t.activeLink}</span>
          </div>
        </div>

        {/* Live SAMA transaction list */}
        <div className="xl:col-span-7 bg-white dark:bg-[#070e17] rounded-3xl border border-gray-100 dark:border-gray-800/60 shadow-sm flex flex-col justify-between">
          <div className={`p-6 flex justify-between items-center border-b border-gray-50 dark:border-gray-800 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            <div>
              <h3 className="text-base font-black text-[#001939] dark:text-white">{t.streamVerification}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t.streamSubText}</p>
            </div>
            <span className="text-[10px] font-black text-gray-400 dark:text-gray-500">
              {filteredTransactions.length} {isRTL ? 'عمليات نشطة' : 'Active Txns'}
            </span>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse" dir={isRTL ? 'rtl' : 'ltr'}>
              <thead>
                <tr className="bg-gray-50 dark:bg-[#0b1524]/60 text-gray-500 dark:text-gray-400 text-[10px] font-black uppercase tracking-wider border-b border-gray-100 dark:border-gray-800/60">
                  <th className="px-6 py-4 text-center">{t.transactionId}</th>
                  <th className="px-4 py-4 text-center">{t.customerName}</th>
                  <th className="px-4 py-4 text-center">{t.amount}</th>
                  <th className="px-4 py-4 text-center">{t.status}</th>
                  <th className="px-4 py-4 text-center">{t.riskScore}</th>
                  <th className="px-6 py-4 text-center">{isRTL ? 'الإجراء الرقابي' : 'Action Gate'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800/40 text-center">
                {filteredTransactions.map((txn) => {
                  let statusColor = 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400';
                  if (txn.status === 'Medium') statusColor = 'bg-amber-50 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400';
                  if (txn.status === 'High') statusColor = 'bg-red-50 text-red-800 dark:bg-red-950/30 dark:text-red-400';

                  let barColor = 'bg-[#006A4E]';
                  if (txn.aiRiskScore > 40) barColor = 'bg-[#D4AF37]';
                  if (txn.aiRiskScore > 80) barColor = 'bg-red-500';

                  return (
                    <tr key={txn.id} className="hover:bg-gray-50/50 dark:hover:bg-[#0a1420]/30 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-gray-600 dark:text-gray-300 font-bold">{txn.id}</td>
                      <td className="px-4 py-4">
                        <div className={`flex items-center gap-2 justify-center ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                          <div className="w-7 h-7 rounded-full bg-[#006A4E]/10 text-[#006A4E] dark:text-emerald-400 flex items-center justify-center text-xs font-black shrink-0">
                            {txn.customerInitials}
                          </div>
                          <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">{txn.customerName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 font-bold text-[#001939] dark:text-white">
                        {isRTL ? `${txn.amount.toLocaleString()} ر.س` : `SAR ${txn.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-black ${statusColor}`}>
                          {txn.status === 'Safe' ? (isRTL ? 'آمن' : 'Safe') : txn.status === 'Medium' ? (isRTL ? 'متوسط' : 'Medium') : (isRTL ? 'مرتفع' : 'High')}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2 justify-center">
                          <div className="w-10 bg-gray-100 dark:bg-gray-800 h-1 rounded-full overflow-hidden shrink-0">
                            <div className={`h-full ${barColor}`} style={{ width: `${txn.aiRiskScore}%` }} />
                          </div>
                          <span className="text-xs font-bold text-gray-600 dark:text-gray-400">{txn.aiRiskScore}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex gap-2 justify-center items-center">
                          <button
                            onClick={() => onInspectTransaction(txn)}
                            className="bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-[10px] font-black px-2.5 py-1.5 rounded-lg transition-all shadow-sm active:scale-95 cursor-pointer border border-gray-200 dark:border-gray-700"
                          >
                            {isRTL ? 'تفاصيل' : 'Details'}
                          </button>
                          {txn.aiRiskScore > 40 ? (
                            <button
                              onClick={() => onNavigate(txn.id)}
                              className="bg-[#001530] dark:bg-[#D4AF37] hover:bg-[#0b2440] dark:hover:bg-[#C5A059] text-white dark:text-[#001530] text-[10px] font-black px-3.5 py-1.5 rounded-lg transition-all shadow-sm active:scale-95 cursor-pointer border-none animate-pulse"
                            >
                              {t.reviewReport}
                            </button>
                          ) : txn.status === 'High' ? (
                            <button
                              onClick={() => onBlockTransaction(txn.id)}
                              className="bg-red-600 hover:bg-red-700 text-white text-[10px] font-black px-3.5 py-1.5 rounded-lg transition-all shadow-sm active:scale-95 cursor-pointer border-none"
                            >
                              {t.releaseCard}
                            </button>
                          ) : (
                            <button 
                              onClick={() => onNavigate(txn.id)}
                              className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all bg-transparent border-none cursor-pointer"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </section>
    </div>
  );
}
