import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
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
    <Card className={`${gradient} text-white`}>
      <CardContent className="p-6">
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
      </CardContent>
    </Card>
  );
}; 