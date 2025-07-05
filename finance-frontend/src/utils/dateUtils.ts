export const getCurrentMonth = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

export const getMonthRange = (monthStr: string): { start: Date; end: Date } => {
  const start = new Date(`${monthStr}-01`);
  const end = new Date(start);
  end.setMonth(end.getMonth() + 1);
  return { start, end };
};

export const formatMonthYear = (monthStr: string): string => {
  const [year, month] = monthStr.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
};

export const formatPeriodLabel = (periodStr: string): string => {
  // Handle quarterly format: "1st Quarter 2024", "2nd Quarter 2024", etc.
  if (periodStr.includes('Quarter')) {
    return periodStr;
  }
  
  // Handle yearly format: "2024"
  if (periodStr.length === 4 && !periodStr.includes('-')) {
    return periodStr;
  }
  
  // Handle monthly format: "2024-01"
  if (periodStr.includes('-')) {
    return formatMonthYear(periodStr);
  }
  
  return periodStr;
};

export const getMonthOptions = (monthsBack: number = 12): string[] => {
  const options: string[] = [];
  const now = new Date();
  
  for (let i = 0; i < monthsBack; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    options.push(monthStr);
  }
  
  return options;
};

export const getYearOptions = (yearsBack: number = 5): number[] => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: yearsBack }, (_, i) => currentYear - i);
};

export const filterTransactionsByMonth = (transactions: any[], monthStr: string): any[] => {
  const { start, end } = getMonthRange(monthStr);
  
  return transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return transactionDate >= start && transactionDate < end;
  });
};

export const filterTransactionsByYear = (transactions: any[], year: number): any[] => {
  const start = new Date(year, 0, 1);
  const end = new Date(year + 1, 0, 1);
  
  return transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return transactionDate >= start && transactionDate < end;
  });
}; 