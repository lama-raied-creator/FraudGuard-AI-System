import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { 
  LayoutDashboard, AlertOctagon, Brain, User, Sparkles, 
  MessageSquare, X, Send, Bell, CheckCircle2, AlertTriangle, 
  Info, ShieldCheck, Moon, Sun, ShieldAlert, Terminal, RefreshCw, Clock
} from 'lucide-react';
import { Screen, TransitionDirection, Transaction, Alert, NewTransactionInput, InvestigationReport, InvestigationStatus } from './types';
import Sidebar from './components/Sidebar';
import TopBar, { AppNotification } from './components/TopBar';
import ExecutiveDashboard from './components/ExecutiveDashboard';
import TransactionAnalysis from './components/TransactionAnalysis';
import FraudAlertsFeed from './components/FraudAlertsFeed';
import AIAnalysisReport from './components/AIAnalysisReport';
import EnterpriseScreens from './components/EnterpriseScreens';
import TransactionDetailsModal from './components/TransactionDetailsModal';
import { translations } from './lib/translations';
import Login from './components/Login';

export default function App() {
  // Login & Session States
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<'employee' | 'customer' | null>(null);
  const [sessionUser, setSessionUser] = useState<string>('');

  // Theme and Preferences States
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(() => {
    const saved = localStorage.getItem('compliance_guard_theme_pref');
    return (saved as 'light' | 'dark' | 'system') || 'dark'; // Default to dark mode for premium feel as original code
  });

  const [darkMode, setDarkMode] = useState<boolean>(true);

  useEffect(() => {
    const applyTheme = () => {
      const root = window.document.documentElement;
      let isDark = true;
      if (theme === 'dark') {
        isDark = true;
      } else if (theme === 'light') {
        isDark = false;
      } else if (theme === 'system') {
        isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      setDarkMode(isDark);
      if (isDark) {
        root.classList.add('dark');
        localStorage.setItem('compliance_guard_theme', 'dark');
      } else {
        root.classList.remove('dark');
        localStorage.setItem('compliance_guard_theme', 'light');
      }
    };

    applyTheme();
    localStorage.setItem('compliance_guard_theme_pref', theme);

    if (theme === 'system') {
      const media = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => applyTheme();
      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    }
  }, [theme]);

  // General application preferences in localStorage
  const [notificationPrefs, setNotificationPrefs] = useState(() => {
    const saved = localStorage.getItem('compliance_guard_notif_prefs');
    return saved ? JSON.parse(saved) : {
      highRiskAlert: true,
      criticalCase: true,
      analysisCompletion: true,
      sama: true
    };
  });
  useEffect(() => {
    localStorage.setItem('compliance_guard_notif_prefs', JSON.stringify(notificationPrefs));
  }, [notificationPrefs]);

  const [dashboardDateRange, setDashboardDateRange] = useState<'7d' | '30d' | '12m'>(() => {
    return (localStorage.getItem('compliance_guard_dashboard_date_range') as '7d' | '30d' | '12m') || '30d';
  });
  useEffect(() => {
    localStorage.setItem('compliance_guard_dashboard_date_range', dashboardDateRange);
  }, [dashboardDateRange]);

  const [defaultCurrency, setDefaultCurrency] = useState<'SAR' | 'USD' | 'EUR'>(() => {
    return (localStorage.getItem('compliance_guard_currency') as 'SAR' | 'USD' | 'EUR') || 'SAR';
  });
  useEffect(() => {
    localStorage.setItem('compliance_guard_currency', defaultCurrency);
  }, [defaultCurrency]);

  const [dateFormat, setDateFormat] = useState<string>(() => {
    return localStorage.getItem('compliance_guard_date_format') || 'YYYY-MM-DD';
  });
  useEffect(() => {
    localStorage.setItem('compliance_guard_date_format', dateFormat);
  }, [dateFormat]);

  const [timeFormat, setTimeFormat] = useState<'12h' | '24h'>(() => {
    return (localStorage.getItem('compliance_guard_time_format') as '12h' | '24h') || '24h';
  });
  useEffect(() => {
    localStorage.setItem('compliance_guard_time_format', timeFormat);
  }, [timeFormat]);

  const [rowsPerPage, setRowsPerPage] = useState<number>(() => {
    const saved = localStorage.getItem('compliance_guard_rows_per_page');
    return saved ? Number(saved) : 10;
  });
  useEffect(() => {
    localStorage.setItem('compliance_guard_rows_per_page', String(rowsPerPage));
  }, [rowsPerPage]);

  const [autoRefresh, setAutoRefresh] = useState<boolean>(() => {
    const saved = localStorage.getItem('compliance_guard_auto_refresh');
    return saved ? saved === 'true' : true;
  });
  useEffect(() => {
    localStorage.setItem('compliance_guard_auto_refresh', String(autoRefresh));
  }, [autoRefresh]);

  const [tableDensity, setTableDensity] = useState<'compact' | 'comfortable'>(() => {
    return (localStorage.getItem('compliance_guard_density') as 'compact' | 'comfortable') || 'comfortable';
  });
  useEffect(() => {
    localStorage.setItem('compliance_guard_density', tableDensity);
  }, [tableDensity]);

  const [reduceMotion, setReduceMotion] = useState<boolean>(() => {
    return localStorage.getItem('compliance_guard_reduce_motion') === 'true';
  });
  useEffect(() => {
    const root = window.document.documentElement;
    if (reduceMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }
    localStorage.setItem('compliance_guard_reduce_motion', String(reduceMotion));
  }, [reduceMotion]);

  const [largerText, setLargerText] = useState<boolean>(() => {
    return localStorage.getItem('compliance_guard_larger_text') === 'true';
  });
  useEffect(() => {
    const root = window.document.documentElement;
    if (largerText) {
      root.classList.add('larger-text');
    } else {
      root.classList.remove('larger-text');
    }
    localStorage.setItem('compliance_guard_larger_text', String(largerText));
  }, [largerText]);

  const [highContrast, setHighContrast] = useState<boolean>(() => {
    return localStorage.getItem('compliance_guard_high_contrast') === 'true';
  });
  useEffect(() => {
    const root = window.document.documentElement;
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    localStorage.setItem('compliance_guard_high_contrast', String(highContrast));
  }, [highContrast]);

  // Toast System State
  const [toasts, setToasts] = useState<Array<{ id: string; type: 'success' | 'error' | 'info'; message: string }>>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + '-' + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  // Live and Default Transactions
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '#TXN-9042',
      customerName: 'Ahmed A.',
      customerInitials: 'AA',
      amount: 4200.00,
      status: 'Safe',
      aiRiskScore: 12,
      time: '14:02:11 GMT',
      type: 'Debit',
      merchantName: 'Noon Riyadh Superstore',
      mcc: '5311',
      ipAddress: '185.33.22.10',
      deviceId: 'apple-iphone-15',
      location: 'Riyadh, Saudi Arabia'
    },
    {
      id: '#TXN-8812',
      customerName: 'Sarah M.',
      customerInitials: 'SM',
      amount: 4299.00,
      status: 'Medium',
      aiRiskScore: 85,
      time: '14:05:45 GMT',
      type: 'Debit',
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
    },
    {
      id: '#TXN-7643',
      customerName: 'Dammam Terminal 4',
      customerInitials: 'DT',
      amount: 980.00,
      status: 'High',
      aiRiskScore: 94,
      time: '14:06:01 GMT',
      type: 'Transfer',
      merchantName: 'Digital Wallet Transfer',
      mcc: '6012',
      ipAddress: '193.20.44.12',
      deviceId: 'android-terminal-x',
      location: 'Dammam, Saudi Arabia'
    },
  ]);

  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: 'alt-1',
      title: 'Unusual Wire Transfer',
      description: 'Transfer of SAR 45,200.00 to an unverified recipient in Dammam. IP mismatch detected.',
      severity: 'CRITICAL',
      time: '2 mins ago',
      customerName: 'Fahad Bin Khalid',
      customerTier: 'SDB Premium Client',
      customerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      riskScore: 98,
      type: 'payments',
    },
    {
      id: 'alt-2',
      title: 'Rapid Successive Purchases',
      description: '8 transaction attempts in 4 minutes totaling SAR 13,420.00 at high-risk MCC vendors.',
      severity: 'HIGH',
      time: '15 mins ago',
      customerName: 'Noura Al-Sudairi',
      customerTier: 'SDB Corporate',
      customerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      riskScore: 74,
      type: 'shopping_cart',
    },
    {
      id: 'alt-3',
      title: 'Geo-Velocity Violation',
      description: 'Login attempt from London, UK followed by payment in Riyadh, SA within 45 minutes.',
      severity: 'MEDIUM',
      time: '42 mins ago',
      customerName: 'Ziyad M.',
      customerTier: 'SDB Private Account',
      customerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      riskScore: 45,
      type: 'language',
    }
  ]);

  const [fraudCases, setFraudCases] = useState<any[]>([
    { id: 'CASE-8821', customer: 'Hussein Al-Ghamdi', amount: 4299.00, date: '2026-07-09', status: 'Investigating', riskLevel: 'High', details: 'Suspicious IP proxy velocity spike' },
    { id: 'CASE-8819', customer: 'Yousef Al-Harbi', amount: 15450.00, date: '2026-07-08', status: 'Resolved', riskLevel: 'Critical', details: 'Unverified device SAMA hold bypass attempt' },
    { id: 'CASE-8812', customer: 'Sarah Al-Moneef', amount: 12850.50, date: '2026-07-07', status: 'Resolved', riskLevel: 'Medium', details: 'Location distance mismatch cleared after voice verification' }
  ]);

  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard');
  const [direction, setDirection] = useState<TransitionDirection>('push');
  const [lang, setLang] = useState<'en' | 'ar'>('ar'); // Default to Arabic for pristine Saudi bank alignment!
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selection and Dynamic Report states
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isAnalysisLoading, setIsAnalysisLoading] = useState<boolean>(false);

  // Transaction Details Modal State
  const [detailsTransaction, setDetailsTransaction] = useState<Transaction | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [prefilledTxData, setPrefilledTxData] = useState<Transaction | null>(null);

  // Compliance Reports state pre-populated with SAMA-compliant historical reports
  const [reports, setReports] = useState<InvestigationReport[]>(() => {
    const saved = localStorage.getItem('compliance_guard_reports');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse reports from localStorage:", e);
      }
    }
    return [
      {
        id: 'RPT-2026-000001',
        transactionId: '#TXN-8812',
        customerName: 'Sarah M.',
        accountNumber: '4000010877',
        iban: 'SA80400001087723945002',
        amount: 4299.00,
        currency: 'SAR',
        type: 'Debit',
        merchantName: 'Elite Workstation Pro',
        city: 'Riyadh',
        device: 'df882-xa11-0092',
        ipAddress: '185.2.44.112',
        analysisDateTime: '2026-07-11T14:05:45Z',
        geminiModelVersion: 'Gemini 3.5 Flash',
        fraudProbability: 85,
        riskScore: 85,
        riskLevel: 'High',
        aiConfidence: '94%',
        executiveSummary: 'Transaction of 4299.00 SAR was flagged due to VPN usage mismatch and velocity spike.',
        detailedExplanation: 'The transaction was initiated from a known VPN subnet in Riyadh with unusual velocity (multiple successive attempts). The account behavior is anomalous compared to historical transaction baselines.',
        riskFactors: [
          'Originating IP address is associated with a blacklisted VPN subnet.',
          'Velocity spike detected within 180 seconds.',
          'Transaction is significantly larger than historical baseline average.'
        ],
        recommendedActions: [
          'Trigger temporary card freeze.',
          'Prompt for instant biometrics verification.',
          'Escalate to senior supervisor audit.'
        ],
        complianceNotes: 'Audit conducted in full alignment with SAMA Cybersecurity Framework (SCSF) version 4.2 guidelines.',
        analystDecision: 'Pending Review',
        investigationStatus: 'Pending Review'
      },
      {
        id: 'RPT-2026-000002',
        transactionId: '#TXN-7643',
        customerName: 'Dammam Terminal 4',
        accountNumber: '4000010222',
        iban: 'SA80400001022293812003',
        amount: 980.00,
        currency: 'SAR',
        type: 'Transfer',
        merchantName: 'Digital Wallet Transfer',
        city: 'Dammam',
        device: 'android-terminal-x',
        ipAddress: '193.20.44.12',
        analysisDateTime: '2026-07-11T14:06:01Z',
        geminiModelVersion: 'Gemini 3.5 Flash',
        fraudProbability: 94,
        riskScore: 94,
        riskLevel: 'High',
        aiConfidence: '98%',
        executiveSummary: 'Transaction of 980.00 SAR flagged as High Risk due to suspect device fingerprint and geovelocity violation.',
        detailedExplanation: 'Device fingerprint indicates a terminal that has been involved in multiple rapid transfers. Geographic location indicates rapid travel anomaly compared to the previous user access point.',
        riskFactors: [
          'Unverified high-risk terminal device fingerprint.',
          'Geographic distance velocity violation.',
          'Receiver wallet associated with high-frequency outbound alerts.'
        ],
        recommendedActions: [
          'Place immediate transfer hold.',
          'Initiate SAMA central fraud register record.',
          'Contact account holder for verbal confirmation.'
        ],
        complianceNotes: 'Regulatory holds applied instantly. Escalated to Fraud Division.',
        analystDecision: 'Under Investigation',
        investigationStatus: 'Under Investigation'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('compliance_guard_reports', JSON.stringify(reports));
  }, [reports]);

  const handleUpdateReportStatus = (reportId: string, status: InvestigationStatus) => {
    setReports(prev => prev.map(r => r.id === reportId ? { ...r, investigationStatus: status, analystDecision: status } : r));
  };

  const handleUpdateReportComplianceNotes = (reportId: string, notes: string) => {
    setReports(prev => prev.map(r => r.id === reportId ? { ...r, complianceNotes: notes } : r));
  };

  // Notification center state
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      titleEn: 'Suspicious Transaction Detected',
      titleAr: 'تم رصد عملية مالية مشبوهة',
      descEn: 'Transaction #TXN-8812 held under SAMA rule 4.2: location and VPN mismatch.',
      descAr: 'تم تعليق العملية رقم #TXN-8812 لعدم تطابق الموقع الفعلي واستخدام شبكة VPN.',
      read: false,
      timeEn: '2m ago',
      timeAr: 'منذ دقيقتين',
      severity: 'danger',
      relatedTxId: '#TXN-8812'
    },
    {
      id: 'notif-2',
      titleEn: 'High-Risk Customer Flagged',
      titleAr: 'تصنيف عميل مرتفع الخطورة',
      descEn: 'Profile #CUST-9042 updated with high velocity ATM withdrawals in Riyadh.',
      descAr: 'تم تحديث ملف العميل #CUST-9042 لمعدل سحوبات صراف آلي مريب بالرياض.',
      read: false,
      timeEn: '8m ago',
      timeAr: 'منذ ٨ دقائق',
      severity: 'warning'
    },
    {
      id: 'notif-3',
      titleEn: 'Large Transfer Detected',
      titleAr: 'تحويل مالي بمبلغ كبير',
      descEn: 'Outbound wire transfer of SAR 145,000 to new corporate beneficiary.',
      descAr: 'حوالة صادرة بقيمة ١٤٥,٠٠٠ ريال سعودي لمستفيد جديد بحاجة لمطابقة الامتثال.',
      read: false,
      timeEn: '22m ago',
      timeAr: 'منذ ٢٢ دقيقة',
      severity: 'warning'
    },
    {
      id: 'notif-4',
      titleEn: 'AI Analysis Completed',
      titleAr: 'اكتمل تحليل الذكاء الاصطناعي',
      descEn: 'Gemini Pro completed compliance audit report for client Sarah M.',
      descAr: 'أتم نموذج جيميناي تقرير تدقيق الامتثال والمسافة الجغرافية للعميلة سارة م.',
      read: false,
      timeEn: '45m ago',
      timeAr: 'منذ ٤٥ دقيقة',
      severity: 'success'
    },
    {
      id: 'notif-5',
      titleEn: 'Investigation Updated',
      titleAr: 'تحديث حالة التحقيق المالي',
      descEn: 'SAMA central inspector added compliance override notes for case #FC-901.',
      descAr: 'أضاف مفتش البنك المركزي ملاحظات تبرير وتجاوز للقضية رقم #FC-901.',
      read: true,
      timeEn: '1h ago',
      timeAr: 'منذ ساعة',
      severity: 'info'
    },
    {
      id: 'notif-6',
      titleEn: 'New Fraud Case Created',
      titleAr: 'إنشاء قضية احتيال جديدة',
      descEn: 'National verification failed. Auto-created fraud dossier #FC-902.',
      descAr: 'فشل التحقق من الهوية الوطنية الموحدة. تم إنشاء ملف قضية الاحتيال #FC-902 تلقائياً.',
      read: true,
      timeEn: '3h ago',
      timeAr: 'منذ ٣ ساعات',
      severity: 'danger'
    },
    {
      id: 'notif-7',
      titleEn: 'System Security Alert',
      titleAr: 'تنبيه أمني للنظام المصرفي',
      descEn: 'SSL secure connection validated with Alinma compliance gateway.',
      descAr: 'تمت مصادقة وتشفير اتصالات بوابة المراقبة للامتثال مصرف الإنماء بنجاح.',
      read: true,
      timeEn: '5h ago',
      timeAr: 'منذ ٥ ساعات',
      severity: 'success'
    }
  ]);

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    addToast(lang === 'ar' ? 'تم تحديد الإشعار كمقروء.' : 'Notification marked as read.', 'success');
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    addToast(lang === 'ar' ? 'تم تحديد جميع الإشعارات كمقروءة.' : 'All notifications marked as read.', 'success');
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    addToast(lang === 'ar' ? 'تم حذف الإشعار بنجاح.' : 'Notification deleted successfully.', 'info');
  };

  const handleViewDetailsNotification = (id: string, relatedTxId?: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    if (relatedTxId) {
      const tx = transactions.find(t => t.id === relatedTxId);
      if (tx) {
        setDetailsTransaction(tx);
        setIsDetailsModalOpen(true);
        return;
      }
    }
    handleNavigate('notifications');
  };

  const handleInspectTransaction = (tx: Transaction) => {
    setDetailsTransaction(tx);
    setIsDetailsModalOpen(true);
  };

  // Copilot Chat States
  const [showAiAssistant, setShowAiAssistant] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [isCopilotTyping, setIsCopilotTyping] = useState(false);
  const [aiMessages, setAiMessages] = useState<Array<{ id: string; sender: 'user' | 'ai'; text: string }>>([
    { 
      id: 'init-msg',
      sender: 'ai', 
      text: 'أهلاً بك في نظام المساعد الذكي لمكافحة الاحتيال. I am your ComplianceGuard AI assistant. Ask me to explain any suspicious transaction patterns or compliance flags.' 
    }
  ]);
  const [lastSelectedTxId, setLastSelectedTxId] = useState<string | null>(null);

  // Make Copilot dynamic and context-aware upon toggle/selection
  useEffect(() => {
    if (showAiAssistant) {
      const currentTxId = selectedTransaction ? selectedTransaction.id : 'no-tx';
      if (currentTxId !== lastSelectedTxId) {
        setLastSelectedTxId(currentTxId);
        if (!selectedTransaction) {
          setAiMessages([
            {
              id: `greeting-${Date.now()}`,
              sender: 'ai',
              text: lang === 'ar' 
                ? 'يمكنني مساعدتك في الأسئلة العامة، ولتحليل تفاصيل عملية محددة يرجى اختيار معاملة أولًا.' 
                : 'I can answer general questions. To review a specific transaction, please select one first.'
            }
          ]);
        } else {
          const tx = selectedTransaction;
          const isAr = lang === 'ar';
          const isHigh = tx.aiRiskScore > 70 || tx.status === 'High';
          
          let automaticGreeting = "";
          if (isAr) {
            automaticGreeting = `أهلاً بك. لقد قمت بتحليل العملية المحددة للعميل ${tx.customerName}. ` +
              `العملية مصنفة كـ [${isHigh ? 'مرتفعة الخطورة' : 'آمنة وبسيطة'}] بنسبة اشتباه ${tx.aiRiskScore}%. ` +
              `كيف يمكنني مساعدتك اليوم في فحص هذه العملية؟`;
          } else {
            automaticGreeting = `Hello. I have analyzed the selected transaction for customer ${tx.customerName}. ` +
              `The transaction is classified as [${isHigh ? 'High Risk' : 'Safe/Low Risk'}] with an AI risk score of ${tx.aiRiskScore}%. ` +
              `How can I assist you in reviewing this transaction today?`;
          }
          setAiMessages([
            {
              id: `greeting-${tx.id}-${Date.now()}`,
              sender: 'ai',
              text: automaticGreeting
            }
          ]);
        }
      }
    }
  }, [showAiAssistant, selectedTransaction, lang, lastSelectedTxId]);

  // Set default selected transaction on mount & load CSV automatically from server
  const [isSingleAnalysisLoading, setIsSingleAnalysisLoading] = useState(false);
  const [isGeminiApiConnected, setIsGeminiApiConnected] = useState<boolean>(true);

  useEffect(() => {
    const checkGeminiStatus = async () => {
      try {
        const res = await fetch('/api/test-gemini');
        if (res.ok) {
          const data = await res.json();
          setIsGeminiApiConnected(!!data.success);
        } else {
          setIsGeminiApiConnected(false);
        }
      } catch (err) {
        setIsGeminiApiConnected(false);
      }
    };
    checkGeminiStatus();

    const fetchCSVTransactions = async () => {
      try {
        const response = await fetch('/api/transactions');
        if (response.ok) {
          const data: Transaction[] = await response.json();
          setTransactions(data);
          if (data.length > 0) {
            setSelectedTransaction(data[0]);
          }
        } else {
          console.error("Failed to fetch transactions from server. Response status:", response.status);
        }
      } catch (err) {
        console.error("Error fetching transactions:", err);
      }
    };
    fetchCSVTransactions();
  }, []);

  const handleRunSingleGeminiAnalysis = async (tx: Transaction) => {
    if (!tx || isSingleAnalysisLoading) return;
    setIsSingleAnalysisLoading(true);

    try {
      addToast(
        lang === 'ar' 
          ? 'يعمل Gemini AI على تحليل العملية...' 
          : 'Gemini AI is analyzing the transaction...', 
        'info'
      );

      // Robust validation and default values for all SAMA-required audit variables
      const payload = {
        id: tx.id || `TXN-${Date.now()}`,
        amount: tx.amount !== undefined ? Number(tx.amount) : 100,
        currency: tx.currency || 'SAR',
        type: tx.type || 'Debit',
        customerName: tx.customerName || 'Unknown Customer',
        customerId: tx.customerName || 'CUST-99210',
        accountNumber: tx.accountNumber || '4000010877',
        iban: tx.iban || 'SA80400001087723945002',
        merchantName: tx.merchantName || 'Elite Workstation Pro',
        mcc: tx.mcc || '5732',
        ipAddress: tx.ipAddress || '185.2.44.112',
        deviceId: tx.deviceId || 'iPhone 15 Pro',
        location: tx.location || 'Riyadh, Saudi Arabia',
        city: tx.location ? tx.location.split(',')[0].trim() : 'Riyadh',
        coordinates: tx.coordinates || '24.7136, 46.6753',
        accountAge: tx.accountAge !== undefined ? Number(tx.accountAge) : 180,
        averageCustomerSpend: tx.averageCustomerSpend !== undefined ? Number(tx.averageCustomerSpend) : 2500,
        riskIndicators: tx.riskIndicators || {
          firstTimeMerchant: false,
          highVelocity: false,
          mismatchedGeo: false,
          vpnUse: false,
          unusualSurge: false,
        }
      };

      const response = await fetch('/api/analyze-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errBody = await response.json();
        throw new Error(errBody.error || errBody.details || 'Server error');
      }

      const result = await response.json();
      setIsGeminiApiConnected(true);

      const mappedRiskScore = result.fraudProbability !== undefined ? result.fraudProbability : (result.fraud_probability !== undefined ? result.fraud_probability : 0);
      const riskString = result.riskLevel || result.risk_level || 'Safe';
      const mappedStatus = riskString === 'High' || riskString === 'Critical' ? 'High' : (riskString === 'Medium' ? 'Medium' : 'Safe');

      const updatedAnalysis = {
        risk_level: riskString,
        riskLevel: riskString,
        fraud_probability: mappedRiskScore,
        fraudProbability: mappedRiskScore,
        confidence: result.confidence || '94%',
        reasons: result.reasons || [],
        recommendations: result.recommendations || [],
        summary: result.summary || result.arabic_explanation || '',
        arabic_explanation: result.arabic_explanation || result.summary || '',
        analysisTimestamp: new Date().toISOString()
      };

      // Update local transactions state
      setTransactions(prev => prev.map(t => {
        if (t.id === tx.id) {
          return {
            ...t,
            status: mappedStatus,
            aiRiskScore: mappedRiskScore,
            aiAnalysis: updatedAnalysis
          };
        }
        return t;
      }));

      // Update selected transaction states
      const updatedTx = {
        ...tx,
        status: mappedStatus,
        aiRiskScore: mappedRiskScore,
        aiAnalysis: updatedAnalysis
      };
      setSelectedTransaction(updatedTx);
      setDetailsTransaction(updatedTx);

      const isHighOrCritical = riskString === 'High' || riskString === 'Critical';

      if (isHighOrCritical) {
        // Prevent duplicate alerts by matching transaction ID
        const alertId = `alt-${tx.id.replace('#', '')}`;
        const newAlert: Alert = {
          id: alertId,
          title: lang === 'ar' ? `إنذار احتيال للعملية ${tx.id}` : `Fraud Threat Warning: ${tx.id}`,
          description: lang === 'ar' ? updatedAnalysis.arabic_explanation : updatedAnalysis.summary,
          severity: riskString === 'Critical' ? 'CRITICAL' : 'HIGH',
          time: lang === 'ar' ? 'الآن' : 'Just now',
          customerName: tx.customerName,
          customerTier: 'SDB Premium Client',
          customerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          riskScore: mappedRiskScore,
          type: tx.type === 'Debit' ? 'payments' : 'shopping_cart'
        };

        setAlerts(prev => {
          const exists = prev.some(a => a.id === alertId);
          if (exists) {
            return prev.map(a => a.id === alertId ? newAlert : a);
          }
          return [newAlert, ...prev];
        });

        // Prevent duplicate Fraud Cases by matching customer and transaction details
        const caseId = `CASE-${tx.id.replace('#', '').replace('TXN-', '')}`;
        const newCase = {
          id: caseId,
          customer: tx.customerName,
          amount: tx.amount,
          date: new Date().toISOString().split('T')[0],
          status: 'Investigating',
          riskLevel: riskString,
          details: `Gemini AI automated compliance trigger. reasons: ${(updatedAnalysis.reasons || []).join('; ')}`
        };

        setFraudCases(prev => {
          const exists = prev.some(c => c.id === caseId);
          if (exists) {
            return prev.map(c => c.id === caseId ? newCase : c);
          }
          return [newCase, ...prev];
        });

        // Prevent duplicate warning notification
        const notifId = `notif-warn-${tx.id.replace('#', '')}`;
        const warningNotif: AppNotification = {
          id: notifId,
          titleEn: `⚠️ CRITICAL FRAUD WARNING: Transaction ${tx.id}`,
          titleAr: `⚠️ تحذير احتيال حرج: العملية ${tx.id}`,
          descEn: `CRITICAL THREAT DETECTED. Transaction ID: ${tx.id}. Customer: ${tx.customerName}. Risk Level: ${riskString}. Fraud Probability: ${mappedRiskScore}%. Analysis Time: ${new Date().toLocaleTimeString()}. Summary: ${updatedAnalysis.summary}`,
          descAr: `تم رصد تهديد خطير للعملية ${tx.id}. العميل: ${tx.customerName}. مستوى الخطورة: ${riskString === 'Critical' ? 'حرج' : 'مرتفع'}. احتمالية الاحتيال: ${mappedRiskScore}%. وقت التحليل: ${new Date().toLocaleTimeString('ar-EG')}. الملخص: ${updatedAnalysis.arabic_explanation}`,
          read: false,
          timeEn: 'Just now',
          timeAr: 'الآن',
          severity: 'danger',
          relatedTxId: tx.id
        };

        setNotifications(prev => {
          const exists = prev.some(n => n.id === notifId || n.relatedTxId === tx.id);
          if (exists) {
            return prev.map(n => (n.id === notifId || n.relatedTxId === tx.id) ? warningNotif : n);
          }
          return [warningNotif, ...prev];
        });

        // Professional High-risk warning toast/banner triggers
        addToast(
          lang === 'ar' 
            ? 'تم اكتشاف عملية عالية الخطورة، ويوصى بمراجعتها فورًا.' 
            : 'High-risk transaction detected. Immediate review is recommended.', 
          'error'
        );

      } else {
        // Safe / Low / Medium - Create normal notification (prevent duplicate normal notifications)
        const notifId = `notif-normal-${tx.id.replace('#', '')}`;
        const normalNotif: AppNotification = {
          id: notifId,
          titleEn: `AI Compliance Analysis: Transaction ${tx.id}`,
          titleAr: `تحليل الامتثال الذكي: العملية ${tx.id}`,
          descEn: `Compliance audit completed. Transaction ID: ${tx.id}. Customer: ${tx.customerName}. Risk Level: ${riskString}. Fraud Probability: ${mappedRiskScore}%. Analysis Time: ${new Date().toLocaleTimeString()}. Summary: ${updatedAnalysis.summary}`,
          descAr: `اكتمل تدقيق الامتثال للعملية رقم ${tx.id}. العميل: ${tx.customerName}. مستوى الخطورة: ${riskString === 'Medium' ? 'متوسط' : 'آمن'}. احتمالية الاحتيال: ${mappedRiskScore}%. وقت التحليل: ${new Date().toLocaleTimeString('ar-EG')}. الملخص: ${updatedAnalysis.arabic_explanation}`,
          read: false,
          timeEn: 'Just now',
          timeAr: 'الآن',
          severity: riskString === 'Medium' ? 'warning' : 'success',
          relatedTxId: tx.id
        };

        setNotifications(prev => {
          const exists = prev.some(n => n.id === notifId || n.relatedTxId === tx.id);
          if (exists) {
            return prev.map(n => (n.id === notifId || n.relatedTxId === tx.id) ? normalNotif : n);
          }
          return [normalNotif, ...prev];
        });
      }

      // Automatically generate or update professional SAMA compliance investigation report
      setReports(prev => {
        const existingReport = prev.find(r => r.transactionId === tx.id);
        const reportId = existingReport ? existingReport.id : `RPT-2026-${String(prev.length + 1).padStart(6, '0')}`;
        
        const newReport: InvestigationReport = {
          id: reportId,
          transactionId: tx.id,
          customerName: tx.customerName || "Sarah M.",
          accountNumber: tx.accountNumber || "4000010877",
          iban: tx.iban || "SA80400001087723945002",
          amount: tx.amount,
          currency: tx.currency || "SAR",
          type: tx.type || "Debit",
          merchantName: tx.merchantName || "Elite Workstation Pro",
          city: tx.location ? tx.location.split(',')[0].trim() : "Riyadh",
          device: tx.deviceId || "iPhone 15 Pro",
          ipAddress: tx.ipAddress || "185.2.44.112",
          analysisDateTime: new Date().toISOString(),
          geminiModelVersion: "Gemini 3.5 Flash",
          fraudProbability: mappedRiskScore,
          riskScore: mappedRiskScore,
          riskLevel: riskString,
          aiConfidence: result.confidence || '94%',
          executiveSummary: updatedAnalysis.summary || `Compliance assessment finalized. Fraud Probability rated at ${mappedRiskScore}% under Alinma guidelines.`,
          detailedExplanation: updatedAnalysis.arabic_explanation || `The transaction of SAR ${tx.amount} on account of ${tx.customerName} flagged ${riskString} with risk coefficient of ${mappedRiskScore}.`,
          riskFactors: updatedAnalysis.reasons && updatedAnalysis.reasons.length > 0 ? updatedAnalysis.reasons : [
            "Originating IP address is associated with a blacklisted VPN subnet.",
            "Velocity spike detected with multiple successive transaction attempts.",
            "Transaction amount exceeds historical baseline average."
          ],
          recommendedActions: updatedAnalysis.recommendations && updatedAnalysis.recommendations.length > 0 ? updatedAnalysis.recommendations : [
            "Trigger temporary card freeze and prompt for verification.",
            "Request SMS/OTP authentication verification.",
            "Hold transaction for manual override and compliance team audit."
          ],
          complianceNotes: existingReport ? existingReport.complianceNotes : "Audit conducted in full alignment with SAMA Cybersecurity Framework (SCSF) version 4.2 guidelines.",
          analystDecision: existingReport ? existingReport.investigationStatus || "Pending Review" : "Pending Review",
          investigationStatus: existingReport ? existingReport.investigationStatus || "Pending Review" : "Pending Review"
        };

        if (existingReport) {
          return prev.map(r => r.id === reportId ? newReport : r);
        } else {
          return [...prev, newReport];
        }
      });

      addToast(
        lang === 'ar' 
          ? 'اكتمل التحليل بنجاح وتمت إضافة تقرير التحقيق إلى صفحة التقارير.' 
          : 'Analysis completed successfully. The investigation report has been added to Reports.', 
        'success'
      );
    } catch (err: any) {
      console.error("Gemini Single Analysis Failed:", err);
      setIsGeminiApiConnected(false);
      addToast(
        lang === 'ar' 
          ? 'فشل التحليل. يرجى المحاولة مرة أخرى.' 
          : 'Analysis failed. Please try again.', 
        'error'
      );
    } finally {
      setIsSingleAnalysisLoading(false);
    }
  };

  // Screen routing transition mapper
  const handleNavigate = (targetScreen: Screen) => {
    if (targetScreen === currentScreen) return;

    let nextDirection: TransitionDirection = 'push';
    if (currentScreen === 'ai-report') {
      if (targetScreen === 'dashboard' || targetScreen === 'alerts-feed') {
        nextDirection = 'push_back';
      }
    } else if (currentScreen === 'transaction-analysis') {
      if (targetScreen === 'dashboard') {
        nextDirection = 'push_back';
      }
    } else if (currentScreen === 'alerts-feed') {
      if (targetScreen === 'dashboard') {
        nextDirection = 'push_back';
      }
    }

    setDirection(nextDirection);
    setCurrentScreen(targetScreen);
  };

  // Approve action
  const handleApproveTransaction = (id: string) => {
    setTransactions((prev) =>
      prev.map((txn) => (txn.id === id ? { ...txn, status: 'Safe', aiRiskScore: 8 } : txn))
    );
    if (selectedTransaction && selectedTransaction.id === id) {
      setSelectedTransaction(prev => prev ? { ...prev, status: 'Safe', aiRiskScore: 8 } : null);
    }
    addToast(`Transaction ${id} successfully authorized. Card lockout released.`, 'success');
  };

  // Reject / Block action
  const handleRejectTransaction = (id: string) => {
    setTransactions((prev) =>
      prev.map((txn) => (txn.id === id ? { ...txn, status: 'High', aiRiskScore: 99 } : txn))
    );
    if (selectedTransaction && selectedTransaction.id === id) {
      setSelectedTransaction(prev => prev ? { ...prev, status: 'High', aiRiskScore: 99 } : null);
    }
    addToast(`Transaction ${id} flagged as High Risk and blocked under SAMA compliance protocols.`, 'error');
  };

  // Block from main lists
  const handleBlockTransaction = (id: string) => {
    handleRejectTransaction(id);
  };

  // Real-Time Gemini AI Analysis request
  const handleNewAnalysis = async (input: NewTransactionInput) => {
    setIsAnalysisLoading(true);
    setCurrentScreen('ai-report'); // Navigate immediately so user sees our premium skeleton loading states
    setDirection('push');

    const tempTxnId = `#TXN-${Math.floor(1000 + Math.random() * 9000)}`;

    const txTypeRaw = input.type;
    const deviceRaw = (input.deviceId || "").toLowerCase();
    let channelVal: 'ATM' | 'POS' | 'Online' | 'Mobile App' | 'Bank Transfer' = 'Online';
    if (txTypeRaw === 'Transfer') {
      channelVal = 'Bank Transfer';
    } else if (deviceRaw.includes('phone') || deviceRaw.includes('iphone') || deviceRaw.includes('android') || deviceRaw.includes('mobile')) {
      channelVal = 'Mobile App';
    } else {
      channelVal = 'POS';
    }

    const draftTxn: Transaction = {
      id: tempTxnId,
      customerName: input.customerId,
      customerInitials: input.customerId.substring(0, 2).toUpperCase(),
      amount: input.amount,
      status: 'Medium',
      aiRiskScore: 50,
      time: 'Calculating...',
      type: input.type,
      merchantName: input.merchantName,
      mcc: input.mcc,
      ipAddress: input.ipAddress,
      deviceId: input.deviceId,
      location: input.city,
      channel: channelVal,
      riskIndicators: input.riskIndicators,
    };
    setSelectedTransaction(draftTxn);

    try {
      const res = await fetch('/api/analyze-transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: input.amount,
          currency: input.currency,
          type: input.type,
          customerId: input.customerId,
          merchantName: input.merchantName,
          mcc: input.mcc,
          ipAddress: input.ipAddress,
          deviceId: input.deviceId,
          coordinates: input.coordinates,
          city: input.city,
          accountAge: input.accountAge,
          riskIndicators: input.riskIndicators,
          date: (input as any).date,
          time: (input as any).time,
          country: (input as any).country,
          browser: (input as any).browser,
          operatingSystem: (input as any).operatingSystem,
          previousTransactions: (input as any).previousTransactions,
          averageCustomerSpend: (input as any).averageCustomerSpend,
        }),
      });

      if (!res.ok) {
        let errMsg = 'Gemini API call failed or timed out.';
        try {
          const errData = await res.json();
          if (errData && errData.error) {
            errMsg = errData.error;
          }
        } catch (_) {
          try {
            const errText = await res.text();
            if (errText) {
              errMsg = errText;
            }
          } catch (_) {}
        }
        console.error("Gemini API Server Error Details:", errMsg);
        throw new Error(errMsg);
      }

      const result = await res.json();

      const isHighOrCritical = result.riskLevel === 'High' || result.riskLevel === 'Critical' || result.risk_level === 'High' || result.risk_level === 'Critical';
      const riskLevelStr = result.riskLevel || result.risk_level || 'Safe';
      const mappedRiskScore = Number(result.fraudProbability !== undefined ? result.fraudProbability : (result.fraud_probability !== undefined ? result.fraud_probability : 0));
      const mappedStatus = riskLevelStr === 'High' || riskLevelStr === 'Critical' ? 'High' : (riskLevelStr === 'Medium' ? 'Medium' : 'Safe');

      const enrichedTxn: Transaction = {
        ...draftTxn,
        status: mappedStatus,
        aiRiskScore: mappedRiskScore,
        time: 'Just now',
        aiAnalysis: {
          ...result,
          riskLevel: riskLevelStr,
          risk_level: riskLevelStr,
          fraudProbability: mappedRiskScore,
          fraud_probability: mappedRiskScore,
          confidence: result.confidence || '90%',
          summary: result.summary || result.arabic_explanation || '',
          arabic_explanation: result.arabic_explanation || result.summary || '',
          reasons: result.reasons || [],
          recommendations: result.recommendations || [],
          analysisTimestamp: new Date().toISOString()
        },
      };

      setTransactions((prev) => [enrichedTxn, ...prev]);
      setSelectedTransaction(enrichedTxn);
      setIsAnalysisLoading(false);

      // Automatically generate or update professional SAMA compliance investigation report
      setReports(prev => {
        const existingReport = prev.find(r => r.transactionId === enrichedTxn.id);
        const reportId = existingReport ? existingReport.id : `RPT-2026-${String(prev.length + 1).padStart(6, '0')}`;
        
        const newReport: InvestigationReport = {
          id: reportId,
          transactionId: enrichedTxn.id,
          customerName: enrichedTxn.customerName || "Sarah M.",
          accountNumber: enrichedTxn.accountNumber || "4000010877",
          iban: enrichedTxn.iban || "SA80400001087723945002",
          amount: enrichedTxn.amount,
          currency: enrichedTxn.currency || "SAR",
          type: enrichedTxn.type || "Debit",
          merchantName: enrichedTxn.merchantName || "Elite Workstation Pro",
          city: enrichedTxn.location || "Riyadh",
          device: enrichedTxn.deviceId || "iPhone 15 Pro",
          ipAddress: enrichedTxn.ipAddress || "185.2.44.112",
          analysisDateTime: new Date().toISOString(),
          geminiModelVersion: "Gemini 3.5 Flash",
          fraudProbability: mappedRiskScore,
          riskScore: mappedRiskScore,
          riskLevel: riskLevelStr,
          aiConfidence: result.confidence || '90%',
          executiveSummary: result.summary || result.arabic_explanation || `Compliance assessment finalized. Fraud Probability rated at ${mappedRiskScore}% under Alinma guidelines.`,
          detailedExplanation: result.arabic_explanation || result.summary || `The transaction of SAR ${enrichedTxn.amount} on account of ${enrichedTxn.customerName} flagged ${riskLevelStr} with risk coefficient of ${mappedRiskScore}.`,
          riskFactors: result.reasons && result.reasons.length > 0 ? result.reasons : [
            "Originating IP address is associated with a blacklisted VPN subnet.",
            "Velocity spike detected with multiple successive transaction attempts.",
            "Transaction amount exceeds historical baseline average."
          ],
          recommendedActions: result.recommendations && result.recommendations.length > 0 ? result.recommendations : [
            "Trigger temporary card freeze and prompt for verification.",
            "Request SMS/OTP authentication verification.",
            "Hold transaction for manual override and compliance team audit."
          ],
          complianceNotes: existingReport ? existingReport.complianceNotes : "Audit conducted in full alignment with SAMA Cybersecurity Framework (SCSF) version 4.2 guidelines.",
          analystDecision: existingReport ? existingReport.analystDecision : "Pending Review",
          investigationStatus: existingReport ? existingReport.investigationStatus : "Pending Review"
        };

        if (existingReport) {
          return prev.map(r => r.id === reportId ? newReport : r);
        } else {
          return [...prev, newReport];
        }
      });

      addToast(
        lang === 'ar' 
          ? 'اكتمل التحليل بنجاح وتمت إضافة تقرير التحقيق إلى صفحة التقارير.' 
          : 'Analysis completed successfully. The investigation report has been added to Reports.', 
        'success'
      );

      // 9. If Risk Level is High or Critical:
      if (isHighOrCritical) {
        addToast(
          lang === 'ar' 
            ? 'تم اكتشاف عملية عالية الخطورة، ويوصى بمراجعتها فورًا.' 
            : 'High-risk transaction detected. Immediate review is recommended.', 
          'error'
        );

        // - Add a new notification.
        const newNotif: AppNotification = {
          id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
          titleEn: `⚠️ CRITICAL FRAUD WARNING: Transaction ${tempTxnId}`,
          titleAr: `⚠️ تحذير احتيال حرج: العملية ${tempTxnId}`,
          descEn: `CRITICAL THREAT DETECTED. Transaction ID: ${tempTxnId}. Customer: ${input.customerId}. Risk Level: ${riskLevelStr}. Fraud Probability: ${mappedRiskScore}%. Analysis Time: ${new Date().toLocaleTimeString()}. Summary: ${result.summary || result.arabic_explanation || ''}`,
          descAr: `تم رصد تهديد خطير للعملية ${tempTxnId}. العميل: ${input.customerId}. مستوى الخطورة: ${riskLevelStr === 'Critical' ? 'حرج' : 'مرتفع'}. احتمالية الاحتيال: ${mappedRiskScore}%. وقت التحليل: ${new Date().toLocaleTimeString('ar-EG')}. الملخص: ${result.arabic_explanation || result.summary || ''}`,
          read: false,
          timeEn: 'Just now',
          timeAr: 'الآن',
          severity: 'danger',
          relatedTxId: tempTxnId
        };
        setNotifications((prev) => [newNotif, ...prev]);

        // - Add a Fraud Case automatically.
        const newCase = {
          id: `CASE-${Math.floor(1000 + Math.random() * 9000)}`,
          customer: input.customerId,
          amount: input.amount,
          date: new Date().toISOString().split('T')[0],
          status: 'Investigating',
          riskLevel: riskLevelStr,
          details: `Automated case created by Gemini AI analysis. Reasons: ${(result.reasons || []).join('; ')}`
        };
        setFraudCases((prev) => [newCase, ...prev]);

        // Also add to dashboard alerts feed
        const newAlt: Alert = {
          id: `alt-${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
          title: `Unusual ${input.type} at ${input.merchantName}`,
          description: `Anomalous pattern analyzed by Gemini AI. Fraud probability calculated at ${mappedRiskScore}%.`,
          severity: riskLevelStr === 'Critical' ? 'CRITICAL' : 'HIGH',
          time: 'Just now',
          customerName: input.customerId,
          customerTier: 'Verified Digital Node',
          customerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          riskScore: mappedRiskScore,
          type: input.type === 'Debit' ? 'payments' : 'shopping_cart',
        };
        setAlerts((prev) => [newAlt, ...prev]);
      } else {
        // Safe or Medium - Create normal notification
        const newNotif: AppNotification = {
          id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
          titleEn: `AI Compliance Analysis: Transaction ${tempTxnId}`,
          titleAr: `تحليل الامتثال الذكي: العملية ${tempTxnId}`,
          descEn: `Compliance audit completed. Transaction ID: ${tempTxnId}. Customer: ${input.customerId}. Risk Level: ${riskLevelStr}. Fraud Probability: ${mappedRiskScore}%. Analysis Time: ${new Date().toLocaleTimeString()}. Summary: ${result.summary || result.arabic_explanation || ''}`,
          descAr: `اكتمل تدقيق الامتثال للعملية رقم ${tempTxnId}. العميل: ${input.customerId}. مستوى الخطورة: ${riskLevelStr === 'Medium' ? 'متوسط' : 'آمن'}. احتمالية الاحتيال: ${mappedRiskScore}%. وقت التحليل: ${new Date().toLocaleTimeString('ar-EG')}. الملخص: ${result.arabic_explanation || result.summary || ''}`,
          read: false,
          timeEn: 'Just now',
          timeAr: 'الآن',
          severity: riskLevelStr === 'Medium' ? 'warning' : 'success',
          relatedTxId: tempTxnId
        };
        setNotifications((prev) => [newNotif, ...prev]);

        const newAlt: Alert = {
          id: `alt-${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
          title: `Unusual ${input.type} at ${input.merchantName}`,
          description: `Anomalous pattern analyzed. Fraud probability calculated at ${mappedRiskScore}%.`,
          severity: 'MEDIUM',
          time: 'Just now',
          customerName: input.customerId,
          customerTier: 'Verified Digital Node',
          customerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          riskScore: mappedRiskScore,
          type: input.type === 'Debit' ? 'payments' : 'shopping_cart',
        };
        setAlerts((prev) => [newAlt, ...prev]);
      }

    } catch (err: any) {
      console.error('Gemini API Error:', err);
      setIsAnalysisLoading(false);
      setIsGeminiApiConnected(false);
      setCurrentScreen('transaction-analysis');
      setDirection('push_back');
      addToast(
        lang === 'ar' 
          ? 'فشل التحليل. يرجى المحاولة مرة أخرى.' 
          : 'Analysis failed. Please try again.', 
        'error'
      );
    }
  };

  // Live Copilot chat with backend
  const handleSendAiMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim() || isCopilotTyping) return;

    const userMsg = aiInput;
    const userMsgId = `user-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const updatedMessages = [...aiMessages, { id: userMsgId, sender: 'user' as const, text: userMsg }];
    setAiMessages(updatedMessages);
    setAiInput('');
    setIsCopilotTyping(true);

    try {
      const res = await fetch('/api/chat-copilot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            sender: m.sender === 'user' ? 'user' : 'model',
            text: m.text,
          })),
          context: {
            currentScreen,
            lang,
            selectedTransaction,
            relatedReport: selectedTransaction ? reports.find(r => r.transactionId === selectedTransaction.id) : null,
            customerPreviousTransactions: selectedTransaction 
              ? transactions.filter(t => t.customerName === selectedTransaction.customerName && t.id !== selectedTransaction.id)
              : [],
            recentTransactions: transactions.slice(0, 5).map(t => ({
              id: t.id,
              customerName: t.customerName,
              amount: t.amount,
              status: t.status,
              type: t.type,
              time: t.time
            }))
          }
        }),
      });

      if (!res.ok) {
        throw new Error('Copilot fetch failed');
      }

      const data = await res.json();
      const aiMsgId = `ai-${Date.now()}-${Math.random().toString(36).substring(7)}`;
      setAiMessages((prev) => [...prev, { id: aiMsgId, sender: 'ai' as const, text: data.text }]);
    } catch (err) {
      console.error('Copilot Chat Error, fallback active:', err);
      
      const isAr = lang === 'ar';
      let aiResponse = "";
      if (!selectedTransaction) {
        aiResponse = isAr 
          ? "يمكنني مساعدتك في الأسئلة العامة، ولتحليل تفاصيل عملية محددة يرجى اختيار معاملة أولًا." 
          : "I can answer general questions. To review a specific transaction, please select one first.";
      } else {
        const tx = selectedTransaction;
        const rep = reports.find(r => r.transactionId === tx.id);
        const statusLabel = isAr 
          ? (rep?.investigationStatus === 'Approved' ? 'معتمدة' : rep?.investigationStatus === 'Rejected' ? 'مرفوضة' : rep?.investigationStatus === 'Escalated' ? 'مصعّدة' : 'تحت التحقيق')
          : (rep?.investigationStatus || 'Pending Review');
        
        const isHigh = tx.aiRiskScore > 70 || tx.status === 'High' || tx.status === 'Critical';
        const riskScore = tx.aiRiskScore !== undefined ? `${tx.aiRiskScore}%` : (isAr ? "غير متوفر" : "N/A");
        const riskLevel = isAr ? (tx.status === 'High' ? 'عالية الخطورة' : tx.status === 'Critical' ? 'حرجة الخطورة' : 'منخفضة الخطورة') : (tx.status || 'N/A');
        const amountStr = `${tx.amount} ${tx.currency || 'SAR'}`;
        const device = tx.deviceId || (isAr ? "غير متوفر" : "N/A");
        const ip = tx.ipAddress || (isAr ? "غير متوفر" : "N/A");
        const location = tx.location || (isAr ? "غير متوفر" : "N/A");
        const avgSpending = tx.averageCustomerSpend ? `${tx.averageCustomerSpend} SAR` : (isAr ? "غير متوفر" : "N/A");

        const indicators = [];
        if (tx.riskIndicators?.vpnUse) indicators.push(isAr ? "استخدام VPN" : "VPN usage");
        if (tx.riskIndicators?.highVelocity) indicators.push(isAr ? "سرعة معاملات عالية" : "high velocity");
        if (tx.riskIndicators?.mismatchedGeo) indicators.push(isAr ? "اختلاف الموقع الجغرافي" : "geo mismatch");
        if (tx.riskIndicators?.unusualSurge) indicators.push(isAr ? "ارتفاع غير معتاد في القيمة" : "unusual amount surge");
        const indicatorsStr = indicators.length > 0 ? indicators.join(isAr ? " و " : " and ") : (isAr ? "لا توجد مؤشرات اشتباه" : "no risk indicators");

        const msgClean = userMsg.toLowerCase().trim();

        if (msgClean.includes('device') || msgClean.includes('phone') || msgClean.includes('iphone') || msgClean.includes('hardware') || msgClean.includes('جهاز') || msgClean.includes('هاتف') || msgClean.includes('ايفون')) {
          aiResponse = isAr 
            ? `تم تنفيذ العملية باستخدام جهاز "${device}" (عنوان IP: ${ip}). تشير أنظمة الرصد أن هذا الجهاز ${tx.riskIndicators?.unusualDevice ? 'جديد وغير مسجل مسبقاً لهذا الحساب' : 'جهاز معتاد وتم استخدامه سابقاً'}.`
            : `The transaction was executed using device "${device}" (IP: ${ip}). This device is analyzed as ${tx.riskIndicators?.unusualDevice ? 'new and unusual for this user account' : 'previously authenticated and trusted'}.`;
        } else if (msgClean.includes('amount') || msgClean.includes('cost') || msgClean.includes('value') || msgClean.includes('limit') || msgClean.includes('sar') || msgClean.includes('مبلغ') || msgClean.includes('قيمة') || msgClean.includes('كم') || msgClean.includes('ريال') || msgClean.includes('ر.س')) {
          aiResponse = isAr
            ? `قيمة العملية هي ${amountStr}. ويبلغ متوسط إنفاق العميل المعتاد هو ${avgSpending}.`
            : `The transaction amount is ${amountStr}. The customer's average historical transaction size is ${avgSpending}.`;
        } else if (msgClean.includes('location') || msgClean.includes('country') || msgClean.includes('city') || msgClean.includes('travel') || msgClean.includes('geo') || msgClean.includes('موقع') || msgClean.includes('بلد') || msgClean.includes('مدينة') || msgClean.includes('سفر') || msgClean.includes('جغراف')) {
          aiResponse = isAr
            ? `تم تنفيذ العملية من موقع "${location}" باستخدام عنوان IP (${ip}). ${tx.riskIndicators?.mismatchedGeo ? 'ويعتبر هذا موقعاً غير معتاد ومختلفاً عن النمط الجغرافي للعميل.' : 'ويعتبر هذا الموقع متوافقاً مع النطاق الجغرافي المعتاد للعميل.'}`
            : `The transaction originated from location "${location}" (IP: ${ip}). ${tx.riskIndicators?.mismatchedGeo ? 'This represents a critical geographic mismatch with the customer\'s typical location.' : 'This location aligns with the customer\'s registered geographical footprint.'}`;
        } else if (msgClean.includes('action') || msgClean.includes('recommend') || msgClean.includes('decision') || msgClean.includes('stop') || msgClean.includes('approve') || msgClean.includes('إجراء') || msgClean.includes('توصية') || msgClean.includes('يوصى') || msgClean.includes('نصيحة') || msgClean.includes('ماذا أفعل')) {
          aiResponse = isAr
            ? `الإجراء الموصى به للامتثال: ${tx.aiAnalysis?.arabic_explanation || (tx.aiRiskScore > 70 ? 'التحقق الفوري من هوية العميل عبر الاتصال المباشر ورفع بلاغ معاملة مشتبه بها (STR).' : 'لا توجد أي مخاطر ملحة تتطلب التعليق حالياً، ويُنصح بمواصلة المراقبة.')}`
            : `The recommended action is: ${tx.aiAnalysis?.recommendations?.[0] || (tx.aiRiskScore > 70 ? 'Immediate customer verification and filing a Suspicious Transaction Report (STR).' : 'Routine ongoing monitoring is recommended.')}`;
        } else if (msgClean.includes('status') || msgClean.includes('investigation') || msgClean.includes('case') || msgClean.includes('حالة') || msgClean.includes('تحقيق') || msgClean.includes('تقرير') || msgClean.includes('معتمدة') || msgClean.includes('مرفوضة')) {
          aiResponse = isAr
            ? `حالة التحقيق الحالية لهذه العملية هي: "${statusLabel}".`
            : `The current investigation status of this transaction is: "${statusLabel}".`;
        } else if (msgClean.includes('why') || msgClean.includes('risk') || msgClean.includes('threat') || msgClean.includes('score') || msgClean.includes('suspicious') || msgClean.includes('ليش') || msgClean.includes('لماذا') || msgClean.includes('سبب') || msgClean.includes('خطورة') || msgClean.includes('اشتباه')) {
          aiResponse = isAr
            ? `تم تصنيف هذه العملية كـ [${riskLevel}] (درجة خطورة: ${riskScore}). وتتمثل أهم مؤشرات الاشتباه في: [${indicatorsStr}].`
            : `This transaction is classified as [${riskLevel}] with a risk score of ${riskScore}. Major threat indicators identified: [${indicatorsStr}].`;
        } else {
          aiResponse = isAr
            ? `العملية المالية بقيمة ${amountStr} مصنفة كـ [${riskLevel}] بدرجة خطورة بلغت ${riskScore} وحالتها هي (${statusLabel}).`
            : `The transaction of ${amountStr} is classified as [${riskLevel}] (Risk Score: ${riskScore}) with investigation status (${statusLabel}).`;
        }
      }
      
      const aiMsgId = `ai-fallback-${Date.now()}-${Math.random().toString(36).substring(7)}`;
      setAiMessages((prev) => [...prev, { id: aiMsgId, sender: 'ai' as const, text: aiResponse }]);
    } finally {
      setIsCopilotTyping(false);
    }
  };

  // Navigations with Selection updates
  const handleReviewTransaction = (id: string) => {
    const found = transactions.find(t => t.id === id);
    if (found) {
      setSelectedTransaction(found);
    }
    handleNavigate('ai-report');
  };

  const animationVariants = {
    enter: (dir: TransitionDirection) => ({
      x: dir === 'push' ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { x: { type: 'spring', stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } },
    },
    exit: (dir: TransitionDirection) => ({
      x: dir === 'push' ? '-100%' : '100%',
      opacity: 0,
      transition: { x: { type: 'spring', stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } },
    }),
  };

  if (!isLoggedIn) {
    return (
      <div className={darkMode ? 'dark bg-[#030712] text-gray-100' : 'bg-[#f4f6fa] text-gray-800'} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <Login 
          onLoginSuccess={(role, name) => {
            setUserRole(role);
            setSessionUser(name);
            setIsLoggedIn(true);
            addToast(
              lang === 'ar' 
                ? `أهلاً بك مجدداً ${name}! تم تسجيل الدخول بنجاح كـ ${role === 'employee' ? 'منسوب مصرفي' : 'عميل'}.` 
                : `Welcome back, ${name}! Logged in as ${role === 'employee' ? 'Bank Employee' : 'Customer'}.`, 
              'success'
            );
          }}
          lang={lang}
          setLang={setLang}
          darkMode={darkMode}
        />
        {/* Toast Notification Hub */}
        <div className="fixed top-6 right-6 z-[150] space-y-3 pointer-events-none max-w-sm w-full">
          <AnimatePresence>
            {toasts.map((toast) => (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                className="pointer-events-auto"
              >
                <div className={`flex items-start gap-3 p-4 rounded-2xl shadow-xl border ${
                  toast.type === 'success' 
                    ? 'bg-emerald-50 dark:bg-emerald-950/90 border-emerald-200 dark:border-emerald-850 text-emerald-800 dark:text-emerald-300'
                    : toast.type === 'error'
                    ? 'bg-red-50 dark:bg-red-950/90 border-red-200 dark:border-red-850 text-red-800 dark:text-red-300'
                    : 'bg-blue-50 dark:bg-slate-900/90 border-blue-200 dark:border-slate-800 text-blue-800 dark:text-blue-300'
                }`}>
                  {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-500" />}
                  {toast.type === 'error' && <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />}
                  {toast.type === 'info' && <Info className="w-5 h-5 shrink-0 mt-0.5 text-blue-500" />}
                  <div className="text-xs font-bold leading-relaxed">{toast.message}</div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen font-sans flex flex-col md:flex-row overflow-x-hidden relative transition-colors duration-150 ${
      darkMode ? 'dark bg-[#030712] text-gray-100' : 'bg-[#f8fafc] text-gray-800'
    }`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* Toast Notification Hub */}
      <div className="fixed top-6 right-6 z-[150] space-y-3 pointer-events-none max-w-sm w-full">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              className="pointer-events-auto"
            >
              <div className={`flex items-start gap-3 p-4 rounded-2xl shadow-xl border ${
                toast.type === 'success' 
                  ? 'bg-emerald-50 dark:bg-emerald-950/90 border-emerald-200 dark:border-emerald-850 text-emerald-800 dark:text-emerald-300'
                  : toast.type === 'error'
                  ? 'bg-red-50 dark:bg-red-950/90 border-red-200 dark:border-red-850 text-red-800 dark:text-red-300'
                  : 'bg-blue-50 dark:bg-slate-900/90 border-blue-200 dark:border-slate-800 text-blue-800 dark:text-blue-300'
              }`}>
                {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-500" />}
                {toast.type === 'error' && <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />}
                {toast.type === 'info' && <Info className="w-5 h-5 shrink-0 mt-0.5 text-blue-500" />}
                <div className="text-xs font-bold leading-relaxed">{toast.message}</div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Navigation Sidebar (Desktop view) */}
      <Sidebar 
        currentScreen={currentScreen} 
        onNavigate={handleNavigate} 
        lang={lang} 
        setLang={setLang} 
        collapsed={collapsed} 
        setCollapsed={setCollapsed}
        notifications={notifications}
        onToggleAiAssistant={() => setShowAiAssistant(prev => !prev)}
        onLogout={() => {
          setIsLoggedIn(false);
          setUserRole(null);
          setSessionUser('');
          addToast(lang === 'ar' ? 'تم تسجيل الخروج بنجاح.' : 'Logged out successfully.', 'info');
        }}
      />

      {/* Main Canvas Area */}
      <div 
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          lang === 'ar'
            ? (collapsed ? 'md:mr-[75px] md:ml-0' : 'md:mr-[280px] md:ml-0')
            : (collapsed ? 'md:ml-[75px] md:mr-0' : 'md:ml-[280px] md:mr-0')
        }`}
        dir={lang === 'ar' ? 'rtl' : 'ltr'}
      >
        {/* TopBar Header with Dark Mode Trigger and AI Assistant Toggle */}
        <TopBar
          currentScreen={currentScreen}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          onToggleAiAssistant={() => setShowAiAssistant((prev) => !prev)}
          lang={lang}
          setLang={setLang}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          notifications={notifications}
          onMarkAsRead={handleMarkAsRead}
          onMarkAllAsRead={handleMarkAllAsRead}
          onDeleteNotification={handleDeleteNotification}
          onViewDetailsNotification={handleViewDetailsNotification}
        />

        {/* Content View Routing with Push/Push_back animations */}
        <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full relative pb-24 md:pb-12">
          {/* Gemini Fallback Alert Banner */}
          {!isGeminiApiConnected && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-amber-500/10 dark:bg-amber-950/40 border border-amber-500/30 text-amber-700 dark:text-amber-400 rounded-2xl flex items-center justify-between gap-4 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <Brain className="w-5 h-5 text-amber-500 shrink-0 animate-pulse" />
                <span className="text-xs md:text-sm font-extrabold leading-relaxed">
                  {lang === 'ar' 
                    ? 'تنبيه: تم الوصول للحد الأقصى لاستهلاك واجهة Gemini API لهذا الشهر. تم تفعيل نظام الاستدلال المحلي والتحليل الاحتياطي الآمن لمواصلة تدقيق العمليات ومكافحة غسيل الأموال دون انقطاع.' 
                    : 'Notice: Gemini API project monthly spending cap exceeded. ComplianceGuard Secure Local Intelligence fallback is active to ensure uninterrupted automated AML risk evaluation.'}
                </span>
              </div>
              <span className="px-2.5 py-1 bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl text-[10px] font-black uppercase tracking-wider shrink-0">
                {lang === 'ar' ? 'نمط استقصاء محلي' : 'LOCAL FALLBACK'}
              </span>
            </motion.div>
          )}

          {/* SAMA High-Risk Alert Banner */}
          {selectedTransaction && selectedTransaction.aiAnalysis && 
           (selectedTransaction.aiAnalysis.riskLevel === 'High' || selectedTransaction.aiAnalysis.riskLevel === 'Critical') && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/10 dark:bg-red-950/40 border border-red-500/30 text-red-700 dark:text-red-400 rounded-2xl flex items-center justify-between gap-4 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 animate-pulse" />
                <span className="text-xs md:text-sm font-extrabold">
                  {lang === 'ar' 
                    ? 'تم اكتشاف عملية عالية الخطورة، ويوصى بمراجعتها فورًا.' 
                    : 'High-risk transaction detected. Immediate review is recommended.'}
                </span>
              </div>
              <span className="px-2.5 py-1 bg-red-500/20 text-red-600 dark:text-red-400 rounded-xl text-[10px] font-black uppercase tracking-wider">
                {lang === 'ar' ? 'فحص حرج' : 'CRITICAL WARNING'}
              </span>
            </motion.div>
          )}

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentScreen}
              custom={direction}
              variants={animationVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full h-full"
            >
              {currentScreen === 'dashboard' && (
                <ExecutiveDashboard
                  transactions={transactions.filter(t => 
                    t.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                    t.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (t.merchantName && t.merchantName.toLowerCase().includes(searchQuery.toLowerCase()))
                  )}
                  onNavigate={handleReviewTransaction}
                  onBlockTransaction={handleBlockTransaction}
                  lang={lang}
                  darkMode={darkMode}
                  onInspectTransaction={handleInspectTransaction}
                  cases={fraudCases}
                  reportsCount={reports.length}
                  reports={reports}
                  isGeminiApiConnected={isGeminiApiConnected}
                  alerts={alerts}
                />
              )}

              {currentScreen === 'transaction-analysis' && (
                <TransactionAnalysis
                  onNavigate={handleNavigate}
                  onSubmitAnalysis={handleNewAnalysis}
                  lang={lang}
                  prefilledData={prefilledTxData}
                  onClearPrefilledData={() => setPrefilledTxData(null)}
                />
              )}

              {currentScreen === 'alerts-feed' && (
                <FraudAlertsFeed
                  alerts={alerts}
                  onNavigate={handleNavigate}
                  onSelectAlert={(id) => {
                    const alert = alerts.find(a => a.id === id);
                    if (alert) {
                      addToast(`Inspecting alert: ${alert.title}`, 'info');
                    }
                  }}
                  transactions={transactions}
                />
              )}

              {currentScreen === 'ai-report' && (
                <AIAnalysisReport
                  transaction={selectedTransaction}
                  isLoading={isAnalysisLoading}
                  onNavigate={handleNavigate}
                  onApprove={handleApproveTransaction}
                  onReject={handleRejectTransaction}
                  darkMode={darkMode}
                  lang={lang}
                  reports={reports}
                  onUpdateReportStatus={handleUpdateReportStatus}
                  onUpdateReportComplianceNotes={handleUpdateReportComplianceNotes}
                  addToast={addToast}
                />
              )}

              {[
                'transactions', 'customers',
                'fraud-cases', 'reports', 'analytics',
                'audit-logs', 'notifications', 'settings'
              ].includes(currentScreen) && (
                <EnterpriseScreens
                  screen={currentScreen}
                  lang={lang}
                  darkMode={darkMode}
                  onNavigate={handleNavigate}
                  onInspectTransaction={handleInspectTransaction}
                  cases={fraudCases}
                  transactions={transactions}
                  alerts={alerts}
                  addToast={addToast}
                  notifications={notifications}
                  onViewDetailsNotification={handleViewDetailsNotification}
                  onMarkAsRead={handleMarkAsRead}
                  onMarkAllAsRead={handleMarkAllAsRead}
                  onDeleteNotification={handleDeleteNotification}
                  reports={reports}
                  onUpdateReportStatus={handleUpdateReportStatus}
                  onUpdateReportComplianceNotes={handleUpdateReportComplianceNotes}
                  
                  theme={theme}
                  onThemeChange={setTheme}
                  onLangChange={setLang}
                  notificationPrefs={notificationPrefs}
                  onNotificationPrefsChange={setNotificationPrefs}
                  dashboardDateRange={dashboardDateRange}
                  onDashboardDateRangeChange={setDashboardDateRange}
                  defaultCurrency={defaultCurrency}
                  onDefaultCurrencyChange={setDefaultCurrency}
                  dateFormat={dateFormat}
                  onDateFormatChange={setDateFormat}
                  timeFormat={timeFormat}
                  onTimeFormatChange={setTimeFormat}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={setRowsPerPage}
                  autoRefresh={autoRefresh}
                  onAutoRefreshChange={setAutoRefresh}
                  tableDensity={tableDensity}
                  onTableDensityChange={setTableDensity}
                  reduceMotion={reduceMotion}
                  onReduceMotionChange={setReduceMotion}
                  largerText={largerText}
                  onLargerTextChange={setLargerText}
                  highContrast={highContrast}
                  onHighContrastChange={setHighContrast}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Bottom Navigation (Mobile view) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-4 py-2 pb-safe bg-white dark:bg-[#070e17] border-t border-gray-100 dark:border-gray-800 shadow-[0_-4px_10px_rgba(0,0,0,0.03)] z-50 h-16 transition-colors">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleNavigate('dashboard');
          }}
          className={`flex flex-col items-center justify-center py-1 flex-1 transition-all ${
            currentScreen === 'dashboard' ? 'text-[#fd8b00] font-black' : 'text-gray-400 dark:text-gray-500'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-0.5 font-bold">Dashboard</span>
        </a>

        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleNavigate('alerts-feed');
          }}
          className={`flex flex-col items-center justify-center py-1 flex-1 transition-all ${
            currentScreen === 'alerts-feed' ? 'text-[#fd8b00] font-black' : 'text-gray-400 dark:text-gray-500'
          }`}
        >
          <AlertOctagon className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-0.5 font-bold">Alerts</span>
        </a>

        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleNavigate('ai-report');
          }}
          className={`flex flex-col items-center justify-center py-1 flex-1 transition-all ${
            currentScreen === 'ai-report' ? 'text-[#fd8b00] font-black' : 'text-gray-400 dark:text-gray-500'
          }`}
        >
          <Brain className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-0.5 font-bold">AI Report</span>
        </a>
      </nav>

      {/* Floating AI Assistant Drawer/Panel */}
      <AnimatePresence>
        {showAiAssistant && (
          <motion.div
            initial={{ opacity: 0, x: lang === 'ar' ? -100 : 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: lang === 'ar' ? -100 : 100 }}
            className={`fixed top-0 h-full w-full max-w-sm bg-white dark:bg-[#070e17] shadow-2xl z-[100] flex flex-col transition-colors ${
              lang === 'ar' ? 'left-0 border-r border-gray-100 dark:border-gray-800' : 'right-0 border-l border-gray-100 dark:border-gray-800'
            }`}
          >
            {/* Header */}
            <div className="p-6 bg-[#001939] dark:bg-[#050c16] text-white flex justify-between items-center border-b dark:border-gray-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#fd8b00]" />
                <div>
                  <span className="font-extrabold text-sm tracking-tight block">AI Risk Copilot</span>
                  <span className="text-[9px] text-[#D4AF37] font-bold block uppercase tracking-wider">البنك الرقمي السعودي</span>
                </div>
              </div>
              <button
                onClick={() => setShowAiAssistant(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg bg-transparent border-none cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat History */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-[#f9f9ff] dark:bg-[#030712] transition-colors">
              {aiMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs font-semibold leading-relaxed shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-[#001939] dark:bg-[#D4AF37] text-white dark:text-[#001939] rounded-br-none'
                        : 'bg-white dark:bg-[#0b1524] text-gray-700 dark:text-gray-200 border border-gray-100 dark:border-gray-800/80 rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              
              {isCopilotTyping && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-[#0b1524] text-gray-400 border border-gray-100 dark:border-gray-800/80 rounded-2xl rounded-bl-none px-4 py-3 text-xs font-semibold flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#fd8b00]" />
                    <span>Copilot is parsing security rules...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendAiMessage} className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-[#070e17] flex gap-2 transition-colors">
              <input
                type="text"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                disabled={isCopilotTyping}
                placeholder={lang === 'ar' ? 'اسأل المساعد الذكي عن هذه العملية...' : 'Ask model to analyze...'}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-100 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-[#001939] dark:focus:ring-emerald-500 text-xs font-semibold bg-gray-50 dark:bg-[#0b1524] text-gray-800 dark:text-gray-100 disabled:opacity-60 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={isCopilotTyping || !aiInput.trim()}
                className="bg-[#fd8b00] hover:bg-[#e07b00] text-white p-2.5 rounded-xl transition-all active:scale-95 shadow-md shadow-orange-500/10 border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sovereign FraudGuard Compliance Details Dossier Modal */}
      <TransactionDetailsModal
        transaction={detailsTransaction}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        lang={lang}
        onApprove={handleApproveTransaction}
        onReject={handleRejectTransaction}
        onEscalate={handleBlockTransaction}
        addToast={addToast}
        darkMode={darkMode}
        onRunGeminiAnalysis={handleRunSingleGeminiAnalysis}
        isGeminiLoading={isSingleAnalysisLoading}
        onAnalyzeThisTransaction={(tx) => {
          setPrefilledTxData(tx);
          handleNavigate('transaction-analysis');
        }}
      />
    </div>
  );
}
