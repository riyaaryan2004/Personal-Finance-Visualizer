import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ChartCardProps {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
}

export const ChartCard: React.FC<ChartCardProps> = ({ title, icon: Icon, children }) => {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Icon className="h-5 w-5 text-indigo-600" />
          <span className="text-black">{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}; 