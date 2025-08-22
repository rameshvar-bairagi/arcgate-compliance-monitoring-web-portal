/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Card from '@/components/ui/Card';
import CardBody from '@/components/ui/CardBody';
import Col from '@/components/ui/Col';
import ContentHeader from '@/components/ui/ContentHeader';
import ContentWrapper from '@/components/ui/ContentWrapper';
import Row from '@/components/ui/Row';
import Section from '@/components/ui/Section';
import { useAllComplianceRulesList } from "@/hooks/useOptionList";
import { useRouter } from "next/navigation";
import { ClientDataTable } from '@/components/ui/Datatable/ClientDataTable';
import Button from '@/components/ui/Button';
import { deleteComplianceRule } from '@/services/allApiService';
import { toast } from "react-toastify";
import { useQueryClient } from '@tanstack/react-query';

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
    console.log(complianceRulesList, 'complianceRulesList');

    const queryClient = useQueryClient();
    const handleDeleteRule = async (id: number | string) => {
        toast(
            <div className="p-3 rounded">
                <h5 className="font-bold text-lg text-warning m-0">⚠ Confirm Delete</h5>

                <p className="text-sm text-muted mb-2">
                Are you sure you want to delete this rule? This action cannot be undone.
                </p>

                {/* Buttons */}
                <div className="d-flex justify-content-end gap-2 mt-3">
                <button
                    className="m-2 btn btn-sm btn-danger"
                    onClick={async () => {
                    try {
                        await deleteComplianceRule(id);
                        toast.dismiss();
                        toast.success("Rule deleted successfully!");
                        queryClient.invalidateQueries({ queryKey: ["allComplianceRulesList"] });
                        // router.refresh();
                    } catch (err: any) {
                        toast.dismiss();
                        toast.error(`Failed to delete rule: ${err?.message || "Unknown error"}`);
                    }
                    }}
                >
                    Delete
                </button>
                <button
                    className="m-2 btn btn-sm btn-secondary"
                    onClick={() => {
                        toast.dismiss();
                        toast.info("Delete cancelled");
                    }}
                >
                    Cancel
                </button>
                </div>
            </div>,
            {
                type: "warning", // "info", "warning", "error", "success"
                autoClose: false,
                closeOnClick: false,
                draggable: false,
                closeButton: true,
                position: "top-center", // center it
                style: {
                    width: "400px",
                    maxWidth: "90%",
                    border: "2px solid #f0ad4e",
                    borderRadius: "12px",
                    padding: "16px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                    marginTop: "30vh",
                },
            }
        );
    };

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
                        onDeleteClick={(id) => handleDeleteRule(id)}
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