import React from 'react';
import { formatCurrency } from '@/utils/formatters';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

export const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium">{label}</p>
        <p className="text-indigo-600">
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
}; 