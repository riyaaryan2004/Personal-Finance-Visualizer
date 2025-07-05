'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { 
  DEMO_TRANSACTIONS, 
  DEMO_CATEGORIES, 
  PAYMENT_METHODS, 
  TRANSACTION_TYPES,
  Transaction 
} from '@/constants/data';

const TransactionsPage = () => {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('transactions', DEMO_TRANSACTIONS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Memoized filtered transactions
  const filteredTransactions = useMemo(() => {
    let filtered = transactions;

    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(t => t.category === selectedCategory);
    }

    if (selectedType) {
      filtered = filtered.filter(t => t.type === selectedType);
    }

    if (selectedPaymentMethod) {
      filtered = filtered.filter(t => t.paymentMethod === selectedPaymentMethod);
    }

    return filtered;
  }, [transactions, searchTerm, selectedCategory, selectedType, selectedPaymentMethod]);

  // Memoized calculations
  const { totalIncome, totalExpense, balance } = useMemo(() => {
    const income = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expense = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      totalIncome: income,
      totalExpense: expense,
      balance: income - expense
    };
  }, [filteredTransactions]);

  // Memoized utility functions
  const getCategoryColor = useCallback((categoryName: string) => {
    const category = DEMO_CATEGORIES.find(c => c.name === categoryName);
    return category?.color || '#6b7280';
  }, []);

  const getCategoryIcon = useCallback((categoryName: string) => {
    const category = DEMO_CATEGORIES.find(c => c.name === categoryName);
    return category?.icon || '📦';
  }, []);

  const handleDelete = useCallback((id: string) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      setTransactions(transactions.filter(t => t.id !== id));
    }
  }, [transactions, setTransactions]);

  const handleSaveTransaction = useCallback((transaction: Transaction) => {
    setIsLoading(true);
    setTimeout(() => {
      if (editingTransaction) {
        setTransactions(transactions.map(t => 
          t.id === editingTransaction.id ? transaction : t
        ));
      } else {
        setTransactions([...transactions, { ...transaction, id: Date.now().toString() }]);
      }
      setShowAddModal(false);
      setEditingTransaction(null);
      setIsLoading(false);
    }, 300);
  }, [editingTransaction, transactions, setTransactions]);

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedType('');
    setSelectedPaymentMethod('');
  }, []);

  // Loading state for initial render
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 100);
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
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-100 p-2 rounded-lg">
                <Plus className="h-6 w-6 text-indigo-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Transaction</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Total Income</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalIncome)}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <span className="text-2xl">💰</span>
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
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <span className="text-2xl">💸</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`${balance >= 0 ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-gradient-to-r from-orange-500 to-orange-600'} text-white`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-80">Balance</p>
                  <p className="text-2xl font-bold">{formatCurrency(balance)}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <span className="text-2xl">{balance >= 0 ? '💎' : '⚠️'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search transactions..."
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
                {DEMO_CATEGORIES.map(category => (
                  <option key={category.id} value={category.name}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>

              {/* Type Filter */}
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">All Types</option>
                {TRANSACTION_TYPES.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>

              {/* Payment Method Filter */}
              <select
                value={selectedPaymentMethod}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">All Payment Methods</option>
                {PAYMENT_METHODS.map(method => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>

              {/* Clear Filters */}
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Transactions List */}
        <Card>
          <CardHeader>
            <CardTitle>All Transactions ({filteredTransactions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg"
                      style={{ backgroundColor: getCategoryColor(transaction.category) }}
                    >
                      {getCategoryIcon(transaction.category)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{transaction.description}</p>
                      <p className="text-sm text-gray-500">
                        {transaction.category} • {formatDate(transaction.date)} • {transaction.paymentMethod}
                      </p>
                      {transaction.tags && transaction.tags.length > 0 && (
                        <div className="flex space-x-1 mt-1">
                          {transaction.tags.map((tag, index) => (
                            <span
                              key={`${transaction.id}-tag-${index}`}
                              className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <p className={`font-semibold text-lg ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">{transaction.type}</p>
                    </div>
                    
                    <div className="flex space-x-1">
                      <button
                        onClick={() => setEditingTransaction(transaction)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredTransactions.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No transactions found matching your filters.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Transaction Modal */}
      {showAddModal && (
        <TransactionModal
          transaction={editingTransaction}
          onClose={() => {
            setShowAddModal(false);
            setEditingTransaction(null);
          }}
          onSave={handleSaveTransaction}
        />
      )}
    </div>
  );
};

// Transaction Modal Component
interface TransactionModalProps {
  transaction?: Transaction | null;
  onClose: () => void;
  onSave: (transaction: Transaction) => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ transaction, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<Transaction>>({
    amount: transaction?.amount || 0,
    category: transaction?.category || '',
    date: transaction?.date || new Date().toISOString().split('T')[0],
    description: transaction?.description || '',
    type: transaction?.type || 'expense',
    paymentMethod: transaction?.paymentMethod || '',
    tags: transaction?.tags || []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.amount && formData.category && formData.description && formData.paymentMethod) {
      onSave(formData as Transaction);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {transaction ? 'Edit Transaction' : 'Add New Transaction'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as 'income' | 'expense' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
            >
              {TRANSACTION_TYPES.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

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
                .filter(cat => cat.type === formData.type)
                .map(category => (
                  <option key={category.id} value={category.name}>
                    {category.icon} {category.name}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
            <select
              value={formData.paymentMethod}
              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="">Select Payment Method</option>
              {PAYMENT_METHODS.map(method => (
                <option key={method} value={method}>{method}</option>
              ))}
            </select>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {transaction ? 'Update' : 'Add'} Transaction
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

export default TransactionsPage;
