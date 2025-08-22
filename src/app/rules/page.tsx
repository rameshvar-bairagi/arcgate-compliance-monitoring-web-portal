/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Card from '@/components/ui/Card';
import CardBody from '@/components/ui/CardBody';
import Col from '@/components/ui/Col';
import ContentHeader from '@/components/ui/ContentHeader';
import ContentWrapper from '@/components/ui/ContentWrapper';
import Row from '@/components/ui/Row';
import Section from '@/components/ui/Section';
import { useAllComplianceRulesList, useComplianceRulesList } from "@/hooks/useOptionList";
import { useRouter } from "next/navigation";
import { ClientDataTable } from '@/components/ui/Datatable/ClientDataTable';
import Button from '@/components/ui/Button';

export default function RulesPage() {
  const router = useRouter();
  
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Rules', active: true },
  ];

//   const { 
//     list: complianceRulesList,
//     loading: complianceRulesListLoading,
//     error: complianceRulesListError
//   } = useComplianceRulesList();

  const { 
    list: complianceRulesList,
    loading: complianceRulesListLoading,
    error: complianceRulesListError
  } = useAllComplianceRulesList();
  console.log(complianceRulesList, 'complianceRulesList')

  return (
    <ContentWrapper>
      <ContentHeader title="Rules" breadcrumbItems={breadcrumbItems} />

      <Section className={'content'}>
        <div className="container-fluid">
          <Row>
            <Col className="col-12">
              <Row className='pb-2 d-flex justify-content-end'>
                <Col className="col-md-12">
                    <Button 
                        type="button" 
                        className="btn btn-sm btn-primary float-right"
                        onClick={() => router.push("/rules/add")}
                    >
                        Add Rule
                    </Button>
                </Col>
              </Row>
              <Card>
                <CardBody className="p-0">
                  <ClientDataTable 
                    id={"rulesTable"} 
                    onViewClick={(id) => {
                      console.log("Clicked row with id:", id);
                      // maybe open modal, navigate, etc.
                    }}
                    onEditClick={(id) => console.log("Edit", id)}
                    onDeleteClick={(id) => console.log("Delete", id)}
                    columns={[
                      { data: "name", title: "Rule Name" },
                      { data: "description", title: "Description" },
                      { data: "andMetrics", title: "AND Rule" },
                      { data: "orMetrics", title: "OR Rule" },
                      {
                        data: null,
                        title: "Action",
                        orderable: false,
                        render: (_data, _type, row) => {
                            return `<button class="btn btn-sm edit-link" data-id="${row.id}">
                                <i class="fas fa-edit text-success"></i>
                            </button>
                            <button class="btn btn-sm delete-link" data-id="${row.id}">
                                <i class="fas fa-trash text-danger"></i>
                            </button>
                            `;
                        }
                      }
                    ]}
                    data={complianceRulesList ?? []}
                    searching={true}
                    // order={0}
                    columnDefs={[{ orderable: false, targets: [4] }]}
                    exportButtons={["csv", "excel", "pdf", "print"]}
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