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
import { useMetricsNameList, useSystemNameList, useComplianceRulesList, useClientGroupList } from "@/hooks/useOptionList";
import type { SystemsRequestBody } from "@/types/systems";
import { getClientGroupOptions, getDateOptions, getIpOptions, getMetricsOptions, getRulesOptions, Option } from '@/utils/commonMethod';
import { useEffect, useMemo, useState } from 'react';
import Select, { MultiValue } from "react-select";
import { CommonDataTable } from '@/components/ui/Datatable/CommonDataTable';

type Filters = {
  date: string;
  systemName: any;
  complianceRule: any;
  clientGroup: any;
  metricList: any[] | null;
  page: number;
  size: number;
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
    size: 10
  });

  const requestBody = useMemo<SystemsRequestBody>(() => ({
    date: filters.date,
    systemName: filters.systemName,
    complianceRule: filters.complianceRule,
    clientGroup: filters.clientGroup,
    metricList: filters.metricList,
    page: filters.page,
    size: filters.size,
  }), [filters]);

  console.log(filters, 'filtersfiltersfilters');

  // Call the hook
  const { 
    systemsData, 
    systemsLoading, 
    systemsError, 
    refetchSystems 
  } = useSystems(requestBody, true);
  // console.log(systemsData?.content,'systems list');

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
    list: complianceRulesList,
    loading: complianceRulesListLoading,
    error: complianceRulesListError
  } = useComplianceRulesList();
  const complianceRuleOptions = getRulesOptions(complianceRulesList ?? []);
  // console.log(complianceRulesList, 'complianceRulesList')

  const { 
    list: clientGroupList,
    loading: clientGroupListLoading,
    error: clientGroupListError
  } = useClientGroupList();
  const clientGroupOptions = getClientGroupOptions(clientGroupList ?? []);
  console.log(clientGroupList, 'clientGroupList')

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      // Only update filters if something actually changed
      setFilters(prev =>
        prev.page !== detail.page || prev.size !== detail.size
          ? { ...prev, page: detail.page, size: detail.size }
          : prev
      );
    };
    window.addEventListener("tablePaginationChange", handler);
    return () => window.removeEventListener("tablePaginationChange", handler);
  }, []);

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
                            setFilters((prev) => ({
                              ...prev,
                              date: newValue?.value || "",
                              page: 1, // reset pagination
                            }))
                          }
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
                            setFilters((prev) => ({
                              ...prev,
                              systemName: newValue?.value || "",
                              page: 1,
                            }));
                          }}
                          placeholder={"Select system..."}
                          isClearable
                        />
                      </div>
                    </Col>
                    <Col className="col-md-3 mt-2 mb-2">
                      <div className="form-group mb-0">
                        <Select
                          options={complianceRuleOptions}
                          value={selectedComplianceRule}
                          onChange={(newValue) => {
                            setSelectedComplianceRule(newValue);
                            setFilters((prev) => ({
                              ...prev,
                              complianceRule: newValue?.value || "",
                              page: 1,
                            }));
                          }}
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
                            setFilters((prev) => ({
                              ...prev,
                              clientGroup: newValue?.value || "",
                              page: 1,
                            }));
                          }}
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
                          // onChange={(newValue) => setSelectedMetrics(newValue)}
                          onChange={(newValue) => {
                            setSelectedMetrics(newValue);
                            setFilters((prev) => ({
                              ...prev,
                              metricList: newValue?.map(v => v.value) || null,
                              page: 1,
                            }));
                          }}
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
                        {/* <pre>{JSON.stringify(selectedMetrics, null, 2)}</pre> */}
                      </div>
                    </Col>
                  </Row>
                  <CommonDataTable 
                    id={"systemsTable"} 
                    onViewClick={(id) => {
                      console.log("Clicked row with id:", id);
                      // maybe open modal, navigate, etc.
                    }}
                    columns={[
                      { data: "ip", title: "IP Address" },
                      { data: "complianceStatus", title: "Compliance Status" },
                      { data: "complianceServices", title: "Compliance Services" },
                      { data: "nonComplianceServices", title: "Non-Compliance Services" },
                      { data: "systemDate", title: "System Date" },
                    ]}
                    data={systemsData?.content ?? []}
                    page={filters.page}
                    size={filters.size}
                    totalElements={systemsData?.totalElements ?? 0}
                    onPageChange={(newPage) =>
                      setFilters((prev) => ({
                        ...prev,
                        page: newPage,
                      }))
                    }
                    searching={false}
                    order={4}
                    columnDefs={[{ orderable: false, targets: [0, 1, 2, 3] }]}
                    exportButtons={[]}
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
