'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Search, Target, Edit, Trash2, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { 
  DEMO_BUDGETS, 
  DEMO_CATEGORIES, 
  BUDGET_STATUS_OPTIONS,
  Budget 
} from '@/constants/data';

const BudgetsPage = () => {
  const [budgets, setBudgets] = useState<Budget[]>(DEMO_BUDGETS);
  const [filteredBudgets, setFilteredBudgets] = useState<Budget[]>(DEMO_BUDGETS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  // Filter budgets
  useEffect(() => {
    let filtered = budgets;

    if (searchTerm) {
      filtered = filtered.filter(b => 
        b.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(b => b.category === selectedCategory);
    }

    if (selectedStatus) {
      filtered = filtered.filter(b => b.status === selectedStatus);
    }

    setFilteredBudgets(filtered);
  }, [budgets, searchTerm, selectedCategory, selectedStatus]);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this budget?')) {
      setBudgets(budgets.filter(b => b.id !== id));
    }
  };

  const getCategoryColor = (categoryName: string) => {
    const category = DEMO_CATEGORIES.find(c => c.name === categoryName);
    return category?.color || '#6b7280';
  };

  const getCategoryIcon = (categoryName: string) => {
    const category = DEMO_CATEGORIES.find(c => c.name === categoryName);
    return category?.icon || '📦';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      case 'overdue': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return '🟢';
      case 'completed': return '✅';
      case 'overdue': return '⚠️';
      default: return '⚪';
    }
  };

  const calculateProgress = (budget: Budget) => {
    return Math.min((budget.spent / budget.budget) * 100, 100);
  };

  const isOverBudget = (budget: Budget) => {
    return budget.spent > budget.budget;
  };

  const totalBudget = filteredBudgets.reduce((sum, b) => sum + b.budget, 0);
  const totalSpent = filteredBudgets.reduce((sum, b) => sum + b.spent, 0);
  const totalRemaining = totalBudget - totalSpent;
  const overallProgress = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-100 p-2 rounded-lg">
                <Target className="h-6 w-6 text-indigo-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Budgets</h1>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Budget</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Budget</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalBudget)}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <Target className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Total Spent</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalSpent)}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <TrendingDown className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Remaining</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalRemaining)}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <TrendingUp className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Progress</p>
                  <p className="text-2xl font-bold">{overallProgress.toFixed(1)}%</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <AlertCircle className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search budgets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {DEMO_CATEGORIES
                  .filter(cat => cat.type === 'expense')
                  .map(category => (
                    <option key={category.id} value={category.name}>
                      {category.icon} {category.name}
                    </option>
                  ))}
              </select>

              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                {BUDGET_STATUS_OPTIONS.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                  setSelectedStatus('');
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Budgets List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredBudgets.map((budget) => (
            <Card key={budget.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg"
                      style={{ backgroundColor: getCategoryColor(budget.category) }}
                    >
                      {getCategoryIcon(budget.category)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{budget.category}</h3>
                      <p className="text-sm text-gray-500">
                        {formatDate(budget.startDate)} - {formatDate(budget.endDate)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(budget.status)}`}>
                      {getStatusIcon(budget.status)} {budget.status}
                    </span>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => setEditingBudget(budget)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(budget.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {budget.description && (
                  <p className="text-gray-600 mb-4">{budget.description}</p>
                )}

                {/* Progress Bar */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className={`text-sm font-medium ${
                      isOverBudget(budget) ? 'text-red-600' : 'text-gray-500'
                    }`}>
                      {calculateProgress(budget).toFixed(1)}%
                    </span>
                  </div>
                  
                  <div className="relative">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-500 ${
                          isOverBudget(budget) ? 'bg-red-500' : 
                          calculateProgress(budget) > 90 ? 'bg-red-500' : 
                          calculateProgress(budget) > 70 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${calculateProgress(budget)}%` }}
                      />
                    </div>
                    {isOverBudget(budget) && (
                      <div className="absolute top-0 right-0 w-2 h-3 bg-red-600 rounded-r-full animate-pulse" />
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Budget</p>
                      <p className="font-semibold text-gray-900">{formatCurrency(budget.budget)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Spent</p>
                      <p className={`font-semibold ${isOverBudget(budget) ? 'text-red-600' : 'text-gray-900'}`}>
                        {formatCurrency(budget.spent)}
                      </p>
                    </div>
                  </div>

                  {isOverBudget(budget) && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <span className="text-sm text-red-700">
                          Over budget by {formatCurrency(budget.spent - budget.budget)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredBudgets.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center text-gray-500">
              <p>No budgets found matching your filters.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add/Edit Budget Modal */}
      {showAddModal && (
        <BudgetModal
          budget={editingBudget}
          onClose={() => {
            setShowAddModal(false);
            setEditingBudget(null);
          }}
          onSave={(budget) => {
            if (editingBudget) {
              setBudgets(budgets.map(b => 
                b.id === editingBudget.id ? budget : b
              ));
            } else {
              setBudgets([...budgets, { ...budget, id: Date.now().toString() }]);
            }
            setShowAddModal(false);
            setEditingBudget(null);
          }}
        />
      )}
    </div>
  );
};

// Budget Modal Component
interface BudgetModalProps {
  budget?: Budget | null;
  onClose: () => void;
  onSave: (budget: Budget) => void;
}

const BudgetModal: React.FC<BudgetModalProps> = ({ budget, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<Budget>>({
    category: budget?.category || '',
    budget: budget?.budget || 0,
    spent: budget?.spent || 0,
    startDate: budget?.startDate || new Date().toISOString().split('T')[0],
    endDate: budget?.endDate || new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
    status: budget?.status || 'active',
    description: budget?.description || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.category && formData.budget && formData.startDate && formData.endDate) {
      onSave(formData as Budget);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {budget ? 'Edit Budget' : 'Add New Budget'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="">Select Category</option>
              {DEMO_CATEGORIES
                .filter(cat => cat.type === 'expense')
                .map(category => (
                  <option key={category.id} value={category.name}>
                    {category.icon} {category.name}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Budget Amount</label>
            <input
              type="number"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Spent Amount</label>
            <input
              type="number"
              value={formData.spent}
              onChange={(e) => setFormData({ ...formData, spent: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'completed' | 'overdue' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
            >
              {BUDGET_STATUS_OPTIONS.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              rows={3}
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {budget ? 'Update' : 'Add'} Budget
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
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
