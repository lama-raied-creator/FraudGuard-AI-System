export interface TranslationDict {
  // Sidebar & Navigation
  dashboard: string;
  analyzeTransaction: string;
  liveMonitoring: string;
  transactions: string;
  customers: string;
  accounts: string;
  fraudCases: string;
  reports: string;
  analytics: string;
  aiInsights: string;
  alerts: string;
  auditLogs: string;
  notifications: string;
  settings: string;
  helpCenter: string;
  language: string;
  logout: string;
  brandName: string;
  saudiDigitalBank: string;

  // Header & Global
  searchPlaceholder: string;
  copilotTitle: string;
  copilotSubtitle: string;
  copilotInputPlaceholder: string;
  samaSandbox: string;
  activeLink: string;
  backToDashboard: string;
  success: string;
  error: string;
  info: string;
  loading: string;

  // Executive Dashboard Screen
  goodMorning: string;
  dashboardSubText: string;
  totalVolume: string;
  fraudCasesLabel: string;
  verifiedSafe: string;
  riskIndex: string;
  modelAccuracy: string;
  aiDecisions: string;
  fraudPreventionAnalytics: string;
  chartSubText: string;
  threatDistribution: string;
  aggregateChannelSubText: string;
  verifiedTraffic: string;
  suspiciousFlagged: string;
  saudiRegionalAudit: string;
  regionalSubText: string;
  streamVerification: string;
  streamSubText: string;
  reviewReport: string;
  blockCard: string;
  releaseCard: string;
  viewDetails: string;

  // Live Monitoring Screen
  liveSubtext: string;
  customerName: string;
  nationalId: string;
  accountNo: string;
  iban: string;
  transactionId: string;
  referenceNo: string;
  amount: string;
  currency: string;
  merchant: string;
  location: string;
  country: string;
  device: string;
  browser: string;
  os: string;
  ipAddress: string;
  status: string;
  riskScore: string;
  fraudProbability: string;
  investigationStatus: string;
  suspiciousHighlight: string;
  realtimeActivity: string;
  timeLabel: string;

  // Transaction Analysis (Form) Screen
  analysisTitle: string;
  analysisSub: string;
  coreTxData: string;
  primaryValueSub: string;
  txValue: string;
  currencyDenom: string;
  transferChannel: string;
  bankCustomerId: string;
  merchantTerminalTitle: string;
  merchantTerminalSub: string;
  mccLabel: string;
  clientIpAddress: string;
  deviceFingerprint: string;
  spatialTitle: string;
  spatialSub: string;
  gpsCoordinates: string;
  citySamaRegion: string;
  proximityValidation: string;
  accountAgeLabel: string;
  historicalBaselineSub: string;
  stabilityRating: string;
  newAccountLabel: string;
  trustedAccountLabel: string;
  stabilityEvaluation: string;
  samaRiskFlags: string;
  riskFlagsSub: string;
  submitAnalysisBtn: string;
  sandboxActiveGateway: string;

  // Customer Profile Screen
  customerProfileTitle: string;
  customerProfileSub: string;
  fullName: string;
  phoneNo: string;
  emailAddress: string;
  cardsCount: string;
  loginHistory: string;
  knownLocations: string;
  devicesUsed: string;
  aiRiskSummary: string;
  customerHistory: string;

  // Reports Screen
  reportsTitle: string;
  reportsSub: string;
  dailyReport: string;
  weeklyReport: string;
  monthlyReport: string;
  annualReport: string;
  fraudReports: string;
  customerReports: string;
  executiveReports: string;
  exportCsv: string;
  generateReportBtn: string;

  // Search & Filter
  advancedFilterTitle: string;
  filterByCustomer: string;
  filterByAmount: string;
  filterByLocation: string;
  filterByRisk: string;
  filterByDate: string;
  filterByStatus: string;
  filterByAccount: string;
  filterByChannel: string;

  // Accounts & Cases Screen
  accountBalance: string;
  accountStatus: string;
  investigating: string;
  resolved: string;
  activeStatus: string;
  blockedStatus: string;

  // Settings Screen
  themeMode: string;
  lightMode: string;
  darkMode: string;
  securityProtocols: string;
  apiSettings: string;
  saveChanges: string;

  // AI Assistant Copilot
  aiGreeting: string;
  aiAnalyzing: string;
}

