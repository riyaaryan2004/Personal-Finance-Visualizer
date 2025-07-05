'use client';

import Link from 'next/link';
import { BarChart3, CreditCard, Target, TrendingUp, DollarSign, Shield, Zap, Sparkles } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-xl shadow-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Personal Finance Visualizer
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-100 to-purple-100 px-4 py-2 rounded-full mb-6">
            <Sparkles className="h-4 w-4 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-700">Smart Financial Management</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Take Control of Your
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> Finances</span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Track expenses, set budgets, and visualize your financial journey with beautiful insights and AI-powered recommendations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex items-center space-x-2 text-green-600 font-medium">
              <Shield className="h-5 w-5" />
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center space-x-2 text-blue-600 font-medium">
              <Zap className="h-5 w-5" />
              <span>Real-time Updates</span>
            </div>
            <div className="flex items-center space-x-2 text-purple-600 font-medium">
              <Sparkles className="h-5 w-5" />
              <span>Smart Insights</span>
            </div>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Link href="/dashboard" className="group">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300 group-hover:border-indigo-300 group-hover:bg-white/90">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    Dashboard
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">Overview of your finances</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Quick Overview</span>
                  <span className="text-indigo-600 font-medium">→</span>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/transactions" className="group">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300 group-hover:border-green-300 group-hover:bg-white/90">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <CreditCard className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                    Transactions
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">Manage your transactions</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Track Spending</span>
                  <span className="text-green-600 font-medium">→</span>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/budgets" className="group">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300 group-hover:border-purple-300 group-hover:bg-white/90">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-4 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                    Budgets
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">Set and track budgets</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Smart Planning</span>
                  <span className="text-purple-600 font-medium">→</span>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/analytics" className="group">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300 group-hover:border-orange-300 group-hover:bg-white/90">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-orange-500 to-red-600 p-4 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                    Analytics
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">Deep insights and trends</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Data Insights</span>
                  <span className="text-orange-600 font-medium">→</span>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Features Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to take control of your financial future
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 hover:shadow-xl transition-all duration-300">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl">📊</span>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">Advanced Filtering</h4>
              <p className="text-gray-600 text-center leading-relaxed">
                Filter transactions by month, year, category, and more with intuitive controls
              </p>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 hover:shadow-xl transition-all duration-300">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl">🎯</span>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">Smart Budget Tracking</h4>
              <p className="text-gray-600 text-center leading-relaxed">
                Set budgets and track your spending with real-time alerts and progress indicators
              </p>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 hover:shadow-xl transition-all duration-300">
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl">📈</span>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">AI-Powered Insights</h4>
              <p className="text-gray-600 text-center leading-relaxed">
                Get intelligent recommendations and insights to optimize your spending habits
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
