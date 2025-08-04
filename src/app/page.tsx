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
import { ComplianceRequestBody } from '@/types/dashboard';

export default function HomePage() {

  // const requestBody: ComplianceRequestBody = {
  //   date: '2025-07-29',
  //   complianceRule: '',
  //   clientGroup: '',
  // };

  const [requestBody, setRequestBody] = useState<ComplianceRequestBody>({
    date: '2025-07-29',
    complianceRule: '',
    clientGroup: '',
  });

  // const {
  //   complianceData,
  //   alerts,
  //   complianceLoading,
  //   complianceError,
  //   refetch,
  //   isLoading,
  //   error,
  // } = useDashboardData(requestBody, false); // disabled initially

  const {
    complianceData,
    complianceLoading,
    complianceError,
    alerts,
    alertsLoading,
    alertsError,
    refetchCompliance,
    refetchAlerts,
  } = useDashboardData(requestBody, true); // or false if you want manual trigger

  // Later on some button click
  const handleFetchData = () => {
    refetchCompliance();
    refetchAlerts();
  };

  // const {
  //   complianceData,
  //   complianceLoading,
  //   complianceError,
  //   alerts,
  //   isLoading,
  //   error,
  // } = useDashboardData(requestBody);

  // if (complianceLoading || isLoading) return <div>Loading...</div>;
  // if (complianceError || error) return <div>Error loading dashboard data</div>;

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Dashboard', active: true },
  ];

  const chartData = {
    labels: ['Red', 'Blue', 'Yellow'],
    datasets: [
      {
        label: 'Compliant',
        backgroundColor: '#007bff',
        borderColor: '#007bff',
        data: [1000, 2000, 3000, 2500, 2700, 2500, 3000],
        // barPercentage: 1.0,
        // categoryPercentage: 0.8
      },
      {
        label: 'Non-Compliant',
        backgroundColor: '#6c757d',
        borderColor: '#6c757d',
        data: [700, 1700, 2700, 2000, 1800, 1500, 2000],
        // barPercentage: 1.0,
        // categoryPercentage: 0.8
      }
    ]
  };

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

  return (
      <ContentWrapper>
        <ContentHeader title="Dashboard" breadcrumbItems={breadcrumbItems} />
        <Section className="content">
          <div className="container-fluid">
            <Row>
              <Col className="col-12">
                {/* Please uncomment if you are not visible api data in src-&gt;app-&gt;page.tsx */}
                <button className="btn btn-primary mb-3" onClick={handleFetchData}>
                  Call Dashboard and Alert API
                </button>
                {/* <div className="col-lg-12 col-12">
                  <h2>Compliance Data</h2>
                  <pre>{JSON.stringify(complianceData, null, 2)}</pre>

                  <h2>Alerts</h2>
                  <pre>{JSON.stringify(alerts, null, 2)}</pre>
                </div> */}
              </Col>
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
                  value={3200}
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
                  value={2500}
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
                  value={700}
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
                      <table className="table table-head-fixed text-nowrap">
                        <thead>
                        <tr>
                          <th>Date time</th>
                          <th>System name</th>
                          <th>Issue</th>
                        </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td><a href="pages/examples/invoice.html">OR9842</a></td>
                            <td>Call of Duty IV</td>
                            <td><span className="text-danger">Shipped</span></td>
                          </tr>
                          <tr>
                            <td><a href="pages/examples/invoice.html">OR1848</a></td>
                            <td>Samsung Smart TV</td>
                            <td><span className="text-danger">Pending</span></td>
                          </tr>
                          <tr>
                            <td><a href="pages/examples/invoice.html">OR7429</a></td>
                            <td>iPhone 6 Plus</td>
                            <td><span className="text-danger">Delivered</span></td>
                          </tr>
                          <tr>
                            <td><a href="pages/examples/invoice.html">OR7429</a></td>
                            <td>Samsung Smart TV</td>
                            <td><span className="text-danger">Processing</span></td>
                          </tr>
                          <tr>
                            <td><a href="pages/examples/invoice.html">OR1848</a></td>
                            <td>Samsung Smart TV</td>
                            <td><span className="text-danger">Pending</span></td>
                          </tr>
                          <tr>
                            <td><a href="pages/examples/invoice.html">OR9842</a></td>
                            <td>Call of Duty IV</td>
                            <td><span className="text-danger">Shipped</span></td>
                          </tr>
                          <tr>
                            <td><a href="pages/examples/invoice.html">OR1848</a></td>
                            <td>Samsung Smart TV</td>
                            <td><span className="text-danger">Pending</span></td>
                          </tr>
                          <tr>
                            <td><a href="pages/examples/invoice.html">OR7429</a></td>
                            <td>iPhone 6 Plus</td>
                            <td><span className="text-danger">Delivered</span></td>
                          </tr>
                          <tr>
                            <td><a href="pages/examples/invoice.html">OR7429</a></td>
                            <td>Samsung Smart TV</td>
                            <td><span className="text-danger">Processing</span></td>
                          </tr>
                          <tr>
                            <td><a href="pages/examples/invoice.html">OR1848</a></td>
                            <td>Samsung Smart TV</td>
                            <td><span className="text-danger">Pending</span></td>
                          </tr>
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
                        <BarChart
                          id="compliantChart"
                          data={chartData}
                          options={chartOptions}
                          className="compliantChart"
                        />
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
