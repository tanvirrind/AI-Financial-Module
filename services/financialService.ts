
import { Assumptions, FinancialData, MonthlyData } from '../types';
import { MONTHS_TO_FORECAST } from '../constants';

export const calculateFinancials = (assumptions: Assumptions): FinancialData => {
  const monthlyData: MonthlyData[] = [];
  let cumulativeRevenue = 0;
  let lastMonthRevenue = assumptions.initialMonthlyRevenue;

  for (let i = 0; i < MONTHS_TO_FORECAST; i++) {
    const month = i + 1;
    const year = Math.floor(i / 12) + 1;

    // --- Revenue Calculation (SaaS Model) ---
    const grossNewRevenue = lastMonthRevenue * (1 + assumptions.monthlyGrowthRate);
    const churnedRevenue = grossNewRevenue * assumptions.churnRate;
    const revenue = grossNewRevenue - churnedRevenue;
    lastMonthRevenue = revenue;
    cumulativeRevenue += revenue;

    // --- Expense Calculation ---
    const cogs = revenue * assumptions.cogsPercentage;
    const grossProfit = revenue - cogs;
    
    const marketing = assumptions.marketingSpend;
    const salesExpense = assumptions.salesTeamSize * assumptions.salespersonSalary;
    const devExpense = assumptions.devTeamSize * assumptions.devSalary;
    const gAndAExpense = assumptions.gAndATeamSize * assumptions.gAndASalary;
    const totalOperatingExpense = marketing + salesExpense + devExpense + gAndAExpense;
    
    // --- P&L ---
    const netIncome = grossProfit - totalOperatingExpense;

    // --- Cash Flow (Simplified) ---
    const cashFlowFromOps = netIncome; // Simple proxy for this model
    const cashFlowFromFinancing = (month === assumptions.fundraisingMonth) ? assumptions.fundraisingAmount : 0;
    const netCashFlow = cashFlowFromOps + cashFlowFromFinancing;

    // --- Balance Sheet ---
    const previousCash = month === 1 ? assumptions.initialCash : monthlyData[i - 1].cash;
    const cash = previousCash + netCashFlow;
    
    monthlyData.push({
      month,
      year,
      revenue,
      cogs,
      grossProfit,
      marketing,
      salesExpense,
      devExpense,
      gAndAExpense,
      totalOperatingExpense,
      netIncome,
      cashFlowFromOps,
      cashFlowFromFinancing,
      netCashFlow,
      cash,
      mrr: revenue,
      arr: revenue * 12,
      cumulativeRevenue
    });
  }

  // --- Annual Summaries ---
  const annualData = [];
  for (let y = 1; y <= MONTHS_TO_FORECAST / 12; y++) {
    const yearMonths = monthlyData.filter(m => m.year === y);
    annualData.push({
      year: y,
      revenue: yearMonths.reduce((sum, m) => sum + m.revenue, 0),
      netIncome: yearMonths.reduce((sum, m) => sum + m.netIncome, 0),
      cash: yearMonths[yearMonths.length - 1].cash,
    });
  }

  // --- KPIs ---
  const negativeCashFlows = monthlyData.filter(m => m.netCashFlow < 0).map(m => m.netCashFlow);
  const peakBurn = negativeCashFlows.length > 0 ? Math.min(...negativeCashFlows) : 0;
  
  const lastMonth = monthlyData[monthlyData.length - 1];
  let runwayMonths = 0;
  if(lastMonth.netCashFlow < 0 && lastMonth.cash > 0){
    runwayMonths = Math.floor(lastMonth.cash / Math.abs(lastMonth.netCashFlow));
  } else if (lastMonth.cash <=0) {
    runwayMonths = 0
  } else {
    runwayMonths = Infinity;
  }
  

  return {
    monthly: monthlyData,
    annual: annualData,
    kpis: {
        peakBurn,
        runwayMonths
    }
  };
};
