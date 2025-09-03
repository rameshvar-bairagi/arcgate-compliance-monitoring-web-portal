/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Card from '@/components/ui/Card';
import CardBody from '@/components/ui/CardBody';
// import CardHeader from '@/components/ui/CardHeader';
import Col from '@/components/ui/Col';
import ContentHeader from '@/components/ui/ContentHeader';
import ContentWrapper from '@/components/ui/ContentWrapper';
// import DynamicTable from '@/components/ui/Datatable/DynamicTable';
import Row from '@/components/ui/Row';
import Section from '@/components/ui/Section';
import { useSystems } from "@/hooks/useSystems";
import { useMetricsNameList, useSystemNameList, useAllComplianceRulesList, useClientGroupList } from "@/hooks/useOptionList";
import type { SystemsRequestBody } from "@/types/systems";
import { getClientGroupOptions, getDateOptions, getIpOptions, getMetricsOptions, getRulesOptions, Option } from '@/utils/commonMethod';
import { Key, useEffect, useMemo, useRef, useState } from 'react';
import Select, { MultiValue } from "react-select";
import { ServerDataTable } from '@/components/ui/Datatable/ServerDataTable';
import { ColumnConfig } from '@/types/server-data-table';
import { dtRenderer } from '@/components/ui/Datatable/DefaultRenderer';
import { renderToStaticMarkup } from 'react-dom/server';

type Filters = {
  date: string;
  systemName: any;
  complianceRule: any;
  clientGroup: any;
  metricList: any[] | null;
  page: number;
  size: number;
  sortBy?: string; // Add these
  sortDirection?: 'asc' | 'desc';
};

