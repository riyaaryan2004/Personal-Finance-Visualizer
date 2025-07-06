'use client';

import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/utils/formatters';
import { CategoryData, CATEGORY_COLORS, COLORS } from '@/constants/dashboard';

interface PieChartComponentProps {
  data: CategoryData[];
}

export const PieChartComponent: React.FC<PieChartComponentProps> = React.memo(({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          dataKey="amount"
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ category, percent }) => `${category} ${((percent || 0) * 100).toFixed(0)}%`}
          outerRadius={120}
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={CATEGORY_COLORS[entry.category] || COLORS[index % COLORS.length]} 
            />
          ))}
        </Pie>
        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
      </PieChart>
    </ResponsiveContainer>
  );
}); 