/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import ContentHeader from '@/components/ui/ContentHeader';
import ContentWrapper from '@/components/ui/ContentWrapper';
import Section from '@/components/ui/Section';
import Row from '@/components/ui/Row';
import Col from '@/components/ui/Col';
import Card from '@/components/ui/Card';
import CardBody from '@/components/ui/CardBody';
import { getBadgeClass, getDateOptions, getReportTypeOption, getExportOption, getClientGroupOptions, getReportTypeOptions } from '@/utils/commonMethod';
import { useState, useEffect, useMemo, Key } from "react";
import Select, { MultiValue } from "react-select";
import { toast } from "react-toastify";
import FinancialYearDatePicker from '@/components/ui/FinancialYearDatePicker/FinancialYearDatePicker';
import CardHeader from '@/components/ui/CardHeader';
import CardFooter from '@/components/ui/CardFooter';
import { useClientGroupList, useScheduledReportsList } from '@/hooks/useOptionList';
import { ExportOverAllData, SystemsRequestBody } from '@/types/systems';
import { useSystems } from '@/hooks/useSystems';
import { mapFilterDateToRequestDate } from '@/utils/dateUtils';
import ExportButtons from '@/components/exportData/ExportButtons';
import Modal from '@/components/modal/Modal';
import { ScheduleForm } from '@/types/scheduleForm';
import ScheduleReportModal from '@/components/modal/ScheduleReportModal';
import { useQueryClient } from "@tanstack/react-query";
import { updateScheduledReport } from '@/services/allApiService';
import { Alerts, AlertsRequestBody } from '@/types/alerts';
import { useReportAlerts } from '@/hooks/useAlerts';
export interface Option<T = string> {
  label: string;
  value: T;
}

type Filters = {
  date: string;
  reportType: string;
  clientGroups?: string | number;
  startDate?: Date;
  endDate?: Date;
  page: number;
  size: number;
  sortBy?: string; // Add these
  sortDirection?: 'asc' | 'desc';
};

type SchedulePayload = Omit<ScheduleForm, "start_date" | "recipients"> & {
  start_date: string | null;
  recipients: string[] | string;
};