export default function SystemsPage() {
  const dateOptions = getDateOptions();
  // const [selectedDate, setSelectedDate] = useState<Option>(dateOptions[0]); // default to first option
  const [selectedSystemName, setSelectedSystemName] = useState<Option | null>(null);
  const [selectedComplianceRule, setSelectedComplianceRule] = useState<Option | null>(null);
  const [selectedClientGroup, setSelectedClientGroup] = useState<Option | null>(null);
  const [selectedMetrics, setSelectedMetrics] = useState<MultiValue<Option>>([]);

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Systems', active: true },
  ];

  const [filters, setFilters] = useState<Filters>({
    date: dateOptions[0].value,
    systemName: "",
    complianceRule: "",
    clientGroup: "",
    metricList: null as string[] | null,
    page: 1,
    size: 10,
    sortBy: "", // Add sort fields
    sortDirection: "desc" as 'asc' | 'desc',
  });

  const requestBody = useMemo<SystemsRequestBody>(() => ({
    date: filters.date,
    systemName: filters.systemName,
    complianceRule: filters.complianceRule,
    clientGroup: filters.clientGroup,
    metricList: filters.metricList,
    page: filters.page,
    size: filters.size,
    sortBy: filters.sortBy ?? "",
    sortDirection: filters.sortDirection ?? "",
  }), [filters]);
  // console.log(filters, 'filtersfiltersfilters');

  // Call the hook
  const { 
    systemsData, 
    systemsLoading, 
    systemsError, 
    refetchSystems 
  } = useSystems(requestBody, true);
  // console.log(systemsData,'systems list');

  const columns: ColumnConfig<any>[] = useMemo(() => ([
    {
      title: "IP Address",
      data: "ip",
      render: (data: any, type: any, row: any, meta: any) =>
        // renderToStaticMarkup(dtRenderer(data, {field: "ip", row})),
        dtRenderer(data, {field: "ip", row}),
      orderable: true,
    },
    {
      title: "Compliance Status",
      data: "complianceStatus",
      render: (data: any, type: any, row: any, meta: any) =>
        // renderToStaticMarkup(dtRenderer(data, {field: "complianceStatus", row})),
        dtRenderer(data, {field: "complianceStatus", row}),
      orderable: true,
    },
    {
      title: "Compliance Services",
      data: "complianceServices",
      render: (data: any, type: any, row: any, meta: any) =>
        // renderToStaticMarkup(dtRenderer(data, {field: "complianceServices", row})),
        dtRenderer(data, {field: "complianceServices", row}),
      orderable: true,
    },
    {
      title: "Non-Compliance Services",
      data: "nonComplianceServices",
      render: (data: any, type: any, row: any, meta: any) =>
        // renderToStaticMarkup(dtRenderer(data, {field: "nonComplianceServices", row})),
        dtRenderer(data, {field: "nonComplianceServices", row}),
      orderable: true,
    },
    {
      title: "System Date",
      data: "systemDate",
      render: (data: any, type: any, row: any, meta: any) =>
        // renderToStaticMarkup(dtRenderer(data, {field: "systemDate", row})),
        dtRenderer(data, {field: "systemDate", row}),
      orderable: true,
    },
  ]), []);

  const { 
    list: systemNameList,
    loading: systemNameListLoading,
    error: systemNameListError
  } = useSystemNameList();
  const systemNameOptions: Option[] = getIpOptions(systemNameList ?? []);

  const { 
    list: metricsNameList,
    loading: metricsNameListLoading,
    error: metricsNameListError
  } = useMetricsNameList();
  const metricsOptions = getMetricsOptions(metricsNameList ?? []);
  // console.log(metricsNameList, 'metricsOptions')

  const { 
    list: allComplianceRulesList,
    loading: complianceRulesListLoading,
    error: complianceRulesListError
  } = useAllComplianceRulesList();
  const allComplianceRuleOptions = getRulesOptions(allComplianceRulesList ?? []);
  // console.log(allComplianceRulesList, 'allComplianceRulesList')

  const { 
    list: clientGroupList,
    loading: clientGroupListLoading,
    error: clientGroupListError
  } = useClientGroupList();
  const clientGroupOptions = getClientGroupOptions(clientGroupList ?? []);
  // console.log(clientGroupList, 'clientGroupList')

  // useEffect(() => {
  //   console.log('filters changed:', filters);
  // }, [filters]);

  const updateFilters = (updates: Partial<Filters>, resetPage = true) => {
    setFilters(prev => {
      const newFilters = {
        ...prev,
        ...updates,
        ...(resetPage ? { page: 1 } : {}),
      };

      // Prevent unnecessary state updates
      if (JSON.stringify(prev) === JSON.stringify(newFilters)) return prev;
      return newFilters;
    });
  };

  const handleSort = (columnIndex: number, direction: 'asc' | 'desc') => {
    const columnField = columns[columnIndex].data;

    if (columnField) {
      // If already sorted by the same column and direction, do nothing
      if (
        filters.sortBy === columnField &&
        filters.sortDirection === direction
      ) {
        return;
      }

      // Update sort and reset to first page
      updateFilters({
        ...filters,
        sortBy: columnField as string,
        sortDirection: direction,
        page: 1, // reset to first page only when sorting changes
      });
    }
  };

  return (
    <ContentWrapper>
      <ContentHeader title="Systems" breadcrumbItems={breadcrumbItems} />

      <Section className={'content'}>
        <div className="container-fluid">
          <Row>
            <Col className="col-12">
              <Card>
                {/* <CardHeader 
                  title="System Details" 
                  transparentBorder={true}
                  showTools={false}
                  actionText="" 
                  actionHref="javascript:void(0);" 
                /> */}
                <CardBody className="p-0">
                  <Row className='p-2 d-flex justify-content-end'>
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
                      </div>
                    </Col>
                    <Col className="col-md-3 mt-2 mb-2">
                      <div className="form-group mb-0">
                        <Select
                          options={systemNameOptions}
                          value={selectedSystemName}
                          onChange={(newValue) => {
                            setSelectedSystemName(newValue);
                            updateFilters({
                              systemName: newValue?.value || "",
                            })
                          }}
                          classNamePrefix="react-select"
                          className={`react-select-container`}
                          placeholder={"Select system..."}
                          isClearable
                        />
                      </div>
                    </Col>
                    <Col className="col-md-3 mt-2 mb-2">
                      <div className="form-group mb-0">
                        <Select
                          options={allComplianceRuleOptions}
                          value={selectedComplianceRule}
                          onChange={(newValue) => {
                            setSelectedComplianceRule(newValue);
                            updateFilters({
                              complianceRule: newValue?.value || "",
                            })
                          }}
                          classNamePrefix="react-select"
                          className={`react-select-container`}
                          placeholder={"Select compliance rule..."}
                          isClearable={true}
                        />
                      </div>
                    </Col>
                    <Col className="col-md-3 mt-2 mb-2">
                      <div className="form-group mb-0">
                        <Select
                          options={clientGroupOptions}
                          value={selectedClientGroup}
                          onChange={(newValue) => {
                            setSelectedClientGroup(newValue);
                            updateFilters({
                              clientGroup: newValue?.value || "",
                            })
                          }}
                          classNamePrefix="react-select"
                          className={`react-select-container`}
                          placeholder={"Select client group..."}
                          isClearable={true}
                        />
                      </div>
                    </Col>
                    <Col className="col-md-6 mt-2 mb-2">
                      <div className="form-group mb-0">
                        <Select
                          options={metricsOptions}
                          isMulti
                          value={selectedMetrics}
                          onChange={(newValue) => {
                            setSelectedMetrics(newValue);
                            updateFilters({
                              metricList: newValue?.map(v => v.value) || null,
                            })
                          }}
                          classNamePrefix="react-select"
                          className={`react-select-container`}
                          placeholder="Select metrics..."
                          isClearable
                          // styles={{
                          //   control: (base) => ({
                          //     ...base,
                          //     borderColor: "#ccc",
                          //     padding: "2px",
                          //   }),
                          // }}
                        />
                      </div>
                    </Col>
                  </Row>
                  <ServerDataTable 
                    id={"systemsTable"}
                    columns={columns}
                    data={systemsData?.content}
                    page={filters.page}
                    size={filters.size}
                    totalElements={systemsData?.totalElements ?? 1}
                    onPageChange={(newPage) => {
                      if (newPage !== filters.page) {
                        updateFilters({ page: newPage }, false);
                      }
                    }}
                    onSort={handleSort} // Pass the sorting handler
                    searching={false}
                    // order={4} //  Server handles initial sort, not client
                    // columnDefs={[{ orderable: false, targets: [0, 1, 2, 3] }]} // Let individual columns control orderable
                    columnDefs={[]} // Empty array to override defaults
                    exportButtons={["csv", "excel", "pdf", "print"]}
                    domLayout="Bfrtip"
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </Section>
    </ContentWrapper>
  );
}