export const translations: Record<'en' | 'ar', TranslationDict> = {
  en: {
    // Sidebar & Navigation
    dashboard: "Dashboard",
    analyzeTransaction: "Analyze Transaction",
    liveMonitoring: "Live Monitoring",
    transactions: "Transactions",
    customers: "Customers",
    accounts: "Accounts",
    fraudCases: "Fraud Cases",
    reports: "Reports",
    analytics: "Analytics",
    aiInsights: "AI Insights",
    alerts: "Alerts",
    auditLogs: "Audit Logs",
    notifications: "Notifications",
    settings: "Settings",
    helpCenter: "Help Center",
    language: "Language",
    logout: "Logout",
    brandName: "FraudGuard AI",
    saudiDigitalBank: "Alinma Bank",

    // Header & Global
    searchPlaceholder: "Search transaction, customer, IBAN or location...",
    copilotTitle: "AI Risk Copilot",
    copilotSubtitle: "Alinma Bank Security",
    copilotInputPlaceholder: "Ask model to analyze...",
    samaSandbox: "SAMA Central Audit Sandbox",
    activeLink: "Active SAMA Link",
    backToDashboard: "Back to Dashboard",
    success: "Success",
    error: "Error",
    info: "Info",
    loading: "Loading system components...",

    // Executive Dashboard Screen
    goodMorning: "Good Morning, Compliance Team",
    dashboardSubText: "FraudGuard AI is actively protecting 4,200 payment endpoints in Riyadh, Jeddah, and Dammam. Standard AML protocols active.",
    totalVolume: "Total SAMA Vol",
    fraudCasesLabel: "Fraud Cases",
    verifiedSafe: "Verified Safe",
    riskIndex: "Risk Index",
    modelAccuracy: "Analysis Coverage",
    aiDecisions: "AI Decisions",
    fraudPreventionAnalytics: "Fraud Prevention Analytics",
    chartSubText: "Comparing processed volume vs. prevented attacks (Last 24h)",
    threatDistribution: "Threat Distribution",
    aggregateChannelSubText: "Aggregate channel safety analysis",
    verifiedTraffic: "Verified Clean Traffic",
    suspiciousFlagged: "Suspicious / Flagged",
    saudiRegionalAudit: "Saudi Regional Audit",
    regionalSubText: "Kingdom of Saudi Arabia Compliance Hubs",
    streamVerification: "SAMA Stream Verification",
    streamSubText: "Real-time payment streams with AI confidence metrics",
    reviewReport: "Review Report",
    blockCard: "Block Card",
    releaseCard: "Release Card",
    viewDetails: "View Details",

    // Live Monitoring Screen
    liveSubtext: "Real-time multi-dimensional vector banking transaction stream",
    customerName: "Customer Name",
    nationalId: "National ID",
    accountNo: "Account Number",
    iban: "IBAN",
    transactionId: "Transaction ID",
    referenceNo: "Reference Number",
    amount: "Amount",
    currency: "Currency",
    merchant: "Merchant",
    location: "Location",
    country: "Country",
    device: "Device",
    browser: "Browser",
    os: "Operating System",
    ipAddress: "IP Address",
    status: "Status",
    riskScore: "Risk Score",
    fraudProbability: "Fraud Probability",
    investigationStatus: "Investigation Status",
    suspiciousHighlight: "Suspicious Anomaly Spotted",
    realtimeActivity: "Live Payment Logs",
    timeLabel: "Time",

    // Transaction Analysis (Form) Screen
    analysisTitle: "Transaction Analysis",
    analysisSub: "Real-time multi-dimensional vector compliance modeling",
    coreTxData: "Core Transaction Data",
    primaryValueSub: "Primary value & customer ledger routing",
    txValue: "Transaction Value",
    currencyDenom: "Currency Denomination",
    transferChannel: "Transfer Channel",
    bankCustomerId: "Bank Customer ID",
    merchantTerminalTitle: "Merchant & Terminal Metadata",
    merchantTerminalSub: "Payment endpoint routing details",
    mccLabel: "SAMA MCC (Merchant Category Code)",
    clientIpAddress: "Client IP Address",
    deviceFingerprint: "Device Hardware Fingerprint",
    spatialTitle: "Spatial & Geolocation Context",
    spatialSub: "Physical location validation indicators",
    gpsCoordinates: "GPS Coordinates (Lat, Long)",
    citySamaRegion: "City / SAMA Region node",
    proximityValidation: "Validating Regional Proximity metrics...",
    accountAgeLabel: "Account Age",
    historicalBaselineSub: "Historical baseline tenure",
    stabilityRating: "Stability Rating",
    newAccountLabel: "New Node",
    trustedAccountLabel: "1 Year+ (Verified)",
    stabilityEvaluation: "Stability Evaluation",
    samaRiskFlags: "SAMA Risk Flags",
    riskFlagsSub: "Toggle compliance indicators",
    submitAnalysisBtn: "RUN GEMINI ANALYSIS",
    sandboxActiveGateway: "SDB Sandboxed Risk Gateway Active",

    // Customer Profile Screen
    customerProfileTitle: "Customer Profile",
    customerProfileSub: "Multi-dimensional banking profile and risk ledger",
    fullName: "Full Name",
    phoneNo: "Phone Number",
    emailAddress: "Email Address",
    cardsCount: "Active Cards",
    loginHistory: "Security Logins",
    knownLocations: "Known Regional Hotspots",
    devicesUsed: "Authorized Hardware",
    aiRiskSummary: "Gemini Compliance Risk Summary",
    customerHistory: "Transaction Ledger History",

    // Reports Screen
    reportsTitle: "Regulatory Report Center",
    reportsSub: "Generate compliance files under SAMA cyber safety guidelines",
    dailyReport: "Daily Compliance Audit",
    weeklyReport: "Weekly Risk Assessment",
    monthlyReport: "Monthly Suspicious Activity (STR)",
    annualReport: "Annual AML Review",
    fraudReports: "Fraud Pattern Ledger",
    customerReports: "High-Risk Customer Audit",
    executiveReports: "Board-Level Risk Summary",
    exportCsv: "Export CSV Data",
    generateReportBtn: "Compile Digital Statement",

    // Search & Filter
    advancedFilterTitle: "Advanced Query Filter",
    filterByCustomer: "Customer Identifier",
    filterByAmount: "Sovereign Amount Threshold",
    filterByLocation: "Regional City Node",
    filterByRisk: "Calculated Hazard Index",
    filterByDate: "Sovereign Calendar Date",
    filterByStatus: "Approval State",
    filterByAccount: "Account Ledger Number",
    filterByChannel: "Payment Route Method",

    // Accounts & Cases Screen
    accountBalance: "Ledger Balance",
    accountStatus: "Node Status",
    investigating: "Under Investigation",
    resolved: "SAMA Resolved",
    activeStatus: "Approved Active",
    blockedStatus: "Compliance Lockout",

    // Settings Screen
    themeMode: "Aesthetic Theme Mode",
    lightMode: "Enterprise Light",
    darkMode: "Cosmic Dark",
    securityProtocols: "SAMA Crypto Settings",
    apiSettings: "Gemini Integration Keys",
    saveChanges: "Save Configuration",

    // AI Assistant Copilot
    aiGreeting: "Peace be upon you! I am FraudGuard AI Copilot. I help you trace suspicious transactions and ensure SAMA AML compliance.",
    aiAnalyzing: "Copilot is parsing security rules..."
  },
  ar: {
    // Sidebar & Navigation
    dashboard: "لوحة القيادة",
    analyzeTransaction: "تحليل العمليات",
    liveMonitoring: "المراقبة المباشرة",
    transactions: "جميع العمليات",
    customers: "العملاء والمستفيدين",
    accounts: "الحسابات المصرفية",
    fraudCases: "حالات الاحتيال",
    reports: "التقارير الرقابية",
    analytics: "التحليلات والمؤشرات",
    aiInsights: "رؤى الذكاء الاصطناعي",
    alerts: "التنبيهات العاجلة",
    auditLogs: "سجلات التدقيق",
    notifications: "الإشعارات المركزية",
    settings: "الإعدادات العامة",
    helpCenter: "مركز المساعدة والدعم",
    language: "اللغة (Language)",
    logout: "تسجيل الخروج",
    brandName: "FraudGuard AI",
    saudiDigitalBank: "مصرف الإنماء",

    // Header & Global
    searchPlaceholder: "ابحث عن العمليات، العملاء، رقم الآيبان أو الموقع الجغرافي...",
    copilotTitle: "مساعد المخاطر الذكي",
    copilotSubtitle: "أمن مصرف الإنماء",
    copilotInputPlaceholder: "اسأل الذكاء الاصطناعي لتحليل المعاملة...",
    samaSandbox: "البيئة الرقابية التجريبية لمؤسسة النقد (ساما)",
    activeLink: "رابط البنك المركزي نشط",
    backToDashboard: "العودة للرئيسية",
    success: "تم بنجاح",
    error: "خطأ في النظام",
    info: "تنبيه",
    loading: "جاري تحميل مكونات النظام المصرفي...",

    // Executive Dashboard Screen
    goodMorning: "صباح الخير، فريق الامتثال ومكافحة الاحتيال",
    dashboardSubText: "نظام FraudGuard AI يقوم بحماية 4,200 نقطة دفع مصرفية في الرياض، جدة، والدمام بنشاط. بروتوكولات مكافحة غسيل الأموال نشطة.",
    totalVolume: "إجمالي عمليات ساما",
    fraudCasesLabel: "حالات الاحتيال المرصودة",
    verifiedSafe: "العمليات الآمنة المعتمدة",
    riskIndex: "مؤشر المخاطر الإجمالي",
    modelAccuracy: "تغطية التحليل الذكي",
    aiDecisions: "القرارات الذكية التلقائية",
    fraudPreventionAnalytics: "تحليلات الوقاية من الاحتيال المالي",
    chartSubText: "مقارنة حجم العمليات المعالجة مقابل الهجمات المحظورة (آخر 24 ساعة)",
    threatDistribution: "توزيع أنواع التهديدات",
    aggregateChannelSubText: "تحليل سلامة قنوات الدفع والتحويل",
    verifiedTraffic: "العمليات السليمة والموثقة",
    suspiciousFlagged: "العمليات المشبوهة المرصودة",
    saudiRegionalAudit: "التدقيق الجغرافي الإقليمي للمملكة",
    regionalSubText: "مراكز الامتثال والتحقق في مناطق المملكة العربية السعودية",
    streamVerification: "شاشة التحقق المباشر من العمليات (ساما)",
    streamSubText: "مراقبة العمليات المالية الحية مع قياس موثوقية الذكاء الاصطناعي",
    reviewReport: "مراجعة تقرير الامتثال",
    blockCard: "تجميد الحساب والبطاقة",
    releaseCard: "فك حظر الحساب",
    viewDetails: "عرض التفاصيل",

    // Live Monitoring Screen
    liveSubtext: "مراقبة التدفق المباشر للعمليات المالية عبر محاكاة متجهات الأمان المصرفي",
    customerName: "اسم العميل",
    nationalId: "رقم الهوية الوطنية",
    accountNo: "رقم الحساب المصرفي",
    iban: "رقم الآيبان (IBAN)",
    transactionId: "رقم العملية",
    referenceNo: "الرقم المرجعي للعملية",
    amount: "مبلغ العملية",
    currency: "العملة",
    merchant: "التاجر المستفيد",
    location: "موقع نقطة البيع",
    country: "الدولة",
    device: "الجهاز المستخدم",
    browser: "متصفح الإنترنت",
    os: "نظام التشغيل",
    ipAddress: "عنوان البروتوكول (IP)",
    status: "حالة العملية",
    riskScore: "تقييم المخاطر",
    fraudProbability: "احتمالية الاحتيال",
    investigationStatus: "حالة التحقيق والتدقيق",
    suspiciousHighlight: "تم رصد اشتباه مالي عالي الخطورة",
    realtimeActivity: "السجل المصرفي الفوري للعمليات",
    timeLabel: "التوقيت",

    // Transaction Analysis (Form) Screen
    analysisTitle: "تحليل المعاملات الفوري",
    analysisSub: "نمذجة الامتثال والتحقق متعدد المتجهات للعملية المالية",
    coreTxData: "بيانات المعاملة الأساسية",
    primaryValueSub: "إدخال مبالغ العمليات وتوجيه حسابات العملاء",
    txValue: "قيمة العملية المالية",
    currencyDenom: "العملة المعتمدة للتحويل",
    transferChannel: "قناة التحويل والتحصيل",
    bankCustomerId: "رقم معرف العميل المصرفي",
    merchantTerminalTitle: "معلومات التاجر وجهاز النقطة",
    merchantTerminalSub: "تفاصيل توجيه محطة الدفع الرقمية",
    mccLabel: "رمز فئة التاجر المعتمد (ساما MCC)",
    clientIpAddress: "عنوان آي بي العميل",
    deviceFingerprint: "بصمة الجهاز الرقمية",
    spatialTitle: "البيانات الجغرافية والموقع الفعلي",
    spatialSub: "مؤشرات التحقق من الموقع الفعلي والدولة",
    gpsCoordinates: "إحداثيات الموقع (GPS)",
    citySamaRegion: "المدينة / منطقة تدقيق ساما",
    proximityValidation: "جاري فحص المسافة والتقارب الجغرافي...",
    accountAgeLabel: "عمر الحساب المصرفي",
    historicalBaselineSub: "عمر استقرار العميل في البنك",
    stabilityRating: "تصنيف استقرار الحساب",
    newAccountLabel: "حساب حديث العهد",
    trustedAccountLabel: "أكثر من سنة (موثق بالكامل)",
    stabilityEvaluation: "تقييم الاستقرار المصرفي للعميل",
    samaRiskFlags: "علامات الاشتباه المالي المحددة",
    riskFlagsSub: "تفعيل وتحديد مؤشرات عدم الامتثال",
    submitAnalysisBtn: "بدء فحص الامتثال عبر جيميناي AI",
    sandboxActiveGateway: "بوابة فحص الامتثال الافتراضية نشطة",

    // Customer Profile Screen
    customerProfileTitle: "ملف تعريف العميل الشامل",
    customerProfileSub: "السجل المصرفي الموحد وبيانات المخاطر والامتثال للمستفيد",
    fullName: "الاسم الكامل للعميل",
    phoneNo: "رقم الهاتف المسجل",
    emailAddress: "البريد الإلكتروني المعتمد",
    cardsCount: "البطاقات المصرفية النشطة",
    loginHistory: "سجل عمليات تسجيل الدخول الأمنية",
    knownLocations: "المواقع الجغرافية المسجلة والمعتادة",
    devicesUsed: "الأجهزة الذكية المصرحة",
    aiRiskSummary: "ملخص مخاطر الامتثال المولد بالذكاء الاصطناعي (جيميناي)",
    customerHistory: "السجل التاريخي للمعاملات وحركات الحساب",

    // Reports Screen
    reportsTitle: "مركز التقارير الرقابية والامتثال",
    reportsSub: "توليد تقارير الامتثال والاشتباه المالي وفق توجيهات الأمن السيبراني لساما",
    dailyReport: "تقرير الامتثال اليومي",
    weeklyReport: "تقييم المخاطر الأسبوعي",
    monthlyReport: "تقرير العمليات المشبوهة الشهري (STR)",
    annualReport: "المراجعة السنوية الشاملة للامتثال",
    fraudReports: "سجل حركات الاحتيال المالي المقاومة",
    customerReports: "تدقيق العملاء ذوي المخاطر المرتفعة",
    executiveReports: "الملخص التنفيذي لمجلس الإدارة",
    exportCsv: "تصدير كملف CSV خام",
    generateReportBtn: "توليد المستند الرقمي المعتمد",

    // Search & Filter
    advancedFilterTitle: "فلترة متقدمة للعمليات",
    filterByCustomer: "معرف العميل",
    filterByAmount: "الحد الأدنى للمبلغ المطلوب",
    filterByLocation: "المدينة / المنطقة المصرفية",
    filterByRisk: "مستوى الخطورة المطلوب",
    filterByDate: "التاريخ المحدد للعمليات",
    filterByStatus: "حالة الموافقة",
    filterByAccount: "رقم حساب العميل الرئيسي",
    filterByChannel: "قناة الدفع المحددة",

    // Accounts & Cases Screen
    accountBalance: "الرصيد الدفتري الحالي",
    accountStatus: "حالة الحساب الرقمي",
    investigating: "قيد التحقيق والتدقيق المالي",
    resolved: "تمت التسوية مع ساما",
    activeStatus: "معتمد ونشط",
    blockedStatus: "موقوف لعدم الامتثال",

    // Settings Screen
    themeMode: "مظهر واجهة النظام",
    lightMode: "الوضع النهاري المضيء",
    darkMode: "الوضع الليلي المصرفي الداكن",
    securityProtocols: "تشفير بيانات الامتثال لساما",
    apiSettings: "إعدادات مفاتيح جيميناي للذكاء الاصطناعي",
    saveChanges: "حفظ الإعدادات المصرفية",

    // AI Assistant Copilot
    aiGreeting: "السلام عليكم ورحمة الله وبركاته! أنا مساعد الامتثال ومكافحة الاحتيال الذكي بمصرف الإنماء. يمكنني مساعدتك في تحليل المعاملات والتحقق من توافقها مع قوانين ساما ومكافحة غسيل الأموال.",
    aiAnalyzing: "المساعد يقوم بمطابقة متطلبات الامتثال الأمنية لساما..."
  }
};
