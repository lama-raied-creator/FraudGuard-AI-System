import React, { useState, useEffect } from 'react';
import { AlertCircle, ArrowRight, Shield, ShieldAlert, Sparkles, Filter, ChevronDown, RefreshCw, X } from 'lucide-react';
import { Alert, Screen } from '../types';
import { getAvatarByCustomerName } from '../lib/utils';

interface FraudAlertsFeedProps {
  alerts: Alert[];
  onNavigate: (screen: Screen) => void;
  onSelectAlert: (alertId: string) => void;
  transactions?: any[];
}

export default function FraudAlertsFeed({ alerts, onNavigate, onSelectAlert, transactions = [] }: FraudAlertsFeedProps) {
  const [filter, setFilter] = useState<'All' | 'High' | 'Investigation' | 'Resolved'>('All');
  const [showToast, setShowToast] = useState(false);

  // Trigger a realistic simulated toast alert after 3 seconds for micro-interaction polish!
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowToast(true);
    }, 4500);
    return () => clearTimeout(timer);
  }, []);

  const getFilteredAlerts = () => {
    switch (filter) {
      case 'High':
        return alerts.filter(a => a.severity === 'CRITICAL' || a.severity === 'HIGH');
      case 'Investigation':
        return alerts.filter(a => a.riskScore > 50 && a.riskScore < 90);
      case 'Resolved':
        return alerts.filter(a => a.riskScore < 50);
      default:
        return alerts;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12 relative text-gray-800 dark:text-gray-100">
      
      {/* Filter Options Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-[#070e17] p-4 rounded-2xl border border-gray-100 dark:border-gray-800/60 shadow-sm transition-colors">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: 'All' as const, label: 'All Alerts' },
            { id: 'High' as const, label: 'High Severity' },
            { id: 'Investigation' as const, label: 'Under Investigation' },
            { id: 'Resolved' as const, label: 'Resolved' },
          ].map((tab) => {
            const isActive = filter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all cursor-pointer border-none ${
                  isActive
                    ? 'bg-[#006A4E] dark:bg-[#D4AF37] text-white dark:text-[#001025] shadow-sm'
                    : 'bg-transparent text-gray-500 hover:text-gray-800 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Sort by:</span>
          <button className="flex items-center gap-1 text-xs font-black text-[#001939] dark:text-white bg-gray-50 dark:bg-[#0b1524] hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-1.5 rounded-xl transition-all border-none cursor-pointer">
            <span>Newest First</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Alerts Feed List */}
      <div className="flex flex-col gap-4">
        {getFilteredAlerts().map((alert) => {
          let borderClass = 'border-l-4 border-gray-100';
          let badgeColor = 'bg-gray-100 text-gray-700 dark:bg-gray-850 dark:text-gray-300';
          let buttonClass = 'bg-gray-50 dark:bg-[#0b1524] hover:bg-gray-100 dark:hover:bg-[#111e33] text-[#001939] dark:text-white';

          if (alert.severity === 'CRITICAL') {
            borderClass = 'border-l-4 border-red-600 dark:border-red-500';
            badgeColor = 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 border border-red-100 dark:border-red-900/40';
            buttonClass = 'bg-[#D4AF37] hover:bg-[#C5A059] text-[#001025] shadow-md shadow-orange-500/10 font-black';
          } else if (alert.severity === 'HIGH') {
            borderClass = 'border-l-4 border-[#D4AF37]';
            badgeColor = 'bg-amber-50 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30';
            buttonClass = 'bg-[#001530] dark:bg-[#0e223c] hover:bg-[#0b2440] text-white';
          } else if (alert.severity === 'MEDIUM') {
            borderClass = 'border-l-4 border-blue-500';
            badgeColor = 'bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30';
            buttonClass = 'bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
          }

          return (
            <div
              key={alert.id}
              className={`bg-white dark:bg-[#070e17] rounded-2xl overflow-hidden transition-all duration-200 border border-gray-100 dark:border-gray-800/60 hover:shadow-lg hover:-translate-y-0.5 ${borderClass}`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center p-6 gap-6">
                
                {/* Severity & Time */}
                <div className="flex flex-row lg:flex-col items-center lg:items-start justify-between lg:w-32 gap-1 shrink-0">
                  <span className={`px-2.5 py-1 text-[9px] font-black rounded-full uppercase tracking-wider ${badgeColor}`}>
                    {alert.severity}
                  </span>
                  <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 lg:mt-1">{alert.time}</span>
                </div>

                {/* Customer Profile Info */}
                <div className="flex items-center gap-4 lg:w-60 shrink-0">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 flex-shrink-0">
                    <img
                      className="w-full h-full object-cover"
                      src={getAvatarByCustomerName(alert.customerName, transactions)}
                      alt={alert.customerName}
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200">{alert.customerName}</h4>
                    <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500">Tier: {alert.customerTier}</p>
                  </div>
                </div>

                {/* Transaction / Anomaly Detail */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="shrink-0">
                      <ShieldAlert className="w-4 h-4 text-[#006A4E] dark:text-emerald-500" />
                    </span>
                    <h5 className="text-sm font-bold text-[#001939] dark:text-white">{alert.title}</h5>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium line-clamp-1 leading-relaxed">
                    {alert.description}
                  </p>
                </div>

                {/* Risk score and action CTA */}
                <div className="flex items-center justify-between lg:justify-end gap-6 shrink-0 border-t lg:border-t-0 pt-4 lg:pt-0 border-gray-50 dark:border-gray-800">
                  <div className="text-left lg:text-right">
                    <span className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest block">Risk Score</span>
                    <span className={`text-xl font-black ${
                      alert.riskScore > 80 ? 'text-red-600 dark:text-red-400' : alert.riskScore > 50 ? 'text-[#D4AF37]' : 'text-[#006A4E] dark:text-emerald-400'
                    }`}>
                      {alert.riskScore}/100
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      onSelectAlert(alert.id);
                      onNavigate('ai-report');
                    }}
                    className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer border-none ${buttonClass}`}
                  >
                    <span>View Report</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Load More */}
      <div className="mt-8 flex justify-center">
        <button className="px-6 py-3 bg-white dark:bg-[#070e17] hover:bg-gray-50 dark:hover:bg-[#0b1524] text-[#001939] dark:text-white font-bold text-xs rounded-full border border-gray-100 dark:border-gray-800 transition-all flex items-center gap-2 shadow-sm active:scale-95 cursor-pointer">
          <RefreshCw className="w-4 h-4 text-gray-500" />
          <span>Load More Live Alerts</span>
        </button>
      </div>

      {/* Floating Interactive Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-[100] transform transition-all duration-500 ease-out animate-slide-up">
          <div className="bg-white/95 dark:bg-[#0b1524]/95 backdrop-blur-md px-5 py-4 rounded-2xl shadow-2xl border-l-4 border-red-500 border-y border-r border-gray-100 dark:border-gray-850 flex items-center gap-4 max-w-sm">
            <div className="bg-red-50 dark:bg-red-950/40 p-2 rounded-xl text-red-600 dark:text-red-400 shrink-0 animate-pulse">
              <AlertCircle className="w-5 h-5 fill-current" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-[#001939] dark:text-white">SAMA Gateway Feed Alert</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold truncate">High-velocity debit attempt detected in Jeddah...</p>
            </div>
            <button
              onClick={() => setShowToast(false)}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all bg-transparent border-none cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
