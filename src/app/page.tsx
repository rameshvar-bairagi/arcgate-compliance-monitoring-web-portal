'use client';

import { useEffect, useState } from "react";
import Section from "@/components/ui/Section";
import styles from "./page.module.css";
import ContentHeader from '@/components/ui/ContentHeader';
import ContentWrapper from "@/components/ui/ContentWrapper";
import Row from '@/components/ui/Row';
import Col from '@/components/ui/Col';
import SmallBox from "@/components/ui/SmallBox";
import InfoBox from "@/components/ui/InfoBox";
import Card from "@/components/ui/Card";
import CardHeader from "@/components/ui/CardHeader";
import CardBody from "@/components/ui/CardBody";
import BarChart from "@/components/charts/BarChart";
import { defaultBarChartOptions } from '@/utils/chartConfig';
import CardFooter from "@/components/ui/CardFooter";
import { useDashboardData } from '@/hooks/useDashboardData';
import { ComplianceRequestBody, AlertsData } from '@/types/dashboard';
import { 
  formatDateTime, 
  getBadgeClass, 
  getComplianceTotals, 
  getChartDataFromCompliance,
  getDateOptions
} from '@/utils/commonMethod';
import { format } from 'date-fns';

export default function HomePage() {
  const dateOptions = getDateOptions();
  const [selectedGroup, setSelectedGroup] = useState(dateOptions[0].value); // default to Today

  const [requestBody, setRequestBody] = useState<ComplianceRequestBody>({
    date: selectedGroup,
    complianceRule: '',
    clientGroup: '',
  });

  const {
    complianceData,
    complianceLoading,
    complianceError,
    alertsData,
    alertsLoading,
    alertsError,
    refetchCompliance,
    refetchAlerts,
    // refetchAll,
  } = useDashboardData(requestBody, true); // or false if you want manual trigger

  const alertsDatas = alertsData as AlertsData;

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Dashboard', active: true },
  ];

  const chartData = getChartDataFromCompliance(complianceData);
  // const chartData = {
  //   labels: ['29-07-2025', '30-07-2025', '01-08-2025', '02-08-2025', '03-08-2025'],
  //   datasets: [
  //     {
  //       label: 'Compliant',
  //       backgroundColor: '#007bff',
  //       borderColor: '#007bff',
  //       data: [1000, 2000, 3000, 2500, 2700, 2500, 3000],
  //       // barPercentage: 1.0,
  //       // categoryPercentage: 0.8
  //     },
  //     {
  //       label: 'Non-Compliant',
  //       backgroundColor: '#6c757d',
  //       borderColor: '#6c757d',
  //       data: [700, 1700, 2700, 2000, 1800, 1500, 2000],
  //       // barPercentage: 1.0,
  //       // categoryPercentage: 0.8
  //     }
  //   ]
  // };

  const chartOptions = {
    ...defaultBarChartOptions,
    plugins: {
      ...defaultBarChartOptions.plugins,
      legend: {
        display: false // override display from false → true
      }
    },
    scales: {
      ...defaultBarChartOptions.scales,
      y: {
        ...defaultBarChartOptions.scales?.y,
        ticks: {
          ...defaultBarChartOptions.scales?.y?.ticks,
          callback: function (value: string | number) {
            if (typeof value === 'number' && value >= 1000) {
              return `${value / 1000}k`;
            }
            return `${value}`;
          },
          font: {
            weight: 'bold' as const  // Fix: explicitly cast to allowed literal
          }
        }
      }
    }
  };

  useEffect(() => {
    setRequestBody(prev => ({
      ...prev,
      date: selectedGroup,
    }));
  }, [selectedGroup]);

  const handleFetchData = () => {
    refetchCompliance();
    refetchAlerts();
  };

  return (
      <ContentWrapper>
        <ContentHeader 
          title="Dashboard"
          showSelect={true}
          options={dateOptions}
          selected={selectedGroup}
          onChange={(val) => setSelectedGroup(val)}
          placeholder="Select Date"
          breadcrumbItems={breadcrumbItems} 
        />
        <Section className="content">
          <div className="container-fluid">
            <Row>
              {/* <Col className="col-12">
                <button className="btn btn-default mb-3" onClick={handleFetchData}>
                  Call Dashboard and Alert API
                </button>
              </Col> */}
              <Col className="col-lg-4 col-6">
                {/* <SmallBox
                  value={500}
                  label="Workstations"
                  iconClass="fas fa-building"
                  bgColorClass="bg-info"
                  link="/"
                /> */}
                <InfoBox
                  iconClass="fas fa-building"
                  bgColorClass="bg-info"
                  label="Workstations"
                  value={getComplianceTotals(complianceData)?.totalWorkStations || 0}
                  // unit="%"
                />
              </Col>

              <Col className="col-lg-4 col-6">
                {/* <SmallBox
                  value={2500}
                  label="Compliant Systems"
                  iconClass="ion ion-bag"
                  bgColorClass="bg-success"
                  link="/"
                /> */}
                <InfoBox
                  iconClass="fas fa-shield-alt"
                  bgColorClass="bg-primary"
                  label="Compliant Systems"
                  value={getComplianceTotals(complianceData)?.complianceCount || 0}
                  // unit="%"
                />
              </Col>

              <Col className="col-lg-4 col-6">
                {/* <SmallBox
                  value={700}
                  label="Non-Compliant Systems"
                  iconClass="fas fa-exclamation-triangle"
                  bgColorClass="bg-danger"
                  link="/"
                /> */}
                <InfoBox
                  iconClass="fas fa-exclamation-triangle"
                  bgColorClass="bg-gray"
                  label="Non-Compliant Systems"
                  value={getComplianceTotals(complianceData)?.nonComplianceCount || 0}
                  // unit="%"
                />
              </Col>
            </Row>

            <Row>
              <Col className="col-lg-7">
                  <Card>
                    <CardHeader 
                      title="Recent Non-Compliant Systems" 
                      transparentBorder={true}
                      showTools={false}
                      actionText="" 
                      actionHref="javascript:void(0);" 
                    />
                    <CardBody className="p-0">
                      <div className="table-responsive p-0" style={{ height: '330px' }}>
                        <table className="table table-head-fixed text-wrap">
                          <thead>
                            <tr>
                              <th>Date time</th>
                              <th>System name</th>
                              <th>Metrics name</th>
                              <th>Issue</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(alertsDatas || {}).filter(([_, alerts]) => alerts && alerts.length > 0).length === 0 ? (
                              <tr>
                                <td colSpan={4} className="text-center text-muted">No data available</td>
                              </tr>
                            ) : (
                              Object.entries(alertsDatas || {}).map(([systemKey, alerts], index) => {
                                if (!alerts || alerts?.length === 0) return null;

                                const { systemDate, level, ip } = alerts[0]; // All alerts share these

                                return (
                                  <tr key={`${systemKey}-${index}`}>
                                    <td style={{ whiteSpace: 'nowrap' }}>
                                      {formatDateTime(systemDate)}
                                    </td>
                                    <td>{systemKey}</td>
                                    <td>
                                      {alerts.map((alert, i) => (
                                        <span key={i} className={getBadgeClass(alert.level)}>
                                          {alert.metricsName}
                                        </span>
                                      ))}
                                    </td>
                                    <td><span className="text-danger">{level}</span></td>
                                  </tr>
                                );
                              })
                            )}
                          </tbody>
                        </table>
                      </div>
                    </CardBody>
                    <CardFooter rightLabel="View All" />
                  </Card>
              </Col>
              <Col className="col-lg-5">
                  <Card>
                    <CardHeader title="Compliant vs. Non-Compliant Systems" actionText="" actionHref="javascript:void(0);" />
                    <CardBody>
                      {/* <div className="d-flex">
                        <p className="d-flex flex-column">
                          <span className="text-bold text-lg">$18,230.00</span>
                          <span>Sales Over Time</span>
                        </p>
                        <p className="ml-auto d-flex flex-column text-right">
                          <span className="text-success">
                            <i className="fas fa-arrow-up"></i> 33.1%
                          </span>
                          <span className="text-muted">Since last month</span>
                        </p>
                      </div> */}

                      <div className="position-relative mb-4">
                        {chartData.datasets.every(ds => ds.data.length === 0 || ds.data.every(d => d === 0)) ? (
                          <div className="text-center text-muted py-5">
                            <i className="fas fa-info-circle mr-2" />
                            No data available
                          </div>
                        ) : (
                          <BarChart
                            id="compliantChart"
                            data={chartData}
                            options={chartOptions}
                            className="compliantChart"
                          />
                        )}
                      </div>

                      <div className="d-flex flex-row justify-content-end">
                        <span className="mr-2">
                          <i className="fas fa-square text-primary"></i> Compliant
                        </span>
                        <span>
                          <i className="fas fa-square text-gray"></i> Non-Compliant
                        </span>
                      </div>
                    </CardBody>
                  </Card>
              </Col>
            </Row>
          </div>
        </Section>
      </ContentWrapper>
  );
}
