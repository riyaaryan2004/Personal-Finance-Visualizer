'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { formatCurrency } from '@/utils/formatters';
import { apiService } from '@/services/api';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { 
  getCurrentMonth, 
  getMonthOptions, 
  getYearOptions,
  formatMonthYear,
  formatPeriodLabel,
  filterTransactionsByMonth,
  filterTransactionsByYear
} from '@/utils/dateUtils';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Wallet,
  Target,
  Activity,
  Zap,
  Lightbulb,
  Plus
} from 'lucide-react';
import { CATEGORIES } from '@/constants/data';

interface AnalyticsData {
  overview: {
    totalExpenses: number;
    transactionCount: number;
  };
  categoryBreakdown: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
  budgetVsActual: Array<{
    category: string;
    budget: number;
    actual: number;
    percentage?: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    expenses: number;
  }>;
}

const AnalyticsPage = () => {
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [filterType, setFilterType] = useState<'month' | 'quarter' | 'year'>('month');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load analytics data from API
  const loadAnalyticsData = useCallback(async (period: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      let trendsRes;
      
      // Call appropriate trends API based on filter type
      switch (filterType) {
        case 'month':
          trendsRes = await apiService.getMonthlyTrends(6);
          break;
        case 'quarter':
          trendsRes = await apiService.getQuarterlyTrends(6);
          break;
        case 'year':
          trendsRes = await apiService.getYearlyTrends(6);
          break;
        default:
          trendsRes = await apiService.getMonthlyTrends(6);
      }

      const [overviewRes, categoryRes, budgetRes] = await Promise.all([
        apiService.getOverview(period),
        apiService.getCategoryBreakdown(period),
        apiService.getBudgetVsActual(period)
      ]);

      if (overviewRes.error || categoryRes.error || budgetRes.error || trendsRes.error) {
        setError('Failed to load analytics data');
        return;
      }

      setAnalyticsData({
        overview: overviewRes.data || {
          totalExpenses: 0,
          transactionCount: 0
        },
        categoryBreakdown: categoryRes.data || [],
        budgetVsActual: budgetRes.data || [],
        monthlyTrends: trendsRes.data || []
      });
    } catch (error) {
      console.error('Error loading analytics data:', error);
      setError('Failed to load analytics data');
    } finally {
      setIsLoading(false);
    }
  }, [filterType]);

  useEffect(() => {
    const period = filterType === 'month' ? selectedMonth : selectedYear.toString();
    loadAnalyticsData(period);
  }, [selectedMonth, selectedYear, filterType, loadAnalyticsData]);

  // Memoized calculations
  const { avgTransaction, topCategory } = useMemo(() => {
    if (!analyticsData?.overview) return {
      avgTransaction: 0,
      topCategory: null
    };
    
    const { totalExpenses, transactionCount } = analyticsData.overview;
    const avgTransaction = transactionCount > 0 ? totalExpenses / transactionCount : 0;
    
    const topCategory = analyticsData.categoryBreakdown.length > 0 
      ? analyticsData.categoryBreakdown[0] 
      : null;
    
    return { avgTransaction, topCategory };
  }, [analyticsData]);

  const handlePeriodChange = useCallback((period: string) => {
    if (filterType === 'month') {
      setSelectedMonth(period);
    } else {
      setSelectedYear(Number(period));
    }
  }, [filterType]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => loadAnalyticsData(filterType === 'month' ? selectedMonth : selectedYear.toString())}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-100 p-2 rounded-lg">
                <BarChart3 className="h-6 w-6 text-indigo-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
            </div>
            {/* Period Selector */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-gray-500" />
                <div className="flex space-x-2">
                  <button
                    onClick={() => setFilterType('month')}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      filterType === 'month' 
                        ? 'bg-indigo-100 text-indigo-700' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setFilterType('quarter')}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      filterType === 'quarter' 
                        ? 'bg-indigo-100 text-indigo-700' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Quarterly
                  </button>
                  <button
                    onClick={() => setFilterType('year')}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      filterType === 'year' 
                        ? 'bg-indigo-100 text-indigo-700' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Yearly
                  </button>
                </div>
              </div>
              <select
                value={filterType === 'month' ? selectedMonth : selectedYear}
                onChange={(e) => handlePeriodChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-700"
              >
                {filterType === 'month' ? (
                  getMonthOptions().map(month => (
                    <option key={month} value={month}>
                      {formatMonthYear(month)}
                    </option>
                  ))
                ) : (
                  getYearOptions().map(year => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Analytics Dashboard */}
        <div className="space-y-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="transform hover:scale-105 transition-all duration-300">
              <MetricCard
                title="Total Periods"
                value={(analyticsData?.monthlyTrends?.length ?? 0).toString()}
                icon={TrendingUp}
                gradient="bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600"
                iconBgColor="bg-white/20"
              />
            </div>
            
            <div className="transform hover:scale-105 transition-all duration-300">
              <MetricCard
                title="Total Spent"
                value={formatCurrency(
                  analyticsData?.monthlyTrends?.reduce((sum, t) => sum + t.expenses, 0) ?? 0
                )}
                icon={Wallet}
                gradient="bg-gradient-to-r from-green-500 via-emerald-500 to-green-600"
                iconBgColor="bg-white/20"
              />
            </div>
            
            <div className="transform hover:scale-105 transition-all duration-300">
              <MetricCard
                title={`Avg ${filterType === 'month' ? 'Monthly' : filterType === 'quarter' ? 'Quarterly' : 'Yearly'}`}
                value={formatCurrency(
                  analyticsData?.monthlyTrends && analyticsData.monthlyTrends.length
                    ? analyticsData.monthlyTrends.reduce((sum, t) => sum + t.expenses, 0) / analyticsData.monthlyTrends.length
                    : 0
                )}
                icon={Target}
                gradient="bg-gradient-to-r from-purple-500 via-violet-500 to-purple-600"
                iconBgColor="bg-white/20"
              />
            </div>
            
            <div className="transform hover:scale-105 transition-all duration-300">
              <MetricCard
                title="Trend"
                value={
                  analyticsData?.monthlyTrends && analyticsData.monthlyTrends.length > 1 
                    ? (() => {
                        const recent = analyticsData.monthlyTrends.slice(-2);
                        const change = ((recent[1]?.expenses || 0) - (recent[0]?.expenses || 0)) / ((recent[0]?.expenses || 1)) * 100;
                        return change > 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
                      })()
                    : 'N/A'
                }
                icon={BarChart3}
                gradient="bg-gradient-to-r from-orange-500 via-red-500 to-orange-600"
                iconBgColor="bg-white/20"
              />
            </div>
          </div>
          {/* Spending Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-indigo-600" />
                <span className="text-gray-900">Spending Trends</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <label className="font-medium text-gray-700">View Period:</label>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setFilterType('month')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filterType === 'month' 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Monthly
                    </button>
                    <button
                      onClick={() => setFilterType('quarter')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filterType === 'quarter' 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Quarterly
                    </button>
                    <button
                      onClick={() => setFilterType('year')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filterType === 'year' 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Yearly
                    </button>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">
                    Last 6 {filterType === 'month' ? 'months' : filterType === 'quarter' ? 'quarters' : 'years'}
                  </span>
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                </div>
              </div>
              <div className="space-y-4">
                {/* Enhanced Trends Display */}
                {analyticsData?.monthlyTrends && analyticsData.monthlyTrends.length > 0 ? (
                  <div className="space-y-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="transform hover:scale-105 transition-all duration-300">
                        <MetricCard
                          title={`Average ${filterType === 'month' ? 'Monthly' : filterType === 'quarter' ? 'Quarterly' : 'Yearly'}`}
                          value={formatCurrency(
                            analyticsData.monthlyTrends.reduce((sum, t) => sum + t.expenses, 0) / 
                            analyticsData.monthlyTrends.length
                          )}
                          icon={BarChart3}
                          gradient="bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600"
                          iconBgColor="bg-white/20"
                        />
                      </div>
                      
                      <div className="transform hover:scale-105 transition-all duration-300">
                        <MetricCard
                          title={`Lowest ${filterType === 'month' ? 'Month' : filterType === 'quarter' ? 'Quarter' : 'Year'}`}
                          value={formatCurrency(
                            Math.min(...analyticsData.monthlyTrends.map(t => t.expenses))
                          )}
                          icon={TrendingDown}
                          gradient="bg-gradient-to-r from-green-500 via-emerald-500 to-green-600"
                          iconBgColor="bg-white/20"
                        />
                      </div>
                      
                      <div className="transform hover:scale-105 transition-all duration-300">
                        <MetricCard
                          title={`Highest ${filterType === 'month' ? 'Month' : filterType === 'quarter' ? 'Quarter' : 'Year'}`}
                          value={formatCurrency(
                            Math.max(...analyticsData.monthlyTrends.map(t => t.expenses))
                          )}
                          icon={TrendingUp}
                          gradient="bg-gradient-to-r from-red-500 via-rose-500 to-red-600"
                          iconBgColor="bg-white/20"
                        />
                      </div>
                    </div>
                    {/* Trends Chart */}
                    <div className="bg-white p-6 rounded-lg border">
                      <h3 className="text-lg font-semibold mb-4 text-gray-900">Spending Trend</h3>
                      <div className="space-y-3">
                        {analyticsData.monthlyTrends.map((trend, idx) => {
                          const maxExpense = Math.max(...analyticsData.monthlyTrends.map(t => t.expenses));
                          const percentage = (trend.expenses / maxExpense) * 100;
                          return (
                            <div key={idx} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-gray-700">
                                  {formatPeriodLabel(trend.month)}
                                </span>
                                <span className="font-semibold text-gray-900">
                                  {formatCurrency(trend.expenses)}
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-3">
                                <div 
                                  className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-300"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    {/* Insights */}
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg border">
                      <h3 className="text-lg font-semibold mb-4 text-gray-900">Trend Insights</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-green-500">📈</span>
                            <span className="text-gray-800">Average {filterType === 'month' ? 'monthly' : filterType === 'quarter' ? 'quarterly' : 'yearly'} spending: <strong>{formatCurrency(
                              analyticsData.monthlyTrends.reduce((sum, t) => sum + t.expenses, 0) / 
                              analyticsData.monthlyTrends.length
                            )}</strong></span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-blue-500">💰</span>
                            <span className="text-gray-800">Total spent in {analyticsData.monthlyTrends.length} {filterType === 'month' ? 'months' : filterType === 'quarter' ? 'quarters' : 'years'}: <strong>{formatCurrency(
                              analyticsData.monthlyTrends.reduce((sum, t) => sum + t.expenses, 0)
                            )}</strong></span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-purple-500">📊</span>
                            <span className="text-gray-800">Spending variance: <strong>{(() => {
                              const amounts = analyticsData.monthlyTrends.map(t => t.expenses);
                              const avg = amounts.reduce((sum, val) => sum + val, 0) / amounts.length;
                              const variance = amounts.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / amounts.length;
                              return formatCurrency(Math.sqrt(variance));
                            })()}</strong></span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-orange-500">🎯</span>
                            <span className="text-gray-800">Lowest {filterType === 'month' ? 'month' : filterType === 'quarter' ? 'quarter' : 'year'}: <strong>{formatPeriodLabel(
                              analyticsData.monthlyTrends.find(t => 
                                t.expenses === Math.min(...analyticsData.monthlyTrends.map(t => t.expenses))
                              )?.month || ''
                            )}</strong></span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-red-500">⚠️</span>
                            <span className="text-gray-800">Highest {filterType === 'month' ? 'month' : filterType === 'quarter' ? 'quarter' : 'year'}: <strong>{formatPeriodLabel(
                              analyticsData.monthlyTrends.find(t => 
                                t.expenses === Math.max(...analyticsData.monthlyTrends.map(t => t.expenses))
                              )?.month || ''
                            )}</strong></span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-indigo-500">📈</span>
                            <span className="text-gray-800">Growth trend: <strong>{(() => {
                              if (analyticsData.monthlyTrends.length < 2) return 'N/A';
                              const recent = analyticsData.monthlyTrends.slice(-2);
                              const change = ((recent[1]?.expenses || 0) - (recent[0]?.expenses || 0)) / (recent[0]?.expenses || 1) * 100;
                              return change > 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
                            })()}</strong></span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-teal-500">📅</span>
                            <span className="text-gray-800">Consistent periods: <strong>{(() => {
                              const amounts = analyticsData.monthlyTrends.map(t => t.expenses);
                              const avg = amounts.reduce((sum, val) => sum + val, 0) / amounts.length;
                              const consistent = amounts.filter(amount => Math.abs(amount - avg) / avg < 0.2).length;
                              return `${consistent} of ${amounts.length}`;
                            })()}</strong></span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-yellow-500">💡</span>
                            <span className="text-gray-800">Recommendation: <strong>{(() => {
                              const amounts = analyticsData.monthlyTrends.map(t => t.expenses);
                              const avg = amounts.reduce((sum, val) => sum + val, 0) / amounts.length;
                              const recent = amounts[amounts.length - 1];
                              if (recent > avg * 1.2) return 'Consider reducing expenses';
                              if (recent < avg * 0.8) return 'Good spending control';
                              return 'Maintain current spending';
                            })()}</strong></span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-pink-500">🎯</span>
                            <span className="text-gray-800">Target for next {filterType === 'month' ? 'month' : filterType === 'quarter' ? 'quarter' : 'year'}: <strong>{formatCurrency(
                              analyticsData.monthlyTrends.reduce((sum, t) => sum + t.expenses, 0) / 
                              analyticsData.monthlyTrends.length * 0.9
                            )}</strong></span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-emerald-500">📊</span>
                            <span className="text-gray-800">Savings potential: <strong>{formatCurrency(
                              analyticsData.monthlyTrends.reduce((sum, t) => sum + t.expenses, 0) / 
                              analyticsData.monthlyTrends.length * 0.1
                            )}</strong></span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-4">
                      <BarChart3 className="h-16 w-16 mx-auto" />
                    </div>
                                      <p className="text-gray-700 text-lg font-medium">No trend data available</p>
                  <p className="text-gray-600 text-sm">Add some transactions to see your spending trends</p>
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

export default AnalyticsPage; 