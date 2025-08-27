/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Card from '@/components/ui/Card';
import CardBody from '@/components/ui/CardBody';
import Col from '@/components/ui/Col';
import ContentHeader from '@/components/ui/ContentHeader';
import ContentWrapper from '@/components/ui/ContentWrapper';
import Row from '@/components/ui/Row';
import Section from '@/components/ui/Section';
import { useClientGroupList } from "@/hooks/useOptionList";
import { useRouter } from "next/navigation";
import { ClientDataTable } from '@/components/ui/Datatable/ClientDataTable';
import Button from '@/components/ui/Button';
import { deleteClientGroup } from '@/services/allApiService';
import { openConfirmToast } from "@/components/ui/Toast/confirmToast";

export default function RulesPage() {
    const router = useRouter();
    
    const breadcrumbItems = [
        { label: 'Home', href: '/' },
        { label: 'Groups', active: true },
    ];

    const { 
        list: clientGroupList,
        loading: clientGroupListLoading,
        error: clientGroupListError
    } = useClientGroupList();
    // console.log(clientGroupList, 'clientGroupList');

    const formattedData = (clientGroupList ?? []).map(group => {
        const compliant: any[] = [];
        const nonCompliant: any[] = [];

        group.complianceRules?.forEach((rule: { compliantMetrics: any[]; nonCompliantMetrics: any[]; }) => {
            rule.compliantMetrics?.forEach((m: any) => compliant.push(m));
            rule.nonCompliantMetrics?.forEach((m: any) => nonCompliant.push(m));
        });

        return {
            ...group,
            compliantMetrics: compliant,
            nonCompliantMetrics: nonCompliant
        };
    });
    // console.log(formattedData, 'formattedData');

    const handleDeleteGroup = async (id: number | string) => {
        openConfirmToast({
            id,
            deleteFn: deleteClientGroup,
            title: "⚠ Confirm Client Group Delete!",
            subtitle: "Are you sure you want to delete this client group?",
            queryKeys: "clientGroupList",
            successMessage: "client group deleted successfully!",
            failedMessage: "Failed to delete client group!",
            cancelMessage: "Delete cancelled!",
            confirmBtnLabel: "Delete",
            cancelBtnLabel: "Cancel",
        });
    }

    const handleEditGroup = async (id: number | string) => {
        if (!id) return;
        
        router.push(`/groups/edit/${id}`);
    }

    return (
        <ContentWrapper>
        <ContentHeader title="Groups" breadcrumbItems={breadcrumbItems} containerHeaderClassName={"content-header pb-0"} />

        <Section className={'content'}>
            <div className="container-fluid">
            <Row>
                <Col className="col-12">
                <Row className='pb-2 d-flex justify-content-end'>
                    <Col className="col-md-12">
                        <Button 
                            type="button" 
                            className="btn btn-sm btn-primary float-right"
                            onClick={() => router.push("/groups/add")}
                        >
                            Add Group
                        </Button>
                    </Col>
                </Row>
                <Card>
                    <CardBody className="p-0">
                    <ClientDataTable 
                        id={"groupTable"} 
                        onViewClick={(id) => {
                            // console.log("Clicked row with id:", id);
                            // maybe open modal, navigate, etc.
                        }}
                        onEditClick={(id) => handleEditGroup(id)}
                        onDeleteClick={(id) => handleDeleteGroup(id)}
                        columns={[
                        { data: "name", title: "Client Groups" },
                        { data: "systemIps", title: "Systems IP" },
                        { data: "complianceRules", title: "Compliant Rules" },
                        { data: "compliantMetrics", title: "Compliant Metrics" },
                        { data: "nonCompliantMetrics", title: "Non-Compliant Metrics" },
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
                        // data={clientGroupList ?? []}
                        data={formattedData ?? []}
                        searching={true}
                        order={5}
                        columnDefs={[{ orderable: false, targets: [5] }]}
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