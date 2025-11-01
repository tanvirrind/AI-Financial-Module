
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { FinancialData } from '../types';
import { ArrowTrendingUpIcon, BanknotesIcon, FireIcon, ClockIcon } from './IconComponents';

const formatCurrency = (value: number) => {
  if (Math.abs(value) >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`;
  }
  if (Math.abs(value) >= 1_000) {
    return `$${(value / 1_000).toFixed(1)}K`;
  }
  return `$${value.toFixed(0)}`;
};

const KpiCard: React.FC<{ title: string, value: string, icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-start justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
            </div>
            <div className="bg-primary-100 p-3 rounded-full">
                {icon}
            </div>
        </div>
    </div>
);

const ReportsDashboard: React.FC<{ data: FinancialData }> = ({ data }) => {
    const chartData = data.monthly.map(m => ({
        name: `M${m.month}`,
        Revenue: m.revenue,
        'Net Income': m.netIncome,
        'Ending Cash': m.cash,
    }));

    const finalARR = data.monthly[data.monthly.length-1].arr;

  return (
    <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KpiCard title="ARR (Year 5)" value={formatCurrency(finalARR)} icon={<ArrowTrendingUpIcon className="w-6 h-6 text-primary-600" />} />
            <KpiCard title="Ending Cash (Year 5)" value={formatCurrency(data.annual[4].cash)} icon={<BanknotesIcon className="w-6 h-6 text-primary-600" />} />
            <KpiCard title="Peak Monthly Burn" value={formatCurrency(data.kpis.peakBurn)} icon={<FireIcon className="w-6 h-6 text-primary-600" />} />
            <KpiCard title="Current Runway" value={data.kpis.runwayMonths === Infinity ? "Positive" : `${data.kpis.runwayMonths} Months`} icon={<ClockIcon className="w-6 h-6 text-primary-600" />} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue & Net Income</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={formatCurrency} />
                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                        <Legend />
                        <Line type="monotone" dataKey="Revenue" stroke="#1e40af" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="Net Income" stroke="#be123c" strokeWidth={2} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Cash Balance</h3>
                 <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={formatCurrency} domain={[0, 'dataMax']} />
                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                        <Legend />
                        <Area type="monotone" dataKey="Ending Cash" stroke="#059669" fill="#d1fae5" strokeWidth={2} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    </div>
  );
};

export default ReportsDashboard;
