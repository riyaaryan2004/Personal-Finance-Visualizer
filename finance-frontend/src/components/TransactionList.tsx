'use client';

import { Transaction } from '../constants/data';
import { formatCurrency } from '@/utils/formatters';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export default function TransactionList({ transactions, onEdit, onDelete }: TransactionListProps) {
  const getCategoryIcon = (categoryName: string) => {
    const categoryMap: { [key: string]: string } = {
      'Food': '🍽️',
      'Rent': '🏠',
      'Transport': '🚗',
      'Utilities': '⚡',
      'Health': '🏥',
      'Shopping': '🛍️',
      'Entertainment': '🎬',
      'Other': '📦'
    };
    return categoryMap[categoryName] || '📦';
  };

  const getCategoryColor = (categoryName: string) => {
    const colorMap: { [key: string]: string } = {
      'Food': '#ef4444',
      'Rent': '#10b981',
      'Transport': '#f97316',
      'Utilities': '#f59e0b',
      'Health': '#06b6d4',
      'Shopping': '#ec4899',
      'Entertainment': '#8b5cf6',
      'Other': '#6b7280'
    };
    return colorMap[categoryName] || '#6b7280';
  };

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <div
          key={transaction.id || transaction._id || Math.random()}
          className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                style={{ backgroundColor: `${getCategoryColor(transaction.category)}20` }}
              >
                {getCategoryIcon(transaction.category)}
              </div>
              <div>
                <h3 className="font-medium text-gray-900">
                  {transaction.description || transaction.category}
                </h3>
                <p className="text-sm text-gray-500">
                  {new Date(transaction.date).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-red-600">
                -{formatCurrency(Math.abs(transaction.amount))}
              </span>
              <div className="flex space-x-1">
                <button
                  onClick={() => onEdit(transaction)}
                  className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  ✏️
                </button>
                <button
                  onClick={() => onDelete(transaction.id || transaction._id || '')}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 