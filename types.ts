
export enum BusinessType {
  SaaS = 'SaaS',
  Ecommerce = 'Ecommerce',
  Marketplace = 'Marketplace',
  Services = 'Services',
  Hardware = 'Hardware',
  Retail = 'Retail',
  Other = 'Other'
}

export enum AppTab {
    Assumptions = 'Assumptions',
    Model = 'Model',
    Reports = 'Reports'
}

export interface Assumptions {
  // Revenue
  initialMonthlyRevenue: number;
  monthlyGrowthRate: number;
  churnRate: number;
  
  // Costs
  cogsPercentage: number;
  marketingSpend: number;
  salesTeamSize: number;
  salespersonSalary: number;
  devTeamSize: number;
  devSalary: number;
  gAndATeamSize: number;
  gAndASalary: number;

  // Fundraising
  initialCash: number;
  fundraisingAmount: number;
  fundraisingMonth: number; // 1-indexed month
}

export interface MonthlyData {
    month: number;
    year: number;
    // P&L
    revenue: number;
    cogs: number;
    grossProfit: number;
    marketing: number;
    salesExpense: number;
    devExpense: number;
    gAndAExpense: number;
    totalOperatingExpense: number;
    netIncome: number;
    // Cash Flow
    cashFlowFromOps: number; // Simplified
    cashFlowFromFinancing: number;
    netCashFlow: number;
    // Balance Sheet
    cash: number;
    // KPIs
    mrr: number;
    arr: number;
    cumulativeRevenue: number;
}

export interface FinancialData {
  monthly: MonthlyData[];
  annual: {
      year: number;
      revenue: number;
      netIncome: number;
      cash: number;
  }[];
  kpis: {
      peakBurn: number;
      runwayMonths: number;
  }
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}
