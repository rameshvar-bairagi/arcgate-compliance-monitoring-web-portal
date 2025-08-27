/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useQueryClient } from "@tanstack/react-query";
import ContentWrapper from '@/components/ui/ContentWrapper';
import ContentHeader from '@/components/ui/ContentHeader';
import Section from '@/components/ui/Section';
import Row from '@/components/ui/Row';
import Col from '@/components/ui/Col';
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";

import { useAllComplianceRulesList, useSystemNameList } from "@/hooks/useOptionList";
import { groupsSchema, GroupFormData } from '@/schemas/groupsSchema';
import { useRouter } from 'next/navigation';
import { getIpOptions, getRulesOptions, Option } from '@/utils/commonMethod';
import { FormCard } from '@/components/ui/Form/FormCard';
import Select from "react-select";
import { useGroups } from "@/hooks/useGroups";
import { getClientRuleById } from '@/services/allApiService';
import { PostGroupsRequestBody } from '@/types/groups';
import { toast } from "react-toastify";

interface GroupFormProps {
  defaultValues?: Partial<GroupFormData>;
  id?: string | number | undefined;
  // onSubmit: (data: GroupFormData) => void;
}

export default function AddGroupPage({ defaultValues, id }: GroupFormProps) {
  const router = useRouter();
  const isEditMode = Boolean(id);
  const queryClient = useQueryClient();

  const { saveGroup, saveGroupLoading, saveGroupError } = useGroups();
  const [loadingGroup, setLoadingGroup] = useState(false);
  const [groupData, setGroupData] = useState<any>(null);
  const [formInitialized, setFormInitialized] = useState(false);


  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Groups', href: '/groups' },
    { label: isEditMode ? "Edit Group" : "Add Group", active: true },
  ];

  const {
    register,
    handleSubmit,
    control,
    watch,
    trigger,
    reset, // <-- for setting API data as defaults
    formState: { errors, isValid },
  } = useForm<GroupFormData>({
    resolver: zodResolver(groupsSchema),
    defaultValues: {
      name: "",
      systemIps: [],
      complianceRuleId: "",
      ...defaultValues,
    },
    mode: "all",       // <-- validate on submit
    reValidateMode: "onChange", // <-- re-validate when fields change
  });

  const onSubmit = (data: GroupFormData) => {
    // Map your form values to API body
    const requestBody: PostGroupsRequestBody = {
      id: isEditMode ? Number(id) : undefined,   // only add ID in edit mode
      name: data.name,
      systemIps: (data.systemIps?.length ? data.systemIps : []).map(String), // force all to string[]
      // complianceRuleId: data.complianceRuleId || "",
      complianceRuleIds: Array.isArray(data.complianceRuleId) 
        ? data.complianceRuleId.map(Number)   // already array
        : [Number(data.complianceRuleId)],    // wrap single value into array
    };

    saveGroup(
      { requestBody, isEdit: isEditMode },
      {
        onSuccess: () => {
          toast.success(isEditMode ? "Client Group updated successfully!" : "Client Group saved successfully!");
          queryClient.invalidateQueries({ queryKey: ["clientGroupList"] });
          router.push("/groups");
        },
        onError: (err) => {
          toast.error(`Failed to save group: ${err?.message || "Unknown error"}`);
        },
      }
    );
  };

  const { 
      list: systemNameList,
    } = useSystemNameList();
    const systemNameOptions: Option[] = getIpOptions(systemNameList ?? []);
  // console.log(systemNameOptions, 'systemNameOptions');

  const { 
      list: allComplianceRulesList,
    } = useAllComplianceRulesList();
    const allComplianceRuleOptions = getRulesOptions(allComplianceRulesList ?? []);
  // console.log(allComplianceRuleOptions,'allComplianceRuleOptions');

  useEffect(() => {
    trigger(["systemIps", "complianceRuleId", "name"]);
  }, []); // run only once on mount

  useEffect(() => {
    if (isEditMode && id) {
      setLoadingGroup(true);
      getClientRuleById(id)
        .then((res) => setGroupData(res))
        .catch((err) => {
          toast.error(`Failed to fetch group: ${err?.message || "Unknown error"}`);
        })
        .finally(() => setLoadingGroup(false));
    }
  }, [isEditMode, id]);


  useEffect(() => {
    if (!formInitialized && groupData && allComplianceRuleOptions.length > 0 && systemNameOptions.length > 0) {
      console.log(groupData,'groupData');
      // Extract complianceRuleId (assuming single rule for now)
      const complianceRuleId = groupData.complianceRules?.[0]?.id;

      // Find matching option
      const matchedComplianceRule = allComplianceRuleOptions.find(
        (opt) => opt.value === complianceRuleId
      );

      const systemIpsValues = groupData.systemIps ?? [];

      const mappedData: GroupFormData = {
        name: groupData.name ?? "",
        systemIps: systemIpsValues,
        complianceRuleId: matchedComplianceRule?.value ?? "",
      };

      reset(mappedData, { keepDefaultValues: false });
      setFormInitialized(true);
    }
  }, [groupData, allComplianceRuleOptions, systemNameOptions, formInitialized]);

  return (
    <ContentWrapper>
      <ContentHeader title={isEditMode ? "Edit Group" : "Add Group"} breadcrumbItems={breadcrumbItems} containerClassName={"container"}/>
      <Section className="content">
        <div className="container">
          <Row>
            <Col className="col-12">
                {loadingGroup && ( <p className="text-center mt-4">Loading group details...</p>)}
                {saveGroupError && (
                  <p className="text-danger text-center mt-2">Failed: {saveGroupError.message}</p>
                )}
                <FormCard 
                    title="Client Group"
                    onSubmit={handleSubmit(onSubmit)}
                    onCancel={() => router.push("/groups")}
                    submitLabel={
                      saveGroupLoading
                        ? isEditMode
                          ? "Updating..."
                          : "Saving..."
                        : isEditMode
                          ? "Update Group"
                          : "Save Group"
                    }
                    cancelLabel="Cancel"
                    formClassName="space-y-4"
                    cardClassName="card-secondary"
                    submitDisabled={!isValid || saveGroupLoading} // <-- disable if form is invalid
                >
                    <Row>
                        <Col className="col-sm-6">
                            <div className="form-group pl-4 pr-4">
                                <label htmlFor="name" className="block font-medium">Group Name</label>
                                <input {...register("name")} type="text" id="name" className={`form-control ${errors.name ? "is-invalid" : ""}`} placeholder="Group name ..." />
                                {errors.name && (
                                    <span className="invalid-feedback">{errors.name.message}</span>
                                )}
                            </div>
                        </Col>
                        <Col className="col-sm-6">
                          <div className="form-group pl-4 pr-4">
                              <label htmlFor="complianceRuleId" className="block font-medium">Compliance Rule</label>
                              <Controller
                                  name="complianceRuleId"
                                  control={control}
                                  render={({ field }) => (
                                  <Select<Option, false>
                                      {...field}
                                      // isMulti
                                      options={allComplianceRuleOptions}
                                      classNamePrefix="react-select"
                                      className={`react-select-container ${errors.complianceRuleId ? "is-invalid" : ""}`}
                                      isClearable
                                      id="complianceRuleId"
                                      value={allComplianceRuleOptions.find((opt) => opt.value === field.value) || null}
                                      onChange={(selected) => field.onChange(selected?.value ?? "")}
                                      placeholder="Compliance rule..."
                                  />
                                  )}
                              />
                              {errors.complianceRuleId && (
                                  <span className="invalid-feedback d-block">{errors.complianceRuleId.message as string}</span>
                              )}
                          </div>
                      </Col>
                    </Row>
                    <Row>
                        <Col className="col-sm-6">
                            <div className="form-group pl-4 pr-4">
                                <label htmlFor="systemIps" className="block font-medium">System IP`s</label>
                                <Controller
                                    name="systemIps"
                                    control={control}
                                    render={({ field }) => {
                                      return (
                                        <Select<Option, true>
                                            {...field}
                                            isMulti
                                            options={systemNameOptions}
                                            classNamePrefix="react-select"
                                            className={`react-select-container ${errors.systemIps ? "is-invalid" : ""}`}
                                            isClearable
                                            id="systemIps"
                                            value={systemNameOptions.filter((opt) =>
                                                field.value?.includes(opt.value)
                                            )}
                                            onChange={(selected) => {
                                                field.onChange(selected ? selected.map((opt) => opt.value) : []);
                                            }}
                                            placeholder="System IP`s..."
                                        />
                                      )
                                    }}
                                />
                                {errors.systemIps && (
                                    <span className="invalid-feedback d-block">{errors.systemIps?.message as string}</span>
                                )}
                            </div>
                        </Col>
                    </Row>
                </FormCard>
            </Col>
          </Row>
        </div>
      </Section>
    </ContentWrapper>
  );
}