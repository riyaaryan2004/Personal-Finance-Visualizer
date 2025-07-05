import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { CustomTooltip } from './CustomTooltip';
import { CategoryData } from '@/constants/dashboard';

interface BarChartComponentProps {
  data: CategoryData[];
}

export const BarChartComponent: React.FC<BarChartComponentProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="category" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="amount" fill="#6366f1" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}; 