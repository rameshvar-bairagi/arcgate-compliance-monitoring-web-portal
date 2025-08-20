'use client';

import Card from '@/components/ui/Card';
import CardBody from '@/components/ui/CardBody';
import CardHeader from '@/components/ui/CardHeader';
import Col from '@/components/ui/Col';
import ContentHeader from '@/components/ui/ContentHeader';
import ContentWrapper from '@/components/ui/ContentWrapper';
// import DynamicTable from '@/components/ui/Datatable/DynamicTable';
import Row from '@/components/ui/Row';
import Section from '@/components/ui/Section';
import { useSystems } from "@/hooks/useSystems";
import { useSystemNameList } from "@/hooks/useSystemNameList";
import { useMetricsNameList } from "@/hooks/useMetricsNameList";
import type { SystemsRequestBody } from "@/types/systems";
import { getDateOptions, getIpOptions, getMetricsOptions } from '@/utils/commonMethod';
import { useEffect, useMemo, useState } from 'react';
import Select, { MultiValue } from "react-select";
import { CommonDataTable } from '@/components/ui/Datatable/CommonDataTable';

interface Option {
  value: string;
  label: string;
}

export default function SystemsPage() {
  const dateOptions = getDateOptions();
  // const [selectedDate, setSelectedDate] = useState<Option>(dateOptions[0]); // default to first option
  const [selectedSystemName, setSelectedSystemName] = useState<Option | null>(null);
  const [selectedMetrics, setSelectedMetrics] = useState<MultiValue<Option>>([]);

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Systems', active: true },
  ];

  const [filters, setFilters] = useState({
    date: dateOptions[0].value,
    systemName: "",
    complianceRule: "",
    clientGroup: "",
    metricList: null as string[] | null,
    page: 0,
    size: 10
  });

  const requestBody = useMemo<SystemsRequestBody>(() => ({
    date: filters.date,
    systemName: filters.systemName,
    complianceRule: "",
    clientGroup: "",
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
    systemNameList, 
    systemNameListLoading, 
    systemNameListError 
  } = useSystemNameList();
  const systemNameOptions: Option[] = getIpOptions(systemNameList ?? []);

  const { 
    metricsNameList, 
    metricsNameListLoading, 
    metricsNameListError 
  } = useMetricsNameList();
  const metricsOptions = getMetricsOptions(metricsNameList ?? []);
  console.log(metricsNameList, 'metricsOptions')

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
                          // value={selectedDate}
                          value={dateOptions.find((opt) => opt.value === filters.date) || null}
                          onChange={(newValue) =>
                            setFilters((prev) => ({
                              ...prev,
                              date: newValue?.value || "",
                              page: 0, // reset pagination
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
                          // onChange={(newValue) => setSelectedSystemName(newValue)}
                          onChange={(newValue) => {
                            setSelectedSystemName(newValue);
                            setFilters((prev) => ({
                              ...prev,
                              systemName: newValue?.value || "",
                              page: 0,
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
                          options={metricsOptions}
                          isMulti
                          value={selectedMetrics}
                          // onChange={(newValue) => setSelectedMetrics(newValue)}
                          onChange={(newValue) => {
                            setSelectedMetrics(newValue);
                            setFilters((prev) => ({
                              ...prev,
                              metricList: newValue?.map(v => v.value) || null,
                              page: 0,
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
                    {/* <Col className="col-md-3 mt-2 mb-2">
                      <div className="form-group mb-0">
                        <Select
                          options={dateOptions}
                          value={selectedDate}
                          onChange={(newValue) => {
                            if (newValue) setSelectedDate(newValue);
                          }}
                          placeholder={"Select date..."}
                          isClearable={false}
                        />
                      </div>
                    </Col> */}
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
                    domLayout={"Brtip"}
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
