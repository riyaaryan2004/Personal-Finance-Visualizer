'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Plus, Search, Edit, Trash2, Calendar, TrendingDown, BarChart3, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { apiService } from '@/services/api';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { debounce } from '@/utils/debounce';
import { 
  getCurrentMonth, 
  getMonthOptions, 
  getYearOptions, 
  formatMonthYear,
  filterTransactionsByMonth,
  filterTransactionsByYear
} from '@/utils/dateUtils';
import { 
  CATEGORIES, 
  Transaction 
} from '@/constants/data';

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [filterType, setFilterType] = useState<'month' | 'year'>('month');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Load transactions from API
  const loadTransactions = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiService.getTransactions();
      if (response.data) {
        setTransactions(response.data as Transaction[]);
        setFilteredTransactions(response.data as Transaction[]);
      } else {
        console.error('Failed to load transactions:', response.error);
        // Fallback to demo data if API fails
        setTransactions([]);
        setFilteredTransactions([]);
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
      setTransactions([]);
      setFilteredTransactions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  // Memoized filtered transactions with advanced filtering - optimized
  const processedTransactions = useMemo(() => {
    if (transactions.length === 0) return [];

    let filtered = transactions;

    // Apply month/year filter
    if (filterType === 'month') {
      filtered = filterTransactionsByMonth(filtered, selectedMonth);
    } else {
      filtered = filterTransactionsByYear(filtered, selectedYear);
    }

    // Apply search filter - optimized with early return
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(t => 
        t.description?.toLowerCase().includes(searchLower) ||
        t.category?.toLowerCase().includes(searchLower)
      );
    }

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(t => t.category === selectedCategory);
    }

    // Sort by date: most recent first - optimized with stable sort
    if (filtered.length > 1) {
      filtered = [...filtered].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    return filtered;
  }, [transactions, filterType, selectedMonth, selectedYear, searchTerm, selectedCategory]);

  // Update filtered transactions when processed transactions change
  useEffect(() => {
    setFilteredTransactions(processedTransactions);
  }, [processedTransactions]);

  // Memoized calculations - all transactions are expenses since backend doesn't support income/expense types
  const { totalExpense, averageExpense, transactionCount } = useMemo(() => {
    const expense = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
    const count = filteredTransactions.length;
    const average = count > 0 ? expense / count : 0;
    
    return {
      totalExpense: expense,
      averageExpense: average,
      transactionCount: count
    };
  }, [filteredTransactions]);

  // Memoized utility functions
  const getCategoryColor = useCallback((categoryName: string) => {
    const category = CATEGORIES.find(c => c.name === categoryName);
    return category?.color || '#6b7280';
  }, []);

  const getCategoryIcon = useCallback((categoryName: string) => {
    const category = CATEGORIES.find(c => c.name === categoryName);
    return category?.icon || '📦';
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      try {
        const response = await apiService.deleteTransaction(id);
        if (response.data) {
          setTransactions(transactions.filter(t => (t._id || t.id) !== id));
        } else {
          alert('Failed to delete transaction: ' + response.error);
        }
      } catch (error) {
        alert('Error deleting transaction');
      }
    }
  }, [transactions]);

  const handleSaveTransaction = useCallback(async (transaction: Transaction) => {
    setIsSaving(true);
    try {
      let response;
      if (editingTransaction) {
        const transactionId = editingTransaction._id || editingTransaction.id;
        if (!transactionId) {
          alert('Cannot update transaction: No ID found');
          return;
        }
        response = await apiService.updateTransaction(transactionId, transaction);
      } else {
        response = await apiService.addTransaction(transaction);
      }

      if (response.data) {
        await loadTransactions(); // Reload to get updated data
        setShowAddModal(false);
        setEditingTransaction(null);
      } else {
        alert('Failed to save transaction: ' + response.error);
      }
    } catch (error) {
      alert('Error saving transaction');
    } finally {
      setIsSaving(false);
    }
  }, [editingTransaction, loadTransactions]);

  // Debounced search handler
  const debouncedSetSearchTerm = useCallback(
    debounce((value: string) => {
      setSearchTerm(value);
    }, 300),
    []
  );

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedMonth(getCurrentMonth());
    setSelectedYear(new Date().getFullYear());
    setFilterType('month');
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
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 rounded-xl shadow-lg">
                <TrendingDown className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Transactions
                </h1>
                <p className="text-sm text-gray-600">Manage your financial records</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="h-5 w-5" />
              <span className="font-semibold">Add Transaction</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="transform hover:scale-105 transition-all duration-300">
            <MetricCard
              title="Total Expenses"
              value={formatCurrency(totalExpense)}
              subtitle={`${transactionCount} transactions`}
              icon={TrendingDown}
              gradient="bg-gradient-to-r from-red-500 via-rose-500 to-red-600"
              iconBgColor="bg-white/20"
            />
          </div>
          
          <div className="transform hover:scale-105 transition-all duration-300">
            <MetricCard
              title="Average per Transaction"
              value={formatCurrency(averageExpense)}
              subtitle="This period"
              icon={BarChart3}
              gradient="bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600"
              iconBgColor="bg-white/20"
            />
          </div>
          
          <div className="transform hover:scale-105 transition-all duration-300">
            <MetricCard
              title="Transaction Count"
              value={transactionCount.toString()}
              subtitle="Total records"
              icon={Clock}
              gradient="bg-gradient-to-r from-green-500 via-emerald-500 to-green-600"
              iconBgColor="bg-white/20"
            />
          </div>
        </div>

        {/* Enhanced Filters */}
        <Card className="mb-8 bg-white/80 backdrop-blur-md shadow-xl border-0">
          <CardContent className="p-8">
            <div className="space-y-6">
              {/* Time Period Filter */}
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-2 rounded-lg">
                  <Calendar className="h-6 w-6 text-indigo-600" />
                </div>
                <span className="text-lg font-semibold text-gray-700">Time Period:</span>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setFilterType('month')}
                    className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      filterType === 'month' 
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:shadow-md'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setFilterType('year')}
                    className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      filterType === 'year' 
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:shadow-md'
                    }`}
                  >
                    Yearly
                  </button>
                </div>
              </div>

              {/* Month/Year Selector */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filterType === 'month' ? (
                  <div>
                    <label className="block text-lg font-semibold text-gray-700 mb-3">Select Month</label>
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 bg-white/80 backdrop-blur-sm text-gray-700"
                    >
                      {getMonthOptions().map(month => (
                        <option key={month} value={month}>
                          {formatMonthYear(month)}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-lg font-semibold text-gray-700 mb-3">Select Year</label>
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(Number(e.target.value))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 bg-white/80 backdrop-blur-sm text-gray-700"
                    >
                      {getYearOptions().map(year => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Other Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    defaultValue={searchTerm}
                    onChange={(e) => debouncedSetSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 bg-white/80 backdrop-blur-sm placeholder-gray-600 text-gray-700"
                  />
                </div>

                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 bg-white/80 backdrop-blur-sm text-gray-700"
                >
                  <option value="" className="text-gray-600">All Categories</option>
                  {CATEGORIES.map(category => (
                    <option key={category.id} value={category.name}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>

                {/* Clear Filters */}
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-300 font-semibold shadow-md hover:shadow-lg"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Transactions List */}
        <Card className="bg-white/80 backdrop-blur-md shadow-xl border-0">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl font-bold text-gray-900">
              All Transactions ({filteredTransactions.length}) - {filterType === 'month' ? formatMonthYear(selectedMonth) : selectedYear}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-4">
              {filteredTransactions.map((transaction, index) => (
                <div
                  key={transaction._id || transaction.id || `transaction-${index}`}
                  className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl hover:from-gray-100 hover:to-gray-50 transition-all duration-300 shadow-md hover:shadow-xl border border-gray-100 hover:border-gray-200 transform hover:-translate-y-1"
                >
                  <div className="flex items-center space-x-6">
                    <div 
                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-semibold text-xl shadow-lg"
                      style={{ backgroundColor: getCategoryColor(transaction.category) }}
                    >
                      {getCategoryIcon(transaction.category)}
                    </div>
                    <div>
                      <p className="font-bold text-lg text-gray-900">{transaction.description}</p>
                      <p className="text-sm text-gray-500 flex items-center space-x-2">
                        <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-medium">
                          {transaction.category}
                        </span>
                        <span>•</span>
                        <span>{formatDate(transaction.date)}</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-bold text-2xl text-red-600">
                        -{formatCurrency(transaction.amount)}
                      </p>
                      <p className="text-xs text-gray-500 capitalize font-medium">expense</p>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setEditingTransaction(transaction);
                          setShowAddModal(true);
                        }}
                        className="p-3 text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300 hover:shadow-md"
                        title="Edit"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(transaction._id || transaction.id || '')}
                        className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 hover:shadow-md"
                        title="Delete"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredTransactions.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-10 w-10 text-gray-400" />
                  </div>
                  <p className="text-lg font-medium">No transactions found matching your filters.</p>
                  <p className="text-sm text-gray-400 mt-2">Try adjusting your search criteria or add a new transaction.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Add/Edit Transaction Modal */}
      {showAddModal && (
        <TransactionModal
          transaction={editingTransaction}
          onClose={() => {
            setShowAddModal(false);
            setEditingTransaction(null);
          }}
          onSave={handleSaveTransaction}
          isSaving={isSaving}
        />
      )}
    </div>
  );
};

// Enhanced Transaction Modal Component
interface TransactionModalProps {
  transaction?: Transaction | null;
  onClose: () => void;
  onSave: (transaction: Transaction) => void;
  isSaving?: boolean;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ transaction, onClose, onSave, isSaving }) => {
  const [formData, setFormData] = useState<Partial<Transaction>>({
    amount: transaction?.amount || 0,
    category: transaction?.category || '',
    date: transaction?.date || new Date().toISOString().split('T')[0],
    description: transaction?.description || ''
  });

  // Update form data when transaction prop changes
  useEffect(() => {
    if (transaction) {
      // Format the date properly for the date input
      const formatDateForInput = (dateString: string) => {
        try {
          const date = new Date(dateString);
          // Check if date is valid
          if (isNaN(date.getTime())) {
            console.warn('Invalid date:', dateString);
            return new Date().toISOString().split('T')[0];
          }
          return date.toISOString().split('T')[0];
        } catch (error) {
          console.error('Error formatting date:', error);
          return new Date().toISOString().split('T')[0];
        }
      };
      
      console.log('Editing transaction with date:', transaction.date);
      const formattedDate = formatDateForInput(transaction.date);
      console.log('Formatted date:', formattedDate);
      
      setFormData({
        amount: transaction.amount,
        category: transaction.category,
        date: formattedDate,
        description: transaction.description || ''
      });
    } else {
      // Reset form for new transaction
      setFormData({
        amount: 0,
        category: '',
        date: new Date().toISOString().split('T')[0],
        description: ''
      });
    }
  }, [transaction]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.amount && formData.category && formData.description) {
      onSave(formData as Transaction);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl border border-gray-100">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 rounded-xl">
            <Plus className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {transaction ? 'Edit Transaction' : 'Add New Transaction'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">Amount</label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 text-gray-700"
              required
            />
          </div>

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
            <label className="block text-lg font-semibold text-gray-700 mb-3">Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 text-gray-700"
              required
            />
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 text-gray-700"
              required
            />
          </div>

          <div className="flex space-x-4 pt-6">
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {isSaving ? 'Saving...' : (transaction ? 'Update' : 'Add')} Transaction
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

export default TransactionsPage;
