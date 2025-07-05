import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  gradient: string;
  iconBgColor: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  gradient,
  iconBgColor
}) => {
  return (
    <div className={`${gradient} rounded-lg p-6 text-white shadow-lg`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {subtitle && <p className="text-sm opacity-80">{subtitle}</p>}
        </div>
        <div className={`${iconBgColor} p-3 rounded-full`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}; 