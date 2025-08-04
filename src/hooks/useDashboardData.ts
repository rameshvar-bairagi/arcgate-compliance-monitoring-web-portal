import { useAppDispatch } from '@/hooks/useRedux';
import { fetchDashboardAlerts, fetchDashboardCompliance } from '@/services/dashboardService';
import { ComplianceRequestBody } from '@/types/dashboard';
import { useQuery } from '@tanstack/react-query';

export const useDashboardData = (body: ComplianceRequestBody, enabled: boolean = false) => {
  
  const {
    data: complianceData,
    isLoading: complianceLoading,
    error: complianceError,
    refetch: refetchCompliance, // 👈 custom alias
  } = useQuery({
    queryKey: ['dashboard', body] as [string, ComplianceRequestBody],
    queryFn: fetchDashboardCompliance,
    enabled,
  });

  const {
    data: alertsData,
    isLoading: alertsLoading,
    error: alertsError,
    refetch: refetchAlerts, // 👈 custom alias
  } = useQuery({
    queryKey: ['dashboard', 'alerts'],
    queryFn: fetchDashboardAlerts,
  });

  // const refetchAll = async () => {
  //   await Promise.all([refetchCompliance(), refetchAlerts()]);
  // };

  return {
    complianceData,
    complianceLoading,
    complianceError,
    alertsData,
    alertsLoading,
    alertsError,
    refetchCompliance, // manually refetch compliance only
    refetchAlerts, // manually refetch alerts only
    // refetchAll, // call both in parallel
  };
};