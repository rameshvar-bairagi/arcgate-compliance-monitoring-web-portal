import { useAppDispatch } from '@/hooks/useRedux';
import { fetchDashboardAlerts } from '@/services/dashboardService';
import { useQuery } from '@tanstack/react-query';

export const useDashboardData = () => {
//   const summaryQuery = useQuery({
//     queryKey: ['dashboard', 'summary'],
//     queryFn: fetchDashboardSummary,
//   });

  const alertsQuery = useQuery({
    queryKey: ['dashboard', 'alerts'],
    queryFn: fetchDashboardAlerts,
  });

  return {
    // summary: summaryQuery.data,
    alerts: alertsQuery.data,
    isLoading: alertsQuery.isLoading,
    error: alertsQuery.error,
  };
};