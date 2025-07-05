'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { 
  DEMO_TRANSACTIONS, 
  DEMO_BUDGETS, 
  DEMO_CATEGORIES,
  Transaction,
  Budget
} from '@/constants/data';
import { PieChartComponent } from '@/components/charts/PieChartComponent';
import { BarChartComponent } from '@/components/charts/BarChartComponent';
import { AreaChartComponent } from '@/components/charts/AreaChartComponent';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  BarChart3,
  Target,
  DollarSign
} from 'lucide-react';

const AnalyticsPage = () => {
  const [transactions] = useState<Transaction[]>(DEMO_TRANSACTIONS);
  const [budgets] = useState<Budget[]>(DEMO_BUDGETS);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Calculate analytics data
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  // Category-wise expense breakdown
  const categoryExpenses = DEMO_CATEGORIES
    .filter(cat => cat.type === 'expense')
    .map(category => {
      const total = transactions
        .filter(t => t.category === category.name && t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      return {
        category: category.name,
        amount: total,
        color: category.color,
        icon: category.icon
      };
    })
    .filter(item => item.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  // Monthly trend data
  const monthlyData = [
    { month: 'Jan', income: 50000, expense: 45000 },
    { month: 'Feb', income: 52000, expense: 48000 },
    { month: 'Mar', income: 48000, expense: 52000 },
    { month: 'Apr', income: 55000, expense: 49000 },
    { month: 'May', income: 51000, expense: 47000 },
    { month: 'Jun', income: 54000, expense: 51000 },
    { month: 'Jul', income: 50000, expense: 48000 }
  ];

  // Budget performance
  const budgetPerformance = budgets.map(budget => {
    const percentage = (budget.spent / budget.budget) * 100;
    return {
      category: budget.category,
      budget: budget.budget,
      spent: budget.spent,
      percentage: percentage,
      status: percentage > 100 ? 'over' : percentage > 90 ? 'warning' : 'good'
    };
  });

  // Payment method distribution
  const paymentMethods = transactions.reduce((acc, transaction) => {
    acc[transaction.paymentMethod] = (acc[transaction.paymentMethod] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const paymentMethodData = Object.entries(paymentMethods).map(([method, count]) => ({
    category: method,
    amount: count
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics & Reports</h1>
          <p className="text-gray-600">Detailed insights into your financial patterns</p>
        </div>

        {/* Period Selector */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <Calendar className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Time Period:</span>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Total Income</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalIncome)}</p>
                  <p className="text-green-100 text-sm">+12% from last month</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <TrendingUp className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm font-medium">Total Expenses</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalExpense)}</p>
                  <p className="text-red-100 text-sm">+8% from last month</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <TrendingDown className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Net Balance</p>
                  <p className="text-2xl font-bold">{formatCurrency(balance)}</p>
                  <p className="text-blue-100 text-sm">+4% from last month</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <DollarSign className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Savings Rate</p>
                  <p className="text-2xl font-bold">{((balance / totalIncome) * 100).toFixed(1)}%</p>
                  <p className="text-purple-100 text-sm">Target: 20%</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <Target className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-indigo-600" />
                <span>Expense by Category</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PieChartComponent data={categoryExpenses} />
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-indigo-600" />
                <span>Payment Method Distribution</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BarChartComponent data={paymentMethodData} />
            </CardContent>
          </Card>
        </div>

        {/* Monthly Trend */}
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-indigo-600" />
              <span>Monthly Income vs Expenses</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <AreaChartComponent data={monthlyData} />
            </div>
          </CardContent>
        </Card>

        {/* Budget Performance */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-indigo-600" />
              <span>Budget Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {budgetPerformance.map((budget, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                         style={{ backgroundColor: DEMO_CATEGORIES.find(c => c.name === budget.category)?.color || '#6b7280' }}>
                      {DEMO_CATEGORIES.find(c => c.name === budget.category)?.icon || '📦'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{budget.category}</p>
                      <p className="text-sm text-gray-500">
                        {formatCurrency(budget.spent)} / {formatCurrency(budget.budget)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-medium ${
                        budget.status === 'over' ? 'text-red-600' :
                        budget.status === 'warning' ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {budget.percentage.toFixed(1)}%
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        budget.status === 'over' ? 'bg-red-100 text-red-800' :
                        budget.status === 'warning' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {budget.status === 'over' ? 'Over Budget' :
                         budget.status === 'warning' ? 'Warning' : 'On Track'}
                      </span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-32 bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          budget.status === 'over' ? 'bg-red-500' :
                          budget.status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage; 