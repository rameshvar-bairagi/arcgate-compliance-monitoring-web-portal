'use client';

import Card from '@/components/ui/Card';
import CardBody from '@/components/ui/CardBody';
import CardHeader from '@/components/ui/CardHeader';
import Col from '@/components/ui/Col';
import ContentHeader from '@/components/ui/ContentHeader';
import ContentWrapper from '@/components/ui/ContentWrapper';
import CustomSelect from '@/components/ui/CustomSelect';
import DynamicTable from '@/components/ui/Datatable/DynamicTable';
import Row from '@/components/ui/Row';
import Section from '@/components/ui/Section';
import { useSystems } from "@/hooks/useSystems";
import { useSystemNameList } from "@/hooks/useSystemNameList";
import { useMetricsNameList } from "@/hooks/useMetricsNameList";
import type { SystemsRequestBody, SystemsListData } from "@/types/systems";
import { getDateOptions, getIpOptions, getMetricsOptions } from '@/utils/commonMethod';
import { useState } from 'react';
import Select, { MultiValue } from "react-select";

interface Option {
  value: string;
  label: string;
}

export default function SystemsPage() {
  const dateOptions = getDateOptions();
  const [selectedDate, setSelectedDate] = useState<string | string[]>(dateOptions[0].value); // default to Today
  // const [selectedDate, setSelectedDate] = useState('');
  const [selectedSystemName, setSelectedSystemName] = useState<string | string[]>('');
  // const [selectedMetrics, setSelectedMetrics] = useState<string | string[] | null>(null);
  const [selectedMetrics, setSelectedMetrics] = useState<MultiValue<Option>>([]);

  // const metricsOptions = [
  //   { label: 'Apple', value: 'apple' },
  //   { label: 'Banana', value: 'banana' },
  //   { label: 'Mango', value: 'mango' },
  //   { label: 'Orange', value: 'orange' },
  // ];
  
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Systems', active: true },
  ];

  const requestBody: SystemsRequestBody = {
    date: Array.isArray(selectedDate) ? selectedDate[0] : selectedDate || "",
    systemName: Array.isArray(selectedSystemName) ? selectedSystemName[0] : selectedSystemName || "",
    complianceRule: "",
    clientGroup: "",
    metricList: !selectedMetrics?.length
    ? null
    : selectedMetrics.map((m) => m.value),
    page:0,
    size:10
  };

  // Call the hook
  const { 
    systemsData, 
    systemsLoading, 
    systemsError, 
    // refetchSystems 
  } = useSystems(requestBody);

  const { 
    systemNameList, 
    systemNameListLoading, 
    systemNameListError 
  } = useSystemNameList();
  const systemNameOptions = getIpOptions(systemNameList ?? []);

  const { 
    metricsNameList, 
    metricsNameListLoading, 
    metricsNameListError 
  } = useMetricsNameList();
  const metricsOptions = getMetricsOptions(metricsNameList ?? []);
  console.log(metricsOptions, 'metricsOptions')

  // Now data is SystemsListData | undefined
  const systems: SystemsListData | undefined = systemsData;
  console.log(systems,'systems list');

  const columns = [
    'System Name/Id',
    'Compliance Status',
    'Metrics',
    // 'Client Group',
    // 'Security Policy Applied',
    'System Date',
  ];

  const data = [
    ['Trident', 'Yes', 'Win 95+', '4'],
    ['Trident', 'No', 'Win 95+', '5'],
    ['Trident', 'No', 'Win 98+', '6'],
    ['Gecko', 'No', 'Win 98+ / OSX.2+', '1.7'],
    ['Gecko', 'No', 'Win 98+ / OSX.2+', '1.7']
  ];

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
                        <CustomSelect
                          options={dateOptions}
                          selected={selectedDate}
                          onChange={(val) => setSelectedDate(val)}
                          placeholder={"Select date..."}
                        />
                      </div>
                    </Col>
                    <Col className="col-md-3 mt-2 mb-2">
                      <div className="form-group mb-0">
                        <CustomSelect
                          options={systemNameOptions}
                          selected={selectedSystemName}
                          onChange={(val) => setSelectedSystemName(val)}
                          placeholder={"Select system..."}
                        />
                      </div>
                    </Col>
                    <Col className="col-md-3 mt-2 mb-2">
                      <div className="form-group mb-0">
                        <Select
                          options={metricsOptions}
                          isMulti
                          value={selectedMetrics}
                          onChange={(newValue) => setSelectedMetrics(newValue)}
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
                        <CustomSelect
                          options={dateOptions}
                          selected={selectedDate}
                          onChange={(val) => setSelectedDate(val)}
                          placeholder={"Select Date"}
                        />
                      </div>
                    </Col> */}
                  </Row>
                  <DynamicTable
                    tableId="example1"
                    className="table table-bordered table-striped"
                    columns={columns}
                    data={data}
                    showFooter={true}
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
