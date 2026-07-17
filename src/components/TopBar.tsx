import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, Sparkles, Menu, Sun, Moon, Search, Globe, Trash2, Check, CheckSquare, 
  Eye, X, ShieldAlert, Clock, AlertCircle, Info, CheckCircle2, MessageSquare, Settings, Building, ChevronRight, Home
} from 'lucide-react';
import { Screen } from '../types';
import { translations } from '../lib/translations';

export interface AppNotification {
  id: string;
  titleEn: string;
  titleAr: string;
  descEn: string;
  descAr: string;
  read: boolean;
  timeEn: string;
  timeAr: string;
  severity: 'info' | 'success' | 'warning' | 'danger';
  relatedTxId?: string;
}

const getSeverityDetails = (severity: 'info' | 'success' | 'warning' | 'danger', isAr: boolean) => {
  switch (severity) {
    case 'danger':
      return {
        label: isAr ? 'حرجة' : 'Critical',
        colorClass: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200/50 dark:border-rose-900/30',
        dotColor: 'bg-rose-500',
        icon: <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />,
        indicator: '🔴'
      };
    case 'warning':
      return {
        label: isAr ? 'عالية' : 'High',
        colorClass: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200/50 dark:border-amber-900/30',
        dotColor: 'bg-amber-500',
        icon: <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />,
        indicator: '🟠'
      };
    case 'info':
      return {
        label: isAr ? 'متوسطة' : 'Medium',
        colorClass: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200/50 dark:border-blue-900/30',
        dotColor: 'bg-blue-500',
        icon: <Info className="w-4 h-4 text-blue-500 shrink-0" />,
        indicator: '🟡'
      };
    case 'success':
    default:
      return {
        label: isAr ? 'منخفضة' : 'Low',
        colorClass: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200/50 dark:border-emerald-900/30',
        dotColor: 'bg-emerald-500',
        icon: <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />,
        indicator: '🟢'
      };
  }
};

interface TopBarProps {
  currentScreen: Screen;
  onMenuClick?: () => void;
  onToggleAiAssistant?: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  lang: 'en' | 'ar';
  setLang: (lang: 'en' | 'ar') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  notifications: AppNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDeleteNotification: (id: string) => void;
  onViewDetailsNotification: (id: string, relatedTxId?: string) => void;
}

