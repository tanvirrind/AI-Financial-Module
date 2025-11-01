
import React, { useCallback } from 'react';
import { Assumptions } from '../types';
import { BanknotesIcon, ChartPieIcon, BuildingStorefrontIcon } from './IconComponents';

interface AssumptionsFormProps {
  assumptions: Assumptions;
  onChange: (newAssumptions: Partial<Assumptions>) => void;
}

const AssumptionInput: React.FC<{label: string, id: keyof Assumptions, value: number, assumptions: Assumptions, onChange: (newAssumptions: Partial<Assumptions>) => void, type?: 'number' | 'percentage' | 'currency', step?: number}> = 
    ({ label, id, value, onChange, type = 'number', step = 1 }) => {

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        let numericValue = e.target.value === '' ? 0 : parseFloat(e.target.value);
        if (type === 'percentage') {
            numericValue = numericValue / 100;
        }
        onChange({ [id]: numericValue });
    }, [id, onChange, type]);

    const displayValue = type === 'percentage' ? (value * 100).toFixed(2) : value;
    const prefix = type === 'currency' ? '$' : '';
    const suffix = type === 'percentage' ? '%' : '';

    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
            <div className="mt-1 relative rounded-md shadow-sm">
                {prefix && <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><span className="text-gray-500 sm:text-sm">{prefix}</span></div>}
                <input
                    type="number"
                    name={id}
                    id={id}
                    className={`block w-full rounded-md border-gray-300 ${prefix ? 'pl-7' : 'pl-3'} ${suffix ? 'pr-8' : 'pr-3'} py-2 focus:border-primary-500 focus:ring-primary-500 sm:text-sm`}
                    value={displayValue}
                    onChange={handleInputChange}
                    step={step}
                />
                {suffix && <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"><span className="text-gray-500 sm:text-sm">{suffix}</span></div>}
            </div>
        </div>
    );
};

const Section: React.FC<{title: string; icon: React.ReactNode; children: React.ReactNode}> = ({title, icon, children}) => (
    <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center mb-4">
            {icon}
            <h3 className="text-lg font-semibold text-gray-900 ml-3">{title}</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {children}
        </div>
    </div>
);


const AssumptionsForm: React.FC<AssumptionsFormProps> = ({ assumptions, onChange }) => {
  return (
    <div className="space-y-8">
      <Section title="Revenue Drivers" icon={<ChartPieIcon className="w-7 h-7 text-primary-600"/>}>
        <AssumptionInput label="Initial Monthly Revenue" id="initialMonthlyRevenue" value={assumptions.initialMonthlyRevenue} onChange={onChange} type="currency" step={1000} />
        <AssumptionInput label="Monthly Growth Rate" id="monthlyGrowthRate" value={assumptions.monthlyGrowthRate} onChange={onChange} type="percentage" step={0.1} />
        <AssumptionInput label="Monthly Churn Rate" id="churnRate" value={assumptions.churnRate} onChange={onChange} type="percentage" step={0.1} />
      </Section>

      <Section title="Costs & Expenses" icon={<BuildingStorefrontIcon className="w-7 h-7 text-primary-600"/>}>
        <AssumptionInput label="COGS (% of Revenue)" id="cogsPercentage" value={assumptions.cogsPercentage} onChange={onChange} type="percentage" step={0.1}/>
        <AssumptionInput label="Monthly Marketing Spend" id="marketingSpend" value={assumptions.marketingSpend} onChange={onChange} type="currency" step={500} />
        <AssumptionInput label="Sales Team Size" id="salesTeamSize" value={assumptions.salesTeamSize} onChange={onChange} />
        <AssumptionInput label="Avg Monthly Sales Salary" id="salespersonSalary" value={assumptions.salespersonSalary} onChange={onChange} type="currency" step={500} />
        <AssumptionInput label="Dev Team Size" id="devTeamSize" value={assumptions.devTeamSize} onChange={onChange} />
        <AssumptionInput label="Avg Monthly Dev Salary" id="devSalary" value={assumptions.devSalary} onChange={onChange} type="currency" step={500} />
        <AssumptionInput label="G&A Team Size" id="gAndATeamSize" value={assumptions.gAndATeamSize} onChange={onChange} />
        <AssumptionInput label="Avg Monthly G&A Salary" id="gAndASalary" value={assumptions.gAndASalary} onChange={onChange} type="currency" step={500} />
      </Section>

       <Section title="Cash & Fundraising" icon={<BanknotesIcon className="w-7 h-7 text-primary-600"/>}>
        <AssumptionInput label="Initial Cash Balance" id="initialCash" value={assumptions.initialCash} onChange={onChange} type="currency" step={10000} />
        <AssumptionInput label="Fundraising Amount" id="fundraisingAmount" value={assumptions.fundraisingAmount} onChange={onChange} type="currency" step={50000} />
        <AssumptionInput label="Fundraising Month (1-60)" id="fundraisingMonth" value={assumptions.fundraisingMonth} onChange={onChange} />
      </Section>
    </div>
  );
};

export default AssumptionsForm;
