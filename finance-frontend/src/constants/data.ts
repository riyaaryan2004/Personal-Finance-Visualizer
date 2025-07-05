export interface Transaction {
  id?: string;
  _id?: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
}

export interface Budget {
  id?: string;
  _id?: string;
  category: string;
  amount: number;
  month: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

// Backend categories only
export const BACKEND_CATEGORIES: Category[] = [
  { id: 'food', name: 'Food', icon: '🍽️', color: '#ef4444' },
  { id: 'rent', name: 'Rent', icon: '🏠', color: '#10b981' },
  { id: 'transport', name: 'Transport', icon: '🚗', color: '#f97316' },
  { id: 'utilities', name: 'Utilities', icon: '⚡', color: '#f59e0b' },
  { id: 'health', name: 'Health', icon: '🏥', color: '#06b6d4' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️', color: '#ec4899' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬', color: '#8b5cf6' },
  { id: 'other', name: 'Other', icon: '📦', color: '#6b7280' },
];

export const CATEGORIES = BACKEND_CATEGORIES; 