import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ChartCardProps {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
}

export const ChartCard: React.FC<ChartCardProps> = React.memo(({ title, icon: Icon, children }) => {
  return (
    <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-lg">
        <CardTitle className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-lg">
            <Icon className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {children}
      </CardContent>
    </Card>
  );
}); 