import React from 'react';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { CATEGORIES } from '@/constants/data';

interface TransactionItemProps {
  transaction: {
    amount: number;
    category: string;
    date: string;
    description: string;
  };
}

export const TransactionItem: React.FC<TransactionItemProps> = React.memo(({ transaction }) => {
  const getCategoryColor = (categoryName: string) => {
    const category = CATEGORIES.find(c => c.name === categoryName);
    return category?.color || '#6b7280';
  };

  const getCategoryIcon = (categoryName: string) => {
    const category = CATEGORIES.find(c => c.name === categoryName);
    return category?.icon || '📦';
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl hover:from-gray-100 hover:to-gray-50 transition-all duration-300 shadow-md hover:shadow-lg border border-gray-100 hover:border-gray-200">
      <div className="flex items-center space-x-4">
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-semibold text-lg shadow-md"
          style={{ backgroundColor: getCategoryColor(transaction.category) }}
        >
          {getCategoryIcon(transaction.category)}
        </div>
        <div>
          <p className="font-semibold text-gray-900">{transaction.description}</p>
          <p className="text-sm text-gray-500 flex items-center space-x-2">
            <span className="bg-gray-100 px-2 py-1 rounded-full text-xs font-medium">
              {transaction.category}
            </span>
            <span>•</span>
            <span>{formatDate(transaction.date)}</span>
          </p>
        </div>
      </div>
      
      <div className="text-right">
        <p className="font-bold text-xl text-red-600">
          -{formatCurrency(transaction.amount)}
        </p>
        <p className="text-xs text-gray-500 capitalize font-medium">expense</p>
      </div>
    </div>
  );
}); 