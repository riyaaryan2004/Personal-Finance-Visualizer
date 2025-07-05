export interface Transaction {
  id: string;
  amount: number;
  category: string;
  date: string;
  description: string;
  type: 'income' | 'expense';
  paymentMethod: string;
  tags?: string[];
}

export interface Budget {
  id: string;
  category: string;
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'overdue';
  description?: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  type: 'income' | 'expense';
}

// Demo Categories
export const DEMO_CATEGORIES: Category[] = [
  { id: '1', name: 'Food', color: '#ef4444', icon: '🍕', type: 'expense' },
  { id: '2', name: 'Transport', color: '#3b82f6', icon: '🚗', type: 'expense' },
  { id: '3', name: 'Entertainment', color: '#8b5cf6', icon: '🎬', type: 'expense' },
  { id: '4', name: 'Shopping', color: '#06b6d4', icon: '🛍️', type: 'expense' },
  { id: '5', name: 'Bills', color: '#f59e0b', icon: '💡', type: 'expense' },
  { id: '6', name: 'Healthcare', color: '#10b981', icon: '🏥', type: 'expense' },
  { id: '7', name: 'Education', color: '#ec4899', icon: '📚', type: 'expense' },
  { id: '8', name: 'Salary', color: '#22c55e', icon: '💰', type: 'income' },
  { id: '9', name: 'Freelance', color: '#84cc16', icon: '💼', type: 'income' },
  { id: '10', name: 'Investment', color: '#06b6d4', icon: '📈', type: 'income' },
  { id: '11', name: 'Others', color: '#6b7280', icon: '📦', type: 'expense' }
];

// Demo Transactions
export const DEMO_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    amount: 2500,
    category: 'Food',
    date: '2025-01-15',
    description: 'Grocery shopping at Walmart',
    type: 'expense',
    paymentMethod: 'Credit Card',
    tags: ['groceries', 'essential']
  },
  {
    id: '2',
    amount: 1200,
    category: 'Transport',
    date: '2025-01-14',
    description: 'Metro card recharge',
    type: 'expense',
    paymentMethod: 'Debit Card',
    tags: ['transport', 'daily']
  },
  {
    id: '3',
    amount: 3500,
    category: 'Entertainment',
    date: '2025-01-13',
    description: 'Movie night with friends',
    type: 'expense',
    paymentMethod: 'Cash',
    tags: ['entertainment', 'social']
  },
  {
    id: '4',
    amount: 890,
    category: 'Food',
    date: '2025-01-12',
    description: 'Restaurant dinner',
    type: 'expense',
    paymentMethod: 'Credit Card',
    tags: ['dining', 'social']
  },
  {
    id: '5',
    amount: 15000,
    category: 'Bills',
    date: '2025-01-10',
    description: 'Electricity bill payment',
    type: 'expense',
    paymentMethod: 'Online Transfer',
    tags: ['bills', 'essential']
  },
  {
    id: '6',
    amount: 50000,
    category: 'Salary',
    date: '2025-01-01',
    description: 'Monthly salary',
    type: 'income',
    paymentMethod: 'Bank Transfer',
    tags: ['income', 'salary']
  },
  {
    id: '7',
    amount: 15000,
    category: 'Freelance',
    date: '2025-01-08',
    description: 'Web development project',
    type: 'income',
    paymentMethod: 'PayPal',
    tags: ['income', 'freelance']
  },
  {
    id: '8',
    amount: 8000,
    category: 'Shopping',
    date: '2025-01-11',
    description: 'New clothes from Zara',
    type: 'expense',
    paymentMethod: 'Credit Card',
    tags: ['shopping', 'clothing']
  },
  {
    id: '9',
    amount: 3000,
    category: 'Healthcare',
    date: '2025-01-09',
    description: 'Doctor consultation',
    type: 'expense',
    paymentMethod: 'Cash',
    tags: ['healthcare', 'medical']
  },
  {
    id: '10',
    amount: 12000,
    category: 'Education',
    date: '2025-01-07',
    description: 'Online course subscription',
    type: 'expense',
    paymentMethod: 'Credit Card',
    tags: ['education', 'learning']
  }
];

// Demo Budgets
export const DEMO_BUDGETS: Budget[] = [
  {
    id: '1',
    category: 'Food',
    budget: 20000,
    spent: 15000,
    startDate: '2025-01-01',
    endDate: '2025-01-31',
    status: 'active',
    description: 'Monthly food budget including groceries and dining out'
  },
  {
    id: '2',
    category: 'Transport',
    budget: 10000,
    spent: 8000,
    startDate: '2025-01-01',
    endDate: '2025-01-31',
    status: 'active',
    description: 'Transportation costs including fuel and public transport'
  },
  {
    id: '3',
    category: 'Entertainment',
    budget: 15000,
    spent: 18000,
    startDate: '2025-01-01',
    endDate: '2025-01-31',
    status: 'overdue',
    description: 'Entertainment and leisure activities'
  },
  {
    id: '4',
    category: 'Shopping',
    budget: 20000,
    spent: 25000,
    startDate: '2025-01-01',
    endDate: '2025-01-31',
    status: 'overdue',
    description: 'Personal shopping and clothing'
  },
  {
    id: '5',
    category: 'Bills',
    budget: 30000,
    spent: 25000,
    startDate: '2025-01-01',
    endDate: '2025-01-31',
    status: 'active',
    description: 'Utility bills and rent'
  },
  {
    id: '6',
    category: 'Healthcare',
    budget: 8000,
    spent: 5000,
    startDate: '2025-01-01',
    endDate: '2025-01-31',
    status: 'active',
    description: 'Medical expenses and health insurance'
  }
];

// Payment Methods
export const PAYMENT_METHODS = [
  'Cash',
  'Credit Card',
  'Debit Card',
  'Bank Transfer',
  'PayPal',
  'UPI',
  'Online Transfer',
  'Check'
];

// Status Options
export const BUDGET_STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'overdue', label: 'Overdue' }
];

// Transaction Types
export const TRANSACTION_TYPES = [
  { value: 'income', label: 'Income' },
  { value: 'expense', label: 'Expense' }
]; 