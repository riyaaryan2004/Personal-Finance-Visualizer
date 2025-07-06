const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

class ApiService {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_DURATION = 30000; // 30 seconds

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const cacheKey = `${endpoint}-${JSON.stringify(options)}`;
    const now = Date.now();
    
    // Check cache for GET requests
    if (!options.method || options.method === 'GET') {
      const cached = this.cache.get(cacheKey);
      if (cached && (now - cached.timestamp) < this.CACHE_DURATION) {
        return { data: cached.data };
      }
    }

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

      // Cache successful GET responses
      if (!options.method || options.method === 'GET') {
        this.cache.set(cacheKey, { data, timestamp: now });
      }

      return { data };
    } catch (error) {
      return { error: 'Network error occurred' };
    }
  }

  // Transaction APIs
  async getTransactions(): Promise<ApiResponse<unknown[]>> {
    return this.request<unknown[]>('/transactions');
  }

  async addTransaction(transaction: unknown): Promise<ApiResponse<unknown>> {
    const result = await this.request<unknown>('/transactions', {
      method: 'POST',
      body: JSON.stringify(transaction),
    });
    // Clear cache after modification
    this.cache.clear();
    return result;
  }

  async updateTransaction(id: string, transaction: unknown): Promise<ApiResponse<unknown>> {
    const result = await this.request<unknown>(`/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(transaction),
    });
    // Clear cache after modification
    this.cache.clear();
    return result;
  }

  async deleteTransaction(id: string): Promise<ApiResponse<unknown>> {
    const result = await this.request<unknown>(`/transactions/${id}`, {
      method: 'DELETE',
    });
    // Clear cache after modification
    this.cache.clear();
    return result;
  }

  // Budget APIs
  async getBudgets(): Promise<ApiResponse<unknown[]>> {
    return this.request<unknown[]>('/budgets');
  }

  async addOrUpdateBudget(budget: unknown): Promise<ApiResponse<unknown>> {
    return this.request<unknown>('/budgets', {
      method: 'POST',
      body: JSON.stringify(budget),
    });
  }

  async deleteBudget(id: string): Promise<ApiResponse<unknown>> {
    return this.request<unknown>(`/budgets/${id}`, {
      method: 'DELETE',
    });
  }

  // Summary APIs
  async getOverview(month: string): Promise<ApiResponse<unknown>> {
    return this.request<unknown>(`/summary/overview?month=${month}`);
  }

  async getCategoryBreakdown(month: string): Promise<ApiResponse<unknown[]>> {
    return this.request<unknown[]>(`/summary/category?month=${month}`);
  }

  async getBudgetVsActual(month: string): Promise<ApiResponse<unknown[]>> {
    return this.request<unknown[]>(`/summary/budget-vs-actual?month=${month}`);
  }

  async getMonthlyTrends(months: number = 6): Promise<ApiResponse<unknown[]>> {
    return this.request<unknown[]>(`/summary/monthly-trends?months=${months}`);
  }

  async getQuarterlyTrends(quarters: number = 6): Promise<ApiResponse<unknown[]>> {
    return this.request<unknown[]>(`/summary/quarterly-trends?quarters=${quarters}`);
  }

  async getYearlyTrends(years: number = 6): Promise<ApiResponse<unknown[]>> {
    return this.request<unknown[]>(`/summary/yearly-trends?years=${years}`);
  }
}

export const apiService = new ApiService(); 