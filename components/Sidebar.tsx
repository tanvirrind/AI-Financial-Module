
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { SparklesIcon, PaperAirplaneIcon, UserIcon, CpuChipIcon } from './IconComponents';

interface SidebarProps {
  chatHistory: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ chatHistory, onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [chatHistory, isLoading]);

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <aside className="w-full md:w-96 bg-white border-l border-gray-200 flex flex-col h-screen">
      <div className="p-4 border-b border-gray-200 flex items-center">
        <SparklesIcon className="w-6 h-6 text-primary-600 mr-2" />
        <h2 className="text-lg font-bold text-gray-800">AI Assistant</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatHistory.map((msg, index) => (
          <div key={index} className={`flex items-start space-x-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
            {msg.sender === 'ai' && (
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                <CpuChipIcon className="w-5 h-5 text-primary-700" />
              </div>
            )}
            <div className={`p-3 rounded-lg max-w-xs lg:max-w-sm ${msg.sender === 'user' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
            </div>
             {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                <UserIcon className="w-5 h-5 text-gray-600" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
            <div className="flex items-start space-x-3">
                 <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <CpuChipIcon className="w-5 h-5 text-primary-700" />
                </div>
                <div className="p-3 rounded-lg bg-gray-100">
                    <div className="flex items-center justify-center space-x-1">
                        <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                    </div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-gray-200">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a question..."
            className="w-full pr-10 p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="absolute inset-y-0 right-0 flex items-center justify-center w-10 text-gray-500 hover:text-primary-600 disabled:text-gray-300"
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
