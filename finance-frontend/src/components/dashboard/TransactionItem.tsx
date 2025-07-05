import React from 'react';
import { formatCurrency } from '@/utils/formatters';
import { Transaction } from '@/constants/dashboard';

interface TransactionItemProps {
  transaction: Transaction;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Food': 'bg-red-100 text-red-600',
      'Transport': 'bg-blue-100 text-blue-600',
      'Entertainment': 'bg-purple-100 text-purple-600',
      'Shopping': 'bg-cyan-100 text-cyan-600',
      'Bills': 'bg-yellow-100 text-yellow-600',
      'Healthcare': 'bg-green-100 text-green-600',
      'Education': 'bg-pink-100 text-pink-600',
      'Others': 'bg-gray-100 text-gray-600'
    };
    return colors[category] || 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex items-center space-x-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getCategoryColor(transaction.category)}`}>
          <span className="text-sm font-semibold">
            {transaction.category.charAt(0)}
          </span>
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