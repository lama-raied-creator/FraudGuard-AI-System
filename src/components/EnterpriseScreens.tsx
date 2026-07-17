import React, { useState, useEffect } from 'react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, 
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { 
  Eye, Search, CreditCard, Users, Landmark, ShieldAlert, FileText, BarChart3, 
  Brain, AlertOctagon, Terminal, Bell, Settings, HelpCircle, Download, CheckCircle, 
  XCircle, Filter, ChevronRight, ChevronLeft, MapPin, Smartphone, Key, ShieldCheck, ArrowRight, ArrowLeft,
  Trash2
} from 'lucide-react';
import { Screen, Transaction, InvestigationReport, InvestigationStatus } from '../types';
import { translations } from '../lib/translations';
import InvestigationReportView from './InvestigationReportView';
import { getCustomerAvatar, getAvatarByCustomerName } from '../lib/utils';

interface EnterpriseScreensProps {
  screen: Screen;
  lang: 'en' | 'ar';
  darkMode: boolean;
  onNavigate: (screen: Screen) => void;
  onInspectTransaction: (txn: Transaction) => void;
  cases?: any[];
  transactions?: Transaction[];
  alerts?: any[];
  addToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
  notifications?: any[];
  onViewDetailsNotification?: (id: string, relatedTxId?: string) => void;
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onDeleteNotification?: (id: string) => void;
  reports?: InvestigationReport[];
  onUpdateReportStatus?: (reportId: string, status: InvestigationStatus) => void;
  onUpdateReportComplianceNotes?: (reportId: string, notes: string) => void;

  theme?: 'light' | 'dark' | 'system';
  onThemeChange?: (theme: 'light' | 'dark' | 'system') => void;
  onLangChange?: (lang: 'en' | 'ar') => void;
  notificationPrefs?: {
    highRiskAlert: boolean;
    criticalCase: boolean;
    analysisCompletion: boolean;
    sama: boolean;
  };
  onNotificationPrefsChange?: (prefs: {
    highRiskAlert: boolean;
    criticalCase: boolean;
    analysisCompletion: boolean;
    sama: boolean;
  }) => void;
  dashboardDateRange?: '7d' | '30d' | '12m';
  onDashboardDateRangeChange?: (range: '7d' | '30d' | '12m') => void;
  defaultCurrency?: 'SAR' | 'USD' | 'EUR';
  onDefaultCurrencyChange?: (currency: 'SAR' | 'USD' | 'EUR') => void;
  dateFormat?: string;
  onDateFormatChange?: (format: string) => void;
  timeFormat?: '12h' | '24h';
  onTimeFormatChange?: (format: '12h' | '24h') => void;
  rowsPerPage?: number;
  onRowsPerPageChange?: (rows: number) => void;
  autoRefresh?: boolean;
  onAutoRefreshChange?: (enabled: boolean) => void;
  tableDensity?: 'compact' | 'comfortable';
  onTableDensityChange?: (density: 'compact' | 'comfortable') => void;
  reduceMotion?: boolean;
  onReduceMotionChange?: (enabled: boolean) => void;
  largerText?: boolean;
  onLargerTextChange?: (enabled: boolean) => void;
  highContrast?: boolean;
  onHighContrastChange?: (enabled: boolean) => void;
}

// Sample Customer Dossier data
const sampleCustomers = [
  { id: 'CUST-001', name: 'Hussein Al-Ghamdi', nationalId: '1098827361', email: 'h.ghamdi@saudidb.com', phone: '+966 50 123 4567', iban: 'SA80400001098827361001', risk: 85, cards: 3, location: 'Riyadh, KSA', device: 'iPhone 15 Pro', stability: 'Trusted Node', gender: 'Male' },
  { id: 'CUST-002', name: 'Sarah Al-Moneef', nationalId: '1087723945', email: 's.moneef@saudidb.com', phone: '+966 54 887 2341', iban: 'SA80400001087723945002', risk: 14, cards: 2, location: 'Jeddah, KSA', device: 'Samsung S24 Ultra', stability: 'High Stability', gender: 'Female' },
  { id: 'CUST-003', name: 'Fahad Al-Qahtani', nationalId: '1022293812', email: 'f.qahtani@saudidb.com', phone: '+966 56 332 9982', iban: 'SA80400001022293812003', risk: 42, cards: 4, location: 'Dammam, KSA', device: 'iPad Pro', stability: 'Intermediate', gender: 'Male' },
  { id: 'CUST-004', name: 'Noura Al-Sudairy', nationalId: '1100234912', email: 'n.sudairy@saudidb.com', phone: '+966 55 991 1234', iban: 'SA80400001100234912004', risk: 9, cards: 1, location: 'Medina, KSA', device: 'iPhone 14', stability: 'Trusted Node', gender: 'Female' }
];

// Sample Accounts data
const sampleAccounts = [
  { accNo: '4000010988', iban: 'SA80400001098827361001', balance: 452810.50, customer: 'Hussein Al-Ghamdi', status: 'Active', risk: 'High' },
  { accNo: '4000010877', iban: 'SA80400001087723945002', balance: 1298450.00, customer: 'Sarah Al-Moneef', status: 'Active', risk: 'Low' },
  { accNo: '4000010222', iban: 'SA80400001022293812003', balance: 78520.25, customer: 'Fahad Al-Qahtani', status: 'Active', risk: 'Medium' },
  { accNo: '4000011002', iban: 'SA80400001100234912004', balance: 3450.00, customer: 'Noura Al-Sudairy', status: 'Blocked', risk: 'Low' }
];

// Sample Fraud Cases
const sampleCases = [
  { id: 'CASE-8821', customer: 'Hussein Al-Ghamdi', amount: 4299.00, date: '2026-07-09', status: 'Investigating', riskLevel: 'High', details: 'Suspicious IP proxy velocity spike' },
  { id: 'CASE-8819', customer: 'Yousef Al-Harbi', amount: 15450.00, date: '2026-07-08', status: 'Resolved', riskLevel: 'Critical', details: 'Unverified device SAMA hold bypass attempt' },
  { id: 'CASE-8812', customer: 'Sarah Al-Moneef', amount: 12850.50, date: '2026-07-07', status: 'Resolved', riskLevel: 'Medium', details: 'Location distance mismatch cleared after voice verification' }
];

