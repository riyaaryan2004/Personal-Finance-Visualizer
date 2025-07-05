import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { formatCurrency } from '@/utils/formatters';
import { CategoryData } from '@/constants/dashboard';

interface BarChartComponentProps {
  data: CategoryData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-900">{label}</p>
        <p className="text-indigo-600 font-bold">{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

export const BarChartComponent: React.FC<BarChartComponentProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>No data available</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="category" 
          tick={{ fontSize: 12 }}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => formatCurrency(value)}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar 
          dataKey="amount" 
          fill="#6366f1" 
          radius={[4, 4, 0, 0]}
          name="Amount"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}; 