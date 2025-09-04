/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import ContentHeader from '@/components/ui/ContentHeader';
import ContentWrapper from '@/components/ui/ContentWrapper';
import Section from '@/components/ui/Section';
import Row from '@/components/ui/Row';
import Col from '@/components/ui/Col';
import Card from '@/components/ui/Card';
import CardBody from '@/components/ui/CardBody';
import { getBadgeClass, getDateOptions, getReportTypeOption, getExportOption, getClientGroupOptions } from '@/utils/commonMethod';
import { useState, useEffect, useMemo, Key } from "react";
import Select, { MultiValue } from "react-select";
import { toast } from "react-toastify";
import FinancialYearDatePicker from '@/components/ui/FinancialYearDatePicker/FinancialYearDatePicker';
import CardHeader from '@/components/ui/CardHeader';
import CardFooter from '@/components/ui/CardFooter';
import { useClientGroupList } from '@/hooks/useOptionList';
import { ExportOverAllData, SystemsRequestBody } from '@/types/systems';
import { useSystems } from '@/hooks/useSystems';
import { mapFilterDateToRequestDate } from '@/utils/dateUtils';
import ExportButtons from '@/components/exportData/ExportButtons';
import Modal from '@/components/modal/Modal';
import { ScheduleForm } from '@/types/scheduleForm';
import ScheduleReportModal from '@/components/modal/ScheduleReportModal';

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

export default function ReportsPage() {
  const dateOptions = getDateOptions();
  const reportTypeOption = getReportTypeOption();
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

  // Manage filters in state
  const [filters, setFilters] = useState<Filters>({
    date: dateOptions[0].value,
    reportType: reportTypeOption[0].value,
    clientGroups: "",
    page: 0,
    size: 10,
    sortBy: "", // Add sort fields
    sortDirection: "desc" as 'asc' | 'desc',
  });
  console.log(filters, 'filtersfiltersfilters');

  const requestOverallBody = useMemo<SystemsRequestBody>(() => {
    const date = mapFilterDateToRequestDate(filters.date);
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

  const isOverallSelected = filters.reportType === "overallComplianceSummary";

  const { 
    systemsData, 
    systemsLoading, 
    systemsError, 
    refetchSystems 
  } = useSystems(requestOverallBody, isOverallSelected); // if isOverallSelected true then call useSystem
  console.log(systemsData,'Overall Compliance Summary');



  useEffect(() => {
    if (
      filters.reportType === 'clientGroupCompliance' &&
      !filters.clientGroups &&
      clientGroupOptions.length > 0
    ) {
      setFilters((prev) => ({
        ...prev,
        clientGroups: clientGroupOptions[0].value, // Default to the first available group
      }));
    }
  }, [filters.reportType, filters.clientGroups, clientGroupOptions]);

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

    // if (filters.reportType === "clientGroupCompliance") {
    //   return (clientGroupList ?? []).map((group: any) => {
    //     const systemsIPs = group.allSystems
    //       ? "All Systems"
    //       : (group.systemIps || []).join(", ");

    //     const rule = group.complianceRules?.[0]; // single rule assumed

    //     const compliantRules = rule?.name || "-";

    //     const compliantMetrics = (rule?.compliantMetrics ?? [])
    //       .map((metric: any) => metric.metricsName)
    //       .join(", ") || "-";

    //     const nonCompliantMetrics = (rule?.nonCompliantMetrics ?? [])
    //       .map((metric: any) => metric.metricsName)
    //       .join(", ") || "-";

    //     return {
    //       "Client Groups": group.name,
    //       "Systems IP's": systemsIPs,
    //       "Compliant Rules": compliantRules,
    //       "Compliant Metrics": compliantMetrics,
    //       "Non-Compliant Metrics": nonCompliantMetrics,
    //     };
    //   });
    // }

    return [];
  }, [systemsData, filters.reportType]);

  const dummyScheduleData: ScheduleForm[] = [
    {
      reportType: 'Overall Compliance Summary',
      frequency: 'Monthly',
      recipients: ['arcgate@gmail.com'],
      format: 'PDF',
      startDate: new Date('2025-10-07'),
      status: 'Active',
    },
    {
      reportType: 'SOC2 Compliance',
      frequency: 'Daily',
      recipients: ['arcgate@gmail.com'],
      format: 'CSV',
      startDate: new Date('2025-10-07'),
      status: 'Inactive',
    },
    {
      reportType: 'Client Group Compliance',
      frequency: 'Weekly',
      recipients: ['arcgate@gmail.com'],
      format: 'Excel',
      startDate: new Date('2025-10-07'),
      status: 'Inactive',
    },
    {
      reportType: 'Alert History',
      frequency: 'Daily',
      recipients: ['arcgate@gmail.com'],
      format: 'DOC',
      startDate: new Date('2025-10-07'),
      status: 'Inactive',
    },
  ];

  const handleEditClick = (report: ScheduleForm) => {
    setSelectedReport(report);
    setModalOpen(true);
  };

  const handleSaveSchedule = (data: ScheduleForm) => {
    console.log("Saved:", data);
    // TODO: Update backend or state here
    setModalOpen(false);
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
                              reportType: newValue?.value || "",
                              clientGroups: newValue?.value === "clientGroupCompliance" ? filters.clientGroups : "",
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
                            isClearable={true}
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
                        {systemsData && systemsData?.content?.length > 0 && (
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
                        {dummyScheduleData.map((schedule, idx) => (
                          <tr key={idx}>
                            <td>{schedule.reportType}</td>
                            <td>{schedule.frequency}</td>
                            <td>{schedule.recipients.join(', ')}</td>
                            <td>{schedule.startDate?.toLocaleDateString()}</td>
                            <td>{schedule.format}</td>
                            <td>
                              <span className={schedule.status === 'Active' ? 'text-success' : 'text-danger'}>
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