export default function ReportsPage() {
  const queryClient = useQueryClient();
  const dateOptions = getDateOptions();
  // const reportTypeOption = getReportTypeOption();
  const exportOption = getExportOption();
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Reports', active: true },
  ];

  const { 
    list: clientGroupList,
    loading: clientGroupListLoading,
    error: clientGroupListError
  } = useClientGroupList();
  const clientGroupOptions = getClientGroupOptions(clientGroupList ?? []);
  // console.log(clientGroupList, 'clientGroupList');
  
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ScheduleForm | null>(null);

  const { 
        list: scheduledReportsList,
        loading: scheduledReportsLoading,
        error: scheduledReportsError
    } = useScheduledReportsList();
  // console.log(scheduledReportsList,'scheduledReportsList');
  const reportTypeOption: Option<string | number>[] = getReportTypeOption(scheduledReportsList ?? []);
  // console.log(reportTypeOption,'reportTypeOption');

  // Manage filters in state
  const [filters, setFilters] = useState<Filters>({
    date: dateOptions[0].value,
    reportType: String(reportTypeOption[0]?.value),
    clientGroups: "",
    page: 0,
    size: 3000,
    sortBy: "", // Add sort fields
    sortDirection: "desc" as 'asc' | 'desc',
  });
  // console.log(filters, 'filtersfiltersfilters');

  const requestOverallBody = useMemo<SystemsRequestBody>(() => {
    // const date = mapFilterDateToRequestDate(filters.date);
    return {
      // date,
      date: filters.date,
      systemName: "",
      complianceRule: "",
      clientGroup: filters.reportType === "clientGroupCompliance" ? Number(filters?.clientGroups) : "",
      metricList: null,
      page: 1,
      size: filters.size,
      sortBy: filters.sortBy ?? "",
      sortDirection: filters.sortDirection ?? "",
    };
  }, [filters]);
  // console.log(requestOverallBody, 'requestOverallBody');

  const fileNamesByReportType: Record<string, string> = {
    overallComplianceSummary: "Overall_Compliance_Report",
    clientGroupCompliance: "Client_Group_Compliance_Report",
    soc2Compliance: "SOC2_Compliance_Report",
    alertHistory: "Alert_History_Report",
  };
  
  const headersByReportType: Record<string, string[]> = {
    overallComplianceSummary: [
      "IP Address",
      "Compliance Status",
      "Compliance Services",
      "Non-Compliance Services",
      "System Date",
    ],
    clientGroupCompliance: [
      "IP Address",
      "Compliance Status",
      "Compliance Services",
      "Non-Compliance Services",
      "System Date",
    ],
    // clientGroupCompliance: [
    //   "Client Groups",
    //   "Systems IP's",
    //   "Compliant Rules",
    //   "Compliant Metrics",
    //   "Non-Compliant Metrics",
    // ],
    soc2Compliance: [
      "Control ID",
      "Control Description",
      "Compliant Systems",
      "Non-Compliant Systems",
      "Compliance %",
    ],
    alertHistory: [
      "System Name",
      "Non-Compliant Systems",
      "Client Groups",
      "Compliance Rules",
      "Level",
      "Systems Date",
      "Status",
    ],
  };

  const exportFileName = useMemo(() => {
    const baseName = fileNamesByReportType[filters.reportType] || "Report";
    const dateSuffix = new Date().toISOString().split("T")[0]; // e.g., "2025-09-02"
    return `${baseName}_${dateSuffix}`;
  }, [filters.reportType]);

  const reportHeaders = useMemo(() => {
    return headersByReportType[filters.reportType] || [];
  }, [filters.reportType]);

  const isOverallSelected = filters.reportType === "overallComplianceSummary" || filters.reportType === "clientGroupCompliance";

  const { 
    systemsData, 
    systemsLoading, 
    systemsError, 
    refetchSystems 
  } = useSystems(requestOverallBody, isOverallSelected); // if isOverallSelected true then call useSystem
  // console.log(systemsData,'Overall Compliance Summary');

  const requestReportsAlertBody = useMemo<AlertsRequestBody>(() => ({
    date: filters.date,
  }), [filters]);
  
  // Call the hook with filters
  const isReportAlertSelected = filters.reportType === "alertHistory";
  const { 
    reportAlertsData, 
    reportAlertsLoading, 
    reportAlertsError, 
    refetchReportAlerts 
  } = useReportAlerts(requestReportsAlertBody, isReportAlertSelected);
  // console.log(reportAlertsData,'reportAlertsData');

  const updateFilters = (updates: Partial<Filters>, resetPage = true) => {
    setFilters(prev => {
      const newFilters = {
        ...prev,
        ...updates,
        ...(resetPage ? { page: 0 } : {}),
      };

      // Prevent unnecessary state updates
      if (JSON.stringify(prev) === JSON.stringify(newFilters)) return prev;
      return newFilters;
    });
  };

  const transformedData = useMemo(() => {
    if (filters.reportType === "overallComplianceSummary" || filters.reportType === "clientGroupCompliance") {
      return (systemsData?.content ?? []).map((item: ExportOverAllData) => ({
        "IP Address": item.ip,
        "Compliance Status": item.complianceStatus ? "Compliant" : "Non-Compliant",
        "Compliance Services": item.complianceServices.join(", "),
        "Non-Compliance Services": item.nonComplianceServices.join(", "),
        "System Date": item.systemDate,
      }));
    }

    if (filters.reportType === "alertHistory") {
      return (reportAlertsData ?? []).map((item: Alerts) => ({
        "System Name": item?.ip,
        "Non-Compliant Systems": Array.isArray(item?.metricsName)
          ? item.metricsName.join(", ")
          : item?.metricsName || "-",
        "Client Groups": item?.clientGroupName || "-",
        "Compliance Rules": item?.complianceRuleName || "-",
        "Level": item?.level || "-",
        "Systems Date": item?.systemDate,
        "Status": item?.status,
      }));
    }

    return [];
  }, [systemsData, reportAlertsData, filters.reportType]);

  const handleEditClick = (report: ScheduleForm) => {
    setSelectedReport(report);
    setModalOpen(true);
  };

  const handleSaveSchedule = async (data: ScheduleForm) => {
    // console.log("Saved:", data);
    // Ensure start_date is in yyyy-MM-dd format
    // const payload = {
    //   ...data,
    //   start_date: data.start_date instanceof Date
    //     ? format(data.start_date, "yyyy-MM-dd")
    //     : data.start_date,
    // };
    const payload: SchedulePayload = {
      ...data,
      start_date: data.start_date instanceof Date
        ? data.start_date.toISOString().split("T")[0]
        : data.start_date,
      recipients: Array.isArray(data.recipients)
        ? data.recipients.join(", ")
        : data.recipients,
    };
    try {
      const res = await updateScheduledReport(payload);
      if (res?.status === 200 || res?.status === 204) {
        // console.log(res,'Update-Scheduled-Report');
        toast.dismiss();
        toast.success("Scheduled Reports: Updated successfully!");
        setModalOpen(false);
        queryClient.invalidateQueries({ queryKey: ["scheduledReportsList"] });
      } else {
        toast.dismiss();
        toast.error(`Failed to update scheduled report: ${res?.status} ${res?.statusText}`);
      }
    } catch (err: any) {
      // console.log(err,'errerrerrerr')
      if (err.status === 409) {
        toast.dismiss();
        toast.error(`Failed to update scheduled report: ${err.response.data || "Unknown error"}`);
      } else {
        toast.dismiss();
        toast.error(`Failed to update scheduled report: ${err?.message || "Unknown error"}`);
      }
    }
  };

  return (
    <ContentWrapper>
      <ContentHeader title="Reports" breadcrumbItems={breadcrumbItems} containerHeaderClassName={"content-header pb-0"} />
      <Section className={'content'}>
        <div className="container-fluid">
          <Row>
            <Col className="col-12">
              <Card>
                <CardBody className="p-0">
                  <Row className='p-2 d-flex justify-content-start'>
                    <Col className="col-md-3 mt-2 mb-2">
                      <div className="form-group mb-0">
                        <Select
                          options={reportTypeOption}
                          value={reportTypeOption.find((opt) => opt.value === filters.reportType) || null}
                          onChange={(newValue) =>
                            updateFilters({
                              reportType: String(newValue?.value) || "",
                              clientGroups: newValue?.value === "clientGroupCompliance" ? clientGroupOptions[0]?.value : "",
                            })
                          }
                          classNamePrefix="react-select"
                          className={`react-select-container`}
                          placeholder={"Select report type..."}
                          isClearable={false}
                        />
                      </div>
                    </Col>
                    {filters.reportType === 'clientGroupCompliance' && (
                      <Col className="col-md-3 mt-2 mb-2">
                        <div className="form-group mb-0">
                          <Select
                            options={clientGroupOptions}
                            // isMulti
                            value={clientGroupOptions.find((opt: any) => opt.value === filters.clientGroups) || null}
                            onChange={(newValue) =>
                              updateFilters({
                                clientGroups: newValue?.value || "",
                              })
                            }
                            classNamePrefix="react-select"
                            className={`react-select-container`}
                            placeholder={"Select client groups..."}
                            isClearable={false}
                          />
                        </div>
                      </Col>
                    )}
                    <Col className="col-md-3 mt-2 mb-2">
                      <div className="form-group mb-0">
                        <Select
                          options={dateOptions}
                          value={dateOptions.find((opt) => opt.value === filters.date) || null}
                          onChange={(newValue) =>
                            updateFilters({
                              date: newValue?.value || "",
                            })
                          }
                          classNamePrefix="react-select"
                          className={`react-select-container`}
                          placeholder={"Select date..."}
                          isClearable={false}
                        />
                        {/* <FinancialYearDatePicker
                          onChange={({ startDate, endDate, date }) => {
                            console.log();
                            updateFilters({
                              startDate,
                              endDate,
                              date,
                            });
                          }}
                        /> */}
                      </div>
                    </Col>
                    <Col className={`mt-2 mb-2 ${filters.reportType === 'clientGroupCompliance' ? 'col-md-3' : 'col-md-6'}`}>
                      <div className="d-flex justify-content-end">
                        {((systemsData && systemsData?.content?.length > 0) || (reportAlertsData?.length > 0)) && (
                          <ExportButtons
                            data={transformedData}
                            fileName={exportFileName}
                            headers={reportHeaders}
                          />
                        )}
                        {/* <button type="button" className={`btn btn-success ${filters.reportType !== 'clientGroupCompliance' ? 'btn-block' : ''}`}>
                          Generate Report
                        </button> */}
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col className="col-md-12">
              <Card className="card-outline card-info">
                <CardHeader 
                  title="Scheduled Reports" 
                  transparentBorder={false}
                  showTools={false}
                  actionText="" 
                  actionHref="javascript:void(0);" 
                />
                <CardBody className='table-responsive p-0'>
                    <table className="table table-striped table-hover">
                      <thead>
                        <tr>
                          <th>Report Type</th>
                          <th>Frequency</th>
                          <th>Recipients</th>
                          <th>Next Run</th>
                          <th>Format</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {scheduledReportsList?.map((schedule, idx) => (
                          <tr key={idx}>
                            <td>{schedule.name}</td>
                            <td>{schedule.frequency}</td>
                            <td>
                              {Array.isArray(schedule?.recipients)
                              ? schedule.recipients.join(", ")
                              : typeof schedule?.recipients === "string"
                                ? schedule.recipients
                                : "-"}
                            </td>
                            <td>{new Date(schedule.start_date)?.toLocaleDateString()}</td>
                            <td>{schedule.format}</td>
                            <td>
                              <span className={schedule.status === 'ON' ? 'text-success' : 'text-danger'}>
                                {schedule.status}
                              </span>
                            </td>
                            <td>
                              <a
                                href="#"
                                className="nav-link"
                                role="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleEditClick(schedule);
                                }}
                              >
                                <i className="fas fa-edit text-info"></i>
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                </CardBody>
                <CardFooter />
              </Card>
            </Col>
          </Row>
        </div>
      </Section>

      <ScheduleReportModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveSchedule}
        initialData={selectedReport}
      />
    </ContentWrapper>
  );
}
