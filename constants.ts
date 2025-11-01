
import { Assumptions, BusinessType } from './types';

export const MONTHS_TO_FORECAST = 60; // 5 years

export const SAAS_TEMPLATE: Assumptions = {
  // Revenue
  initialMonthlyRevenue: 10000,
  monthlyGrowthRate: 0.10, // 10%
  churnRate: 0.02, // 2%

  // Costs
  cogsPercentage: 0.20, // 20%
  marketingSpend: 3000,
  salesTeamSize: 2,
  salespersonSalary: 7000,
  devTeamSize: 3,
  devSalary: 10000,
  gAndATeamSize: 1,
  gAndASalary: 8000,

  // Fundraising
  initialCash: 250000,
  fundraisingAmount: 500000,
  fundraisingMonth: 12,
};
