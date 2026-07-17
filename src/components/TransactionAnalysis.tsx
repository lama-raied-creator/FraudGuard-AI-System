import React, { useState } from 'react';
import { 
  CreditCard, Store, MapPin, History, AlertTriangle, Cpu, 
  Sparkles, ChevronRight, ChevronLeft, Map, CheckCircle2, AlertCircle, Info, Landmark 
} from 'lucide-react';
import { NewTransactionInput, Screen } from '../types';
import { translations } from '../lib/translations';

interface TransactionAnalysisProps {
  onNavigate: (screen: Screen) => void;
  onSubmitAnalysis: (input: NewTransactionInput) => void;
  lang: 'en' | 'ar';
  prefilledData?: any | null;
  onClearPrefilledData?: () => void;
}

export default function TransactionAnalysis({ 
  onNavigate, 
  onSubmitAnalysis, 
  lang,
  prefilledData,
  onClearPrefilledData
}: TransactionAnalysisProps) {
  const t = translations[lang];
  const isRTL = lang === 'ar';

  const [amount, setAmount] = useState<number | "">("");
  const [currency, setCurrency] = useState(''); // blank by default
  const [txType, setTxType] = useState<string>(''); // blank by default
  const [customerId, setCustomerId] = useState('');
  const [merchantName, setMerchantName] = useState('');
  const [mcc, setMcc] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [coordinates, setCoordinates] = useState('');
  const [city, setCity] = useState('');
  const [accountAge, setAccountAge] = useState<number | "">(""); // blank by default

  // New fields for absolute SAMA compliance
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [country, setCountry] = useState('');
  const [browser, setBrowser] = useState('');
  const [operatingSystem, setOperatingSystem] = useState('');
  const [previousTransactions, setPreviousTransactions] = useState<number | "">("");
  const [averageCustomerSpend, setAverageCustomerSpend] = useState<number | "">("");

  const [riskIndicators, setRiskIndicators] = useState({
    firstTimeMerchant: false,
    highVelocity: false,
    mismatchedGeo: false,
    vpnUse: false,
    unusualSurge: false,
  });

  // Prefill Data Hook
  React.useEffect(() => {
    if (prefilledData) {
      setAmount(prefilledData.amount || "");
      setCurrency(prefilledData.currency || "SAR");
      setTxType(prefilledData.type || "Debit");
      setCustomerId(prefilledData.customerName || "");
      setMerchantName(prefilledData.merchantName || "");
      setMcc(prefilledData.mcc || "");
      setIpAddress(prefilledData.ipAddress || "");
      setDeviceId(prefilledData.deviceId || "");
      setCoordinates(prefilledData.coordinates || "");
      setCity(prefilledData.location || "");
      setAccountAge(prefilledData.accountAge !== undefined ? prefilledData.accountAge : 180);
      
      setDate(prefilledData.date || "");
      setTime(prefilledData.time || "");
      setCountry(prefilledData.country || "");
      setBrowser(prefilledData.browser || "");
      setOperatingSystem(prefilledData.operatingSystem || "");
      setPreviousTransactions(prefilledData.previousTransactions24h !== undefined ? prefilledData.previousTransactions24h : "");
      setAverageCustomerSpend(prefilledData.averageCustomerSpend !== undefined ? prefilledData.averageCustomerSpend : "");
    } else {
      setAmount("");
      setCurrency("");
      setTxType("");
      setCustomerId("");
      setMerchantName("");
      setMcc("");
      setIpAddress("");
      setDeviceId("");
      setCoordinates("");
      setCity("");
      setAccountAge("");
      setDate("");
      setTime("");
      setCountry("");
      setBrowser("");
      setOperatingSystem("");
      setPreviousTransactions("");
      setAverageCustomerSpend("");
    }
  }, [prefilledData]);

  // Automatically determine SAMA Risk Flags in real-time based on transaction data
  React.useEffect(() => {
    // 1. First-time Merchant:
    const trustedMerchants = [
      'jarir', 'noon', 'amazon', 'stc pay', 'mcdonald', 'uber', 'saudi airlines', 
      'snb', 'al rajhi', 'sadaqah', 'panda', 'othaim', 'hungerstation', 'jahez'
    ];
    const merchantLower = (merchantName || '').toLowerCase().trim();
    const isFirstTimeMerchant = merchantLower.length > 0 && !trustedMerchants.some(m => merchantLower.includes(m));

    // 2. Velocity Threshold Triggered: young account (< 60 days) or very high amount (> 4000) or instant remit indicators
    const hasAmount = typeof amount === 'number' && amount > 0;
    const isHighVelocity = merchantLower.length > 0 && (Number(accountAge || 0) < 60 || (hasAmount && amount > 4000) || merchantLower.includes('instant') || merchantLower.includes('crypto') || merchantLower.includes('remit'));

    // 3. VPN / Regional Geodistance mismatch: city outside Saudi Arabia, or coordinates outside Saudi
    const saudiCities = [
      'riyadh', 'jeddah', 'dammam', 'mecca', 'medina', 'khobar', 'saudi', 'ksa',
      'الرياض', 'جدة', 'الدمام', 'مكة', 'المدينة', 'الخبر', 'الجبيل', 'تبوك', 'ابها', 'الطائف', 'بريدة', 'عنيزة', 'السعودية'
    ];
    const cityLower = (city || '').toLowerCase().trim();
    const hasSaudiCity = saudiCities.some(c => cityLower.includes(c));
    const isMismatchedGeo = cityLower.length > 0 && (!hasSaudiCity || cityLower.includes('london') || cityLower.includes('york') || cityLower.includes('dubai') || cityLower.includes('paris'));

    // 4. IP Address associated with Proxy/VPN:
    const proxyPrefixes = ['185.', '45.', '103.', '190.', '223.', '82.', '91.', '194.', '188.'];
    const ipLower = (ipAddress || '').toLowerCase().trim();
    const isVpnUse = ipLower.length > 0 && (proxyPrefixes.some(pref => ipLower.startsWith(pref)) || ipLower.includes('vpn') || ipLower.includes('proxy'));

    // 5. Unusual amount deviation:
    const isUnusualSurge = hasAmount && amount > 3000;

    setRiskIndicators({
      firstTimeMerchant: isFirstTimeMerchant,
      highVelocity: isHighVelocity,
      mismatchedGeo: isMismatchedGeo,
      vpnUse: isVpnUse,
      unusualSurge: isUnusualSurge,
    });
  }, [amount, merchantName, city, ipAddress, accountAge, coordinates, txType]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const toggleRisk = (key: keyof typeof riskIndicators) => {
    setRiskIndicators(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleClearForm = () => {
    setAmount("");
    setCurrency("");
    setTxType("");
    setCustomerId("");
    setMerchantName("");
    setMcc("");
    setIpAddress("");
    setDeviceId("");
    setCoordinates("");
    setCity("");
    setAccountAge("");
    setDate("");
    setTime("");
    setCountry("");
    setBrowser("");
    setOperatingSystem("");
    setPreviousTransactions("");
    setAverageCustomerSpend("");
    setValidationError(null);
    if (onClearPrefilledData) {
      onClearPrefilledData();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Strict Validation before submission - Do not send empty data to Gemini!
    if (!amount || Number(amount) <= 0) {
      setValidationError(isRTL ? "يرجى إدخال مبلغ معاملة صحيح أكبر من الصفر." : "Please enter a valid transaction amount greater than 0.");
      return;
    }
    if (!currency) {
      setValidationError(isRTL ? "يرجى تحديد العملة." : "Please select currency.");
      return;
    }
    if (!txType) {
      setValidationError(isRTL ? "يرجى تحديد نوع المعاملة المصرفية." : "Please select transaction type.");
      return;
    }
    if (!customerId.trim()) {
      setValidationError(isRTL ? "يرجى إدخال اسم أو معرف العميل." : "Please enter customer information.");
      return;
    }
    if (!merchantName.trim()) {
      setValidationError(isRTL ? "يرجى إدخال اسم المتجر." : "Please enter merchant name.");
      return;
    }
    if (!ipAddress.trim()) {
      setValidationError(isRTL ? "يرجى إدخال عنوان الـ IP للعملية." : "Please enter transaction IP address.");
      return;
    }
    if (!city.trim()) {
      setValidationError(isRTL ? "يرجى إدخال مدينة المعاملة." : "Please enter transaction city.");
      return;
    }

    setIsSubmitting(true);
    
    onSubmitAnalysis({
      amount: Number(amount),
      currency,
      type: txType as 'Debit' | 'Credit' | 'Transfer',
      customerId,
      merchantName,
      mcc,
      ipAddress,
      deviceId,
      coordinates,
      city,
      accountAge: accountAge === "" ? 180 : Number(accountAge),
      riskIndicators,
      // Pass other fields to backend
      date,
      time,
      country,
      browser,
      operatingSystem,
      previousTransactions: previousTransactions === "" ? 0 : Number(previousTransactions),
      averageCustomerSpend: averageCustomerSpend === "" ? 0 : Number(averageCustomerSpend)
    } as any);
  };

  return (
    <div className={`space-y-8 animate-fade-in pb-12 text-gray-800 dark:text-gray-100 ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* Breadcrumbs SAMA Meta Navigation */}
      <div className={`flex flex-wrap items-center justify-between gap-4 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 font-black ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('dashboard');
            }}
            className="hover:text-[#006A4E] dark:hover:text-[#D4AF37] transition-colors decoration-none"
          >
            {t.dashboard}
          </a>
          {isRTL ? <ChevronLeft className="w-3.5 h-3.5 text-gray-300 dark:text-gray-700" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-300 dark:text-gray-700" />}
          <span className="text-gray-400 dark:text-gray-500">{isRTL ? 'مركز التحقق من الامتثال' : 'Compliance Hub'}</span>
          {isRTL ? <ChevronLeft className="w-3.5 h-3.5 text-gray-300 dark:text-gray-700" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-300 dark:text-gray-700" />}
          <span className="text-[#001939] dark:text-white font-extrabold">
            {isRTL ? 'تحليل متجهات العمليات المصرفية' : 'Transaction Vector Analysis'}
          </span>
        </div>

        {/* Audit Sandbox Active Status */}
        <div className={`flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-[10px] font-black uppercase tracking-wider text-[#006A4E] dark:text-emerald-400 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
          <Landmark className="w-3.5 h-3.5" />
          <span>{t.sandboxActiveGateway}</span>
        </div>
      </div>

      {/* Title Block */}
      <div className={`flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-5 ${isRTL ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}>
        <div>
          <h1 className="text-xl md:text-2xl font-black text-[#001939] dark:text-white tracking-tight uppercase">
            {isRTL ? 'إجراء تحليل مالي يدوي للعمليات' : 'MANUAL TRANSACTION COMPLIANCE AUDIT'}
          </h1>
          <p className="text-[11px] text-gray-400 dark:text-gray-500 font-semibold mt-1">
            {isRTL 
              ? 'أدخل متغيرات المعاملة المالية يدوياً لمحاكاتها مع قواعد الامتثال وفحصها فورياً بالذكاء الاصطناعي.' 
              : 'Manually feed transaction variables to simulate them against SAMA rules & run real-time AI security audits.'}
          </p>
        </div>
        <button
          type="button"
          onClick={handleClearForm}
          className="px-4 py-2.5 rounded-xl border border-dashed border-[#D4AF37]/40 hover:border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/5 text-xs font-black transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
        >
          {isRTL ? 'مسح المدخلات بالكامل' : 'RESET / CLEAR FORM'}
        </button>
      </div>

      {/* Grid of Form parameters */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Form: Parameters Forms */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Section 1: Core Transaction details */}
          <div className="bg-white dark:bg-[#070e17] rounded-3xl p-8 border border-gray-100 dark:border-gray-800/60 shadow-sm transition-colors">
            <div className={`flex items-center gap-3 mb-6 ${isRTL ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}>
              <div className="p-2.5 bg-[#006A4E]/10 dark:bg-emerald-950/40 text-[#006A4E] dark:text-emerald-400 rounded-xl">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#001939] dark:text-white">{t.coreTxData}</h3>
                <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{t.primaryValueSub}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Transaction Amount */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest block">{t.txValue}</label>
                <div className="relative">
                  <span className={`absolute top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 font-extrabold ${isRTL ? 'left-4' : 'left-4'}`}>SAR</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full pl-14 pr-4 py-3 rounded-xl border border-gray-100 dark:border-gray-800 focus:ring-2 focus:ring-[#006A4E] dark:focus:ring-emerald-500 focus:border-transparent outline-none transition-all font-extrabold text-[#001939] dark:text-white bg-gray-50 dark:bg-[#0b1524]"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              {/* Currency type */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest block">{t.currencyDenom}</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-100 dark:border-gray-800 focus:ring-2 focus:ring-[#006A4E] dark:focus:ring-emerald-500 focus:border-transparent bg-gray-50 dark:bg-[#0b1524] outline-none transition-all font-bold text-[#001939] dark:text-white cursor-pointer"
                  required
                >
                  <option value="">{isRTL ? '-- اختر العملة --' : '-- Select Currency --'}</option>
                  <option value="SAR">SAR - Saudi Riyal</option>
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                </select>
              </div>

              {/* Transaction channel Type */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest block">{t.transferChannel}</label>
                <div className="flex gap-2 bg-gray-100 dark:bg-[#0b1524] p-1.5 rounded-xl border border-gray-50 dark:border-gray-800/80">
                  {(['Debit', 'Credit', 'Transfer'] as const).map((type) => {
                    const isSelected = txType === type;
                    const translatedType = isRTL 
                      ? (type === 'Debit' ? 'خصم بطاقة' : type === 'Credit' ? 'ائتمان' : 'حوالة بنكية')
                      : type;
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setTxType(type)}
                        className={`flex-1 py-2 text-[10px] font-black rounded-lg transition-all border-none cursor-pointer ${
                          isSelected
                            ? 'bg-[#006A4E] text-white shadow-sm'
                            : 'text-gray-500 hover:text-gray-800 dark:hover:text-white bg-transparent'
                        }`}
                      >
                        {translatedType}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Customer ID ledger identifier */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest block">{t.bankCustomerId}</label>
                <input
                  type="text"
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-100 dark:border-gray-800 focus:ring-2 focus:ring-[#006A4E] dark:focus:ring-emerald-500 focus:border-transparent outline-none transition-all font-bold text-[#001939] dark:text-white bg-gray-50 dark:bg-[#0b1524]"
                  placeholder="e.g. Faisal Almutairi"
                  required
                />
              </div>

              {/* Transaction Date */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest block">{isRTL ? 'تاريخ المعاملة' : 'Transaction Date'}</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-100 dark:border-gray-800 focus:ring-2 focus:ring-[#006A4E] dark:focus:ring-emerald-500 focus:border-transparent outline-none transition-all font-bold text-[#001939] dark:text-white bg-gray-50 dark:bg-[#0b1524]"
                  required
                />
              </div>

              {/* Transaction Time */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest block">{isRTL ? 'وقت المعاملة' : 'Transaction Time'}</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-100 dark:border-gray-800 focus:ring-2 focus:ring-[#006A4E] dark:focus:ring-emerald-500 focus:border-transparent outline-none transition-all font-bold text-[#001939] dark:text-white bg-gray-50 dark:bg-[#0b1524]"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 2: Merchant & Network verification */}
          <div className="bg-white dark:bg-[#070e17] rounded-3xl p-8 border border-gray-100 dark:border-gray-800/60 shadow-sm transition-colors">
            <div className={`flex items-center gap-3 mb-6 ${isRTL ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}>
              <div className="p-2.5 bg-[#D4AF37]/15 text-[#D4AF37] rounded-xl">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#001939] dark:text-white">{t.merchantTerminalTitle}</h3>
                <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{t.merchantTerminalSub}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Merchant Name */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest block">{t.merchant}</label>
                <input
                  type="text"
                  value={merchantName}
                  onChange={(e) => setMerchantName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-100 dark:border-gray-800 focus:ring-2 focus:ring-[#006A4E] dark:focus:ring-emerald-500 focus:border-transparent outline-none transition-all font-bold text-[#001939] dark:text-white bg-gray-50 dark:bg-[#0b1524]"
                  placeholder="Global Retail Inc."
                  required
                />
              </div>

              {/* Merchant Category Code */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest block">{t.mccLabel}</label>
                <input
                  type="text"
                  value={mcc}
                  onChange={(e) => setMcc(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-100 dark:border-gray-800 focus:ring-2 focus:ring-[#006A4E] dark:focus:ring-emerald-500 focus:border-transparent outline-none transition-all font-bold text-[#001939] dark:text-white bg-gray-50 dark:bg-[#0b1524]"
                  placeholder="e.g. 5732"
                  required
                />
              </div>

              {/* IP Address */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest block">{t.ipAddress}</label>
                <input
                  type="text"
                  value={ipAddress}
                  onChange={(e) => setIpAddress(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-100 dark:border-gray-800 focus:ring-2 focus:ring-[#006A4E] dark:focus:ring-emerald-500 focus:border-transparent outline-none transition-all font-bold text-[#001939] dark:text-white bg-gray-50 dark:bg-[#0b1524]"
                  placeholder="192.168.1.1"
                  required
                />
              </div>

              {/* Device ID / fingerprint */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest block">{t.deviceFingerprint}</label>
                <input
                  type="text"
                  value={deviceId}
                  onChange={(e) => setDeviceId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-100 dark:border-gray-800 focus:ring-2 focus:ring-[#006A4E] dark:focus:ring-emerald-500 focus:border-transparent outline-none transition-all font-bold text-[#001939] dark:text-white bg-gray-50 dark:bg-[#0b1524]"
                  placeholder="df882-xa11-0092"
                  required
                />
              </div>

              {/* Browser */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest block">{isRTL ? 'المتصفح المستخدم' : 'Web Browser'}</label>
                <input
                  type="text"
                  value={browser}
                  onChange={(e) => setBrowser(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-100 dark:border-gray-800 focus:ring-2 focus:ring-[#006A4E] dark:focus:ring-emerald-500 focus:border-transparent outline-none transition-all font-bold text-[#001939] dark:text-white bg-gray-50 dark:bg-[#0b1524]"
                  placeholder="e.g. Chrome, Safari, Firefox"
                  required
                />
              </div>

              {/* Operating System */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest block">{isRTL ? 'نظام التشغيل للعميل' : 'Client Operating System'}</label>
                <input
                  type="text"
                  value={operatingSystem}
                  onChange={(e) => setOperatingSystem(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-100 dark:border-gray-800 focus:ring-2 focus:ring-[#006A4E] dark:focus:ring-emerald-500 focus:border-transparent outline-none transition-all font-bold text-[#001939] dark:text-white bg-gray-50 dark:bg-[#0b1524]"
                  placeholder="e.g. iOS, Android, Windows"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 3: Geolocation map context */}
          <div className="bg-white dark:bg-[#070e17] rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800/60 shadow-sm transition-colors">
            <div className="p-8">
              <div className={`flex items-center gap-3 mb-6 ${isRTL ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}>
                <div className="p-2.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#001939] dark:text-white">{t.spatialTitle}</h3>
                  <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{t.spatialSub}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest block">{t.gpsCoordinates}</label>
                  <input
                    type="text"
                    value={coordinates}
                    onChange={(e) => setCoordinates(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-100 dark:border-gray-800 focus:ring-2 focus:ring-[#006A4E] dark:focus:ring-emerald-500 focus:border-transparent outline-none transition-all font-bold text-[#001939] dark:text-white bg-gray-50 dark:bg-[#0b1524]"
                    placeholder="24.7136, 46.6753"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest block">{t.citySamaRegion}</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-100 dark:border-gray-800 focus:ring-2 focus:ring-[#006A4E] dark:focus:ring-emerald-500 focus:border-transparent outline-none transition-all font-bold text-[#001939] dark:text-white bg-gray-50 dark:bg-[#0b1524]"
                    placeholder="Riyadh"
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest block">{isRTL ? 'الدولة' : 'Country'}</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-100 dark:border-gray-800 focus:ring-2 focus:ring-[#006A4E] dark:focus:ring-emerald-500 focus:border-transparent outline-none transition-all font-bold text-[#001939] dark:text-white bg-gray-50 dark:bg-[#0b1524]"
                    placeholder="e.g. Saudi Arabia"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Map Placement Graphic */}
            <div className="h-64 bg-[#f0f3ff] dark:bg-[#030712] relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 opacity-15">
                <Map className="w-full h-full scale-110 text-[#006A4E] dark:text-[#D4AF37]" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#070e17] via-transparent to-transparent" />
              <div className={`relative z-10 bg-white/95 dark:bg-[#0b1524]/95 backdrop-blur-md px-6 py-3 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800/60 flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-ping" />
                <span className="text-xs font-bold text-[#001939] dark:text-white">{t.proximityValidation}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: checks indicators & action submit */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Account baseline age */}
          <div className="bg-white dark:bg-[#070e17] rounded-3xl p-8 border border-gray-100 dark:border-gray-800/60 shadow-sm transition-colors">
            <div className={`flex items-center gap-3 mb-6 ${isRTL ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}>
              <div className="p-2.5 bg-[#006A4E]/10 dark:bg-emerald-950/40 text-[#006A4E] dark:text-emerald-400 rounded-xl">
                <History className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#001939] dark:text-white">{t.accountAgeLabel}</h3>
                <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{t.historicalBaselineSub}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest block">{t.accountAgeLabel} ({accountAge} {isRTL ? 'يوم' : 'Days'})</label>
                <input
                  type="range"
                  min="1"
                  max="365"
                  value={accountAge}
                  onChange={(e) => setAccountAge(Number(e.target.value))}
                  className="w-full accent-[#D4AF37] h-2 bg-gray-100 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer"
                />
                <div className={`flex justify-between text-[10px] font-bold text-gray-400 dark:text-gray-500 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                  <span>{t.newAccountLabel}</span>
                  <span>{t.trustedAccountLabel}</span>
                </div>
              </div>

              {/* Behavioral Metrics Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Previous Transactions (24h) */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest block">
                    {isRTL ? 'العمليات السابقة (٢٤ ساعة)' : 'Prev Txns (24h)'}
                  </label>
                  <input
                    type="number"
                    value={previousTransactions}
                    onChange={(e) => setPreviousTransactions(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-100 dark:border-gray-800/80 focus:ring-2 focus:ring-[#006A4E] dark:focus:ring-emerald-500 focus:border-transparent outline-none transition-all font-bold text-[#001939] dark:text-white bg-gray-50 dark:bg-[#0b1524]"
                    placeholder="e.g. 3"
                    required
                  />
                </div>

                {/* Average Customer Spend */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest block">
                    {isRTL ? 'متوسط الإنفاق (ر.س)' : 'Avg Spend (SAR)'}
                  </label>
                  <input
                    type="number"
                    value={averageCustomerSpend}
                    onChange={(e) => setAverageCustomerSpend(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-100 dark:border-gray-800/80 focus:ring-2 focus:ring-[#006A4E] dark:focus:ring-emerald-500 focus:border-transparent outline-none transition-all font-bold text-[#001939] dark:text-white bg-gray-50 dark:bg-[#0b1524]"
                    placeholder="e.g. 1500"
                    required
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#0b1524] border border-gray-100 dark:border-gray-800/60">
                <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">{t.stabilityRating}</p>
                <p className="text-xs font-bold text-[#001939] dark:text-white">
                  {accountAge < 30 
                    ? (isRTL ? 'حساب غير موثق عالي السرعة' : 'High-Velocity Unverified account') 
                    : accountAge < 90 
                    ? (isRTL ? 'عقدة حساب مصرفي متوسط' : 'Intermediate Node') 
                    : (isRTL ? 'حساب معتمد وموثوق بالكامل' : 'SDB Trusted Ledger Account')}
                </p>
                <div className="mt-2 h-1.5 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#D4AF37] transition-all duration-300"
                    style={{ width: `${Math.min(100, (accountAge / 365) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SAMA Risk Flags Checkbox selectors - Updated to use automatic simple text list only */}
          <div className="bg-white dark:bg-[#070e17] rounded-3xl p-8 border border-gray-100 dark:border-gray-800/60 shadow-sm transition-colors">
            <div className={`flex items-center gap-3 mb-6 ${isRTL ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}>
              <div className="p-2.5 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 rounded-xl">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-[#001939] dark:text-white uppercase tracking-wider">
                    {isRTL ? 'مؤشرات الخطورة المكتشفة' : 'Detected Risk Indicators'}
                  </h3>
                  <p className="text-[10px] text-gray-400 font-semibold mt-0.5">
                    {isRTL ? 'يتم رصد المؤشرات بشكل تلقائي بناءً على معطيات المعاملة' : 'Indicators are automatically detected based on transaction variables'}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[9px] font-black text-emerald-600 dark:text-emerald-400 select-none">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  <span>{isRTL ? 'مؤتمت بالكامل' : 'AUTOMATED'}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {(() => {
                const detectedList: Array<{ title: string; desc: string }> = [];
                const parsedAmount = Number(amount) || 0;
                const parsedAverageSpend = Number(averageCustomerSpend) || 0;
                const parsedAccountAge = Number(accountAge) || 0;

                // 1. Unusually high transaction amount
                if (parsedAmount > 10000) {
                  detectedList.push({
                    title: isRTL ? 'مبلغ عملية مرتفع بشكل غير معتاد' : 'Unusually high transaction amount',
                    desc: isRTL 
                      ? `مبلغ العملية البالغ ${parsedAmount.toLocaleString()} ر.س يتجاوز الحد المعتاد لبطاقات التجزئة.` 
                      : `The transaction amount of ${parsedAmount.toLocaleString()} SAR exceeds standard consumer baseline thresholds.`
                  });
                }

                // 2. New device
                const devLower = (deviceId || '').toLowerCase();
                if (devLower.length > 0 && (devLower.includes('new') || devLower.includes('unknown') || devLower.includes('unrecognized') || devLower.includes('emulator') || devLower.includes('fingerprint'))) {
                  detectedList.push({
                    title: isRTL ? 'جهاز جديد غير مسجل' : 'New device',
                    desc: isRTL 
                      ? `بصمة جهاز العميل "${deviceId}" لم يسبق تسجيلها في المحفظة الأمنية.` 
                      : `Device ID "${deviceId}" is not recognized in customer history logs.`
                  });
                }

                // 3. Different IP address
                const ipLower = (ipAddress || '').toLowerCase();
                const proxyPrefixes = ['185.', '45.', '103.', '190.', '223.', '82.', '91.', '194.', '188.'];
                if (ipLower.length > 0 && (proxyPrefixes.some(pref => ipLower.startsWith(pref)) || ipLower.includes('vpn') || ipLower.includes('proxy'))) {
                  detectedList.push({
                    title: isRTL ? 'عنوان IP مختلف ومشبوه' : 'Different IP address',
                    desc: isRTL 
                      ? `اتصال الشبكة عبر عنوان الـ IP (${ipAddress}) مصنف كشبكة بروكسي أو VPN.` 
                      : `Network route detected from VPN/Proxy node range (${ipAddress}).`
                  });
                }

                // 4. Unusual location
                const cityLower = (city || '').toLowerCase();
                const saudiCities = [
                  'riyadh', 'jeddah', 'dammam', 'mecca', 'medina', 'khobar', 'saudi', 'ksa',
                  'الرياض', 'جدة', 'الدمام', 'مكة', 'المدينة', 'الخبر', 'السعودية'
                ];
                const hasSaudiCity = saudiCities.some(c => cityLower.includes(c));
                if (cityLower.length > 0 && (!hasSaudiCity || cityLower.includes('london') || cityLower.includes('york') || cityLower.includes('dubai') || cityLower.includes('paris') || cityLower.includes('unknown'))) {
                  detectedList.push({
                    title: isRTL ? 'موقع جغرافي غير معتاد' : 'Unusual location',
                    desc: isRTL 
                      ? `الموقع الجغرافي للعملية "${city}" يمثل انحرافاً حرجاً عن النطاق المحلي المعتاد للعميل.` 
                      : `The geo-location "${city}" represents an anomalous path deviation outside expected boundaries.`
                  });
                }

                // 5. Unusual transaction time
                const timeHour = time ? parseInt(time.split(':')[0]) : -1;
                if (timeHour >= 0 && (timeHour >= 23 || timeHour <= 4)) {
                  detectedList.push({
                    title: isRTL ? 'توقيت عملية غير معتاد' : 'Unusual transaction time',
                    desc: isRTL 
                      ? `العملية تمت في الوقت (${time}) وهو توقيت غير اعتيادي لمثل هذا السلوك المالي للعميل.` 
                      : `The transaction request at ${time} falls in the late night velocity risk window.`
                  });
                }

                // 6. Spending significantly above customer average
                if (parsedAmount > 0 && parsedAverageSpend > 0 && parsedAmount > parsedAverageSpend * 1.5) {
                  detectedList.push({
                    title: isRTL ? 'الإنفاق أعلى بكثير من متوسط العميل' : 'Spending significantly above customer average',
                    desc: isRTL 
                      ? `قيمة العملية (${parsedAmount.toLocaleString()} ر.س) تتجاوز بشكل حرج متوسط إنفاق العميل التاريخي (${parsedAverageSpend.toLocaleString()} ر.س).` 
                      : `This amount of ${parsedAmount.toLocaleString()} SAR exceeds their historical average of ${parsedAverageSpend.toLocaleString()} SAR by ${Math.round((parsedAmount / parsedAverageSpend) * 100)}%.`
                  });
                }

                if (detectedList.length === 0) {
                  return (
                    <div className="p-6 text-center bg-gray-50 dark:bg-[#0b1524]/40 rounded-2xl border border-dashed border-gray-100 dark:border-gray-800">
                      <p className="text-xs font-bold text-gray-400 dark:text-gray-500">
                        {isRTL ? 'لم يتم رصد أي مؤشرات خطورة تلقائية.' : 'No risk indicators detected.'}
                      </p>
                    </div>
                  );
                }

                return detectedList.map((indicator, idx) => (
                  <div
                    key={idx}
                    className={`w-full flex flex-col p-3.5 rounded-2xl border transition-all ${
                      isRTL ? 'text-right' : 'text-left'
                    } border-red-500/20 bg-red-500/5 text-red-600 dark:text-red-400`}
                  >
                    <div className={`flex items-center gap-1.5 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0" />
                      <span className="text-xs font-black">{indicator.title}</span>
                    </div>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold mt-1 leading-relaxed pl-3 pr-3">
                      {indicator.desc}
                    </p>
                  </div>
                ));
              })()}
            </div>
          </div>

           {/* Submit compliance modeling action card */}
          <div className="bg-[#f9f9ff] dark:bg-[#0b1524] border-2 border-dashed border-[#D4AF37]/30 rounded-3xl p-6 text-center space-y-4">
            <p className="text-[10.5px] text-gray-500 dark:text-gray-400 font-semibold italic leading-relaxed">
              {isRTL 
                ? 'عند إرسال طلب التحليل، سيقوم نظام الذكاء الاصطناعي (Gemini AI) بفحص المتغيرات ومطابقتها بلوائح ساما وإخراج تقرير تدقيق ثنائي اللغة.' 
                : 'Upon request submission, ComplianceGuard AI will parse active variables via the Gemini model to output a dual-language audit report.'}
            </p>

            {validationError && (
              <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 text-center flex items-center justify-center gap-1.5 animate-pulse">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 bg-[#D4AF37] hover:bg-[#C5A059] disabled:opacity-75 disabled:cursor-not-allowed text-[#001025] font-black text-sm rounded-2xl shadow-lg shadow-[#D4AF37]/15 transition-all active:scale-95 flex items-center justify-center gap-2 border-none cursor-pointer`}
            >
              <Cpu className={`w-4 h-4 ${isSubmitting ? 'animate-spin' : ''}`} />
              <span>{isSubmitting ? t.aiAnalyzing : t.submitAnalysisBtn}</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className="w-full py-2 bg-transparent border-none text-xs text-gray-400 hover:text-gray-600 dark:hover:text-white font-bold transition-colors cursor-pointer"
            >
              {isRTL ? 'إلغاء والعودة للرئيسية' : 'Cancel & Return'}
            </button>
          </div>

        </div>

      </form>
    </div>
  );
}
