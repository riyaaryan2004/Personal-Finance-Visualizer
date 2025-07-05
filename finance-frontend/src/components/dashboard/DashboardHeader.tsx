import React from 'react';
import { Wallet, Calendar } from 'lucide-react';

export const DashboardHeader: React.FC = () => {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-100 p-2 rounded-lg">
              <Wallet className="h-6 w-6 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Finance Dashboard</h1>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>July 2025</span>
          </div>
        </div>
      </div>
    </div>
  );
}; 