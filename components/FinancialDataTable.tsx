
import React, { useState } from 'react';
import { FinancialData } from '../types';

const formatCurrency = (value: number) => {
  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  if (absValue >= 1_000_000) {
    return `${sign}$${(value / 1_000_000).toFixed(1)}M`;
  }
  if (absValue >= 1_000) {
    return `${sign}$${(value / 1_000).toFixed(1)}K`;
  }
  return `${sign}$${value.toFixed(0)}`;
};

const FinancialDataTable: React.FC<{ data: FinancialData }> = ({ data }) => {
  const [view, setView] = useState<'monthly' | 'annual'>('annual');

  const headers = view === 'monthly'
    ? data.monthly.map(m => `M${m.month}`)
    : data.annual.map(a => `Year ${a.year}`);
  
  const renderRow = (label: string, key: string, isHeader: boolean = false, isSpaced: boolean = false, subHeader: boolean = false) => {
    const values = view === 'monthly'
      ? data.monthly.map((m: any) => m[key])
      : data.annual.map((a: any) => a[key]);

    return (
      <tr className={`${isHeader ? 'bg-gray-100 font-bold' : 'bg-white'} ${subHeader ? 'bg-gray-50 font-semibold' : ''} ${isSpaced ? 'border-t-4 border-gray-200' : ''}`}>
        <td className="sticky left-0 bg-inherit p-2 text-sm font-medium text-gray-900 whitespace-nowrap">{label}</td>
        {values.map((val, index) => (
          <td key={index} className={`p-2 text-sm text-right whitespace-nowrap ${val < 0 ? 'text-red-600' : 'text-gray-700'}`}>
            {typeof val === 'number' ? formatCurrency(val) : '-'}
          </td>
        ))}
      </tr>
    );
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Financial Model</h2>
        <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg">
          <button onClick={() => setView('annual')} className={`${view === 'annual' ? 'bg-white shadow' : ''} px-3 py-1 text-sm font-medium rounded-md transition-colors`}>Annual</button>
          <button onClick={() => setView('monthly')} className={`${view === 'monthly' ? 'bg-white shadow' : ''} px-3 py-1 text-sm font-medium rounded-md transition-colors`}>Monthly</button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="sticky left-0 bg-gray-50 p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metric</th>
              {headers.map((header, index) => (
                <th key={index} className="p-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {renderRow('Revenue', 'revenue', true)}
            {renderRow('COGS', 'cogs', false, false, true)}
            {renderRow('Gross Profit', 'grossProfit', false, false, true)}
            {view === 'monthly' && (
              <>
                {renderRow('Operating Expenses', '', false, true, true)}
                {renderRow('  Marketing', 'marketing')}
                {renderRow('  Sales', 'salesExpense')}
                {renderRow('  Development', 'devExpense')}
                {renderRow('  G&A', 'gAndAExpense')}
                {renderRow('Total Operating Expenses', 'totalOperatingExpense', false, false, true)}
              </>
            )}
            {renderRow('Net Income', 'netIncome', true, true)}
            {view === 'monthly' && (
                <>
                    {renderRow('Cash Flow', '', false, true, true)}
                    {renderRow('  Cash Flow from Ops', 'cashFlowFromOps')}
                    {renderRow('  Cash Flow from Financing', 'cashFlowFromFinancing')}
                    {renderRow('Net Cash Flow', 'netCashFlow', false, false, true)}
                </>
            )}
            {renderRow('Ending Cash', 'cash', true, true)}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FinancialDataTable;
