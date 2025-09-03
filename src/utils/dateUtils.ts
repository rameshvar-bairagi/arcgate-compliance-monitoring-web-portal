
// utils/dateUtils.ts
import { startOfToday, subDays } from "date-fns";

type DateRange = [Date, Date];

export const getFinancialYearRanges = (): Record<string, DateRange> => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  const isBeforeApril = currentMonth < 3;

  const fyStart = new Date(isBeforeApril ? currentYear - 1 : currentYear, 3, 1);
  const fyEnd = new Date(isBeforeApril ? currentYear : currentYear + 1, 2, 31);

  const lastFyStart = new Date(fyStart.getFullYear() - 1, 3, 1);
  const lastFyEnd = new Date(fyStart.getFullYear(), 2, 31);

  return {
    today: [startOfToday(), startOfToday()],
    last7Days: [subDays(startOfToday(), 6), startOfToday()],
    last30Days: [subDays(startOfToday(), 29), startOfToday()],
    thisFY: [fyStart, fyEnd],
    lastFY: [lastFyStart, lastFyEnd],
  };
};
