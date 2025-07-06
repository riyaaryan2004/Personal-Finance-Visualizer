'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Plus, Edit, Trash2, Target, Calendar, TrendingUp, TrendingDown, DollarSign, BarChart3, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { formatCurrency } from '@/utils/formatters';
import { apiService } from '@/services/api';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { 
  getCurrentMonth, 
  getMonthOptions, 
  formatMonthYear 
} from '@/utils/dateUtils';
import { CATEGORIES, Budget } from '@/constants/data';

const BudgetsPage = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load budgets from API
  const loadBudgets = useCallback(async (month: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiService.getBudgets();
      if (response.data) {
        // Filter budgets by selected month
        const filteredBudgets = response.data.filter((budget: Budget) => 
          budget.month === month
        );
        setBudgets(filteredBudgets);
      } else {
        console.error('Failed to load budgets:', response.error);
        setError('Failed to load budgets');
        setBudgets([]);
      }
    } catch (error) {
      console.error('Error loading budgets:', error);
      setError('Failed to load budgets');
      setBudgets([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBudgets(selectedMonth);
  }, [selectedMonth, loadBudgets]);

  // Memoized calculations - backend doesn't support spent amounts
  const { totalBudget, budgetCount, averageBudget } = useMemo(() => {
    const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
    const count = budgets.length;
    const average = count > 0 ? totalBudget / count : 0;
    
    return { 
      totalBudget,
      budgetCount: count,
      averageBudget: average
    };
  }, [budgets]);

  const handleSaveBudget = useCallback(async (budget: Budget) => {
    setIsSaving(true);
    try {
      const budgetData = {
        ...budget,
        month: selectedMonth
      };

      let response;
      if (editingBudget) {
        response = await apiService.addOrUpdateBudget(budgetData);
      } else {
        response = await apiService.addOrUpdateBudget(budgetData);
      }

      if (response.data) {
        await loadBudgets(selectedMonth);
        setShowAddModal(false);
        setEditingBudget(null);
      } else {
        alert('Failed to save budget: ' + response.error);
      }
    } catch (error) {
      alert('Error saving budget');
    } finally {
      setIsSaving(false);
    }
  }, [editingBudget, selectedMonth, loadBudgets]);

  const handleDeleteBudget = useCallback(async (id: string) => {
    if (confirm('Are you sure you want to delete this budget?')) {
      try {
        const response = await apiService.deleteBudget(id);
        if (response.data) {
          await loadBudgets(selectedMonth);
        } else {
          alert('Failed to delete budget: ' + response.error);
        }
      } catch (error) {
        alert('Error deleting budget');
      }
    }
  }, [selectedMonth, loadBudgets]);

  const handleMonthChange = useCallback((month: string) => {
    setSelectedMonth(month);
  }, []);

  const getCategoryIcon = useCallback((categoryName: string) => {
    const category = CATEGORIES.find(c => c.name === categoryName);
    return category?.icon || '📦';
  }, []);

  const getCategoryColor = useCallback((categoryName: string) => {
    const category = CATEGORIES.find(c => c.name === categoryName);
    return category?.color || '#6b7280';
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Enhanced Header */}
      <div className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl shadow-lg">
                <Target className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Budgets
                </h1>
                <p className="text-sm text-gray-600">Set and manage your spending limits</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              {/* Enhanced Month Selector */}
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-2 rounded-lg">
                  <Calendar className="h-5 w-5 text-indigo-600" />
                </div>
                <select
                  value={selectedMonth}
                  onChange={(e) => handleMonthChange(e.target.value)}
                  className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 bg-white/80 backdrop-blur-sm font-medium text-gray-700"
                >
                  {getMonthOptions().map(month => (
                    <option key={month} value={month}>
                      {formatMonthYear(month)}
                    </option>
                  ))}
                </select>
              </div>
              
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus className="h-5 w-5" />
                <span className="font-semibold">Add Budget</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="transform hover:scale-105 transition-all duration-300">
            <MetricCard
              title="Total Budget"
              value={formatCurrency(totalBudget)}
              subtitle={`${budgetCount} categories`}
              icon={Target}
              gradient="bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600"
              iconBgColor="bg-white/20"
            />
          </div>
          
          <div className="transform hover:scale-105 transition-all duration-300">
            <MetricCard
              title="Average Budget"
              value={formatCurrency(averageBudget)}
              subtitle="Per category"
              icon={BarChart3}
              gradient="bg-gradient-to-r from-green-500 via-emerald-500 to-green-600"
              iconBgColor="bg-white/20"
            />
          </div>
          
          <div className="transform hover:scale-105 transition-all duration-300">
            <MetricCard
              title="Budget Categories"
              value={budgetCount.toString()}
              subtitle="Active budgets"
              icon={Settings}
              gradient="bg-gradient-to-r from-purple-500 via-violet-500 to-purple-600"
              iconBgColor="bg-white/20"
            />
          </div>
        </div>

        {/* Enhanced Budgets List */}
        <Card className="bg-white/80 backdrop-blur-md shadow-xl border-0">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Category Budgets - {formatMonthYear(selectedMonth)}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-6">
              {budgets.map((budget, index) => {
                return (
                  <div 
                    key={budget._id || budget.id || `budget-${index}`} 
                    className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl hover:from-gray-100 hover:to-gray-50 transition-all duration-300 shadow-md hover:shadow-xl border border-gray-100 hover:border-gray-200 transform hover:-translate-y-1"
                  >
                    <div className="flex items-center space-x-6">
                      <div 
                        className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-semibold text-xl shadow-lg"
                        style={{ backgroundColor: getCategoryColor(budget.category) }}
                      >
                        {getCategoryIcon(budget.category)}
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-gray-900">{budget.category}</h3>
                        <p className="text-lg font-semibold text-blue-600">
                          Budget: {formatCurrency(budget.amount)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => {
                          setEditingBudget(budget);
                          setShowAddModal(true);
                        }}
                        className="p-3 text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300 hover:shadow-md"
                        title="Edit"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteBudget(budget._id || budget.id || '')}
                        className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 hover:shadow-md"
                        title="Delete"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                );
              })}
              
              {budgets.length === 0 && (
                <div className="text-center py-16 text-gray-500">
                  <div className="bg-gradient-to-r from-gray-100 to-gray-200 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Target className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-700 mb-3">No budgets set</h3>
                  <p className="text-lg text-gray-600 mb-6">Create budgets for different categories to track your spending</p>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <Plus className="h-5 w-5 inline mr-2" />
                    Create Your First Budget
                  </button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Add/Edit Budget Modal */}
      {showAddModal && (
        <BudgetModal
          budget={editingBudget}
          onClose={() => {
            setShowAddModal(false);
            setEditingBudget(null);
          }}
          onSave={handleSaveBudget}
          isSaving={isSaving}
        />
      )}
    </div>
  );
};

// Enhanced Budget Modal Component
interface BudgetModalProps {
  budget?: Budget | null;
  onClose: () => void;
  onSave: (budget: Budget) => void;
  isSaving?: boolean;
}

const BudgetModal: React.FC<BudgetModalProps> = ({ budget, onClose, onSave, isSaving }) => {
  const [formData, setFormData] = useState<Partial<Budget>>({
    category: budget?.category || '',
    amount: budget?.amount || undefined
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.category && formData.amount) {
      onSave(formData as Budget);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl border border-gray-100">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl">
            <Target className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {budget ? 'Edit Budget' : 'Add New Budget'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 text-gray-700"
              required
            >
              <option value="" className="text-gray-600">Select Category</option>
              {CATEGORIES.map(category => (
                <option key={category.id} value={category.name}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">Budget Amount</label>
            <input
              type="number"
              value={formData.amount || ''}
              onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 text-gray-700"
              required
            />
          </div>

          <div className="flex space-x-4 pt-6">
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {isSaving ? 'Saving...' : (budget ? 'Update' : 'Add')} Budget
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="flex-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 py-3 px-6 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-300 disabled:opacity-50 font-semibold shadow-md hover:shadow-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BudgetsPage;