export default function TopBar({ 
  currentScreen, 
  onMenuClick, 
  onToggleAiAssistant,
  darkMode,
  onToggleDarkMode,
  lang,
  setLang,
  searchQuery,
  setSearchQuery,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification,
  onViewDetailsNotification
}: TopBarProps) {
  const t = translations[lang];
  const isRTL = lang === 'ar';
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMsgOpen, setIsMsgOpen] = useState(false);

  const getScreenTitleAndSubtitle = () => {
    switch (currentScreen) {
      case 'dashboard':
        return {
          title: t.dashboard,
          subtitle: `${t.saudiDigitalBank} • ${t.samaSandbox}`
        };
      case 'transaction-analysis':
        return {
          title: t.analyzeTransaction,
          subtitle: t.analysisSub
        };
      case 'transactions':
        return {
          title: t.transactions,
          subtitle: t.realtimeActivity
        };
      case 'customers':
        return {
          title: t.customers,
          subtitle: t.customerProfileSub
        };
      case 'fraud-cases':
        return {
          title: t.fraudCases,
          subtitle: t.fraudCases
        };
      case 'reports':
        return {
          title: t.reportsTitle,
          subtitle: t.reportsSub
        };
      case 'analytics':
        return {
          title: t.analytics,
          subtitle: t.fraudPreventionAnalytics
        };
      case 'alerts-feed':
        return {
          title: t.alerts,
          subtitle: t.suspiciousHighlight
        };
      case 'audit-logs':
        return {
          title: t.auditLogs,
          subtitle: t.auditLogs
        };
      case 'notifications':
        return {
          title: t.notifications,
          subtitle: t.notifications
        };
      case 'settings':
        return {
          title: t.settings,
          subtitle: t.settings
        };
      default:
        return { title: t.brandName, subtitle: t.saudiDigitalBank };
    }
  };

  const { title, subtitle } = getScreenTitleAndSubtitle();

  const toggleLanguage = () => {
    setLang(lang === 'en' ? 'ar' : 'en');
  };  return (
    <header className={`sticky top-0 z-[100] flex justify-between items-center px-6 md:px-10 h-20 w-full bg-white/90 dark:bg-[#070e17]/95 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800/60 shadow-sm transition-all duration-150 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
      
      {/* Left side: Menu trigger, Alinma Bank logo, FraudGuard AI, Breadcrumbs */}
      <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}>
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 text-[#001939] dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors border-none cursor-pointer bg-transparent"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Bank & System Logo */}
        <div className={`flex items-center gap-2.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#001530] to-[#006A4E] border border-[#D4AF37]/40 flex items-center justify-center shadow-md">
            <Building className="w-4.5 h-4.5 text-[#D4AF37]" />
          </div>
          <div className="leading-tight">
            <div className={`flex items-center gap-1 font-black text-xs text-[#001939] dark:text-white uppercase ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span>{t.saudiDigitalBank}</span>
              <span className="text-[#D4AF37]">•</span>
              <span className="text-[#D4AF37] text-[10px] tracking-wider">{t.brandName}</span>
            </div>
            {/* Breadcrumb Navigation */}
            <div className={`flex items-center gap-1.5 text-[9px] text-gray-400 dark:text-gray-500 font-bold mt-0.5 uppercase ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Home className="w-2.5 h-2.5" />
              <ChevronRight className="w-2 h-2 shrink-0" />
              <span>{title}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Center Search Input */}
      <div className="hidden lg:flex items-center flex-1 max-w-md mx-8 relative">
        <Search className={`absolute w-4.5 h-4.5 text-gray-400 dark:text-gray-500 ${isRTL ? 'right-4.5' : 'left-4.5'}`} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.searchPlaceholder}
          className={`w-full py-2.5 rounded-xl border border-gray-100 dark:border-gray-800/60 bg-gray-50 dark:bg-[#0b1524] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-gray-800 dark:text-gray-100 transition-all ${
            isRTL ? 'pr-11 pl-4 text-right' : 'pl-11 pr-4 text-left'
          }`}
        />
      </div>

      {/* Right side: Language, Theme, Copilot, Messages, Notifications, Settings & Profile */}
      <div className={`flex items-center gap-3 md:gap-4 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Quick Language Toggle */}
        <button
          onClick={toggleLanguage}
          className="p-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 text-gray-600 dark:text-gray-300 rounded-xl border border-gray-100 dark:border-gray-700/50 transition-all active:scale-95 shadow-sm cursor-pointer"
          title={lang === 'en' ? 'تغيير إلى العربية' : 'Switch to English'}
        >
          <Globe className="w-4.5 h-4.5 text-[#D4AF37]" />
        </button>

        {/* Dark/Light Mode Toggle */}
        <button
          onClick={onToggleDarkMode}
          className="p-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 text-gray-600 dark:text-gray-300 rounded-xl border border-gray-100 dark:border-gray-700/50 transition-all active:scale-95 shadow-sm cursor-pointer"
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? <Sun className="w-4.5 h-4.5 text-amber-500" /> : <Moon className="w-4.5 h-4.5 text-[#001939]" />}
        </button>

        {/* Floating Copilot Trigger */}
        <button
          onClick={onToggleAiAssistant}
          className="flex items-center gap-1.5 px-3 py-2 bg-[#fd8b00]/10 hover:bg-[#fd8b00]/20 text-[#fd8b00] rounded-full text-xs font-black transition-all shadow-sm active:scale-95 border border-[#fd8b00]/20 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 fill-current animate-pulse" />
          <span className="hidden md:inline">{t.copilotTitle}</span>
        </button>

        {/* Messages Dropdown & Trigger */}
        <div className="relative">
          <button 
            onClick={() => {
              setIsMsgOpen(!isMsgOpen);
              setIsNotifOpen(false);
            }}
            className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-full relative transition-colors cursor-pointer bg-transparent border-none"
            title="Secure Support Chats"
          >
            <MessageSquare className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 bg-[#006A4E] text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center ring-2 ring-white dark:ring-[#070e17]">
              2
            </span>
          </button>

          {/* Messages Dropdown Panel */}
          <AnimatePresence>
            {isMsgOpen && (
              <>
                {/* Backdrop overlay for outside click detection */}
                <div 
                  className="fixed inset-0 z-[290] cursor-default bg-transparent" 
                  onClick={() => setIsMsgOpen(false)} 
                />
                <motion.div 
                  initial={{ opacity: 0, y: 12, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className={`absolute top-full mt-2.5 bg-white dark:bg-[#070e17] rounded-[16px] border border-gray-100 dark:border-gray-800 shadow-2xl z-[300] overflow-hidden flex flex-col max-h-[450px] w-[320px] sm:w-[380px] max-w-[380px] ${
                    isRTL ? 'left-0 origin-top-left' : 'right-0 origin-top-right'
                  }`}
                >
                  <div className="p-4 bg-gray-50 dark:bg-[#0b1524] border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                    <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
                      <span className="text-xs font-black text-[#001939] dark:text-white">
                        {isRTL ? 'غرفة المراسلات الآمنة' : 'Secure Compliance Desk'}
                      </span>
                    </div>
                  </div>

                  <div className="divide-y divide-gray-50 dark:divide-gray-800/40 overflow-y-auto flex-1">
                    <div className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 flex gap-3 cursor-pointer ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}>
                      <div className="w-8 h-8 rounded-full bg-[#001530] text-white text-[11px] font-black flex items-center justify-center shrink-0">
                        SAMA
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center gap-2">
                          <span className="text-[11px] font-black text-gray-800 dark:text-white">SAMA Support Team</span>
                          <span className="text-[8px] text-gray-400 font-bold">5m ago</span>
                        </div>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 truncate">Audit token successfully rotated under SAMA protocol 4.2.</p>
                      </div>
                    </div>

                    <div className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 flex gap-3 cursor-pointer ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}>
                      <div className="w-8 h-8 rounded-full bg-emerald-750 text-white text-[11px] font-black flex items-center justify-center shrink-0">
                        RYD
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center gap-2">
                          <span className="text-[11px] font-black text-gray-800 dark:text-white">Riyadh Central Desk</span>
                          <span className="text-[8px] text-gray-400 font-bold">1h ago</span>
                        </div>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 truncate">Sarah Jenkins card override approved. Verification confirmed.</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 bg-gray-50 dark:bg-[#0b1524] border-t border-gray-100 dark:border-gray-800 text-center">
                    <button 
                      onClick={() => setIsMsgOpen(false)}
                      className="w-full py-1.5 bg-white dark:bg-gray-800 text-[10px] font-black text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 transition-all cursor-pointer border border-gray-200 dark:border-gray-750"
                    >
                      {isRTL ? 'إغلاق مركز المراسلات' : 'Close Messages'}
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Notification Bell and Dropdown Container */}
        <div className="relative">
          <button 
            onClick={() => {
              setIsNotifOpen(!isNotifOpen);
              setIsMsgOpen(false);
            }}
            className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-full relative transition-colors cursor-pointer bg-transparent border-none"
          >
            <Bell className="w-5 h-5" />
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-red-600 text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center ring-2 ring-white dark:ring-[#070e17]">
                {notifications.filter(n => !n.read).length}
              </span>
            )}
          </button>

          {/* Premium Glassmorphic Notifications Panel */}
          <AnimatePresence>
            {isNotifOpen && (
              <>
                {/* Backdrop overlay for outside click detection */}
                <div 
                  className="fixed inset-0 z-[290] cursor-default bg-transparent" 
                  onClick={() => setIsNotifOpen(false)} 
                />
                <motion.div 
                  initial={{ opacity: 0, y: 12, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className={`absolute top-full mt-2.5 bg-white dark:bg-[#070e17] rounded-[16px] border border-gray-100 dark:border-gray-850 shadow-2xl z-[300] overflow-hidden flex flex-col max-h-[450px] w-[320px] sm:w-[380px] max-w-[380px] ${
                    isRTL ? 'left-0 origin-top-left' : 'right-0 origin-top-right'
                  }`}
                >
                  {/* Notif Header */}
                  <div className="p-4 bg-gray-50 dark:bg-[#0b1524] border-b border-gray-100 dark:border-gray-850 flex justify-between items-center shrink-0">
                    <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Bell className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                      <span className="text-xs font-black text-[#001939] dark:text-white uppercase tracking-wider">
                        {isRTL ? 'الإشعارات' : 'Notifications'}
                      </span>
                      {notifications.filter(n => !n.read).length > 0 && (
                        <span className="px-2 py-0.5 text-[9px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full leading-none shrink-0 border border-slate-300/40 dark:border-slate-700/50">
                          {notifications.filter(n => !n.read).length} {isRTL ? 'جديد' : 'unread'}
                        </span>
                      )}
                    </div>
                    {notifications.filter(n => !n.read).length > 0 && (
                      <button 
                        onClick={() => {
                          onMarkAllAsRead();
                        }}
                        className="text-[10px] font-black text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 bg-transparent border-none cursor-pointer hover:underline"
                      >
                        {isRTL ? 'تحديد الكل كمقروء' : 'Mark All as Read'}
                      </button>
                    )}
                  </div>

                  {/* Notif Body */}
                  <div className="overflow-y-auto flex-1 p-3 space-y-2">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-xs text-gray-400 font-bold">
                        {isRTL ? 'لا توجد إشعارات حالياً' : 'No compliance alerts'}
                      </div>
                    ) : (
                      notifications.map((notif) => {
                        return (
                          <div 
                            key={notif.id}
                            className={`p-3 transition-all duration-200 flex gap-3 rounded-xl border ${
                              !notif.read 
                                ? 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-800/40 shadow-sm' 
                                : 'bg-transparent border-transparent'
                            } ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}
                          >
                            {/* Professional Monochrome Notification Icon */}
                            <div className="shrink-0 mt-0.5">
                              <div className="p-1.5 rounded-lg bg-slate-100/60 dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800">
                                {notif.severity === 'danger' ? (
                                  <ShieldAlert className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
                                ) : notif.severity === 'warning' ? (
                                  <AlertCircle className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
                                ) : notif.severity === 'success' ? (
                                  <CheckCircle2 className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
                                ) : (
                                  <Info className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
                                )}
                              </div>
                            </div>

                            {/* Main Content */}
                            <div className="flex-1 min-w-0 flex flex-col gap-1">
                              <div className={`flex justify-between items-start gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                {/* Title and NEW Badge */}
                                <div className={`flex items-center gap-1.5 min-w-0 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                  <h4 className={`text-[11px] leading-snug truncate ${!notif.read ? 'text-[#001939] dark:text-white font-black' : 'text-gray-500 dark:text-gray-400 font-medium'}`}>
                                    {isRTL ? notif.titleAr : notif.titleEn}
                                  </h4>
                                  {!notif.read && (
                                    <span className="px-1.5 py-0.5 bg-slate-200/60 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded text-[8px] font-black tracking-wider uppercase border border-slate-300/30 dark:border-slate-700/40 leading-none shrink-0">
                                      {isRTL ? 'جديد' : 'NEW'}
                                    </span>
                                  )}
                                </div>
                                {/* Time */}
                                <span className="text-[9px] text-gray-400 font-bold shrink-0">
                                  {isRTL ? notif.timeAr : notif.timeEn}
                                </span>
                              </div>

                              {/* Short Description */}
                              <p className={`text-[10px] leading-relaxed ${!notif.read ? 'text-gray-700 dark:text-gray-300 font-bold' : 'text-gray-500 dark:text-gray-400 font-medium'}`}>
                                {isRTL ? notif.descAr : notif.descEn}
                              </p>

                              {/* Inline Actions */}
                              <div className={`flex gap-3 mt-1.5 pt-1.5 border-t border-gray-50 dark:border-gray-850/40 ${isRTL ? 'justify-start flex-row-reverse' : 'justify-start'}`}>
                                {!notif.read && (
                                  <button 
                                    onClick={() => onMarkAsRead(notif.id)}
                                    className="text-[9px] font-bold text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 bg-transparent border-none cursor-pointer flex items-center gap-1 hover:underline"
                                  >
                                    <Check className="w-3 h-3" />
                                    <span>{isRTL ? 'تم الاطلاع' : 'Mark Read'}</span>
                                  </button>
                                )}
                                <button 
                                  onClick={() => {
                                    onViewDetailsNotification(notif.id, notif.relatedTxId);
                                    setIsNotifOpen(false);
                                  }}
                                  className="text-[9px] font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 bg-transparent border-none cursor-pointer flex items-center gap-1 hover:underline"
                                >
                                  <Eye className="w-3 h-3" />
                                  <span>{isRTL ? 'تفاصيل' : 'Inspect'}</span>
                                </button>
                                <button 
                                  onClick={() => onDeleteNotification(notif.id)}
                                  className="text-[9px] font-bold text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 bg-transparent border-none cursor-pointer flex items-center gap-1 hover:underline"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  <span>{isRTL ? 'حذف' : 'Delete'}</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Notif Footer / View All Notifications */}
                  <div className="p-3 bg-gray-50 dark:bg-[#0b1524] border-t border-gray-100 dark:border-gray-850 text-center shrink-0">
                    <button 
                      onClick={() => {
                        setIsNotifOpen(false);
                      }}
                      className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-[10px] font-black rounded-xl hover:shadow transition-all cursor-pointer border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                      <span>{isRTL ? 'عرض جميع الإشعارات' : 'View All Notifications'}</span>
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* User profile image node */}
        <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-gray-100 dark:border-gray-800 shrink-0 shadow-sm">
          <img
            className="w-full h-full object-cover"
            alt="User avatar"
            referrerPolicy="no-referrer"
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
          />
        </div>
      </div>
    </header>
  );
}
