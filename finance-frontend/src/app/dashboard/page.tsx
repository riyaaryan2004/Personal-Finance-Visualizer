'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  CreditCard, 
  Target,
  BarChart3,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { formatCurrency } from '@/utils/formatters';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { 
  MOCK_CATEGORY_DATA, 
  MOCK_RECENT_TRANSACTIONS, 
  MOCK_BUDGET_DATA, 
  MOCK_TREND_DATA,
  CategoryData,
  Transaction,
  BudgetData,
  TrendData
} from '@/constants/dashboard';

import { MetricCard } from '@/components/dashboard/MetricCard';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { BudgetProgressBar } from '@/components/dashboard/BudgetProgressBar';
import { TransactionItem } from '@/components/dashboard/TransactionItem';
import { PieChartComponent } from '@/components/charts/PieChartComponent';
import { BarChartComponent } from '@/components/charts/BarChartComponent';
import { AreaChartComponent } from '@/components/charts/AreaChartComponent';

const Dashboard = () => {
  const [categoryData, setCategoryData] = useLocalStorage<CategoryData[]>('categoryData', MOCK_CATEGORY_DATA);
  const [recent, setRecent] = useLocalStorage<Transaction[]>('recentTransactions', MOCK_RECENT_TRANSACTIONS);
  const [budgetData, setBudgetData] = useLocalStorage<BudgetData[]>('budgetData', MOCK_BUDGET_DATA);
  const [trendData, setTrendData] = useLocalStorage<TrendData[]>('trendData', MOCK_TREND_DATA);
  const [total, setTotal] = useState(83000);
  const [totalBudget, setTotalBudget] = useState(103000);
  const [isLoading, setIsLoading] = useState(true);

  // Memoized calculations
  const budgetUtilization = useMemo(() => Math.round((total / totalBudget) * 100), [total, totalBudget]);
  
  const topCategory = useMemo(() => 
    categoryData.reduce((prev, current) => 
      prev.amount > current.amount ? prev : current
    ), [categoryData]
  );

  const metricCards = useMemo(() => [
    {
      title: 'Total Expenses',
      value: formatCurrency(total),
      icon: DollarSign,
      gradient: 'bg-gradient-to-r from-indigo-500 to-purple-600',
      iconBgColor: 'bg-white/20'
    },
    {
      title: 'Budget Used',
      value: `${budgetUtilization}%`,
      icon: Target,
      gradient: 'bg-gradient-to-r from-green-500 to-teal-600',
      iconBgColor: 'bg-white/20'
    },
    {
      title: 'Top Category',
      value: topCategory.category,
      subtitle: formatCurrency(topCategory.amount),
      icon: TrendingUp,
      gradient: 'bg-gradient-to-r from-orange-500 to-red-600',
      iconBgColor: 'bg-white/20'
    },
    {
      title: 'Transactions',
      value: recent.length,
      subtitle: 'This month',
      icon: CreditCard,
      gradient: 'bg-gradient-to-r from-blue-500 to-cyan-600',
      iconBgColor: 'bg-white/20'
    }
  ], [total, budgetUtilization, topCategory, recent.length]);

  // Loading effect
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metricCards.map((card, index) => (
            <MetricCard key={`metric-${index}`} {...card} />
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChartCard title="Category Breakdown" icon={Target}>
            <PieChartComponent data={categoryData} />
          </ChartCard>

          <ChartCard title="Monthly Expenses" icon={BarChart3}>
            <BarChartComponent data={categoryData} />
          </ChartCard>
        </div>

        {/* Budget Progress & Trend */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Budget Progress */}
          <Card className="lg:col-span-2 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-indigo-600" />
                <span>Budget vs Actual</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {budgetData.map((item, index) => (
                  <BudgetProgressBar key={`budget-${index}`} {...item} />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Spending Trend */}
          <ChartCard title="Monthly Trend" icon={TrendingUp}>
            <AreaChartComponent data={trendData} />
          </ChartCard>
        </div>

        {/* Recent Transactions */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-indigo-600" />
              <span>Recent Transactions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recent.map((transaction, index) => (
                <TransactionItem key={`transaction-${index}`} transaction={transaction} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;