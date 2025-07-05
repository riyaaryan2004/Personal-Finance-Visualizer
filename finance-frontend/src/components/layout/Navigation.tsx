'use client';

import React, { memo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  BarChart3, 
  CreditCard, 
  Target, 
  Settings,
  Wallet
} from 'lucide-react';

const Navigation = memo(() => {
  const pathname = usePathname();

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      description: 'Overview and analytics'
    },
    {
      name: 'Transactions',
      href: '/transactions',
      icon: CreditCard,
      description: 'Manage your transactions'
    },
    {
      name: 'Budgets',
      href: '/budgets',
      icon: Target,
      description: 'Track your budgets'
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: BarChart3,
      description: 'Detailed reports'
    }
  ];

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-100 p-2 rounded-lg">
              <Wallet className="h-6 w-6 text-indigo-600" />
            </div>
            <span className="text-xl font-bold text-gray-900">Finance Tracker</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200">
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-5 w-5" />
                <div>
                  <span className="font-medium">{item.name}</span>
                  <p className="text-xs text-gray-500">{item.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
});

Navigation.displayName = 'Navigation';

export default Navigation; 