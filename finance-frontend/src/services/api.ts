const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.message || 'Something went wrong' };
      }

      return { data };
    } catch (error) {
      return { error: 'Network error occurred' };
    }
  }

  // Transaction APIs
  async getTransactions(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/transactions');
  }

  async addTransaction(transaction: any): Promise<ApiResponse<any>> {
    return this.request<any>('/transactions', {
      method: 'POST',
      body: JSON.stringify(transaction),
    });
  }

  async updateTransaction(id: string, transaction: any): Promise<ApiResponse<any>> {
    return this.request<any>(`/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(transaction),
    });
  }

  async deleteTransaction(id: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/transactions/${id}`, {
      method: 'DELETE',
    });
  }

  // Budget APIs
  async getBudgets(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/budgets');
  }

  async addOrUpdateBudget(budget: any): Promise<ApiResponse<any>> {
    return this.request<any>('/budgets', {
      method: 'POST',
      body: JSON.stringify(budget),
    });
  }

  async deleteBudget(id: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/budgets/${id}`, {
      method: 'DELETE',
    });
  }

  // Summary APIs
  async getOverview(month: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/summary/overview?month=${month}`);
  }

  async getCategoryBreakdown(month: string): Promise<ApiResponse<any[]>> {
    return this.request<any[]>(`/summary/category?month=${month}`);
  }

  async getBudgetVsActual(month: string): Promise<ApiResponse<any[]>> {
    return this.request<any[]>(`/summary/budget-vs-actual?month=${month}`);
  }

  async getMonthlyTrends(months: number = 6): Promise<ApiResponse<any[]>> {
    return this.request<any[]>(`/summary/monthly-trends?months=${months}`);
  }

  async getQuarterlyTrends(quarters: number = 6): Promise<ApiResponse<any[]>> {
    return this.request<any[]>(`/summary/quarterly-trends?quarters=${quarters}`);
  }

  async getYearlyTrends(years: number = 6): Promise<ApiResponse<any[]>> {
    return this.request<any[]>(`/summary/yearly-trends?years=${years}`);
  }
}

export const apiService = new ApiService(); 