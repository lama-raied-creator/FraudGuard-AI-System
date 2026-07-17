import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, Lock, User, Briefcase, Eye, EyeOff, 
  Globe, Sparkles, Building, ArrowRight, ArrowLeft, 
  ShieldAlert, RefreshCw, Smartphone, Key, Fingerprint
} from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (role: 'employee' | 'customer', username: string) => void;
  lang: 'en' | 'ar';
  setLang: (l: 'en' | 'ar') => void;
  darkMode: boolean;
}

export default function Login({ onLoginSuccess, lang, setLang, darkMode }: LoginProps) {
  const [role, setRole] = useState<'employee' | 'customer'>('employee');
  const [employeeId, setEmployeeId] = useState('EMP-7092');
  const [nationalId, setNationalId] = useState('1092834123');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  const isRTL = lang === 'ar';

  const t = {
    en: {
      bankName: "Alinma Bank",
      systemName: "FraudGuard AI",
      subtitle: "AI-Powered Fraud Detection & Monitoring Platform",
      employeeRole: "Bank Employee Portal",
      employeeDesc: "Secure access for SAMA compliance audit, monitoring, and fraud response.",
      customerRole: "Client / Customer Hub",
      customerDesc: "National ID verification, card override justifications, and self-reports.",
      employeeIdLabel: "Employee ID / Security ID",
      employeeIdPlaceholder: "e.g., EMP-XXXX",
      nationalIdLabel: "National ID / Iqama / Username",
      nationalIdPlaceholder: "e.g., 10XXXXXXXX",
      passwordLabel: "Secure Password",
      passwordPlaceholder: "Enter your secure password",
      rememberMe: "Remember me on this terminal",
      forgotPassword: "Forgot credentials?",
      secureLogin: "SECURE IDENTITY LOGIN",
      sslSecure: "SSL 256-bit Secure Encrypted Connection",
      samaCompliant: "SAMA Cybersecurity Compliant",
      lastLoginDemo: "Demo Last Session: July 09, 2026 14:12 AST from IP 185.33.22.10",
      authenticating: "Authenticating Security Credentials...",
      verifyingDevice: "Validating Device Fingerprint & IP Security...",
      establishingSama: "Establishing Secure SAMA Sandbox Link...",
      accessGranted: "Access Granted. Initializing Dashboard...",
      loginError: "Please fill out the credentials",
      needDemo: "Demo Mode: Click Secure Login to enter instantly"
    },
    ar: {
      bankName: "مصرف الإنماء",
      systemName: "نظام FraudGuard AI",
      subtitle: "المنصة الذكية لمكافحة الاحتيال والرقابة والامتثال المصرفي",
      employeeRole: "بوابة منسوبي المصرف",
      employeeDesc: "دخول آمن لمسؤولي الامتثال، المراقبة الفورية، وتدقيق التوجيهات الأمنية لساما.",
      customerRole: "بوابة العملاء والمستفيدين",
      customerDesc: "المصادقة الوطنية، تبريرات تجميد البطاقات، وتقديم بلاغات الاحتيال الذاتية.",
      employeeIdLabel: "الرقم الوظيفي / معرّف الأمان",
      employeeIdPlaceholder: "مثال: EMP-XXXX",
      nationalIdLabel: "الهوية الوطنية / الإقامة / اسم المستخدم",
      nationalIdPlaceholder: "مثال: ١٠xxxxxxxx",
      passwordLabel: "كلمة المرور المشفرة",
      passwordPlaceholder: "أدخل كلمة المرور الخاصة بك",
      rememberMe: "تذكر هويتي على هذا الجهاز",
      forgotPassword: "نسيت تفاصيل الدخول؟",
      secureLogin: "دخول آمن موثّق",
      sslSecure: "اتصال مشفر وآمن بمعيار SSL 256-bit",
      samaCompliant: "متوافق مع الهيئة الوطنية للأمن السيبراني وساما",
      lastLoginDemo: "آخر دخول تجريبي: ٠٩ يوليو ٢٠٢٦ ١٤:١٢ بتوقيت الرياض من آي بي 185.33.22.10",
      authenticating: "جاري مطابقة الهوية والرموز الأمنية...",
      verifyingDevice: "التحقق من بصمة الجهاز وموثوقية الاتصال الجغرافي...",
      establishingSama: "جاري ربط بيئة تدقيق البنك المركزي (ساما)...",
      accessGranted: "تمت المصادقة بنجاح. جاري فتح النظام لوحة القيادة...",
      loginError: "يرجى تعبئة الحقول المطلوبة",
      needDemo: "نسخة تجريبية: انقر فوق تسجيل الدخول الآمن للبدء فورا"
    }
  }[lang];

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoadingStep(1);

    // Simulated high fidelity sequential verification
    setTimeout(() => {
      setLoadingStep(2);
    }, 1200);

    setTimeout(() => {
      setLoadingStep(3);
    }, 2400);

    setTimeout(() => {
      setLoadingStep(4);
    }, 3600);

    setTimeout(() => {
      const username = role === 'employee' ? employeeId : nationalId;
      onLoginSuccess(role, username);
    }, 4500);
  };

  return (
    <div className={`min-h-screen w-full flex flex-col justify-between overflow-x-hidden relative transition-colors duration-150 ${
      darkMode ? 'bg-[#030712] text-gray-100' : 'bg-[#f4f6fa] text-gray-800'
    }`}>
      
      {/* Background Ornaments */}
      <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-[#001530]/20 via-transparent to-transparent pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#D4AF37]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -left-40 w-96 h-96 rounded-full bg-[#006A4E]/5 blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <header className="max-w-7xl mx-auto w-full px-6 py-4 flex justify-between items-center z-10">
        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {/* Logo Placeholder */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#001530] to-[#006A4E] border border-[#D4AF37]/30 flex items-center justify-center shadow-md">
            <Building className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <span className="font-black text-base tracking-tight block text-[#001530] dark:text-white">
              {t.bankName}
            </span>
            <span className="text-[10px] text-[#D4AF37] uppercase font-bold tracking-widest block">
              {t.systemName}
            </span>
          </div>
        </div>

        {/* Header Right */}
        <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {/* Language Switcher */}
          <button
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 text-xs font-black bg-white dark:bg-[#070e17] text-gray-600 dark:text-gray-300 transition-all cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
          </button>
        </div>
      </header>

      {/* Main Content Card Container */}
      <main className="max-w-6xl mx-auto w-full px-6 py-12 flex-1 flex items-center justify-center z-10">
        <AnimatePresence mode="wait">
          {!isSubmitting ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              
              {/* Left Column: System Value Proposition & SAMA Badge */}
              <div className={`lg:col-span-5 space-y-6 ${isRTL ? 'lg:text-right text-center order-2 lg:order-1' : 'lg:text-left text-center order-2'}`}>
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 text-xs font-bold ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  <span>{t.samaCompliant}</span>
                </div>

                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#001530] dark:text-white leading-tight">
                  {t.bankName} <span className="text-[#D4AF37] block mt-1">{t.systemName}</span>
                </h1>

                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                  {t.subtitle}
                </p>

                {/* Grid of highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <div className={`p-4 bg-white dark:bg-[#070e17] rounded-2xl border border-gray-100 dark:border-gray-800/80 shadow-sm flex gap-3 items-start ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}>
                    <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-extrabold text-xs block text-gray-800 dark:text-white">
                        SAMA Rule 4.2
                      </span>
                      <span className="text-[10px] text-gray-400 block mt-0.5">
                        Central Compliance Active
                      </span>
                    </div>
                  </div>

                  <div className={`p-4 bg-white dark:bg-[#070e17] rounded-2xl border border-gray-100 dark:border-gray-800/80 shadow-sm flex gap-3 items-start ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}>
                    <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 shrink-0">
                      <Fingerprint className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-extrabold text-xs block text-gray-800 dark:text-white">
                        Gemini Pro Guard
                      </span>
                      <span className="text-[10px] text-gray-400 block mt-0.5">
                        Deep Pattern Verification
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-gray-400 dark:text-gray-500 font-semibold italic bg-gray-50 dark:bg-[#070e17] p-3 rounded-xl border border-gray-100 dark:border-gray-800/40">
                  {t.lastLoginDemo}
                </div>
              </div>

              {/* Right Column: High Fidelity Login Card */}
              <div className="lg:col-span-7 flex justify-center order-1 lg:order-2">
                <div className="w-full max-w-lg bg-white/75 dark:bg-[#070e17]/85 backdrop-blur-xl border border-white/40 dark:border-gray-800/80 rounded-[32px] p-8 md:p-10 shadow-2xl relative">
                  
                  {/* Decorative Glowing Accent */}
                  <div className="absolute top-0 right-1/4 left-1/4 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

                  {/* Role Selector Tabs */}
                  <div className="grid grid-cols-2 gap-3 bg-gray-100 dark:bg-[#0b1524] p-1.5 rounded-2xl mb-8">
                    <button
                      type="button"
                      onClick={() => setRole('employee')}
                      className={`flex flex-col md:flex-row items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all cursor-pointer border-none ${
                        role === 'employee'
                          ? 'bg-[#001530] text-white dark:bg-[#0b1524] dark:text-[#D4AF37] dark:border dark:border-[#D4AF37]/30 shadow-md font-bold'
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 bg-transparent font-semibold'
                      }`}
                    >
                      <Briefcase className="w-4 h-4 shrink-0" />
                      <span className="text-xs uppercase tracking-wider">{lang === 'ar' ? 'منسوبي المصرف' : 'Bank Employee'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole('customer')}
                      className={`flex flex-col md:flex-row items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all cursor-pointer border-none ${
                        role === 'customer'
                          ? 'bg-[#001530] text-white dark:bg-[#0b1524] dark:text-[#D4AF37] dark:border dark:border-[#D4AF37]/30 shadow-md font-bold'
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 bg-transparent font-semibold'
                      }`}
                    >
                      <User className="w-4 h-4 shrink-0" />
                      <span className="text-xs uppercase tracking-wider">{lang === 'ar' ? 'عميل المصرف' : 'Customer'}</span>
                    </button>
                  </div>

                  {/* Intro description depending on role selection */}
                  <div className={`mb-6 text-center lg:text-left ${isRTL ? 'lg:text-right' : ''}`}>
                    <h3 className="text-md font-extrabold text-[#001530] dark:text-white">
                      {role === 'employee' ? t.employeeRole : t.customerRole}
                    </h3>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 leading-relaxed">
                      {role === 'employee' ? t.employeeDesc : t.customerDesc}
                    </p>
                  </div>

                  {/* Login Form */}
                  <form onSubmit={handleLoginSubmit} className="space-y-5">
                    {role === 'employee' ? (
                      <div className="space-y-1.5">
                        <label className={`text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider font-extrabold block ${isRTL ? 'text-right' : 'text-left'}`}>
                          {t.employeeIdLabel}
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            value={employeeId}
                            onChange={(e) => setEmployeeId(e.target.value)}
                            className={`w-full px-4 py-3.5 bg-gray-50 dark:bg-[#0b1524] border border-gray-200 dark:border-gray-800/80 rounded-xl text-xs font-bold text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all ${
                              isRTL ? 'text-right' : 'text-left'
                            }`}
                            placeholder={t.employeeIdPlaceholder}
                          />
                          <Briefcase className={`absolute top-3.5 w-4 h-4 text-gray-400 ${isRTL ? 'left-4' : 'right-4'}`} />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <label className={`text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider font-extrabold block ${isRTL ? 'text-right' : 'text-left'}`}>
                          {t.nationalIdLabel}
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            value={nationalId}
                            onChange={(e) => setNationalId(e.target.value)}
                            className={`w-full px-4 py-3.5 bg-gray-50 dark:bg-[#0b1524] border border-gray-200 dark:border-gray-800/80 rounded-xl text-xs font-bold text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all ${
                              isRTL ? 'text-right' : 'text-left'
                            }`}
                            placeholder={t.nationalIdPlaceholder}
                          />
                          <Smartphone className={`absolute top-3.5 w-4 h-4 text-gray-400 ${isRTL ? 'left-4' : 'right-4'}`} />
                        </div>
                      </div>
                    )}

                    {/* Password Field */}
                    <div className="space-y-1.5">
                      <div className={`flex justify-between items-center text-[10px] uppercase tracking-wider font-extrabold ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <label className="text-gray-400 dark:text-gray-500">{t.passwordLabel}</label>
                        <button
                          type="button"
                          className="text-[#D4AF37] hover:underline bg-transparent border-none cursor-pointer text-[10px] font-extrabold"
                        >
                          {t.forgotPassword}
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className={`w-full px-4 py-3.5 bg-gray-50 dark:bg-[#0b1524] border border-gray-200 dark:border-gray-800/80 rounded-xl text-xs font-bold text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all ${
                            isRTL ? 'text-right' : 'text-left'
                          }`}
                          placeholder={t.passwordPlaceholder}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className={`absolute top-3.5 bg-transparent border-none cursor-pointer text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 ${isRTL ? 'left-4' : 'right-4'}`}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Remember me option */}
                    <div className={`flex items-center gap-2 py-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <input
                        type="checkbox"
                        id="rememberMe"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 accent-[#D4AF37] rounded cursor-pointer"
                      />
                      <label htmlFor="rememberMe" className="text-[11px] text-gray-500 dark:text-gray-400 font-bold cursor-pointer select-none">
                        {t.rememberMe}
                      </label>
                    </div>

                    {/* Secure Submit Button */}
                    <button
                      type="submit"
                      className="w-full h-14 bg-gradient-to-r from-[#001530] via-[#006A4E] to-[#001530] text-[#D4AF37] border border-[#D4AF37]/30 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-950/20 hover:scale-[1.01] transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 mt-4"
                    >
                      <Lock className="w-4 h-4" />
                      <span>{t.secureLogin}</span>
                      {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                    </button>

                    <div className="text-center text-[10px] text-gray-400 font-semibold pt-1">
                      {t.needDemo}
                    </div>
                  </form>
                </div>
              </div>

            </motion.div>
          ) : (
            /* Secure Login Animation / Branding Loading Screen */
            <motion.div
              key="loading-screen"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-lg bg-white dark:bg-[#070e17] rounded-[32px] p-10 border border-gray-100 dark:border-gray-800/80 shadow-2xl flex flex-col items-center justify-center text-center space-y-6"
            >
              {/* Alinma Bank Branding Ring */}
              <div className="relative flex items-center justify-center w-24 h-24">
                <div className="absolute inset-0 rounded-full border-4 border-gray-100 dark:border-gray-800" />
                <div className="absolute inset-0 rounded-full border-4 border-t-[#D4AF37] border-r-[#006A4E] animate-spin" />
                <Building className="w-8 h-8 text-[#D4AF37]" />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-black text-[#001530] dark:text-white uppercase tracking-tight">
                  {t.bankName}
                </h3>
                <p className="text-xs text-[#D4AF37] font-extrabold uppercase tracking-widest">
                  {t.systemName}
                </p>
              </div>

              {/* Secure Progress Indicators */}
              <div className="w-full max-w-xs bg-gray-50 dark:bg-[#0b1524] rounded-2xl p-5 border border-gray-100 dark:border-gray-800 space-y-3.5 text-[11px] font-black">
                <div className={`flex items-center gap-2.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-2.5 h-2.5 rounded-full ${loadingStep >= 1 ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-700 animate-pulse'}`} />
                  <span className={loadingStep >= 1 ? 'text-gray-800 dark:text-gray-200' : 'text-gray-400'}>{t.authenticating}</span>
                </div>

                <div className={`flex items-center gap-2.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-2.5 h-2.5 rounded-full ${loadingStep >= 2 ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-700'}`} />
                  <span className={loadingStep >= 2 ? 'text-gray-800 dark:text-gray-200' : 'text-gray-400'}>{t.verifyingDevice}</span>
                </div>

                <div className={`flex items-center gap-2.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-2.5 h-2.5 rounded-full ${loadingStep >= 3 ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-700'}`} />
                  <span className={loadingStep >= 3 ? 'text-gray-800 dark:text-gray-200' : 'text-gray-400'}>{t.establishingSama}</span>
                </div>

                <div className={`flex items-center gap-2.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-2.5 h-2.5 rounded-full ${loadingStep >= 4 ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-700'}`} />
                  <span className={loadingStep >= 4 ? 'text-emerald-500' : 'text-gray-400'}>{t.accessGranted}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>{t.sslSecure}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Indicators */}
      <footer className="max-w-7xl mx-auto w-full px-6 py-6 border-t border-gray-100 dark:border-gray-800/40 text-center z-10 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] text-gray-400 dark:text-gray-500 font-extrabold uppercase tracking-widest">
        <span>© 2026 {t.bankName}. All Rights Reserved.</span>
        <div className="flex gap-4 items-center">
          <span>SAMA Sandbox: Operational</span>
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
          <span>v3.5.2-Secure</span>
        </div>
      </footer>
    </div>
  );
}