export default function EnterpriseScreens({ 
  screen, 
  lang, 
  darkMode, 
  onNavigate, 
  onInspectTransaction, 
  cases, 
  transactions = [], 
  alerts = [],
  addToast,
  notifications = [],
  onViewDetailsNotification,
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification,
  reports = [],
  onUpdateReportStatus = () => {},
  onUpdateReportComplianceNotes = () => {},

  theme = 'dark',
  onThemeChange = () => {},
  onLangChange = () => {},
  notificationPrefs = { highRiskAlert: true, criticalCase: true, analysisCompletion: true, sama: true },
  onNotificationPrefsChange = () => {},
  dashboardDateRange = '30d',
  onDashboardDateRangeChange = () => {},
  defaultCurrency = 'SAR',
  onDefaultCurrencyChange = () => {},
  dateFormat = 'YYYY-MM-DD',
  onDateFormatChange = () => {},
  timeFormat = '24h',
  onTimeFormatChange = () => {},
  rowsPerPage = 10,
  onRowsPerPageChange = () => {},
  autoRefresh = true,
  onAutoRefreshChange = () => {},
  tableDensity = 'comfortable',
  onTableDensityChange = () => {},
  reduceMotion = false,
  onReduceMotionChange = () => {},
  largerText = false,
  onLargerTextChange = () => {},
  highContrast = false,
  onHighContrastChange = () => {}
}: EnterpriseScreensProps) {
  const t = translations[lang];
  const isRTL = lang === 'ar';
  const activeCases = cases || sampleCases;

  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [activeCustomer, setActiveCustomer] = useState<any | null>(null);
  const [streamData, setStreamData] = useState<any[]>([]);
  const [filterQuery, setFilterQuery] = useState('');
  const [analyticsLocation, setAnalyticsLocation] = useState<string>('All');
  const [analyticsType, setAnalyticsType] = useState<string>('All');
  const [analyticsRisk, setAnalyticsRisk] = useState<string>('All');
  const [riskFilter, setRiskFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [notifPreferences, setNotifPreferences] = useState({ email: true, sms: true, push: false, sama: true });
  const [securityLevel, setSecurityLevel] = useState('High');

  // Streaming Live Transaction simulator
  useEffect(() => {
    if ((screen as string) !== 'live-monitoring') return;
    
    const initialStream = [
      { id: 'TXN-901', name: 'Sarah M.', iban: 'SA80...1001', amount: 4299.00, location: 'Riyadh', risk: 85, status: 'Flagged', time: 'Just Now' },
      { id: 'TXN-902', name: 'Khalid A.', iban: 'SA80...3002', amount: 150.00, location: 'Jeddah', risk: 5, status: 'Safe', time: '1s ago' },
      { id: 'TXN-903', name: 'Ahmad S.', iban: 'SA80...8821', amount: 8900.50, location: 'Khobar', risk: 42, status: 'Pending', time: '4s ago' },
    ];
    setStreamData(initialStream);

    const interval = setInterval(() => {
      const names = ['Yasmin F.', 'Mishaal B.', 'Nasser O.', 'Waleed K.'];
      const cities = ['Riyadh', 'Jeddah', 'Dammam', 'Medina', 'Jubail'];
      const randomAmount = parseFloat((Math.random() * 5000 + 10).toFixed(2));
      const randomRisk = Math.floor(Math.random() * 100);
      const newTx = {
        id: `TXN-${Math.floor(Math.random() * 900) + 100}`,
        name: names[Math.floor(Math.random() * names.length)],
        iban: `SA80...${Math.floor(Math.random() * 8000) + 1000}`,
        amount: randomAmount,
        location: cities[Math.floor(Math.random() * cities.length)],
        risk: randomRisk,
        status: randomRisk > 75 ? 'Flagged' : randomRisk > 35 ? 'Pending' : 'Safe',
        time: 'Just Now'
      };

      setStreamData(prev => [newTx, ...prev.slice(0, 5)]);
    }, 4000);

    return () => clearInterval(interval);
  }, [screen]);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filterQuery, riskFilter, typeFilter, sortBy]);

  // Render 2. Transactions Table
  if (screen === 'transactions') {
    const allTxns = transactions || [];

    // Filter & Search Logic
    const filteredTxns = allTxns.filter(txn => {
      const query = filterQuery.toLowerCase();
      const matchesSearch = 
        txn.id.toLowerCase().includes(query) ||
        txn.customerName.toLowerCase().includes(query) ||
        (txn.merchantName || '').toLowerCase().includes(query) ||
        (txn.ipAddress || '').toLowerCase().includes(query) ||
        (txn.location || '').toLowerCase().includes(query);

      const matchesRisk = riskFilter === 'All' || txn.status === riskFilter;
      const matchesType = typeFilter === 'All' || txn.type === typeFilter;

      return matchesSearch && matchesRisk && matchesType;
    });

    // Sorting Logic
    const sortedTxns = [...filteredTxns].sort((a, b) => {
      if (sortBy === 'newest') {
        return b.id.localeCompare(a.id);
      }
      if (sortBy === 'oldest') {
        return a.id.localeCompare(b.id);
      }
      if (sortBy === 'amount_desc') {
        return b.amount - a.amount;
      }
      if (sortBy === 'amount_asc') {
        return a.amount - b.amount;
      }
      if (sortBy === 'risk_desc') {
        return b.aiRiskScore - a.aiRiskScore;
      }
      if (sortBy === 'risk_asc') {
        return a.aiRiskScore - b.aiRiskScore;
      }
      return 0;
    });

    // Pagination Logic
    const itemsPerPage = 15;
    const totalItems = sortedTxns.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
    const activePage = currentPage > totalPages ? totalPages : currentPage;
    const startIndex = (activePage - 1) * itemsPerPage;
    const paginatedTxns = sortedTxns.slice(startIndex, startIndex + itemsPerPage);

    const handleDownload = (format: string, filename: string) => {
      if (addToast) {
        addToast(`Dossier exported to ${format.toUpperCase()} successfully.`, 'success');
      }
    };

    return (
      <div className={`space-y-6 animate-fade-in ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className={`flex flex-wrap items-center justify-between gap-4`}>
          <div>
            <h3 className="text-lg font-black text-[#001939] dark:text-white">{t.transactions}</h3>
            <p className="text-xs text-gray-500">{t.realtimeActivity}</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => handleDownload('csv', 'All_Transactions')} 
              className="px-3.5 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border-none text-gray-800 dark:text-gray-100"
            >
              <Download className="w-4 h-4 text-gray-400" />
              <span>{t.exportCsv}</span>
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-[#070e17] rounded-3xl p-6 border border-gray-100 dark:border-gray-800/60 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="relative md:col-span-2">
              <Search className={`absolute w-4 h-4 text-gray-400 top-1/2 -translate-y-1/2 ${isRTL ? 'right-4' : 'left-4'}`} />
              <input
                type="text"
                placeholder={isRTL ? "ابحث حسب المعرف، العميل، التاجر، أو عنوان IP..." : "Search ID, customer, merchant, or IP..."}
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className={`w-full py-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#0b1524] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-gray-800 dark:text-gray-100 ${
                  isRTL ? 'pr-11 pl-4' : 'pl-11 pr-4'
                }`}
              />
            </div>

            {/* Risk Status Filter */}
            <div>
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="w-full py-3 px-4 rounded-xl border border-gray-150 dark:border-gray-800 bg-gray-50 dark:bg-[#0b1524] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-gray-800 dark:text-gray-100 cursor-pointer"
              >
                <option value="All">{isRTL ? "كل مستويات الخطورة" : "All Risk Levels"}</option>
                <option value="Safe">{isRTL ? "مقبول / آمن" : "Safe"}</option>
                <option value="Medium">{isRTL ? "معلق / مشبوه" : "Medium"}</option>
                <option value="High">{isRTL ? "محظور / حرج" : "High"}</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full py-3 px-4 rounded-xl border border-gray-150 dark:border-gray-800 bg-gray-50 dark:bg-[#0b1524] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-gray-800 dark:text-gray-100 cursor-pointer"
              >
                <option value="newest">{isRTL ? "الأحدث أولاً" : "Newest First"}</option>
                <option value="oldest">{isRTL ? "الأقدم أولاً" : "Oldest First"}</option>
                <option value="amount_desc">{isRTL ? "المبلغ (الأعلى)" : "Amount (High-Low)"}</option>
                <option value="amount_asc">{isRTL ? "المبلغ (الأقل)" : "Amount (Low-High)"}</option>
                <option value="risk_desc">{isRTL ? "مؤشر الخطورة (الأعلى)" : "Risk Score (High-Low)"}</option>
                <option value="risk_asc">{isRTL ? "مؤشر الخطورة (الأقل)" : "Risk Score (Low-High)"}</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-[#0b1524]/60 text-gray-500 dark:text-gray-400 text-[10px] font-black uppercase tracking-wider border-b border-gray-100 dark:border-gray-800/60">
                  <th className="px-4 py-3">{isRTL ? 'معرف العملية' : 'Txn ID'}</th>
                  <th className="px-4 py-3">{isRTL ? 'العميل' : 'Customer'}</th>
                  <th className="px-4 py-3">{isRTL ? 'الجهة المستلمة' : 'Recipient'}</th>
                  <th className="px-4 py-3">{isRTL ? 'المبلغ الفعلي' : 'Amount'}</th>
                  <th className="px-4 py-3">{isRTL ? 'الموقع وعنوان IP' : 'Location & IP'}</th>
                  <th className="px-4 py-3">{isRTL ? 'مؤشر خطورة AI' : 'Risk Score'}</th>
                  <th className="px-4 py-3">{isRTL ? 'حالة الاعتماد' : 'Status'}</th>
                  <th className="px-4 py-3">{isRTL ? 'تدقيق الامتثال' : 'Compliance'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800/40 text-xs font-semibold">
                {paginatedTxns.map((txn) => (
                  <tr key={txn.id} className="hover:bg-gray-50/50 dark:hover:bg-[#0a1420]/30 transition-all">
                    <td className="px-4 py-4 font-mono text-[#D4AF37] font-black">{txn.id}</td>
                    <td className="px-4 py-4 text-gray-800 dark:text-gray-200">
                      <div className="font-bold">{txn.customerName}</div>
                      <div className="text-[9px] text-gray-400 dark:text-gray-500 font-mono">{txn.accountNumber}</div>
                    </td>
                    <td className="px-4 py-4 text-gray-650 dark:text-gray-300">
                      <div className="font-bold text-[#001939] dark:text-white">{txn.merchantName}</div>
                      <div className="text-[9px] text-gray-400 dark:text-gray-500">MCC: {txn.mcc}</div>
                    </td>
                    <td className="px-4 py-4 font-bold text-gray-950 dark:text-white">
                      {txn.currency} {txn.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-4 text-gray-500">
                      <div>{txn.location}</div>
                      <div className="text-[9px] text-gray-400 dark:text-gray-500 font-mono">{txn.ipAddress}</div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-0.5 rounded font-black ${
                        txn.aiRiskScore > 75 ? 'text-red-500 bg-red-50 dark:bg-red-950/20' : 
                        txn.aiRiskScore > 35 ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/20' : 
                        'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20'
                      }`}>
                        {txn.aiRiskScore}%
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-black ${
                        txn.status === 'High' ? 'bg-red-50 text-red-700 dark:bg-red-950/20 border border-red-200' : 
                        txn.status === 'Medium' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 border border-amber-200' : 
                        'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 border border-emerald-200'
                      }`}>
                        {txn.status === 'High' ? (isRTL ? 'محظور / حرج' : 'Blocked') : 
                         txn.status === 'Medium' ? (isRTL ? 'معلق / مشبوه' : 'Suspicious') : 
                         (isRTL ? 'مقبول / آمن' : 'Approved')}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => onInspectTransaction(txn)}
                        className="bg-gray-50 hover:bg-[#D4AF37]/15 hover:text-[#D4AF37] dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-750 dark:text-gray-200 text-[10px] font-black px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer transition-all active:scale-95"
                      >
                        {isRTL ? 'تفاصيل الرقابة' : 'Details Audit'}
                      </button>
                    </td>
                  </tr>
                ))}
                {paginatedTxns.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-400 dark:text-gray-500">
                      {isRTL ? 'لم يتم العثور على أي عمليات تطابق خيارات البحث والفلترة.' : 'No transactions found matching your search and filter criteria.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {totalPages > 1 && (
            <div className={`flex flex-wrap items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-800/40 text-xs font-bold gap-4 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className="text-gray-400 dark:text-gray-500">
                {isRTL 
                  ? `عرض ${startIndex + 1}-${Math.min(startIndex + itemsPerPage, totalItems)} من أصل ${totalItems} عملية` 
                  : `Showing ${startIndex + 1}-${Math.min(startIndex + itemsPerPage, totalItems)} of ${totalItems} transactions`}
              </div>
              <div className="flex items-center gap-2">
                <button
                  disabled={activePage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className="px-3 py-1.5 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-300 disabled:opacity-40 cursor-pointer border-none transition-all active:scale-95"
                >
                  {isRTL ? 'السابق' : 'Previous'}
                </button>
                <span className="text-gray-500 dark:text-gray-400">
                  {isRTL ? `صفحة ${activePage} من ${totalPages}` : `Page ${activePage} of ${totalPages}`}
                </span>
                <button
                  disabled={activePage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  className="px-3 py-1.5 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-300 disabled:opacity-40 cursor-pointer border-none transition-all active:scale-95"
                >
                  {isRTL ? 'التالي' : 'Next'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Render 3. Customers Database + Deep Dossier Profile view
  if (screen === 'customers') {
    const dynamicCustomers = (() => {
      const list: any[] = [];
      const seenNames = new Set<string>();

      // Seed from sampleCustomers first to ensure standard profiles exist
      sampleCustomers.forEach(sc => {
        seenNames.add(sc.name.toLowerCase().trim());
        const customerTxns = transactions.filter(t => (t.customerName || '').toLowerCase().trim() === sc.name.toLowerCase().trim());
        const firstTx = customerTxns[0];
        
        const relatedRpts = reports.filter(r => (r.customerName || '').toLowerCase().trim() === sc.name.toLowerCase().trim());
        const relatedAlts = alerts.filter(a => (a.customerName || '').toLowerCase().trim() === sc.name.toLowerCase().trim());
        const riskHistory = customerTxns.map(t => t.aiRiskScore);

        list.push({
          id: sc.id,
          name: sc.name,
          gender: sc.gender || 'Unknown',
          accountNumber: firstTx?.accountNumber || '4000010988',
          accountAge: firstTx?.accountAge || 180,
          city: sc.location.split(',')[0].trim(),
          averageSpending: firstTx?.averageCustomerSpend || 12500,
          previousTransactions: customerTxns.length || 5,
          riskHistory: riskHistory.length > 0 ? riskHistory : [sc.risk],
          risk: sc.risk,
          stability: sc.stability,
          nationalId: sc.nationalId,
          email: sc.email,
          phone: sc.phone,
          iban: sc.iban || firstTx?.iban || `SA80400001098827361001`,
          device: sc.device,
          cards: sc.cards,
          relatedReports: relatedRpts,
          relatedAlerts: relatedAlts
        });
      });

      // Add unique customers from transaction dataset
      transactions.forEach(tx => {
        const nameKey = (tx.customerName || '').toLowerCase().trim();
        if (nameKey && nameKey !== 'unknown customer' && !seenNames.has(nameKey)) {
          seenNames.add(nameKey);
          const customerTxns = transactions.filter(t => (t.customerName || '').toLowerCase().trim() === nameKey);
          const relatedRpts = reports.filter(r => (r.customerName || '').toLowerCase().trim() === nameKey);
          const relatedAlts = alerts.filter(a => (a.customerName || '').toLowerCase().trim() === nameKey);
          const riskHistory = customerTxns.map(t => t.aiRiskScore);
          const avgRisk = Math.round(riskHistory.reduce((sum, val) => sum + val, 0) / riskHistory.length) || 0;

          list.push({
            id: `CUST-${tx.id.replace('TXN-', '')}`,
            name: tx.customerName,
            gender: tx.gender || 'Unknown',
            accountNumber: tx.accountNumber || '4000021345',
            accountAge: tx.accountAge || 120,
            city: tx.location.split(',')[0].trim(),
            averageSpending: tx.averageCustomerSpend || (tx.amount * 1.1),
            previousTransactions: customerTxns.length,
            riskHistory: riskHistory,
            risk: avgRisk,
            stability: avgRisk > 75 ? 'Under Watch' : avgRisk > 35 ? 'Intermediate' : 'High Stability',
            nationalId: `10${Math.floor(10000000 + Math.random() * 90000000)}`,
            email: `${tx.customerName.toLowerCase().replace(/\s+/g, '.')}@saudidb.com`,
            phone: `+966 5${Math.floor(10000000 + Math.random() * 90000000)}`,
            iban: tx.iban || `SA80400001${tx.accountNumber || '21345'}001`,
            device: tx.deviceId || 'Mobile App',
            cards: 1,
            relatedReports: relatedRpts,
            relatedAlerts: relatedAlts
          });
        }
      });

      return list;
    })();

    return (
      <div className={`space-y-6 animate-fade-in ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        {!activeCustomer ? (
          <>
            <div>
              <h3 className="text-lg font-black text-[#001939] dark:text-white">{t.customers}</h3>
              <p className="text-xs text-gray-500">{t.customerProfileSub}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {dynamicCustomers.map((cust) => (
                <div key={cust.id} className="bg-white dark:bg-[#070e17] p-6 rounded-3xl border border-gray-100 dark:border-gray-800/60 shadow-sm flex flex-col justify-between">
                  <div className={`flex items-center gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                    <img
                      src={getAvatarByCustomerName(cust.name, transactions)}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover shrink-0 border border-gray-100 dark:border-gray-800"
                      alt={cust.name}
                    />
                    <div>
                      <h4 className="text-xs font-black text-gray-900 dark:text-white truncate max-w-[140px]">{cust.name}</h4>
                      <p className="text-[10px] text-gray-400 font-bold">{cust.id}</p>
                    </div>
                  </div>

                  <div className="space-y-2 border-t border-gray-50 dark:border-gray-800/60 pt-4 mb-4 text-xs font-semibold text-gray-600 dark:text-gray-300">
                    <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                      <span>{isRTL ? 'الجنس:' : 'Gender:'}</span>
                      <span className="text-gray-800 dark:text-white font-bold">{isRTL && cust.gender === 'Female' ? 'أنثى' : isRTL && cust.gender === 'Male' ? 'ذكر' : cust.gender}</span>
                    </div>
                    <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                      <span>{t.location}:</span>
                      <span>{cust.city}</span>
                    </div>
                    <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                      <span>{t.riskScore}:</span>
                      <span className={`font-black ${cust.risk > 50 ? 'text-red-500' : 'text-emerald-500'}`}>{cust.risk}%</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveCustomer(cust)}
                    className="w-full py-2 bg-gray-50 dark:bg-gray-800 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] rounded-xl text-xs font-black transition-all border-none cursor-pointer text-gray-700 dark:text-gray-300"
                  >
                    {isRTL ? 'الملف الأمني والتحقق بالذكاء الاصطناعي' : 'View AI Dossier'}
                  </button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="space-y-6">
            <button
              onClick={() => setActiveCustomer(null)}
              className={`flex items-center gap-1.5 text-xs font-black text-gray-400 hover:text-[#006A4E] bg-transparent border-none cursor-pointer ${
                isRTL ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              <span>{isRTL ? 'العودة لقائمة العملاء' : 'Back to Customers'}</span>
            </button>

            <div className="bg-[#0b1524] text-white p-8 rounded-3xl border border-[#D4AF37]/30 shadow-xl relative overflow-hidden">
              <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-5 pointer-events-none bg-[radial-gradient(ellipse_at_bottom_right,var(--color-[#D4AF37]),transparent)]" />
              <div className={`relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}>
                  <img
                    src={getAvatarByCustomerName(activeCustomer.name, transactions)}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-[#D4AF37] shrink-0"
                    alt={activeCustomer.name}
                  />
                  <div>
                    <h2 className="text-xl font-black text-white">{activeCustomer.name}</h2>
                    <p className="text-xs text-[#D4AF37] font-black">{activeCustomer.id} • {activeCustomer.stability}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className={`px-4 py-2 text-white rounded-xl text-xs font-black ${
                    activeCustomer.risk < 40 ? 'bg-emerald-600' : 'bg-red-600'
                  }`}>
                    {activeCustomer.risk}% {isRTL ? 'مستوى الخطورة' : 'Risk'}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left column: Core Profile Details */}
              <div className="lg:col-span-4 bg-white dark:bg-[#070e17] p-6 rounded-3xl border border-gray-100 dark:border-gray-800/60 shadow-sm space-y-4">
                <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{t.customerProfileTitle}</h3>
                <div className="space-y-3.5 text-xs font-bold text-gray-600 dark:text-gray-300">
                  <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                    <span>{isRTL ? 'الجنس:' : 'Gender:'}</span>
                    <span className="font-semibold text-gray-800 dark:text-white">{isRTL && activeCustomer.gender === 'Female' ? 'أنثى' : isRTL && activeCustomer.gender === 'Male' ? 'ذكر' : activeCustomer.gender}</span>
                  </div>
                  <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                    <span>{isRTL ? 'رقم الحساب:' : 'Account Number:'}</span>
                    <span className="font-mono text-gray-800 dark:text-white">{activeCustomer.accountNumber}</span>
                  </div>
                  <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                    <span>{isRTL ? 'عمر الحساب:' : 'Account Age:'}</span>
                    <span className="font-semibold text-gray-800 dark:text-white">{activeCustomer.accountAge} {isRTL ? 'يوم' : 'days'}</span>
                  </div>
                  <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                    <span>{isRTL ? 'المدينة:' : 'City:'}</span>
                    <span className="font-semibold text-gray-800 dark:text-white">{activeCustomer.city}</span>
                  </div>
                  <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                    <span>{isRTL ? 'متوسط الإنفاق بالريال:' : 'Average Spending:'}</span>
                    <span className="font-semibold text-gray-800 dark:text-white">SAR {activeCustomer.averageSpending.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                  <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                    <span>{isRTL ? 'العمليات السابقة (24 ساعة):' : 'Previous Transactions:'}</span>
                    <span className="font-mono text-gray-800 dark:text-white">{activeCustomer.previousTransactions}</span>
                  </div>
                  <div className="h-px bg-gray-50 dark:bg-gray-800/60 my-2" />
                  <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                    <span>{t.nationalId}:</span>
                    <span className="font-mono text-gray-800 dark:text-white">{activeCustomer.nationalId}</span>
                  </div>
                  <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                    <span>{t.emailAddress}:</span>
                    <span className="truncate max-w-[140px]">{activeCustomer.email}</span>
                  </div>
                  <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                    <span>{t.phoneNo}:</span>
                    <span className="font-mono">{activeCustomer.phone}</span>
                  </div>
                  <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                    <span>{t.iban}:</span>
                    <span className="font-mono truncate max-w-[130px]" title={activeCustomer.iban}>{activeCustomer.iban}</span>
                  </div>
                </div>
              </div>

              {/* Right column: AI Risk Assessment & Linked Records */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* AI Summary and Nodes */}
                <div className="bg-white dark:bg-[#070e17] p-6 rounded-3xl border border-gray-100 dark:border-gray-800/60 shadow-sm space-y-4">
                  <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{t.aiRiskSummary}</h3>
                  <p className="text-xs leading-relaxed text-gray-700 dark:text-gray-300 font-semibold">
                    {isRTL 
                      ? `قام نموذج جيميناي بتقييم الحساب للعميل ${activeCustomer.name}. العميل لديه مؤشر استقرار قدره (${activeCustomer.stability}) مع نطاق معاملات مالي منسجم من موقعه المعتاد في ${activeCustomer.city}. لا يوجد حالياً أي حركات اشتباه غسيل أموال نشطة.` 
                      : `Gemini has completed an AML verification audit on customer ${activeCustomer.name}. The node demonstrates consistent regional proximity compliance in ${activeCustomer.city} utilizing verified hardware device ${activeCustomer.device}.`}
                  </p>
                  <div className="grid grid-cols-3 gap-3 border-t border-gray-50 dark:border-gray-800/60 pt-4 text-center">
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <span className="text-[10px] text-gray-400 font-bold block uppercase">{t.devicesUsed}</span>
                      <span className="text-xs font-black mt-1 block">{activeCustomer.device}</span>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <span className="text-[10px] text-gray-400 font-bold block uppercase">{t.cardsCount}</span>
                      <span className="text-xs font-black mt-1 block">{activeCustomer.cards || 1} Active</span>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <span className="text-[10px] text-gray-400 font-bold block uppercase">SAMA Nodes</span>
                      <span className="text-xs font-black mt-1 block text-emerald-500">Secure</span>
                    </div>
                  </div>
                </div>

                {/* Risk History and Connection Logs */}
                <div className="bg-white dark:bg-[#070e17] p-6 rounded-3xl border border-gray-100 dark:border-gray-800/60 shadow-sm space-y-4">
                  <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{isRTL ? 'تاريخ تقييم المخاطر للعمليات' : 'Risk Evaluation History'}</h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    {activeCustomer.riskHistory.map((riskScore: number, idx: number) => (
                      <div key={idx} className={`px-3 py-1.5 rounded-xl font-mono text-xs font-black ${
                        riskScore > 75 ? 'bg-red-50 dark:bg-red-950/20 text-red-600' :
                        riskScore > 35 ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-500' :
                        'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600'
                      }`}>
                        TX #{idx + 1}: {riskScore}%
                      </div>
                    ))}
                  </div>
                </div>

                {/* Linked Reports and Alerts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Related Reports */}
                  <div className="bg-white dark:bg-[#070e17] p-6 rounded-3xl border border-gray-100 dark:border-gray-800/60 shadow-sm space-y-4">
                    <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                      {isRTL ? `التقارير المرتبطة (${activeCustomer.relatedReports.length})` : `Related Reports (${activeCustomer.relatedReports.length})`}
                    </h3>
                    {activeCustomer.relatedReports.length === 0 ? (
                      <p className="text-xs font-bold text-gray-400">{isRTL ? 'لا توجد تقارير أمنية مرتبطة' : 'No related security reports found.'}</p>
                    ) : (
                      <div className="space-y-2">
                        {activeCustomer.relatedReports.map((r: any) => (
                          <div key={r.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl flex justify-between items-center text-xs font-semibold">
                            <span className="font-mono text-[#D4AF37]">{r.id}</span>
                            <span className="text-gray-400">{r.riskLevel}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Related Alerts */}
                  <div className="bg-white dark:bg-[#070e17] p-6 rounded-3xl border border-gray-100 dark:border-gray-800/60 shadow-sm space-y-4">
                    <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                      {isRTL ? `التنبيهات المرتبطة (${activeCustomer.relatedAlerts.length})` : `Related Alerts (${activeCustomer.relatedAlerts.length})`}
                    </h3>
                    {activeCustomer.relatedAlerts.length === 0 ? (
                      <p className="text-xs font-bold text-gray-400">{isRTL ? 'لا توجد تنبيهات مرتبطة' : 'No related fraud alerts found.'}</p>
                    ) : (
                      <div className="space-y-2">
                        {activeCustomer.relatedAlerts.map((a: any) => (
                          <div key={a.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl flex justify-between items-center text-xs font-semibold">
                            <span className="text-gray-800 dark:text-white font-bold truncate max-w-[120px]">{a.title}</span>
                            <span className="font-mono text-red-500">{a.severity}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Render 5. Fraud Cases
  if (screen === 'fraud-cases') {
    return (
      <div className={`space-y-6 animate-fade-in ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div>
          <h3 className="text-lg font-black text-[#001939] dark:text-white">{t.fraudCases}</h3>
          <p className="text-xs text-gray-500">{isRTL ? 'إدارة حالات الاحتيال النشطة واتخاذ الإجراءات الأمنية الفورية' : 'Manage active fraud cases and take immediate security actions'}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activeCases.map((c) => {
            // Find linked transaction and report dynamically
            const matchedTx = transactions.find(t => (t.customerName || '').toLowerCase().trim() === (c.customer || '').toLowerCase().trim());
            const linkedReport = reports.find(r => (r.customerName || '').toLowerCase().trim() === (c.customer || '').toLowerCase().trim());
            
            const riskLevel = c.riskLevel || (matchedTx ? (matchedTx.aiRiskScore > 75 ? 'Critical' : 'High') : 'Medium');
            const recommendedAction = isRTL 
              ? (riskLevel === 'Critical' ? 'حظر فوري للحساب وتجميد المحفظة بالتنسيق مع سما' : 'طلب التحقق الثنائي وإرسال إشعار أمني للعميل')
              : (riskLevel === 'Critical' ? 'Immediate SAMA Lock & Freeze Node' : 'Enforce Multi-Factor Verification & Notify');

            return (
              <div key={c.id} className="bg-white dark:bg-[#070e17] p-6 rounded-3xl border border-gray-100 dark:border-gray-800/60 shadow-sm flex flex-col justify-between space-y-4">
                <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                  <span className="font-mono font-black text-[#D4AF37]">{c.id}</span>
                  <div className="flex items-center gap-1.5">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black ${
                      riskLevel === 'Critical' || riskLevel === 'High' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {riskLevel.toUpperCase()}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black ${
                      c.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                    }`}>
                      {c.status === 'Resolved' ? t.resolved : t.investigating}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-black text-gray-800 dark:text-gray-100">{c.customer}</h4>
                  <p className="text-[10px] text-gray-400 mt-1">{c.details}</p>
                </div>

                {/* Recommended Action */}
                <div className="bg-gray-50 dark:bg-[#0b1524]/60 p-3 rounded-xl border border-gray-100 dark:border-gray-800/40 text-[10px] font-semibold text-gray-600 dark:text-gray-300">
                  <span className="font-bold text-gray-400 block mb-0.5 uppercase">{isRTL ? 'الإجراء الموصى به:' : 'Recommended Action:'}</span>
                  <span className="font-extrabold text-[#006A4E] dark:text-emerald-400">{recommendedAction}</span>
                </div>

                {/* Linked Reports */}
                {linkedReport ? (
                  <div className={`flex justify-between items-center text-[10px] font-bold ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                    <span className="text-gray-400">{isRTL ? 'التقرير المرتبط:' : 'Linked Report:'}</span>
                    <button
                      onClick={() => {
                        setSelectedReportId(linkedReport.id);
                        onNavigate('reports');
                      }}
                      className="text-[#D4AF37] hover:underline font-extrabold bg-transparent border-none cursor-pointer p-0 font-mono"
                    >
                      {linkedReport.id}
                    </button>
                  </div>
                ) : (
                  <div className={`flex justify-between items-center text-[10px] font-bold ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                    <span className="text-gray-400">{isRTL ? 'التقرير المرتبط:' : 'Linked Report:'}</span>
                    <span className="text-gray-400 italic">{isRTL ? 'لا يوجد تقرير بعد' : 'No report generated'}</span>
                  </div>
                )}

                <div className="border-t border-gray-50 dark:border-gray-800/60 pt-4 flex justify-between items-center text-xs font-bold">
                  <span className="text-[#006A4E] dark:text-emerald-400">SAR {c.amount.toLocaleString()}</span>
                  <span className="text-gray-400">{c.date}</span>
                </div>

                {/* Open Transaction action */}
                {matchedTx && (
                  <button
                    onClick={() => onInspectTransaction(matchedTx)}
                    className="w-full py-2 bg-[#006A4E]/10 hover:bg-[#006A4E]/20 text-[#006A4E] dark:text-emerald-400 rounded-xl text-[10px] font-black transition-all border-none cursor-pointer"
                  >
                    {isRTL ? 'تحليل العملية المرتبطة بالبطاقة' : 'Analyze Linked Transaction'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Render 6. Reports Center
  if (screen === 'reports') {
    if (selectedReportId) {
      const selectedReport = reports.find(r => r.id === selectedReportId);
      if (selectedReport) {
        return (
          <InvestigationReportView
            report={selectedReport}
            lang={lang}
            onBack={() => setSelectedReportId(null)}
            onUpdateStatus={onUpdateReportStatus}
            onUpdateComplianceNotes={onUpdateReportComplianceNotes}
            addToast={addToast || (() => {})}
          />
        );
      }
    }

    const reportCategories = [
      { name: t.dailyReport, desc: 'Complete sovereign audit ledger for past 24h transactions.' },
      { name: t.weeklyReport, desc: 'Weekly risk assessment matrix and spatial proximity log.' },
      { name: t.monthlyReport, desc: 'SAMA anti-money laundering suspicious transactions audit report (STR).' },
      { name: t.annualReport, desc: 'Comprehensive annual regulatory and threat trend report.' }
    ];

    // Status Badge helper
    const getStatusBadge = (status: string) => {
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

    const getRiskBadge = (level: string) => {
      switch (level.toUpperCase()) {
        case 'CRITICAL':
        case 'HIGH':
          return 'bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400';
        case 'MEDIUM':
          return 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400';
        default:
          return 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400';
      }
    };

    return (
      <div className={`space-y-6 animate-fade-in ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="bg-[#0b1524] text-white p-6 rounded-3xl border border-[#D4AF37]/30 shadow-xl no-print">
          <h3 className="text-lg font-black text-[#D4AF37] mb-2">{t.reportsTitle}</h3>
          <p className="text-xs text-gray-300">{t.reportsSub}</p>
        </div>

        {/* Live Generated Reports Table section */}
        <div className="bg-white dark:bg-[#070e17] rounded-3xl p-6 border border-gray-100 dark:border-gray-800/60 shadow-sm space-y-4 no-print">
          <h4 className="text-sm font-black text-[#001939] dark:text-white uppercase tracking-widest flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#D4AF37]" />
            <span>{isRTL ? 'سجلات وتقارير التحقيق النشطة' : 'Active Security Investigation Reports'}</span>
          </h4>

          {reports.length === 0 ? (
            <div className="p-8 text-center bg-gray-50 dark:bg-[#0b1524]/20 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
              <ShieldAlert className="w-8 h-8 text-amber-500 mx-auto mb-2 animate-bounce" />
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
                {isRTL 
                  ? 'لا توجد تقارير تحقيق أمني تفاعلية مُنشأة بعد. قم بتشغيل تحليل جيميناي للعمليات من لوحة التنبيهات لإنشاء التقرير فورياً.' 
                  : 'No interactive security reports generated yet. Trigger a Gemini AI analysis on any transaction in the Alerts Feed to generate a compliance report instantly.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-gray-100 dark:border-gray-800/40">
              <table className="w-full text-center border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-[#0b1524]/60 text-gray-500 dark:text-gray-400 text-[10px] font-black uppercase tracking-wider border-b border-gray-100 dark:border-gray-800/60">
                    <th className="px-4 py-3">{isRTL ? 'رقم التقرير' : 'Report ID'}</th>
                    <th className="px-4 py-3">{isRTL ? 'رقم العملية' : 'Transaction ID'}</th>
                    <th className="px-4 py-3">{isRTL ? 'اسم العميل' : 'Customer Name'}</th>
                    <th className="px-4 py-3">{isRTL ? 'المبلغ' : 'Amount'}</th>
                    <th className="px-4 py-3">{isRTL ? 'مستوى المخاطر' : 'Risk Level'}</th>
                    <th className="px-4 py-3">{isRTL ? 'درجة الخطورة' : 'Risk Score'}</th>
                    <th className="px-4 py-3">{isRTL ? 'تاريخ الإنشاء' : 'Generated Date'}</th>
                    <th className="px-4 py-3">{isRTL ? 'حالة التحقيق' : 'Investigation Status'}</th>
                    <th className="px-4 py-3">{isRTL ? 'عرض التقرير' : 'View Report'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800/40 text-xs font-semibold">
                  {reports.map((rep) => (
                    <tr key={rep.id} className="hover:bg-gray-50/50 dark:hover:bg-[#0a1420]/30 transition-all">
                      <td className="px-4 py-3.5 font-mono text-[#D4AF37]">{rep.id}</td>
                      <td className="px-4 py-3.5 font-mono text-gray-500">{rep.transactionId}</td>
                      <td className="px-4 py-3.5 text-gray-800 dark:text-gray-200">{rep.customerName}</td>
                      <td className="px-4 py-3.5 text-gray-800 dark:text-gray-200">
                        {isRTL ? `${rep.amount.toLocaleString()} ر.س` : `SAR ${rep.amount.toLocaleString()}`}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black ${getRiskBadge(rep.riskLevel)}`}>
                          {rep.riskLevel.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-black text-red-500">{rep.riskScore}%</td>
                      <td className="px-4 py-3.5 text-gray-500 font-mono">
                        {new Date(rep.analysisDateTime).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-black ${getStatusBadge(rep.investigationStatus)}`}>
                          {isRTL ? (
                            rep.investigationStatus === 'Approved' ? 'معتمدة' :
                            rep.investigationStatus === 'Rejected' ? 'مرفوضة' :
                            rep.investigationStatus === 'Escalated' ? 'مصعّدة' :
                            rep.investigationStatus === 'Under Investigation' ? 'تحت التحقيق' : 'قيد المراجعة'
                          ) : rep.investigationStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <button
                          onClick={() => setSelectedReportId(rep.id)}
                          className="px-3 py-1.5 text-[10px] font-black text-white bg-[#006A4E] hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-lg transition-all active:scale-95 cursor-pointer border-none flex items-center gap-1 mx-auto"
                          title={isRTL ? 'فتح التقرير التفصيلي' : 'Open Detailed Report'}
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{isRTL ? 'عرض التقرير' : 'View Report'}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Categories Section for standard sovereignty reports */}
        <div className="space-y-4 no-print">
          <h4 className="text-sm font-black text-[#001939] dark:text-white uppercase tracking-widest flex items-center gap-2">
            <Landmark className="w-5 h-5 text-[#D4AF37]" />
            <span>{isRTL ? 'دفاتر التدقيق السيادي الدوري لساما' : 'Periodic SAMA Sovereign Audit Ledgers'}</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reportCategories.map((rep, idx) => (
              <div key={idx} className="bg-white dark:bg-[#070e17] p-6 rounded-3xl border border-gray-100 dark:border-gray-800/60 shadow-sm flex flex-col justify-between space-y-4">
                <div>
                  <h4 className="text-sm font-black text-[#001939] dark:text-white">{rep.name}</h4>
                  <p className="text-xs text-gray-500 mt-2 leading-relaxed">{rep.desc}</p>
                </div>

                <div className={`flex items-center gap-1.5 pt-3 border-t border-gray-50 dark:border-gray-800/60 text-[10px] text-gray-400 font-extrabold ${isRTL ? 'justify-end' : 'justify-start'}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>{isRTL ? 'مراقب داخلياً في النظام' : 'Monitored Internally'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Render 7. Analytics Hub
  if (screen === 'analytics') {
    // 1. Dynamic Filtering of CSV/analysis dataset
    const filteredTxns = transactions.filter(t => {
      // Location filter
      if (analyticsLocation !== 'All') {
        const loc = (t.location || '').toLowerCase();
        const filterLoc = analyticsLocation.toLowerCase();
        if (!loc.includes(filterLoc)) return false;
      }
      // Type filter
      if (analyticsType !== 'All' && t.type !== analyticsType) {
        return false;
      }
      // Risk filter
      if (analyticsRisk !== 'All') {
        if (analyticsRisk === 'Safe' && t.status !== 'Safe') return false;
        if (analyticsRisk === 'Risky' && t.status === 'Safe') return false;
      }
      return true;
    });

    // 2. Metrics calculations
    const totalCount = filteredTxns.length;
    const totalRisky = filteredTxns.filter(t => t.status !== 'Safe').length;
    const averageRisk = totalCount > 0 
      ? Math.round(filteredTxns.reduce((sum, t) => sum + t.aiRiskScore, 0) / totalCount)
      : 0;

    const totalPreventedFraud = filteredTxns.filter(t => t.status !== 'Safe').reduce((sum, t) => sum + t.amount, 0);
    const basePreventedValue = 42800000;
    const currentPreventedValue = basePreventedValue + totalPreventedFraud;

    // Threat Vectors
    const totalDebit = filteredTxns.filter(t => t.type === 'Debit').length || 1;
    const riskyDebit = filteredTxns.filter(t => t.type === 'Debit' && t.status !== 'Safe').length;
    const debitRisk = ((riskyDebit / totalDebit) * 100).toFixed(1);

    const totalTransfer = filteredTxns.filter(t => t.type === 'Transfer').length || 1;
    const riskyTransfer = filteredTxns.filter(t => t.type === 'Transfer' && t.status !== 'Safe').length;
    const transferRisk = ((riskyTransfer / totalTransfer) * 100).toFixed(1);

    const totalCredit = filteredTxns.filter(t => t.type === 'Credit').length || 1;
    const riskyCredit = filteredTxns.filter(t => t.type === 'Credit' && t.status !== 'Safe').length;
    const creditRisk = ((riskyCredit / totalCredit) * 100).toFixed(1);

    // 3. Recharts Risk Distribution Dataset
    const riskDistributionData = [
      { name: isRTL ? 'آمن (0-25%)' : 'Safe (0-25%)', count: filteredTxns.filter(t => t.aiRiskScore <= 25).length, color: '#006A4E' },
      { name: isRTL ? 'حذر (26-50%)' : 'Caution (26-50%)', count: filteredTxns.filter(t => t.aiRiskScore > 25 && t.aiRiskScore <= 50).length, color: '#D4AF37' },
      { name: isRTL ? 'مرتفع (51-75%)' : 'High (51-75%)', count: filteredTxns.filter(t => t.aiRiskScore > 50 && t.aiRiskScore <= 75).length, color: '#ea580c' },
      { name: isRTL ? 'خطير (76-100%)' : 'Critical (76-100%)', count: filteredTxns.filter(t => t.aiRiskScore > 75).length, color: '#ef4444' }
    ];

    // 4. Recharts Location threat volume
    const locationThreatData = (() => {
      const cities = [
        { en: 'Riyadh', ar: 'الرياض' },
        { en: 'Jeddah', ar: 'جدة' },
        { en: 'Dammam', ar: 'الدمام' },
        { en: 'Mecca', ar: 'مكة المكرمة' },
        { en: 'Medina', ar: 'المدينة المنورة' }
      ];
      return cities.map(city => {
        const cityTxns = filteredTxns.filter(t => (t.location || '').toLowerCase().includes(city.en.toLowerCase()));
        const total = cityTxns.length;
        const risky = cityTxns.filter(t => t.status !== 'Safe').length;
        return {
          name: isRTL ? city.ar : city.en,
          Total: total,
          Risky: risky
        };
      });
    })();

    return (
      <div className={`space-y-6 animate-fade-in ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-black text-[#001939] dark:text-white">{t.analytics}</h3>
            <p className="text-xs text-gray-500">{t.fraudPreventionAnalytics}</p>
          </div>
          
          {/* Interactive Filters Bar */}
          <div className={`flex flex-wrap items-center gap-3 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            {/* Location Filter */}
            <div className="flex items-center gap-1.5 bg-white dark:bg-[#070e17] px-3 py-1.5 rounded-xl border border-gray-100 dark:border-gray-800/40 text-xs font-semibold">
              <span className="text-gray-400">{isRTL ? 'المنطقة:' : 'City:'}</span>
              <select 
                value={analyticsLocation} 
                onChange={(e) => setAnalyticsLocation(e.target.value)}
                className="bg-transparent border-none font-bold text-gray-800 dark:text-white focus:outline-none cursor-pointer"
              >
                <option value="All">{isRTL ? 'الكل' : 'All Cities'}</option>
                <option value="Riyadh">{isRTL ? 'الرياض' : 'Riyadh'}</option>
                <option value="Jeddah">{isRTL ? 'جدة' : 'Jeddah'}</option>
                <option value="Dammam">{isRTL ? 'الدمام' : 'Dammam'}</option>
                <option value="Mecca">{isRTL ? 'مكة المكرمة' : 'Mecca'}</option>
                <option value="Medina">{isRTL ? 'المدينة المنورة' : 'Medina'}</option>
              </select>
            </div>

            {/* Type Filter */}
            <div className="flex items-center gap-1.5 bg-white dark:bg-[#070e17] px-3 py-1.5 rounded-xl border border-gray-100 dark:border-gray-800/40 text-xs font-semibold">
              <span className="text-gray-400">{isRTL ? 'نوع العملية:' : 'Type:'}</span>
              <select 
                value={analyticsType} 
                onChange={(e) => setAnalyticsType(e.target.value)}
                className="bg-transparent border-none font-bold text-gray-800 dark:text-white focus:outline-none cursor-pointer"
              >
                <option value="All">{isRTL ? 'الكل' : 'All Types'}</option>
                <option value="Debit">{isRTL ? 'مدى سحب' : 'Debit'}</option>
                <option value="Transfer">{isRTL ? 'حوالة سداد' : 'Transfer'}</option>
                <option value="Credit">{isRTL ? 'بطاقة ائتمان' : 'Credit'}</option>
              </select>
            </div>

            {/* Risk Class Filter */}
            <div className="flex items-center gap-1.5 bg-white dark:bg-[#070e17] px-3 py-1.5 rounded-xl border border-gray-100 dark:border-gray-800/40 text-xs font-semibold">
              <span className="text-gray-400">{isRTL ? 'التصنيف:' : 'Class:'}</span>
              <select 
                value={analyticsRisk} 
                onChange={(e) => setAnalyticsRisk(e.target.value)}
                className="bg-transparent border-none font-bold text-gray-800 dark:text-white focus:outline-none cursor-pointer"
              >
                <option value="All">{isRTL ? 'الكل' : 'All Risk'}</option>
                <option value="Safe">{isRTL ? 'آمن فقط' : 'Safe Only'}</option>
                <option value="Risky">{isRTL ? 'مشبوه/مخاطر' : 'Risky Only'}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Dynamic Analytics Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="bg-white dark:bg-[#070e17] p-5 rounded-3xl border border-gray-100 dark:border-gray-800/60 shadow-sm">
            <span className="text-[10px] text-gray-400 uppercase font-black tracking-wider block">{isRTL ? 'إجمالي العمليات المفلترة' : 'Filtered Checked Volume'}</span>
            <span className="text-2xl font-black text-[#001939] dark:text-white mt-1 block">{totalCount.toLocaleString()}</span>
          </div>
          <div className="bg-white dark:bg-[#070e17] p-5 rounded-3xl border border-gray-100 dark:border-gray-800/60 shadow-sm">
            <span className="text-[10px] text-gray-400 uppercase font-black tracking-wider block">{isRTL ? 'العمليات المشبوهة المفلترة' : 'Risky Transactions'}</span>
            <span className="text-2xl font-black text-red-500 mt-1 block">{totalRisky.toLocaleString()}</span>
          </div>
          <div className="bg-white dark:bg-[#070e17] p-5 rounded-3xl border border-gray-100 dark:border-gray-800/60 shadow-sm">
            <span className="text-[10px] text-gray-400 uppercase font-black tracking-wider block">{isRTL ? 'متوسط مؤشر المخاطر' : 'Average Risk Score'}</span>
            <span className="text-2xl font-black text-[#D4AF37] mt-1 block">{averageRisk}%</span>
          </div>
          <div className="bg-white dark:bg-[#070e17] p-5 rounded-3xl border border-gray-100 dark:border-gray-800/60 shadow-sm">
            <span className="text-[10px] text-gray-400 uppercase font-black tracking-wider block">{isRTL ? 'إجمالي الحماية المالية المفلترة' : 'Prevented Fraud Value'}</span>
            <span className="text-2xl font-black text-[#006A4E] dark:text-emerald-400 mt-1 block">SAR {totalPreventedFraud.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
          </div>
        </div>

        {/* Dual Chart Block */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Risk Distribution Chart Card */}
          <div className="bg-white dark:bg-[#070e17] p-6 rounded-3xl border border-gray-100 dark:border-gray-800/60 shadow-sm">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">{isRTL ? 'توزيع المخاطر للعمليات المفلترة' : 'Filtered Risk Distribution'}</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={riskDistributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {riskDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Location Volume & Risk Chart Card */}
          <div className="bg-white dark:bg-[#070e17] p-6 rounded-3xl border border-gray-100 dark:border-gray-800/60 shadow-sm">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">{isRTL ? 'حجم العمليات والمخاطر حسب المدينة' : 'Activity & Threat Volume by City'}</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={locationThreatData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
                  <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: 10, fontWeight: 'bold' }} />
                  <Bar dataKey="Total" name={isRTL ? 'إجمالي العمليات' : 'Total Activity'} fill="#D4AF37" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="Risky" name={isRTL ? 'العمليات المشبوهة' : 'Risky Block'} fill="#ef4444" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Existing Threat Vectors Summary list & Protected Sovereign Value banner */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-[#070e17] p-6 rounded-3xl border border-gray-100 dark:border-gray-800/60 shadow-sm space-y-6">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">{isRTL ? 'احتمالية الاختراقات حسب القناة' : 'Threat Vectors by Payment Gate'}</h4>
            <div className="space-y-4 font-semibold text-xs text-gray-700 dark:text-gray-300">
              <div>
                <div className={`flex justify-between mb-1 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                  <span>mada Debit Cards</span>
                  <span>{debitRisk}% Risk</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#006A4E] h-full" style={{ width: `${Math.max(1.2, parseFloat(debitRisk))}%` }} />
                </div>
              </div>
              <div>
                <div className={`flex justify-between mb-1 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                  <span>SADAD Online Gate</span>
                  <span>{transferRisk}% Risk</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#D4AF37] h-full" style={{ width: `${Math.max(1.5, parseFloat(transferRisk))}%` }} />
                </div>
              </div>
              <div>
                <div className={`flex justify-between mb-1 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                  <span>Apple Pay Mobile Wallet</span>
                  <span>{creditRisk}% Risk</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-red-500 h-full" style={{ width: `${Math.max(2.0, parseFloat(creditRisk))}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#0b1524] text-white p-6 rounded-3xl border border-[#D4AF37]/30 shadow-xl flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-black text-[#D4AF37] mb-2">{isRTL ? 'الحجم الإجمالي للوقاية المالية' : 'Prevented Fraud Sovereign Value'}</h4>
              <p className="text-xs text-gray-300">{isRTL ? 'إحصائيات تجميد السيولة المشبوهة وحماية مدخرات المودعين لعام ٢٠٢٦' : 'Sovereign financial assets saved from cybersecurity attacks in 2026.'}</p>
            </div>
            <div className="my-6">
              <span className="text-3xl font-black text-white">SAR {currentPreventedValue.toLocaleString()}</span>
              <span className="text-xs text-emerald-400 font-bold block mt-1">
                {isRTL 
                  ? `+${((totalPreventedFraud / basePreventedValue) * 100 + 24.5).toFixed(2)}% عائد وقائي نشط`
                  : `+${((totalPreventedFraud / basePreventedValue) * 100 + 24.5).toFixed(2)}% Preventative yield`
                }
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render 9. Audit Logs
  if (screen === 'audit-logs') {
    return (
      <div className={`space-y-6 animate-fade-in ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div>
          <h3 className="text-lg font-black text-[#001939] dark:text-white">{t.auditLogs}</h3>
          <p className="text-xs text-gray-500">{t.auditLogs}</p>
        </div>

        <div className="bg-white dark:bg-[#070e17] rounded-3xl p-6 border border-gray-100 dark:border-gray-800/60 shadow-sm space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-[#0b1524]/60 text-gray-500 dark:text-gray-400 text-[10px] font-black uppercase tracking-wider border-b border-gray-100 dark:border-gray-800/60">
                  <th className="px-4 py-3">{isRTL ? 'التوقيت' : 'Timestamp'}</th>
                  <th className="px-4 py-3">{isRTL ? 'المسؤول' : 'Analyst'}</th>
                  <th className="px-4 py-3">{isRTL ? 'الإجراء' : 'Action'}</th>
                  <th className="px-4 py-3">{isRTL ? 'الهدف' : 'Target'}</th>
                  <th className="px-4 py-3">{t.ipAddress}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800/40 text-xs font-semibold text-gray-600 dark:text-gray-300">
                <tr className="hover:bg-gray-50/50">
                  <td className="px-4 py-4">14:05:42</td>
                  <td className="px-4 py-4 text-gray-900 dark:text-white font-bold">Admin-Compliance</td>
                  <td className="px-4 py-4 text-red-500">Node Card Lock</td>
                  <td className="px-4 py-4 font-mono">SA804000...001</td>
                  <td className="px-4 py-4 font-mono">185.2.44.112</td>
                </tr>
                <tr className="hover:bg-gray-50/50">
                  <td className="px-4 py-4">13:58:10</td>
                  <td className="px-4 py-4 text-gray-900 dark:text-white font-bold">System-AutoGate</td>
                  <td className="px-4 py-4 text-emerald-500">Gemini Risk Parse</td>
                  <td className="px-4 py-4 font-mono">#TXN-8812</td>
                  <td className="px-4 py-4 font-mono">192.168.1.45</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // Render 10. Notifications Feed
  if (screen === 'notifications') {
    const notifT = {
      en: {
        title: "Central Notification Hub",
        subtitle: "Real-time SAMA-compliant anti-fraud feeds",
        markAllAsRead: "Mark All as Read",
        markAsRead: "Mark as Read",
        delete: "Delete",
        noNotifications: "No notifications found.",
        txId: "Transaction ID",
        customer: "Customer Name",
        riskScore: "Risk Score",
        riskLevel: "Risk Level",
        aiSummary: "Gemini AI Summary",
        timestamp: "Analysis Date & Time",
        read: "Read",
        unread: "Unread",
        inspectTx: "Inspect Transaction",
        severity: "Severity",
        safe: "Safe",
        medium: "Medium",
        high: "High",
        critical: "Critical",
        allCaughtUp: "All Caught Up!"
      },
      ar: {
        title: "مركز الإشعارات المركزي",
        subtitle: "تحديثات مكافحة الاحتيال اللحظية المتوافقة مع ضوابط ساما",
        markAllAsRead: "تحديد الكل كمقروء",
        markAsRead: "تحديد كمقروء",
        delete: "حذف الإشعار",
        noNotifications: "لا توجد إشعارات حالياً.",
        txId: "رقم العملية",
        customer: "اسم العميل",
        riskScore: "درجة الخطورة",
        riskLevel: "مستوى الخطورة",
        aiSummary: "ملخص جيميناي للذكاء الاصطناعي",
        timestamp: "تاريخ ووقت التحليل",
        read: "مقروء",
        unread: "غير مقروء",
        inspectTx: "عرض المعاملة المرتبطة",
        severity: "الأهمية",
        safe: "آمن",
        medium: "متوسط",
        high: "مرتفع",
        critical: "حرج",
        allCaughtUp: "أنت على اطلاع بكل شيء!"
      }
    };
    const localT = notifT[lang];

    const handleCardClick = (notif: any, txId: string) => {
      if (onViewDetailsNotification) {
        onViewDetailsNotification(notif.id, txId);
      }
    };

    return (
      <div className={`space-y-6 animate-fade-in ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-150 dark:border-gray-800/60`}>
          <div>
            <h3 className="text-xl font-black text-[#001939] dark:text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#D4AF37]" />
              <span>{localT.title}</span>
            </h3>
            <p className="text-xs text-gray-500 mt-1">{localT.subtitle}</p>
          </div>
          
          {notifications && notifications.length > 0 && onMarkAllAsRead && (
            <button
              onClick={() => onMarkAllAsRead()}
              className="px-4 py-2 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40 rounded-xl text-xs font-bold hover:bg-emerald-100 dark:hover:bg-emerald-950/40 transition-all flex items-center gap-1.5 self-start md:self-auto cursor-pointer shadow-sm active:scale-95"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{localT.markAllAsRead}</span>
            </button>
          )}
        </div>

        <div className="space-y-4">
          {notifications && notifications.length > 0 ? (
            notifications.map((notif) => {
              const isDanger = notif.severity === 'danger';
              const isWarning = notif.severity === 'warning';
              const isSuccess = notif.severity === 'success';
              const isInfo = notif.severity === 'info';

              // Derive required transaction values (Requirement 5)
              const txId = notif.relatedTxId || (
                notif.id === 'notif-2' ? '#TXN-9042' :
                notif.id === 'notif-3' ? '#TXN-7643' :
                notif.id === 'notif-4' ? '#TXN-8812' :
                notif.id === 'notif-5' ? '#TXN-9042' :
                notif.id === 'notif-6' ? '#TXN-7643' :
                '#TXN-8812'
              );
              const tx = transactions.find(t => t.id === txId || t.id.replace('#', '') === txId.replace('#', ''));

              const displayTxId = txId;
              const customerName = tx ? tx.customerName : (
                notif.id === 'notif-2' ? 'Ahmed A.' :
                notif.id === 'notif-3' ? 'Dammam Terminal 4' :
                notif.id === 'notif-4' ? 'Sarah M.' :
                notif.id === 'notif-5' ? 'Ahmed A.' :
                notif.id === 'notif-6' ? 'Dammam Terminal 4' :
                'Sarah M.'
              );

              const riskScore = tx ? tx.aiRiskScore : (
                notif.id === 'notif-2' ? 12 :
                notif.id === 'notif-3' ? 94 :
                notif.id === 'notif-4' ? 85 :
                notif.id === 'notif-5' ? 12 :
                notif.id === 'notif-6' ? 94 :
                85
              );

              const riskLevel = tx ? (tx.status === 'High' ? 'High' : tx.status === 'Medium' ? 'Medium' : 'Safe') : (
                riskScore >= 80 ? 'High' :
                riskScore >= 40 ? 'Medium' :
                'Safe'
              );

              const aiSummary = tx && tx.aiAnalysis ? (isRTL ? tx.aiAnalysis.arabic_explanation || tx.aiAnalysis.summary : tx.aiAnalysis.summary) : (
                isRTL ? notif.descAr : notif.descEn
              );

              const analysisDateAndTime = tx ? `${tx.time}` : '14:05:45 GMT';

              const severityBg = isDanger 
                ? 'border-red-200 dark:border-red-900/40 bg-red-50/40 dark:bg-red-950/10' 
                : isWarning 
                  ? 'border-amber-200 dark:border-amber-850/40 bg-amber-50/40 dark:bg-amber-950/10' 
                  : isSuccess
                    ? 'border-emerald-200 dark:border-emerald-800/40 bg-emerald-50/40 dark:bg-emerald-950/10'
                    : 'border-blue-200 dark:border-blue-850/40 bg-blue-50/40 dark:bg-blue-950/10';

              const badgeColor = isDanger 
                ? 'bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-400 border-red-200 dark:border-red-900/30' 
                : isWarning 
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-400 border-amber-200 dark:border-amber-850/30' 
                  : isSuccess
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/30'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-400 border-blue-200 dark:border-blue-900/30';

              return (
                <div 
                  key={notif.id}
                  onClick={() => handleCardClick(notif, txId)}
                  className={`p-5 rounded-3xl border ${severityBg} transition-all hover:shadow-md cursor-pointer relative group flex flex-col gap-4 overflow-hidden ${
                    !notif.read ? 'ring-2 ring-blue-500/20 dark:ring-blue-400/25 bg-white dark:bg-[#09121f]' : 'bg-white/80 dark:bg-[#070e17]/80'
                  }`}
                >
                  {/* Decorative Highlight Strip */}
                  <div className={`absolute top-0 bottom-0 ${isRTL ? 'right-0' : 'left-0'} w-1.5 ${
                    isDanger ? 'bg-red-500' : isWarning ? 'bg-[#D4AF37]' : isSuccess ? 'bg-emerald-500' : 'bg-blue-500'
                  }`} />

                  {/* Top Row: Severity Badge, Read/Unread state, Date/Time, and Action Buttons */}
                  <div className={`flex flex-wrap items-center justify-between gap-3 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-wider ${badgeColor}`}>
                        {isDanger ? localT.critical : isWarning ? localT.high : isSuccess ? localT.safe : localT.medium}
                      </span>
                      
                      {/* Read/Unread status badge */}
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                        notif.read 
                          ? 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-750' 
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                      }`}>
                        {notif.read ? localT.read : localT.unread}
                      </span>
                    </div>

                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <span className="text-[11px] text-gray-400 dark:text-gray-500 font-bold">
                        {isRTL ? notif.timeAr : notif.timeEn}
                      </span>
                      
                      {/* Mark as read individual button */}
                      {!notif.read && onMarkAsRead && (
                        <button
                          onClick={() => onMarkAsRead(notif.id)}
                          title={localT.markAsRead}
                          className="p-1.5 text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-all rounded-lg hover:bg-gray-100 dark:hover:bg-gray-850 cursor-pointer"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}

                      {/* Delete notification button */}
                      {onDeleteNotification && (
                        <button
                          onClick={() => onDeleteNotification(notif.id)}
                          title={localT.delete}
                          className="p-1.5 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-all rounded-lg hover:bg-gray-100 dark:hover:bg-gray-850 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Middle Content: Title and description */}
                  <div className="space-y-1.5">
                    <h4 className="text-sm font-black text-gray-900 dark:text-white leading-snug">
                      {isRTL ? notif.titleAr : notif.titleEn}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                      {isRTL ? notif.descAr : notif.descEn}
                    </p>
                  </div>

                  {/* SAMA Compliance Information Grid (Requirement 5) */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-gray-50/50 dark:bg-gray-900/30 rounded-2xl border border-gray-100 dark:border-gray-800/40 text-[11px]">
                    <div>
                      <span className="text-gray-400 dark:text-gray-500 font-bold block mb-0.5">{localT.txId}</span>
                      <span className="font-mono font-black text-gray-800 dark:text-gray-200">{displayTxId}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 dark:text-gray-500 font-bold block mb-0.5">{localT.customer}</span>
                      <span className="font-bold text-gray-800 dark:text-gray-200">{customerName}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 dark:text-gray-500 font-bold block mb-0.5">{localT.riskScore}</span>
                      <span className={`font-black ${
                        riskScore >= 80 ? 'text-red-600 dark:text-red-400' : riskScore >= 40 ? 'text-[#D4AF37]' : 'text-emerald-600 dark:text-emerald-400'
                      }`}>{riskScore}% ({riskLevel})</span>
                    </div>
                    <div>
                      <span className="text-gray-400 dark:text-gray-500 font-bold block mb-0.5">{localT.timestamp}</span>
                      <span className="font-bold text-gray-800 dark:text-gray-200">{analysisDateAndTime}</span>
                    </div>
                  </div>

                  {/* Gemini AI Summary Section (Requirement 5) */}
                  <div className="p-3.5 bg-blue-50/30 dark:bg-blue-950/5 rounded-2xl border border-blue-100/40 dark:border-blue-900/20">
                    <div className={`flex items-center gap-1.5 mb-1.5 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                      <Brain className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                      <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider">{localT.aiSummary}</span>
                    </div>
                    <p className="text-[11px] text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                      {aiSummary}
                    </p>
                  </div>

                  {/* Footer Actions Row */}
                  <div className={`flex justify-end pt-1 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCardClick(notif, txId);
                      }}
                      className="px-4 py-2 bg-[#001530] hover:bg-[#0b2440] text-white rounded-xl text-xs font-bold transition-all border-none cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95"
                    >
                      <Eye className="w-4 h-4" />
                      <span>{localT.inspectTx}</span>
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-12 text-center bg-white dark:bg-[#070e17] rounded-3xl border border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-gray-300 dark:text-gray-700">
                <Bell className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-black text-gray-800 dark:text-gray-200">{localT.allCaughtUp}</h4>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{localT.noNotifications}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Render 11. Settings Board
  if (screen === 'settings') {
    const handleSaveAndNotify = () => {
      if (addToast) {
        addToast(
          isRTL 
            ? 'تم حفظ وتطبيق التفضيلات العامة بنجاح!' 
            : 'General preferences saved and applied successfully!', 
          'success'
        );
      }
    };

    return (
      <div className={`space-y-6 animate-fade-in ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div>
          <h3 className="text-lg font-black text-[#001939] dark:text-white">
            {isRTL ? 'الإعدادات والتفضيلات العامة' : 'General Settings & Preferences'}
          </h3>
          <p className="text-xs text-gray-500">
            {isRTL 
              ? 'تخصيص تجربة فحص العمليات الاحتيالية وتطبيق التفضيلات مباشرة' 
              : 'Customize fraud operations workspace and apply preferences instantly.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-12 bg-white dark:bg-[#070e17] p-8 rounded-3xl border border-gray-100 dark:border-gray-800/60 shadow-sm space-y-8">
            
            {/* Section 1: Localization & Appearance */}
            <div>
              <h4 className="text-xs font-black text-[#D4AF37] uppercase tracking-widest mb-4">
                {isRTL ? '١. المظهر واللغة' : '1. Language & Appearance'}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Language selection */}
                <div className="space-y-2">
                  <label className="text-xs font-black block text-gray-700 dark:text-gray-300">
                    {isRTL ? 'لغة النظام' : 'Application Language'}
                  </label>
                  <select
                    value={lang}
                    onChange={(e) => onLangChange(e.target.value as 'en' | 'ar')}
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold px-3 py-2.5 cursor-pointer text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#001939]"
                  >
                    <option value="ar">العربية (RTL)</option>
                    <option value="en">English (LTR)</option>
                  </select>
                  <span className="text-[10px] text-gray-400 block">
                    {isRTL ? 'تغيير اتجاه العرض ومصطلحات الواجهة فوراً' : 'Instantly toggles alignment, fonts, and labels.'}
                  </span>
                </div>

                {/* Theme Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-black block text-gray-700 dark:text-gray-300">
                    {isRTL ? 'السمة المرئية' : 'Workspace Theme'}
                  </label>
                  <select
                    value={theme}
                    onChange={(e) => onThemeChange(e.target.value as 'light' | 'dark' | 'system')}
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold px-3 py-2.5 cursor-pointer text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#001939]"
                  >
                    <option value="dark">{isRTL ? 'الوضع الداكن (موصى به)' : 'Dark Slate Mode (Recommended)'}</option>
                    <option value="light">{isRTL ? 'الوضع المضيء المشرق' : 'Bright Light Mode'}</option>
                    <option value="system">{isRTL ? 'مطابقة سمة النظام المحيط' : 'Sync with Operating System'}</option>
                  </select>
                  <span className="text-[10px] text-gray-400 block">
                    {isRTL ? 'اختر النمط البصري المناسب لبيئة العمل' : 'Pick the best lighting style for your dashboard.'}
                  </span>
                </div>

              </div>
            </div>

            <hr className="border-gray-100 dark:border-gray-800" />

            {/* Section 2: Core Operational & Dashboard Preferences */}
            <div>
              <h4 className="text-xs font-black text-[#D4AF37] uppercase tracking-widest mb-4">
                {isRTL ? '٢. تفضيلات فحص لوحة القيادة والعمليات' : '2. Dashboard & Operational Config'}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Default Date Range */}
                <div className="space-y-2">
                  <label className="text-xs font-black block text-gray-700 dark:text-gray-300">
                    {isRTL ? 'النطاق الزمني للوحة المعلومات' : 'Default Dashboard range'}
                  </label>
                  <select
                    value={dashboardDateRange}
                    onChange={(e) => onDashboardDateRangeChange(e.target.value as '7d' | '30d' | '12m')}
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold px-3 py-2.5 cursor-pointer text-gray-800 dark:text-gray-100"
                  >
                    <option value="7d">{isRTL ? 'آخر ٧ أيام' : 'Last 7 Days'}</option>
                    <option value="30d">{isRTL ? 'آخر ٣٠ يوم' : 'Last 30 Days'}</option>
                    <option value="12m">{isRTL ? 'آخر ١٢ شهر (سنوي)' : 'Last 12 Months'}</option>
                  </select>
                </div>

                {/* Currency preference */}
                <div className="space-y-2">
                  <label className="text-xs font-black block text-gray-700 dark:text-gray-300">
                    {isRTL ? 'العملة الافتراضية' : 'Default Currency'}
                  </label>
                  <select
                    value={defaultCurrency}
                    onChange={(e) => onDefaultCurrencyChange(e.target.value as 'SAR' | 'USD' | 'EUR')}
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold px-3 py-2.5 cursor-pointer text-gray-800 dark:text-gray-100"
                  >
                    <option value="SAR">SAR (ريال سعودي)</option>
                    <option value="USD">USD ($ دولار أمريكي)</option>
                    <option value="EUR">EUR (€ يورو)</option>
                  </select>
                </div>

                {/* Auto Refresh preference */}
                <div className="space-y-2">
                  <label className="text-xs font-black block text-gray-700 dark:text-gray-300">
                    {isRTL ? 'تحديث البيانات تلقائياً' : 'Auto-refresh Dashboard'}
                  </label>
                  <select
                    value={autoRefresh ? 'true' : 'false'}
                    onChange={(e) => onAutoRefreshChange(e.target.value === 'true')}
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold px-3 py-2.5 cursor-pointer text-gray-800 dark:text-gray-100"
                  >
                    <option value="true">{isRTL ? 'تمكين (كل ١٥ ثانية)' : 'Enabled (Every 15s)'}</option>
                    <option value="false">{isRTL ? 'تعطيل التحديث التلقائي' : 'Disabled'}</option>
                  </select>
                </div>

              </div>
            </div>

            <hr className="border-gray-100 dark:border-gray-800" />

            {/* Section 3: Localization Display & Table density */}
            <div>
              <h4 className="text-xs font-black text-[#D4AF37] uppercase tracking-widest mb-4">
                {isRTL ? '٣. عرض البيانات وتنسيق الجداول' : '3. Formatting & Grid Density'}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                
                {/* Date Format */}
                <div className="space-y-2">
                  <label className="text-xs font-black block text-gray-700 dark:text-gray-300">
                    {isRTL ? 'تنسيق التاريخ' : 'Date Format'}
                  </label>
                  <select
                    value={dateFormat}
                    onChange={(e) => onDateFormatChange(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold px-3 py-2.5 cursor-pointer text-gray-800 dark:text-gray-100"
                  >
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  </select>
                </div>

                {/* Time Format */}
                <div className="space-y-2">
                  <label className="text-xs font-black block text-gray-700 dark:text-gray-300">
                    {isRTL ? 'تنسيق الوقت' : 'Time Format'}
                  </label>
                  <select
                    value={timeFormat}
                    onChange={(e) => onTimeFormatChange(e.target.value as '12h' | '24h')}
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold px-3 py-2.5 cursor-pointer text-gray-800 dark:text-gray-100"
                  >
                    <option value="24h">{isRTL ? '٢٤ ساعة (توقيت عسكري)' : '24-Hour (Military)'}</option>
                    <option value="12h">{isRTL ? '١٢ ساعة (صباحاً/مساءً)' : '12-Hour (AM/PM)'}</option>
                  </select>
                </div>

                {/* Rows per page */}
                <div className="space-y-2">
                  <label className="text-xs font-black block text-gray-700 dark:text-gray-300">
                    {isRTL ? 'صفوف الجدول لكل صفحة' : 'Rows Per Page'}
                  </label>
                  <select
                    value={rowsPerPage}
                    onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold px-3 py-2.5 cursor-pointer text-gray-800 dark:text-gray-100"
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                  </select>
                </div>

                {/* Table Density */}
                <div className="space-y-2">
                  <label className="text-xs font-black block text-gray-700 dark:text-gray-300">
                    {isRTL ? 'كثافة عرض الجداول' : 'Table Grid Density'}
                  </label>
                  <select
                    value={tableDensity}
                    onChange={(e) => onTableDensityChange(e.target.value as 'compact' | 'comfortable')}
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold px-3 py-2.5 cursor-pointer text-gray-800 dark:text-gray-100"
                  >
                    <option value="comfortable">{isRTL ? 'مريح (افتراضي)' : 'Comfortable (Default)'}</option>
                    <option value="compact">{isRTL ? 'مدمج ومكثف' : 'Compact & High-Density'}</option>
                  </select>
                </div>

              </div>
            </div>

            <hr className="border-gray-100 dark:border-gray-800" />

            {/* Section 4: Secure Incident Notifications Dispatcher */}
            <div>
              <h4 className="text-xs font-black text-[#D4AF37] uppercase tracking-widest mb-4">
                {isRTL ? '٤. مرسل التنبيهات وإشعارات الامتثال' : '4. Dispatcher Notifications'}
              </h4>
              <div className="space-y-4 max-w-xl">
                
                {/* highRiskAlert */}
                <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div>
                    <span className="text-xs font-black block text-gray-800 dark:text-gray-200">
                      {isRTL ? 'تنبيهات العمليات عالية الخطورة' : 'High-risk alert notifications'}
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold block mt-0.5">
                      {isRTL ? 'إرسال إشعار فوري عند رصد عملية تتجاوز نسبة اشتباه ٧٠٪' : 'Instant warning for scores exceeding 70%.'}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationPrefs.highRiskAlert}
                    onChange={(e) => onNotificationPrefsChange({ ...notificationPrefs, highRiskAlert: e.target.checked })}
                    className="accent-[#D4AF37] w-4.5 h-4.5 cursor-pointer"
                  />
                </div>

                {/* criticalCase */}
                <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div>
                    <span className="text-xs font-black block text-gray-800 dark:text-gray-200">
                      {isRTL ? 'تحديثات القضايا الحرجة' : 'Critical-case notifications'}
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold block mt-0.5">
                      {isRTL ? 'إشعار ضابط الامتثال مباشرة عند اتخاذ إجراء تجميد فوري' : 'Notify dispatcher directly upon automated SAMA lockdown holds.'}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationPrefs.criticalCase}
                    onChange={(e) => onNotificationPrefsChange({ ...notificationPrefs, criticalCase: e.target.checked })}
                    className="accent-[#D4AF37] w-4.5 h-4.5 cursor-pointer"
                  />
                </div>

                {/* analysisCompletion */}
                <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div>
                    <span className="text-xs font-black block text-gray-800 dark:text-gray-200">
                      {isRTL ? 'اكتمال الفحص الشامل للذكاء الاصطناعي' : 'Analysis-completion notifications'}
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold block mt-0.5">
                      {isRTL ? 'تنبيه منبثق عند جاهزية تقرير جيميناي المفصل للمراجعة' : 'Trigger desktop notification when Gemini finishes auditing.'}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationPrefs.analysisCompletion}
                    onChange={(e) => onNotificationPrefsChange({ ...notificationPrefs, analysisCompletion: e.target.checked })}
                    className="accent-[#D4AF37] w-4.5 h-4.5 cursor-pointer"
                  />
                </div>

                {/* SAMA compliance channel */}
                <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div>
                    <span className="text-xs font-black block text-gray-800 dark:text-gray-200">
                      {isRTL ? 'قنوات الإشعار الفوري للامتثال المركزي لساما' : 'Central SAMA Dispatcher'}
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold block mt-0.5">
                      {isRTL ? 'إشعار البنك المركزي تلقائياً بالنشاط المشبوه' : 'Direct secure API callback to Central Bank registry.'}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationPrefs.sama}
                    onChange={(e) => onNotificationPrefsChange({ ...notificationPrefs, sama: e.target.checked })}
                    className="accent-[#D4AF37] w-4.5 h-4.5 cursor-pointer"
                  />
                </div>

              </div>
            </div>

            <hr className="border-gray-100 dark:border-gray-800" />

            {/* Section 5: Universal Accessibility Settings */}
            <div>
              <h4 className="text-xs font-black text-[#D4AF37] uppercase tracking-widest mb-4">
                {isRTL ? '٥. سهولة الوصول الشاملة' : '5. Accessibility Preferences'}
              </h4>
              <div className="space-y-4 max-w-xl">
                
                {/* Reduce Motion */}
                <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div>
                    <span className="text-xs font-black block text-gray-800 dark:text-gray-200">
                      {isRTL ? 'تقليل الحركة البصرية' : 'Reduce motion'}
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold block mt-0.5">
                      {isRTL ? 'تعطيل الحركات والمؤثرات الانتقالية لتسريع التصفح وتسهيله' : 'Disables layouts slide effects and fade transitions.'}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={reduceMotion}
                    onChange={(e) => onReduceMotionChange(e.target.checked)}
                    className="accent-[#D4AF37] w-4.5 h-4.5 cursor-pointer"
                  />
                </div>

                {/* Larger Text */}
                <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div>
                    <span className="text-xs font-black block text-gray-800 dark:text-gray-200">
                      {isRTL ? 'تكبير خطوط الواجهة ومقروئيتها' : 'Larger text size'}
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold block mt-0.5">
                      {isRTL ? 'زيادة حجم النصوص بنسبة ١٢٪ لتحسين وضوح ومقروئية الأرقام' : 'Scales up UI relative font sizes for optimal visibility.'}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={largerText}
                    onChange={(e) => onLargerTextChange(e.target.checked)}
                    className="accent-[#D4AF37] w-4.5 h-4.5 cursor-pointer"
                  />
                </div>

                {/* High Contrast Mode */}
                <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div>
                    <span className="text-xs font-black block text-gray-800 dark:text-gray-200">
                      {isRTL ? 'وضع تباين الألوان العالي' : 'High-contrast mode'}
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold block mt-0.5">
                      {isRTL ? 'تحسين تباين الألوان الفاتحة والداكنة لتسهيل فحص الأرقام الطويلة' : 'Increases layout color depth and visual element borders.'}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={highContrast}
                    onChange={(e) => onHighContrastChange(e.target.checked)}
                    className="accent-[#D4AF37] w-4.5 h-4.5 cursor-pointer"
                  />
                </div>

              </div>
            </div>

            <hr className="border-gray-100 dark:border-gray-800" />

            <div className={`flex ${isRTL ? 'justify-start' : 'justify-end'}`}>
              <button 
                onClick={handleSaveAndNotify}
                className="px-8 py-3.5 bg-[#001939] dark:bg-[#D4AF37] text-white dark:text-[#001025] hover:bg-[#002554] dark:hover:bg-[#C5A059] rounded-xl text-xs font-black transition-all shadow-md cursor-pointer border-none"
              >
                {t.saveChanges}
              </button>
            </div>

          </div>
        </div>
      </div>
    );
  }

  return null;
}
