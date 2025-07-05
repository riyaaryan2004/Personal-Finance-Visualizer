import React from 'react';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { Transaction, CATEGORY_COLORS } from '@/constants/dashboard';

interface TransactionItemProps {
  transaction: Transaction;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex items-center space-x-4">
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
          style={{ backgroundColor: CATEGORY_COLORS[transaction.category] || '#6b7280' }}
        >
          {transaction.category.charAt(0)}
        </div>
        <div>
          <p className="font-medium text-gray-900">{transaction.description}</p>
          <p className="text-sm text-gray-500">
            {transaction.category} • {formatDate(transaction.date)}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-semibold text-gray-900">
          {formatCurrency(transaction.amount)}
        </p>
      </div>
    </div>
  );
}; 