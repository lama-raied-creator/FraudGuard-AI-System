export type Screen = 
  | 'dashboard' 
  | 'transaction-analysis' 
  | 'transactions' 
  | 'customers' 
  | 'fraud-cases' 
  | 'reports' 
  | 'analytics' 
  | 'alerts-feed' 
  | 'audit-logs' 
  | 'notifications' 
  | 'settings' 
  | 'ai-report';

export type TransitionDirection = 'push' | 'push_back';

export interface AiAnalysisResult {
  risk_level?: 'Safe' | 'Medium' | 'High' | 'Critical';
  riskLevel?: 'Safe' | 'Medium' | 'High' | 'Critical';
  fraud_probability?: number;
  fraudProbability?: number;
  confidence?: string | number;
  summary?: string;
  reasons: string[];
  recommendations: string[];
  arabic_explanation?: string;
  analysisTimestamp?: string;
}

export interface Transaction {
  id: string;
  customerName: string;
  customerInitials: string;
  amount: number;
  status: 'Safe' | 'Medium' | 'High';
  aiRiskScore: number;
  time: string;
  type: 'Debit' | 'Credit' | 'Transfer';
  merchantName?: string;
  mcc?: string;
  ipAddress?: string;
  deviceId?: string;
  location?: string;
  accountNumber?: string;
  iban?: string;
  currency?: string;
  channel?: 'ATM' | 'POS' | 'Online' | 'Mobile App' | 'Bank Transfer';
  riskIndicators?: {
    firstTimeMerchant: boolean;
    highVelocity: boolean;
    mismatchedGeo: boolean;
    vpnUse: boolean;
    unusualSurge: boolean;
  };
  accountAge?: number;
  coordinates?: string;
  averageCustomerSpend?: number;
  gender?: 'Male' | 'Female' | 'Unknown';
  aiAnalysis?: AiAnalysisResult; // Optional real-time Gemini AI report
}

export type InvestigationStatus = 
  | 'Pending Review'
  | 'Approved'
  | 'Escalated'
  | 'Rejected'
  | 'Under Investigation';

export interface InvestigationReport {
  id: string; // e.g. RPT-2026-000001
  transactionId: string;
  customerName: string;
  accountNumber: string;
  iban: string;
  amount: number;
  currency: string;
  type: string;
  merchantName: string;
  city: string;
  device: string;
  ipAddress: string;
  analysisDateTime: string;
  geminiModelVersion: string;
  fraudProbability: number;
  riskScore: number;
  riskLevel: 'Safe' | 'Medium' | 'High' | 'Critical';
  aiConfidence: string;
  executiveSummary: string;
  detailedExplanation: string;
  riskFactors: string[];
  recommendedActions: string[];
  complianceNotes: string;
  analystDecision: string;
  investigationStatus: InvestigationStatus;
}

export interface Alert {
  id: string;
  title: string;
  description: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  time: string;
  customerName: string;
  customerTier: string;
  customerAvatar: string;
  riskScore: number;
  type: string;
}

export interface NewTransactionInput {
  amount: number;
  currency: string;
  type: 'Debit' | 'Credit' | 'Transfer';
  customerId: string;
  merchantName: string;
  mcc: string;
  ipAddress: string;
  deviceId: string;
  coordinates: string;
  city: string;
  accountAge: number;
  riskIndicators: {
    firstTimeMerchant: boolean;
    highVelocity: boolean;
    mismatchedGeo: boolean;
    vpnUse: boolean;
    unusualSurge: boolean;
  };
}
