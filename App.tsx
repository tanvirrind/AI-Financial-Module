
import React, { useState, useMemo, useCallback } from 'react';
import { Assumptions, BusinessType, ChatMessage, FinancialData, AppTab } from './types';
import { SAAS_TEMPLATE } from './constants';
import { calculateFinancials } from './services/financialService';
import { getAIAssistance } from './services/geminiService';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import AssumptionsForm from './components/AssumptionsForm';
import FinancialDataTable from './components/FinancialDataTable';
import ReportsDashboard from './components/ReportsDashboard';
import { ArrowPathIcon } from './components/IconComponents';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.Assumptions);
  const [businessType, setBusinessType] = useState<BusinessType>(BusinessType.SaaS);
  const [assumptions, setAssumptions] = useState<Assumptions>(SAAS_TEMPLATE);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const financialData: FinancialData = useMemo(() => {
    return calculateFinancials(assumptions);
  }, [assumptions]);

  const handleAssumptionsChange = useCallback((newAssumptions: Partial<Assumptions>) => {
    setAssumptions(prev => ({ ...prev, ...newAssumptions }));
  }, []);

  const handleBusinessTypeChange = (type: BusinessType) => {
    setBusinessType(type);
    // In a real app, you'd load different templates here. We'll stick with SaaS for this example.
    setAssumptions(SAAS_TEMPLATE);
  };
  
  const handleSendMessage = async (message: string) => {
    if (!message.trim() || isAiLoading) return;

    const userMessage: ChatMessage = { sender: 'user', text: message };
    setChatHistory(prev => [...prev, userMessage]);
    setIsAiLoading(true);

    try {
      const aiResponseText = await getAIAssistance(message, financialData, assumptions);
      const aiMessage: ChatMessage = { sender: 'ai', text: aiResponseText };
      setChatHistory(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error getting AI assistance:", error);
      const errorMessage: ChatMessage = { sender: 'ai', text: "Sorry, I encountered an error. Please try again." };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.Assumptions:
        return <AssumptionsForm assumptions={assumptions} onChange={handleAssumptionsChange} />;
      case AppTab.Model:
        return <FinancialDataTable data={financialData} />;
      case AppTab.Reports:
        return <ReportsDashboard data={financialData} />;
      default:
        return <AssumptionsForm assumptions={assumptions} onChange={handleAssumptionsChange} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header 
          businessType={businessType} 
          onBusinessTypeChange={handleBusinessTypeChange}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 md:p-6 lg:p-8">
          {renderContent()}
        </main>
      </div>
      <Sidebar 
        chatHistory={chatHistory} 
        onSendMessage={handleSendMessage} 
        isLoading={isAiLoading} 
      />
    </div>
  );
};

export default App;
