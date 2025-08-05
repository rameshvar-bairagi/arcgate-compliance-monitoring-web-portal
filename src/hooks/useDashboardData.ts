import { fetchDashboardAlerts, fetchDashboardCompliance } from '@/services/dashboardService';
import { ComplianceRequestBody } from '@/types/dashboard';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const useDashboardData = (body: ComplianceRequestBody, enabled: boolean = false) => {
  
  const {
    data: complianceData,
    isLoading: complianceLoading,
    error: complianceError,
    refetch: refetchCompliance, // custom alias
  } = useQuery({
    queryKey: ['dashboard', body] as [string, ComplianceRequestBody],
    queryFn: fetchDashboardCompliance,
    enabled,
    retry: false, // Don't retry on error
  });

  const {
    data: alertsData,
    isLoading: alertsLoading,
    error: alertsError,
    refetch: refetchAlerts, // custom alias
  } = useQuery({
    queryKey: ['alerts', body] as [string, ComplianceRequestBody],
    queryFn: fetchDashboardAlerts,
    enabled,
    retry: false, // Don't retry on error
  });

  // const refetchAll = async () => {
  //   await Promise.all([refetchCompliance(), refetchAlerts()]);
  // };

  return {
    complianceData,
    complianceLoading,
    complianceError: complianceError as AxiosError | null,
    alertsData,
    alertsLoading,
    alertsError: alertsError as AxiosError | null,
    refetchCompliance, // manually refetch compliance only
    refetchAlerts, // manually refetch alerts only
    // refetchAll, // call both in parallel
  };
};