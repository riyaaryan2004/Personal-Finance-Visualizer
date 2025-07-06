'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { 
  TrendingUp, 
  CreditCard, 
  Target,
  BarChart3,
  Clock,
  Calendar,
  Wallet,
  Sparkles,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { formatCurrency } from '@/utils/formatters';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { apiService } from '@/services/api';
import { 
  CATEGORIES
} from '@/constants/data';

import { MetricCard } from '@/components/dashboard/MetricCard';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { BudgetProgressBar } from '@/components/dashboard/BudgetProgressBar';
import { TransactionItem } from '@/components/dashboard/TransactionItem';
import { PieChartComponent } from '@/components/charts/PieChartComponent';
import { BarChartComponent } from '@/components/charts/BarChartComponent';
import { AreaChartComponent } from '@/components/charts/AreaChartComponent';

const Dashboard = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [budgets, setBudgets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  // Load data from backend
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [transactionsResponse, budgetsResponse] = await Promise.all([
        apiService.getTransactions(),
        apiService.getBudgets()
      ]);
      
      if (transactionsResponse.data) {
        setTransactions(transactionsResponse.data);
      }
      
      if (budgetsResponse.data) {
        setBudgets(budgetsResponse.data);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filter transactions by selected month - optimized with early return
  const filteredTransactions = useMemo(() => {
    if (!selectedMonth || transactions.length === 0) return transactions;
    
    const [year, month] = selectedMonth.split('-');
    const yearNum = parseInt(year);
    const monthNum = parseInt(month) - 1;
    
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate.getFullYear() === yearNum && 
             transactionDate.getMonth() === monthNum;
    });
  }, [transactions, selectedMonth]);

  // Transform backend data to chart format - optimized with Map for better performance
  const categoryData = useMemo(() => {
    if (filteredTransactions.length === 0) {
      return CATEGORIES.map(cat => ({ category: cat.name, amount: 0 }));
    }
    
    const breakdown = new Map<string, number>();
    
    // Initialize all categories with 0
    CATEGORIES.forEach(cat => {
      breakdown.set(cat.name, 0);
    });
    
    // Add actual transaction amounts
    for (const transaction of filteredTransactions) {
      const current = breakdown.get(transaction.category) || 0;
      breakdown.set(transaction.category, current + transaction.amount);
    }
    
    return Array.from(breakdown.entries()).map(([category, amount]) => ({
      category,
      amount
    }));
  }, [filteredTransactions]);

  const recentTransactions = useMemo(() => {
    if (filteredTransactions.length === 0) return [];
    
    // Use a more efficient sorting approach
    const sorted = [...filteredTransactions].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    return sorted.slice(0, 5).map(transaction => ({
      amount: transaction.amount,
      category: transaction.category,
      date: transaction.date,
      description: transaction.description || 'No description'
    }));
  }, [filteredTransactions]);

  const budgetData = useMemo(() => {
    const [year, month] = selectedMonth.split('-');
    const monthKey = `${year}-${month.padStart(2, '0')}`;
    
    // Get all categories that have expenses or budgets
    const allCategories = new Set([
      ...categoryData.map(cat => cat.category),
      ...budgets.filter(budget => budget.month === monthKey).map(budget => budget.category)
    ]);
    
    return Array.from(allCategories).map(category => {
      const budget = budgets.find(b => b.month === monthKey && b.category === category)?.amount || 0;
      const actual = categoryData.find(cat => cat.category === category)?.amount || 0;
      const percentage = budget > 0 ? (actual / budget) * 100 : (actual > 0 ? 1000 : 0); // Show 1000% if no budget but has expenses
      return {
        category,
        budget,
        actual,
        percentage
      };
    });
  }, [budgets, categoryData, selectedMonth]);

  // Generate trend data from transactions (last 6 months)
  const trendData = useMemo(() => {
    const monthlyData: { [key: string]: number } = {};
    const months = [];
    
    // Generate last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short' });
      months.push(monthKey);
      monthlyData[monthKey] = 0;
    }
    
    // Fill in actual data
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short' });
      if (monthlyData.hasOwnProperty(monthKey)) {
        monthlyData[monthKey] += transaction.amount;
      }
    });
    
    return months.map(month => ({
      month,
      amount: monthlyData[month]
    }));
  }, [transactions]);

  // Calculate totals
  const total = useMemo(() => 
    filteredTransactions.reduce((sum, transaction) => sum + transaction.amount, 0), 
    [filteredTransactions]
  );

  const totalBudget = useMemo(() => 
    budgetData.reduce((sum, budget) => sum + budget.budget, 0), 
    [budgetData]
  );

  // Memoized calculations
  const budgetUtilization = useMemo(() => 
    totalBudget > 0 ? Math.round((total / totalBudget) * 100) : 0, 
    [total, totalBudget]
  );
  
  const topCategory = useMemo(() => 
    categoryData.length > 0 ? categoryData.reduce((prev, current) => 
      prev.amount > current.amount ? prev : current
    ) : { category: 'No Data', amount: 0 }, 
    [categoryData]
  );

  const metricCards = useMemo(() => [
    {
      title: 'Total Expenses',
      value: formatCurrency(total),
      icon: CreditCard,
      gradient: 'bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600',
      iconBgColor: 'bg-white/20',
      subtitle: 'This month'
    },
    {
      title: 'Total Budget',
      value: formatCurrency(totalBudget),
      icon: Wallet,
      gradient: 'bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600',
      iconBgColor: 'bg-white/20',
      subtitle: 'Available'
    },
    {
      title: 'Budget Used',
      value: `${budgetUtilization}%`,
      icon: Target,
      gradient: 'bg-gradient-to-r from-green-500 via-emerald-500 to-green-600',
      iconBgColor: 'bg-white/20',
      subtitle: 'Utilization'
    },
    {
      title: 'Top Category',
      value: topCategory.category,
      subtitle: formatCurrency(topCategory.amount),
      icon: TrendingUp,
      gradient: 'bg-gradient-to-r from-orange-500 via-red-500 to-orange-600',
      iconBgColor: 'bg-white/20'
    },
    {
      title: 'Transactions',
      value: filteredTransactions.length.toString(),
      subtitle: 'This month',
      icon: CreditCard,
      gradient: 'bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600',
      iconBgColor: 'bg-white/20'
    }
  ], [total, totalBudget, budgetUtilization, topCategory, filteredTransactions.length]);

  // Generate month options
  const monthOptions = useMemo(() => {
    const options = [];
    for (let i = 0; i < 12; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const label = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      options.push({ value, label });
    }
    return options;
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 font-medium">Loading your financial dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header with Month Selector */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-lg border border-gray-200/50">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 rounded-xl shadow-lg">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Dashboard
                </h1>
                <p className="text-gray-600 mt-1">Your financial overview at a glance</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-white/80 rounded-lg p-2 border border-gray-200">
                <Calendar className="h-5 w-5 text-indigo-600" />
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="bg-transparent border-none focus:outline-none focus:ring-0 text-gray-700 font-medium"
                >
                  {monthOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Sparkles className="h-4 w-4" />
                <span>Live Data</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {metricCards.map((card, index) => (
            <div key={`metric-${index}`} className="transform hover:scale-105 transition-all duration-300">
              <MetricCard {...card} />
            </div>
          ))}
        </div>

        {/* Enhanced Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="transform hover:scale-[1.02] transition-all duration-300">
            <ChartCard title="Category Breakdown" icon={Target}>
              <PieChartComponent data={categoryData} />
            </ChartCard>
          </div>
          <div className="transform hover:scale-[1.02] transition-all duration-300">
            <ChartCard title="Monthly Expenses" icon={BarChart3}>
              <BarChartComponent data={categoryData} />
            </ChartCard>
          </div>
        </div>

        {/* Enhanced Budget Progress & Trend */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Budget Progress */}
          <div className="lg:col-span-2 transform hover:scale-[1.02] transition-all duration-300">
            <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-lg">
                <CardTitle className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-lg">
                    <Target className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-gray-900">Budget vs Actual</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {budgetData.map((item, index) => (
                    <div key={`budget-${index}`} className="transform hover:scale-[1.02] transition-all duration-200">
                      <BudgetProgressBar {...item} />
                    </div>
                  ))}
                  {budgetData.length === 0 && (
                    <div className="text-center py-12">
                      <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <Target className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 font-medium">No budgets set for this month</p>
                      <p className="text-gray-400 text-sm mt-1">Set budgets to track your spending</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Spending Trend */}
          <div className="transform hover:scale-[1.02] transition-all duration-300">
            <ChartCard title="Monthly Trend" icon={TrendingUp}>
              <AreaChartComponent data={trendData} />
            </ChartCard>
          </div>
        </div>

        {/* Enhanced Recent Transactions */}
        <div className="transform hover:scale-[1.02] transition-all duration-300">
          <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-lg">
              <CardTitle className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-2 rounded-lg">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">Recent Transactions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {recentTransactions.map((transaction, index) => (
                  <div key={`transaction-${index}`} className="transform hover:scale-[1.02] transition-all duration-200">
                    <TransactionItem transaction={transaction} />
                  </div>
                ))}
                {recentTransactions.length === 0 && (
                  <div className="text-center py-12">
                    <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <CreditCard className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">No transactions found for this month</p>
                    <p className="text-gray-400 text-sm mt-1">Add some transactions to get started</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;