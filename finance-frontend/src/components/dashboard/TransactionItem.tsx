import React from 'react';
import { formatCurrency } from '@/utils/formatters';
import { Transaction } from '@/constants/dashboard';
import { CATEGORIES } from '@/constants/data';

interface TransactionItemProps {
  transaction: Transaction;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
  const getCategoryIcon = (categoryName: string) => {
    const category = CATEGORIES.find(c => c.name === categoryName);
    return category?.icon || '📦';
  };

  const getCategoryColor = (categoryName: string) => {
    const category = CATEGORIES.find(c => c.name === categoryName);
    return category?.color || '#6b7280';
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex items-center space-x-4">
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-md"
          style={{ backgroundColor: getCategoryColor(transaction.category) }}
        >
          {getCategoryIcon(transaction.category)}
        </div>
        <div>
          <p className="font-medium text-gray-900">{transaction.description}</p>
          <p className="text-sm text-gray-500">
            {transaction.category} • {new Date(transaction.date).toLocaleDateString()}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-semibold text-red-600">-{formatCurrency(transaction.amount)}</p>
        <p className="text-xs text-gray-500">{new Date(transaction.date).toLocaleDateString()}</p>
      </div>
    </div>
  );
}; 