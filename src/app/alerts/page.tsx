/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import ContentHeader from '@/components/ui/ContentHeader';
import ContentWrapper from '@/components/ui/ContentWrapper';
import Section from '@/components/ui/Section';
import Row from '@/components/ui/Row';
import Col from '@/components/ui/Col';
import Card from '@/components/ui/Card';
import CardBody from '@/components/ui/CardBody';
import { getBadgeClass, getDateOptions } from '@/utils/commonMethod';
import type { AlertsRequestBody, Alerts, AlertsUpdateStatus} from "@/types/alerts";
import { useAlerts } from "@/hooks/useAlerts";
import { useState, useEffect, useMemo, Key } from "react";
import Select, { MultiValue } from "react-select";
import { ServerDataTable } from '@/components/ui/Datatable/ServerDataTable';
import { ColumnConfig } from '@/types/server-data-table';
import { dtRenderer, getAlertActionButton } from '@/components/ui/Datatable/DefaultRenderer';
import { renderToStaticMarkup } from 'react-dom/server';
import { createRoot } from 'react-dom/client';
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { updateAlertStatus } from '@/services/allApiService';

type Filters = {
  date: string;
  page: number;
  size: number;
  sortBy?: string; // Add these
  sortDirection?: 'asc' | 'desc';
};

export default function AlertsPage() {
  const queryClient = useQueryClient();
  const dateOptions = getDateOptions();
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Alerts', active: true },
  ];

  // Add local state to hold alerts
  const [alerts, setAlerts] = useState<Alerts[]>([]);

  // Manage filters in state
  const [filters, setFilters] = useState<Filters>({
    date: dateOptions[0].value,
    page: 1,
    size: 10,
    sortBy: "", // Add sort fields
    sortDirection: "desc" as 'asc' | 'desc',
  });

  const requestBody = useMemo<AlertsRequestBody>(() => ({
      date: filters.date,
      page: filters.page,
      size: filters.size,
      sortBy: filters.sortBy,
      sortDirection: filters.sortDirection,
    }), [filters]);

  // Call the hook with filters
  const { 
    alertsData, 
    alertsLoading, 
    alertsError, 
    refetchAlerts 
  } = useAlerts(requestBody, true);
  // console.log(requestBody,'alertsData');

  const roots = new WeakMap<HTMLElement, ReturnType<typeof createRoot>>();

  const columns: ColumnConfig<any>[] = useMemo(() => ([
    {
      title: "System Name",
      data: "ip",
      render: (data: any, type: any, row: any, meta: any) =>
        // renderToStaticMarkup(dtRenderer(data, {field: "ip", row})),
        dtRenderer(data, {field: "ip", row}),
      orderable: true,
    },
    {
      title: "Non-Complaint Metric",
      data: "metricsName",
      render: (data: any, type: any, row: any, meta: any) =>
        // renderToStaticMarkup(dtRenderer(data, {field: "metricsName", row})),
        dtRenderer(data, {field: "alertNonComplaintMetric", row}),
      orderable: true,
    },
    {
      title: "Client Group",
      data: "clientGroupName",
      render: (data: any, type: any, row: any, meta: any) =>
        // renderToStaticMarkup(dtRenderer(data, {field: "clientGroupId", row})),
        dtRenderer(data, {field: "clientGroupName", row}),
      orderable: true,
    },
    {
      title: "Compliance Rule",
      data: "complianceRuleName",
      render: (data: any, type: any, row: any, meta: any) =>
        // renderToStaticMarkup(dtRenderer(data, {field: "complianceRuleId", row})),
        dtRenderer(data, {field: "complianceRuleName", row}),
      orderable: true,
    },
    {
      title: "Level",
      data: "level",
      render: (data: any, type: any, row: any, meta: any) =>
        // renderToStaticMarkup(dtRenderer(data, {field: "level", row})),
        dtRenderer(data, {field: "level", row}),
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
    {
      title: "Status",
      data: "status",
      orderable: false,
      // render: (data: any, type: any, row: any, meta: any) =>
        // renderToStaticMarkup(dtRenderer(data, {field: "alertStatus", row, onAction: handleStatusUpdate})),
        // dtRenderer(data, {field: "alertStatus", row, onAction: handleStatusUpdate}),
      render: (data, type, rowData, meta) => {
        // debugger;
        // console.log(type, 'export types');
        // if (type === "export" || type === "print" || type === 'filter' || type === 'sort') {
        //   return rowData.status ?? "-";
        // }

        const containerId = `react-btn-${rowData.ip}${type}`;

        setTimeout(() => {
          const container = document.getElementById(containerId);

          if (container) {
            let root = roots.get(container);

            if (!root) {
              root = createRoot(container);
              roots.set(container, root);
            }

            root.render(getAlertActionButton(rowData, handleStatusUpdate));
          }
        }, 0);

        return `<div id="${containerId}">${rowData.status}</div>`;
      }
    },
  ]), []);

  const handleStatusUpdate = async (row: Alerts, newStatus: string) => {
    // console.log(row, 'row alert');
    // console.log(newStatus, 'newStatus alert');
    const requestBody: AlertsUpdateStatus = {
      ip: String(row?.ip),
      status: newStatus,
    };

    try {
      const res = await updateAlertStatus(requestBody);
      if (res?.status === 200 || res?.status === 204) {
        // console.log(res,'updateAlertStatus');
        toast.dismiss();
        toast.success(res?.data);
        setAlerts((prev) =>
          prev.map((item) =>
            item.ip === row.ip ? { ...item, status: newStatus } : item
          )
        );
        // queryClient.invalidateQueries({ queryKey: ["alerts"] });
      } else {
        toast.dismiss();
        toast.error(`Failed to update alert status: ${res?.status} ${res?.statusText}`);
      }
    } catch (err: any) {
      // console.log(err,'errerrerrerr')
      if (err.status === 409) {
        toast.dismiss();
        toast.error(`Failed to update alert status: ${err.response.data || "Unknown error"}`);
      } else {
        toast.dismiss();
        toast.error(`Failed to update alert status: ${err?.message || "Unknown error"}`);
      }
    }
  };

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

  // Sync with server data
  useEffect(() => {
    if (alertsData?.content) {
      setAlerts(alertsData.content);
    }
  }, [alertsData]);

  return (
    <ContentWrapper>
      <ContentHeader title="Alerts" breadcrumbItems={breadcrumbItems} containerHeaderClassName={"content-header pb-0"} />
      <Section className={'content'}>
        <div className="container-fluid">
          <Row>
            <Col className="col-12">
              <Card>
                {/* <CardHeader 
                  title="Alerts" 
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
                  </Row>
                  <ServerDataTable 
                    id={"alertsTable"} 
                    columns={columns}
                    data={alerts}
                    page={filters.page}
                    size={filters.size}
                    totalElements={alertsData?.totalElements ?? 0}
                    onPageChange={(newPage) => {
                      if (newPage !== filters.page) {
                        updateFilters({ page: newPage }, false);
                      }
                    }}
                    onPageSizeChange={(newSize) => {
                      updateFilters({ size: newSize, page: 1 }); // reset page
                    }}
                    onSort={handleSort}
                    searching={false}
                    // order={6}
                    // columnDefs={[{ orderable: false, targets: [0, 1, 2, 3, 4, 5] }]}
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
