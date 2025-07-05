# Personal Finance Visualizer

A modern, full-stack web application for tracking personal finances with beautiful visualizations, comprehensive analytics, and real-time data management.

## 🚀 Features

### 📊 Dashboard
- **Overview Metrics**: Total expenses, budget utilization, top categories, transaction count
- **Interactive Charts**: Pie charts for category breakdown, bar charts for monthly expenses
- **Budget Progress**: Visual progress bars with over-budget indicators
- **Recent Transactions**: Latest transaction history with category icons

### 💳 Transaction Management
- **CRUD Operations**: Create, Read, Update, Delete transactions
- **Advanced Filtering**: Search by description, filter by category and date ranges
- **Real-time Analytics**: Expense tracking with balance calculation
- **Transaction Categories**: Support for various expense categories
- **Date-based Sorting**: Transactions sorted by date with most recent first

### 🎯 Budget Management
- **Budget Creation**: Set budgets for different categories with date ranges
- **Progress Tracking**: Visual progress bars with status indicators
- **Over-budget Alerts**: Clear warnings when spending exceeds budget
- **Status Management**: Active, completed, and overdue budget statuses

### 📈 Analytics & Reports
- **Financial Overview**: Total expenses, transaction counts, spending insights
- **Category Analysis**: Detailed breakdown of spending by category
- **Monthly Trends**: Expense trends over time with quarterly/yearly views
- **Budget Performance**: Performance tracking for all budgets
- **Spending Insights**: Smart analysis and recommendations

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **State Management**: React Hooks
- **Routing**: Next.js App Router

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **API**: RESTful API with JSON responses
- **CORS**: Cross-origin resource sharing enabled
- **Environment**: Configurable via environment variables

## 📁 Project Structure

```
Personal-Finance-Visualizer/
├── finance-backend/           # Backend API server
│   ├── controllers/          # API controllers
│   │   ├── budget.controller.js
│   │   ├── transaction.controller.js
│   │   └── summary.controller.js
│   ├── models/              # Database models
│   │   ├── budget.model.js
│   │   └── transaction.model.js
│   ├── routes/              # API routes
│   │   ├── budget.route.js
│   │   ├── transaction.route.js
│   │   └── summary.route.js
│   ├── config/              # Database configuration
│   │   └── db.js
│   ├── sampleData.js        # Sample data seeding
│   ├── app.js              # Express app setup
│   └── server.js           # Server entry point
├── finance-frontend/         # Frontend application
│   ├── src/
│   │   ├── app/            # Next.js app router pages
│   │   │   ├── dashboard/  # Dashboard page
│   │   │   ├── transactions/ # Transaction management
│   │   │   ├── budgets/    # Budget management
│   │   │   ├── analytics/  # Analytics and reports
│   │   │   └── layout.tsx  # Root layout
│   │   ├── components/     # React components
│   │   │   ├── ui/         # Base UI components
│   │   │   ├── charts/     # Chart components
│   │   │   ├── dashboard/  # Dashboard components
│   │   │   └── layout/     # Layout components
│   │   ├── constants/      # Application constants
│   │   ├── services/       # API service functions
│   │   └── utils/          # Utility functions
│   └── package.json        # Frontend dependencies
└── README.md              # This file
```

## 🎨 Design Features

- **Modern UI**: Clean, professional design with gradients and glassmorphism
- **Responsive**: Mobile-first design that works on all devices
- **Interactive**: Hover effects, transitions, and smooth animations
- **Color-coded**: Category-based color coding for easy identification
- **Accessibility**: Proper contrast ratios and semantic HTML
- **Currency**: Indian Rupee (₹) formatting throughout the application

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd finance-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file:
   ```env
   MONGODB_URI=mongodb://localhost:27017/finance-app
   PORT=5000
   ```

4. **Start the backend server**
   ```bash
   npm start
   ```

5. **Seed sample data (optional)**
   ```bash
   node sampleData.js
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
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
- Monthly, quarterly, and yearly trends
- Spending insights and recommendations

## 🔧 API Endpoints

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Budgets
- `GET /api/budgets` - Get all budgets
- `POST /api/budgets` - Create new budget
- `PUT /api/budgets/:id` - Update budget
- `DELETE /api/budgets/:id` - Delete budget

### Summary/Analytics
- `GET /api/summary` - Get financial summary
- `GET /api/summary/monthly-trends` - Monthly trends
- `GET /api/summary/quarterly-trends` - Quarterly trends
- `GET /api/summary/yearly-trends` - Yearly trends

## 🔧 Customization

### Adding New Categories
Edit backend models and frontend constants to add new transaction categories.

### Modifying Charts
Update chart components in `finance-frontend/src/components/charts/` to customize:
- Colors and styling
- Chart types and configurations
- Tooltip content and formatting

### Styling Changes
Modify Tailwind classes in components or update `tailwind.config.js` for:
- Color schemes
- Typography
- Spacing and layout

## 🔮 Future Enhancements

- **User Authentication**: Multi-user support with secure login
- **Data Export**: PDF/Excel report generation
- **Notifications**: Budget alerts and reminders
- **Multi-currency**: Support for different currencies
- **Goal Setting**: Financial goal tracking
- **Recurring Transactions**: Automatic transaction scheduling
- **Mobile App**: React Native mobile application
- **Advanced Analytics**: Machine learning insights



## 🙏 Acknowledgments

- **Recharts** for beautiful chart components
- **Lucide React** for consistent iconography
- **Tailwind CSS** for utility-first styling
- **Next.js** for the amazing React framework
- **Express.js** for the robust backend framework
- **MongoDB** for the flexible database solution

---

**Personal Finance Visualizer** - Take control of your financial future with beautiful insights and smart recommendations. 