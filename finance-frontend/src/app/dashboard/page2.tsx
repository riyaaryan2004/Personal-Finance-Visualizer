
// src/app/dashboardpage.tsx

'use client';
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent } from '@/components/ui/card';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c', '#d0ed57', '#ffbb28', '#ff6666'];
type CategoryData = {
  category: string;
  amount: number;
};
type BarData = {
  name: string;
  amount: number;
};
type Transaction = {
  amount: number;
  category: string;
  date: string; // or `Date` if you're converting
  description?: string;
};
const Dashboard = () => {
const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
const [barData, setBarData] = useState<BarData[]>([]);
const [total, setTotal] = useState(0);
const [recent, setRecent] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const month = '2025-07';

      const [catRes, overviewRes] = await Promise.all([
        axios.get(`${baseUrl}/api/summary/category?userId=demo&month=${month}`),
        axios.get(`${baseUrl}/api/summary/overview?userId=demo&month=${month}`),
      ]);

      setCategoryData(catRes.data);
      setTotal(overviewRes.data.totalExpenses);
      setRecent(overviewRes.data.recentTransactions);

      const bar = catRes.data.map((d: { category: string; amount: number }) => ({
  name: d.category,
  amount: d.amount,
}));

      setBarData(bar);
    };

    fetchData();
  }, []);

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">💰 Monthly Finance Dashboard</h1>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-muted-foreground">Total Expenses</p>
            <p className="text-xl font-semibold">₹{total}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-muted-foreground">Top Category</p>
            <p className="text-xl font-semibold">
              {categoryData[0]?.category || 'N/A'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-muted-foreground">Recent Transactions</p>
            <ul className="text-sm">
              {recent.map((t, i) => (
                <li key={i}>
                  ₹{t.amount} - {t.category}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-2">Category Breakdown</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  dataKey="amount"
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {categoryData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bar Chart */}
        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-2">Expenses by Category</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default Dashboard;
