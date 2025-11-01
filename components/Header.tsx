
import React from 'react';
import { BusinessType, AppTab } from '../types';
import { ChartBarIcon, CalculatorIcon, DocumentTextIcon } from './IconComponents';

interface HeaderProps {
  businessType: BusinessType;
  onBusinessTypeChange: (type: BusinessType) => void;
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
}

const Header: React.FC<HeaderProps> = ({ businessType, onBusinessTypeChange, activeTab, setActiveTab }) => {
  const tabs = [
    { name: AppTab.Assumptions, icon: <CalculatorIcon className="w-5 h-5 mr-2" /> },
    { name: AppTab.Model, icon: <DocumentTextIcon className="w-5 h-5 mr-2" /> },
    { name: AppTab.Reports, icon: <ChartBarIcon className="w-5 h-5 mr-2" /> },
  ];
  
  return (
    <header className="bg-white shadow-sm p-4 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
            <div className="bg-primary-800 text-white font-bold text-xl rounded-md w-10 h-10 flex items-center justify-center">
                FM
            </div>
            <h1 className="text-xl font-bold text-gray-800">AI Financial Model Builder</h1>
        </div>
        
        <div>
          <label htmlFor="business-type" className="sr-only">Business Type</label>
          <select
            id="business-type"
            value={businessType}
            onChange={(e) => onBusinessTypeChange(e.target.value as BusinessType)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
          >
            {Object.values(BusinessType).map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>
      <nav className="mt-4 -mb-4 -mx-4 border-t border-gray-200" aria-label="Tabs">
        <div className="flex space-x-2 px-4">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`
                ${activeTab === tab.name ? 'border-primary-700 text-primary-700' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                group inline-flex items-center py-3 px-3 border-b-2 font-medium text-sm transition-colors duration-150
              `}
            >
              {tab.icon}
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Header;
