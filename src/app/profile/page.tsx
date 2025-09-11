'use client';

import { useEffect, useState, useMemo } from "react";
import Section from "@/components/ui/Section";
// import styles from "./page.module.css";
import ContentHeader from '@/components/ui/ContentHeader';
import ContentWrapper from "@/components/ui/ContentWrapper";
import Row from '@/components/ui/Row';
import Col from '@/components/ui/Col';
// import SmallBox from "@/components/ui/SmallBox";
import InfoBox from "@/components/ui/InfoBox";
import Card from "@/components/ui/Card";
import CardHeader from "@/components/ui/CardHeader";
import CardBody from "@/components/ui/CardBody";
import CardFooter from "@/components/ui/CardFooter";

export default function HomePage() {

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Profile', active: true },
  ];

  return (
      <ContentWrapper>
        {/* <ContentHeader 
          title="Profile"
          breadcrumbItems={breadcrumbItems}
        /> */}
        <Section className="content">
          <div className="container-fluid">
            <Row className="pt-3">
              {/* <Col className="col-12">
                <button className="btn btn-default mb-3" onClick={handleFetchData}>
                  Call Dashboard and Alert API
                </button>
              </Col> */}
              <Col className="col-12 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                <InfoBox
                  iconClass="fas fa-building"
                  bgColorClass="bg-info"
                  label="Info 1"
                  value={0}
                  // unit="%"
                />
              </Col>
              <Col className="col-12 col-sm-3 col-md-3 col-lg-3 col-xl-3">
                {/* <SmallBox
                  value={500}
                  label="Workstations"
                  iconClass="fas fa-building"
                  bgColorClass="bg-info"
                  link="/"
                /> */}
                <InfoBox
                  iconClass="fas fa-network-wired"
                  bgColorClass="bg-info"
                  label="Info 2"
                  value={0}
                  // unit="%"
                />
              </Col>

              <Col className="col-12 col-sm-3 col-md-3 col-lg-3 col-xl-3">
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
                  label="Info 3"
                  value={0}
                  // unit="%"
                />
              </Col>

              <Col className="col-12 col-sm-3 col-md-3 col-lg-3 col-xl-3">
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
                  label="Info 4"
                  value={0}
                  // unit="%"
                />
              </Col>
            </Row>

            {/* Maintenance Message Section */}
            <Row className="mt-4">
              <Col className="col-12">
                <Card>
                  <CardBody className="text-center py-5">
                    <i className="fas fa-tools fa-2x text-warning mb-3"></i>
                    <h4>Profile Under Maintenance</h4>
                    <p className="text-muted">
                      We are working on updating this section. Please check back later.
                    </p>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            {/* <Row>
              <Col className="col-lg-4">
                Column 1
              </Col>
              <Col className="col-lg-4">
                Column 2
              </Col>
            </Row> */}
          </div>
        </Section>
      </ContentWrapper>
  );
}
