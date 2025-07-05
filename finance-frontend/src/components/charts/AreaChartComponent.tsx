import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { CustomTooltip } from './CustomTooltip';
import { TrendData } from '@/constants/dashboard';

interface AreaChartComponentProps {
  data: TrendData[];
}

export const AreaChartComponent: React.FC<AreaChartComponentProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="amount" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}; 