import React, { useState } from 'react';
import { 
  Shield, LayoutDashboard, Cpu, Eye, CreditCard, Users, Landmark, 
  ShieldAlert, FileText, BarChart3, Brain, AlertOctagon, Terminal, 
  Bell, Settings, HelpCircle, Globe, LogOut, ChevronLeft, ChevronRight, Menu
} from 'lucide-react';
import { Screen } from '../types';
import { translations } from '../lib/translations';

interface SidebarProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  lang: 'en' | 'ar';
  setLang: (lang: 'en' | 'ar') => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  onLogout: () => void;
  notifications?: any[];
  onToggleAiAssistant?: () => void;
}

export default function Sidebar({ 
  currentScreen, 
  onNavigate, 
  lang, 
  setLang, 
  collapsed, 
  setCollapsed,
  onLogout,
  notifications = [],
  onToggleAiAssistant
}: SidebarProps) {
  const t = translations[lang];
  const isRTL = lang === 'ar';
  
  const unreadCount = notifications.filter(n => !n.read).length;

  const menuItems = [
    { id: 'dashboard' as Screen, label: t.dashboard, icon: LayoutDashboard },
    { id: 'transaction-analysis' as Screen, label: t.analyzeTransaction, icon: Cpu },
    { id: 'transactions' as Screen, label: t.transactions, icon: CreditCard },
    { id: 'customers' as Screen, label: t.customers, icon: Users },
    { id: 'alerts-feed' as Screen, label: t.alerts, icon: AlertOctagon },
    { id: 'fraud-cases' as Screen, label: t.fraudCases, icon: ShieldAlert },
    { id: 'reports' as Screen, label: t.reports, icon: FileText },
    { id: 'analytics' as Screen, label: t.analytics, icon: BarChart3 },
    { id: 'notifications' as Screen, label: t.notifications, icon: Bell },
    { id: 'audit-logs' as Screen, label: t.auditLogs, icon: Terminal },
    { id: 'settings' as Screen, label: t.settings, icon: Settings },
    { id: 'ai-assistant' as any, label: t.copilotTitle, icon: Brain },
  ];

  const toggleLanguage = () => {
    setLang(lang === 'en' ? 'ar' : 'en');
  };

  return (
    <aside 
      className={`fixed top-0 bottom-0 bg-[#001530] text-white z-50 flex flex-col border-r border-[#0e2440] shadow-2xl transition-all duration-300 ${
        isRTL ? 'right-0 border-l border-r-0' : 'left-0 border-r'
      } ${
        collapsed ? 'w-[75px]' : 'w-[280px]'
      }`}
    >
      {/* Brand & Toggle Header */}
      <div className={`p-4 flex items-center justify-between border-b border-[#0e2440]/80 h-20 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
        {!collapsed && (
          <div className={`flex items-center gap-2.5 ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}>
            <div className="p-2 bg-[#D4AF37] rounded-xl shadow-lg shadow-[#D4AF37]/20 shrink-0">
              <Shield className="w-5 h-5 text-[#001530]" />
            </div>
            <div className="leading-tight">
              <span className="text-sm font-black tracking-tight text-white block uppercase">{t.brandName}</span>
              <span className="text-[9px] text-[#D4AF37] font-extrabold uppercase tracking-widest block">{t.saudiDigitalBank}</span>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="mx-auto p-1.5 bg-[#D4AF37]/10 text-[#D4AF37] rounded-lg">
            <Shield className="w-5 h-5" />
          </div>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white border-none cursor-pointer hidden md:block"
        >
          {collapsed ? (
            isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
          ) : (
            isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Menu Options */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = (item.id as string) === 'ai-assistant' ? false : currentScreen === item.id;
          return (
            <a
              key={item.id}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if ((item.id as string) === 'ai-assistant') {
                  if (onToggleAiAssistant) onToggleAiAssistant();
                } else {
                  onNavigate(item.id as Screen);
                }
              }}
              className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
                isRTL ? 'flex-row-reverse text-right' : 'text-left'
              } ${
                isActive
                  ? 'text-white bg-white/10 font-bold shadow-md shadow-black/10'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
              title={collapsed ? item.label : undefined}
            >
              {isActive && (
                <div className={`absolute top-2.5 bottom-2.5 w-1 bg-[#D4AF37] rounded-md ${isRTL ? 'right-0' : 'left-0'}`} />
              )}
              <Icon className={`w-5 h-5 transition-transform group-hover:scale-105 shrink-0 ${
                isActive ? 'text-[#D4AF37]' : 'text-white/60 group-hover:text-white'
              }`} />
              {!collapsed && (
                <span className="text-xs font-semibold tracking-wide truncate">{item.label}</span>
              )}
              {item.id === 'notifications' && unreadCount > 0 && (
                collapsed ? (
                   <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#D4AF37] border-2 border-[#001530] rounded-full animate-pulse" />
                ) : (
                  <span className={`px-2 py-0.5 bg-[#D4AF37] text-[#001530] text-[10px] font-black rounded-full ${isRTL ? 'mr-auto' : 'ml-auto'}`}>
                    {unreadCount}
                  </span>
                )
              )}
            </a>
          );
        })}
      </nav>

      {/* Bottom Actions Area */}
      <div className="p-3 border-t border-white/10 space-y-1 bg-[#000f24]/50">
        {/* Language selector */}
        <button
          onClick={toggleLanguage}
          className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl hover:bg-white/5 text-white/70 hover:text-white transition-all bg-transparent border-none cursor-pointer ${
            isRTL ? 'flex-row-reverse text-right' : 'text-left'
          }`}
          title={lang === 'en' ? "العربية" : "English"}
        >
          <Globe className="w-5 h-5 text-[#D4AF37] shrink-0" />
          {!collapsed && (
            <span className="text-xs font-semibold">{lang === 'en' ? 'العربية (RTL)' : 'English (LTR)'}</span>
          )}
        </button>

        {/* Logout */}
        <button
          onClick={onLogout}
          className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-all bg-transparent border-none cursor-pointer ${
            isRTL ? 'flex-row-reverse text-right' : 'text-left'
          }`}
          title={t.logout}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && (
            <span className="text-xs font-semibold">{t.logout}</span>
          )}
        </button>
      </div>
    </aside>
  );
}
