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

type Filters = {
  date: string;
  reportType: string;
  export: string,
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

  // Manage filters in state
  const [filters, setFilters] = useState<Filters>({
    date: dateOptions[0].value,
    reportType: reportTypeOption[0].value,
    export: exportOption[0].value,
    page: 0,
    size: 10,
    sortBy: "", // Add sort fields
    sortDirection: "desc" as 'asc' | 'desc',
  });

  const { 
    list: clientGroupList,
    loading: clientGroupListLoading,
    error: clientGroupListError
  } = useClientGroupList();
  const clientGroupOptions = getClientGroupOptions(clientGroupList ?? []);

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
                        <FinancialYearDatePicker
                          onChange={({ startDate, endDate }) => {
                            updateFilters({
                              startDate,
                              endDate,
                            });
                          }}
                        />
                      </div>
                    </Col>
                    <Col className="col-md-3 mt-2 mb-2">
                      <div className="form-group mb-0">
                        <Select
                          options={exportOption}
                          value={exportOption.find((opt) => opt.value === filters.export) || null}
                          onChange={(newValue) =>
                            updateFilters({
                              export: newValue?.value || "",
                            })
                          }
                          classNamePrefix="react-select"
                          className={`react-select-container`}
                          placeholder={"Select export format..."}
                          isClearable={false}
                        />
                      </div>
                    </Col>
                    <Col className={`mt-2 mb-2 ${filters.reportType === 'clientGroupCompliance' ? 'col-md-12' : 'col-md-3'}`}>
                      <div className="d-flex justify-content-end">
                        <button type="button" className={`btn btn-success ${filters.reportType !== 'clientGroupCompliance' ? 'btn-block' : ''}`}>
                          Generate Report
                        </button>
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
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Overall Compliance Summary</td>
                          <td>Monthly</td>
                          <td>arcgate@gmail.com</td>
                          <td>Oct 7</td>
                          <td>Active</td>
                          <td>
                            <a className="nav-link" href="#" role="button">
                              <i className="fas fa-edit text-info"></i>
                            </a>
                          </td>
                        </tr>
                        <tr>
                          <td>SOC2 Compliance</td>
                          <td>Daily</td>
                          <td>arcgate@gmail.com</td>
                          <td>Oct 7</td>
                          <td>Active</td>
                          <td>
                            <a className="nav-link" href="#" role="button">
                              <i className="fas fa-edit text-info"></i>
                            </a>
                          </td>
                        </tr>
                        <tr>
                          <td>Client Group Compliance</td>
                          <td>Weekly</td>
                          <td>arcgate@gmail.com</td>
                          <td>Oct 7</td>
                          <td>Active</td>
                          <td>
                            <a className="nav-link" href="#" role="button">
                              <i className="fas fa-edit text-info"></i>
                            </a>
                          </td>
                        </tr>
                        <tr>
                          <td>Alert History</td>
                          <td>Daily</td>
                          <td>arcgate@gmail.com</td>
                          <td>Oct 7</td>
                          <td>Active</td>
                          <td>
                            <a className="nav-link" href="#" role="button">
                              <i className="fas fa-edit text-info"></i>
                            </a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                </CardBody>
                <CardFooter />
              </Card>
            </Col>
          </Row>
        </div>
      </Section>
    </ContentWrapper>
  );
}
