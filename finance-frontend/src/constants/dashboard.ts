export const COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#84cc16'];

export const CATEGORY_COLORS: Record<string, string> = {
  'Food': '#ef4444',
  'Transport': '#3b82f6',
  'Entertainment': '#8b5cf6',
  'Shopping': '#06b6d4',
  'Bills': '#f59e0b',
  'Healthcare': '#10b981',
  'Education': '#ec4899',
  'Others': '#6b7280'
};

export interface CategoryData {
  category: string;
  amount: number;
}

export interface Transaction {
  amount: number;
  category: string;
  date: string;
  description: string;
}

export interface BudgetData {
  category: string;
  budget: number;
  actual: number;
  percentage: number;
}

export interface TrendData {
  month: string;
  amount: number;
}

// Mock data for demonstration - will be replaced with real data
export const MOCK_CATEGORY_DATA: CategoryData[] = [
  { category: 'Food', amount: 15000 },
  { category: 'Transport', amount: 8000 },
  { category: 'Entertainment', amount: 12000 },
  { category: 'Shopping', amount: 18000 },
  { category: 'Bills', amount: 25000 },
  { category: 'Healthcare', amount: 5000 }
];

export const MOCK_RECENT_TRANSACTIONS: Transaction[] = [
  { amount: 2500, category: 'Food', date: '2025-07-04', description: 'Grocery shopping' },
  { amount: 1200, category: 'Transport', date: '2025-07-04', description: 'Metro card recharge' },
  { amount: 3500, category: 'Entertainment', date: '2025-07-03', description: 'Movie night' },
  { amount: 890, category: 'Food', date: '2025-07-03', description: 'Restaurant dinner' },
  { amount: 15000, category: 'Bills', date: '2025-07-02', description: 'Electricity bill' }
];

export const MOCK_BUDGET_DATA: BudgetData[] = [
  { category: 'Food', budget: 20000, actual: 15000, percentage: 75 },
  { category: 'Transport', budget: 10000, actual: 8000, percentage: 80 },
  { category: 'Entertainment', budget: 15000, actual: 18000, percentage: 120 }, // Over budget
  { category: 'Shopping', budget: 20000, actual: 25000, percentage: 125 }, // Over budget
  { category: 'Bills', budget: 30000, actual: 25000, percentage: 83 },
  { category: 'Healthcare', budget: 8000, actual: 5000, percentage: 63 }
];

export const MOCK_TREND_DATA: TrendData[] = [
  { month: 'Jan', amount: 75000 },
  { month: 'Feb', amount: 82000 },
  { month: 'Mar', amount: 78000 },
  { month: 'Apr', amount: 85000 },
  { month: 'May', amount: 79000 },
  { month: 'Jun', amount: 83000 },
  { month: 'Jul', amount: 83000 }
]; 