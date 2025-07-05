import React from 'react';
import { formatCurrency } from '@/utils/formatters';

interface BudgetProgressBarProps {
  category: string;
  budget: number;
  actual: number;
  percentage: number;
}

export const BudgetProgressBar: React.FC<BudgetProgressBarProps> = ({
  category,
  budget,
  actual,
  percentage
}) => {
  const isOverBudget = percentage > 100;
  const displayPercentage = Math.min(percentage, 100);
  const overBudgetAmount = isOverBudget ? actual - budget : 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">{category}</span>
          {isOverBudget && (
            <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-full">
              Over Budget
            </span>
          )}
        </div>
        <span className={`text-sm font-medium ${isOverBudget ? 'text-red-600' : 'text-gray-500'}`}>
          {percentage.toFixed(1)}%
        </span>
      </div>
      
      <div className="relative">
        {/* Main progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${
              isOverBudget ? 'bg-red-500' : 
              percentage > 90 ? 'bg-red-500' : 
              percentage > 70 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${displayPercentage}%` }}
          />
        </div>
        
        {/* Over-budget indicator */}
        {isOverBudget && (
          <div className="absolute top-0 right-0 w-2 h-3 bg-red-600 rounded-r-full animate-pulse" />
        )}
      </div>
      
      <div className="flex justify-between items-center text-xs">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">Spent:</span>
            <span className={`font-semibold ${isOverBudget ? 'text-red-600' : 'text-gray-700'}`}>
              {formatCurrency(actual)}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">Budget:</span>
            <span className="text-gray-700">{formatCurrency(budget)}</span>
          </div>
        </div>
        
        {isOverBudget && (
          <div className="text-right">
            <div className="text-red-600 font-semibold">
              +{formatCurrency(overBudgetAmount)}
            </div>
            <div className="text-red-500 text-xs">
              over budget
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 