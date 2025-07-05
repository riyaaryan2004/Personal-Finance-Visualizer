# Personal Finance Visualizer

A modern, responsive web application for tracking personal finances with beautiful visualizations and comprehensive analytics.

## 🚀 Features

### 📊 Dashboard
- **Overview Metrics**: Total expenses, budget utilization, top categories, transaction count
- **Interactive Charts**: Pie charts for category breakdown, bar charts for monthly expenses
- **Budget Progress**: Visual progress bars with over-budget indicators
- **Recent Transactions**: Latest transaction history with category icons

### 💳 Transaction Management
- **CRUD Operations**: Create, Read, Update, Delete transactions
- **Advanced Filtering**: Search by description, filter by category, type, and payment method
- **Real-time Analytics**: Income vs expense tracking with balance calculation
- **Transaction Types**: Support for both income and expense transactions
- **Payment Methods**: Track various payment methods (Cash, Credit Card, UPI, etc.)

### 🎯 Budget Management
- **Budget Creation**: Set budgets for different categories with date ranges
- **Progress Tracking**: Visual progress bars with status indicators
- **Over-budget Alerts**: Clear warnings when spending exceeds budget
- **Status Management**: Active, completed, and overdue budget statuses

### 📈 Analytics & Reports
- **Financial Overview**: Income, expenses, balance, and savings rate
- **Category Analysis**: Detailed breakdown of spending by category
- **Payment Method Distribution**: Analysis of payment preferences
- **Monthly Trends**: Income vs expense trends over time
- **Budget Performance**: Performance tracking for all budgets

## 🛠️ Technology Stack

- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **State Management**: React Hooks
- **Routing**: Next.js App Router

## 📁 Project Structure

```
src/
├── app/
│   ├── dashboard/          # Dashboard page
│   ├── transactions/       # Transaction management
│   ├── budgets/           # Budget management
│   ├── analytics/         # Analytics and reports
│   └── layout.tsx         # Root layout with navigation
├── components/
│   ├── ui/                # Base UI components
│   │   └── card.tsx
│   ├── charts/            # Chart components
│   │   ├── CustomTooltip.tsx
│   │   ├── PieChartComponent.tsx
│   │   ├── BarChartComponent.tsx
│   │   └── AreaChartComponent.tsx
│   ├── dashboard/         # Dashboard-specific components
│   │   ├── MetricCard.tsx
│   │   ├── ChartCard.tsx
│   │   ├── BudgetProgressBar.tsx
│   │   └── TransactionItem.tsx
│   └── layout/            # Layout components
│       └── Navigation.tsx
├── constants/
│   ├── dashboard.ts       # Dashboard constants
│   └── data.ts           # Demo data and interfaces
└── utils/
    └── formatters.ts      # Utility functions
```

## 🎨 Design Features

- **Modern UI**: Clean, professional design with gradients and shadows
- **Responsive**: Mobile-first design that works on all devices
- **Interactive**: Hover effects, transitions, and smooth animations
- **Color-coded**: Category-based color coding for easy identification
- **Accessibility**: Proper contrast ratios and semantic HTML

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd finance-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 📱 Pages Overview

### Dashboard (`/dashboard`)
- Financial overview with key metrics
- Interactive charts and visualizations
- Budget progress tracking
- Recent transaction list

### Transactions (`/transactions`)
- Complete transaction management
- Advanced filtering and search
- Add/Edit/Delete transactions
- Real-time analytics

### Budgets (`/budgets`)
- Budget creation and management
- Progress tracking with visual indicators
- Status management (Active/Completed/Overdue)
- Performance analytics

### Analytics (`/analytics`)
- Detailed financial reports
- Category-wise analysis
- Payment method distribution
- Monthly trends and patterns

## 🔧 Customization

### Adding New Categories
Edit `src/constants/data.ts`:
```typescript
export const DEMO_CATEGORIES: Category[] = [
  // Add your new category here
  { id: '12', name: 'New Category', color: '#your-color', icon: '🎯', type: 'expense' }
];
```

### Modifying Charts
Update chart components in `src/components/charts/` to customize:
- Colors and styling
- Chart types and configurations
- Tooltip content and formatting

### Styling Changes
Modify Tailwind classes in components or update `tailwind.config.js` for:
- Color schemes
- Typography
- Spacing and layout

## 🔮 Future Enhancements

- **Backend Integration**: Connect to real API endpoints
- **Data Persistence**: Local storage or database integration
- **Export Features**: PDF/Excel report generation
- **Notifications**: Budget alerts and reminders
- **Multi-currency**: Support for different currencies
- **Goal Setting**: Financial goal tracking
- **Recurring Transactions**: Automatic transaction scheduling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Recharts** for beautiful chart components
- **Lucide React** for consistent iconography
- **Tailwind CSS** for utility-first styling
- **Next.js** for the amazing React framework

---

**Note**: This is currently using demo data. Backend integration will be implemented in the next phase.
