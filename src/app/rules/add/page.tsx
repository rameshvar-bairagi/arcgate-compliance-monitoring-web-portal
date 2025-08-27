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

// import { useMetricsNameList, useClientGroupList } from "@/hooks/useOptionList";
import { useMetricsNameList } from "@/hooks/useOptionList";
import { rulesSchema, RuleFormData } from '@/schemas/rulesSchema';
import { useRouter } from 'next/navigation';
// import { getClientGroupOptions, getMetricsOptions, Option } from '@/utils/commonMethod';
import { getMetricsOptions, Option } from '@/utils/commonMethod';
import { FormCard } from '@/components/ui/Form/FormCard';
import Select from "react-select";
import { useRules } from "@/hooks/useRules";
import { getComplianceRuleById } from '@/services/allApiService';
import { PostRulesRequestBody } from '@/types/rules';
import { toast } from "react-toastify";

interface RuleFormProps {
  defaultValues?: Partial<RuleFormData>;
  id?: string | number | undefined;
  // onSubmit: (data: RuleFormData) => void;
}

export default function AddRulePage({ defaultValues, id }: RuleFormProps) {
  const router = useRouter();
  const isEditMode = Boolean(id);
  const queryClient = useQueryClient();

  const { saveRule, saveRuleLoading, saveRuleError } = useRules();
  const [loadingRule, setLoadingRule] = useState(false);
  const [ruleData, setRuleData] = useState<any>(null);
  const [formInitialized, setFormInitialized] = useState(false);


  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Rules', href: '/rules' },
    { label: isEditMode ? "Edit Rule" : "Add Rule", active: true },
  ];

  const {
    register,
    handleSubmit,
    control,
    watch,
    trigger,
    reset, // <-- for setting API data as defaults
    formState: { errors, isValid },
  } = useForm<RuleFormData>({
    resolver: zodResolver(rulesSchema),
    defaultValues: {
      name: "",
      description: "",
      andRule: [],
      orRule: [],
      // allSystems: "",
      // clientGroupId: "",
      ...defaultValues,
    },
    mode: "all",       // <-- validate on submit
    reValidateMode: "onChange", // <-- re-validate when fields change
  });

  const onSubmit = (data: RuleFormData) => {
    // Map your form values to API body
    const requestBody: PostRulesRequestBody = {
      id: isEditMode ? id : undefined,   // only add ID in edit mode
      name: data.name,
      description: data.description ?? "",
      andRule: data.andRule?.length ? data.andRule.join(",") : "",
      orRule: data.orRule?.length ? data.orRule.join(",") : "",
      // allSystems: data.allSystems === "ALL",
      // clientGroupId: data.allSystems === "ALL" ? -1 : data.clientGroupId || -1,
    };

    saveRule(
      { requestBody, isEdit: isEditMode },
      {
        onSuccess: () => {
          toast.success(isEditMode ? "Rule updated successfully!" : "Rule saved successfully!");
          // Force RulesPage to re-fetch
          queryClient.invalidateQueries({ queryKey: ["allComplianceRulesList"] });
          router.push("/rules");
        },
        onError: (err) => {
          toast.error(`Failed to save rule: ${err?.message || "Unknown error"}`);
        },
      }
    );
  };

  const { 
    list: metricsNameList,
    // loading: metricsNameListLoading,
    // error: metricsNameListError
  } = useMetricsNameList();
  const metricsOptions = getMetricsOptions(metricsNameList ?? []);
  console.log(metricsOptions, 'metricsOptions');
  
  // const { 
  //   list: clientGroupList,
  // } = useClientGroupList();
  // const clientGroupOptions = getClientGroupOptions(clientGroupList ?? []);

  // const allSystemOptions: Option[] = [
  //   { label: "All Systems", value: "ALL" },
  //   { label: "Client Group", value: "CLIENT_GROUP" },
  // ];

  const orRuleValue = watch("orRule");
  // const allSystemsValue = watch("allSystems");

  // Determine if AND Metrics error should show
  const showAndRuleError = !orRuleValue?.length && !!errors.andRule;
  
  // Determine if Client Group should show
  // const showClientGroup = allSystemsValue === "CLIENT_GROUP";

  useEffect(() => {
    // trigger(["andRule", "orRule", "allSystems", "clientGroupId", "name"]);
    trigger(["andRule", "orRule", "name"]);
  }, []); // run only once on mount

  useEffect(() => {
    if (isEditMode && id) {
      setLoadingRule(true);
      getComplianceRuleById(id)
        .then((res) => setRuleData(res))
        .catch((err) => {
          toast.error(`Failed to fetch rule: ${err?.message || "Unknown error"}`);
        })
        .finally(() => setLoadingRule(false));
    }
  }, [isEditMode, id]);

  // once rule + options are both available, reset form
  useEffect(() => {
    if (!formInitialized && ruleData && metricsOptions.length > 0) {
    // if (!formInitialized && ruleData && clientGroupOptions.length > 0 && metricsOptions.length > 0) {
      console.log(ruleData,'ruleData');
      // const matchedClientGroup = clientGroupOptions.find(
      //   (opt) => opt.label === ruleData.clientGroupName
      // );

      // Extract metric IDs for default values
    const andRuleValues =
      ruleData.andMetrics?.map((metric: { id: number }) => metric.id) ?? [];

    const orRuleValues =
      ruleData.orMetrics?.map((metric: { id: number }) => metric.id) ?? [];

      const mappedData: RuleFormData = {
        name: ruleData.name ?? "",
        description: ruleData.description ?? "",
        andRule: andRuleValues,   // must match option.value
        orRule: orRuleValues,     // must match option.value
        // allSystems: ruleData.allSystems ? "ALL" : "CLIENT_GROUP",
        // clientGroupId: ruleData.allSystems ? "" : matchedClientGroup?.value ?? "",
      };

      reset(mappedData, { keepDefaultValues: false });
      setFormInitialized(true);
    }
  }, [ruleData, metricsOptions, formInitialized]);
  // }, [ruleData, clientGroupOptions, metricsOptions, formInitialized]);

  return (
    <ContentWrapper>
      <ContentHeader title={isEditMode ? "Edit Rule" : "Add Rule"} breadcrumbItems={breadcrumbItems} containerClassName={"container"}/>
      <Section className="content">
        <div className="container">
          <Row>
            <Col className="col-12">
                {loadingRule && ( <p className="text-center mt-4">Loading rule details...</p>)}
                {saveRuleError && (
                  <p className="text-danger text-center mt-2">Failed: {saveRuleError.message}</p>
                )}
                <FormCard 
                    title="Compliance Rule"
                    onSubmit={handleSubmit(onSubmit)}
                    onCancel={() => router.push("/rules")}
                    submitLabel={
                      saveRuleLoading
                        ? isEditMode
                          ? "Updating..."
                          : "Saving..."
                        : isEditMode
                          ? "Update Rule"
                          : "Save Rule"
                    }
                    cancelLabel="Cancel"
                    formClassName="space-y-4"
                    cardClassName="card-secondary"
                    submitDisabled={!isValid || saveRuleLoading} // <-- disable if form is invalid
                >
                    <Row>
                        <Col className="col-sm-6">
                            <div className="form-group pl-4 pr-4">
                                <label htmlFor="name" className="block font-medium">Rule Name</label>
                                <input {...register("name")} type="text" id="name" className={`form-control ${errors.name ? "is-invalid" : ""}`} placeholder="Rule name ..." />
                                {errors.name && (
                                    <span className="invalid-feedback">{errors.name.message}</span>
                                )}
                            </div>
                        </Col>
                        <Col className="col-sm-6">
                            <div className="form-group pl-4 pr-4">
                                <label htmlFor="description" className="block font-medium">Description</label>
                                <textarea {...register("description")} id="description" className="form-control" placeholder="Description ..." rows={1} />
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="col-sm-6">
                            <div className="form-group pl-4 pr-4">
                                <label htmlFor="andRule" className="block font-medium">AND Metrics (all must be true)</label>
                                <Controller
                                    name="andRule"
                                    control={control}
                                    render={({ field }) => {

                                      // Exclude options already selected in orRule
                                      const filteredAndOptions = metricsOptions.filter(
                                        (opt) => !orRuleValue?.includes(opt.value)
                                      );
                                    
                                      return (
                                        <Select<Option, true>
                                            {...field}
                                            isMulti
                                            options={filteredAndOptions}
                                            classNamePrefix="react-select"
                                            className={`react-select-container ${showAndRuleError ? "is-invalid" : ""}`}
                                            isClearable
                                            id="andRule"
                                            value={metricsOptions.filter((opt) =>
                                                field.value?.includes(opt.value)
                                            )}
                                            onChange={(selected) => {
                                                field.onChange(selected ? selected.map((opt) => opt.value) : []);
                                            }}
                                            placeholder="And metrics..."
                                        />
                                      )
                                    }}
                                />
                                {showAndRuleError && (
                                    <span className="invalid-feedback d-block">{errors.andRule?.message as string}</span>
                                )}
                            </div>
                        </Col>
                        <Col className="col-sm-6">
                            <div className="form-group pl-4 pr-4">
                                <label htmlFor="orRule" className="block font-medium">OR Metrics (any one true)</label>
                                <Controller
                                    name="orRule"
                                    control={control}
                                    render={({ field }) => {
                                      // Exclude options already selected in andRule
                                      const filteredOrOptions = metricsOptions.filter(
                                        (opt) => !watch("andRule")?.includes(opt.value)
                                      );

                                      return (
                                        <Select<Option, true>
                                            {...field}
                                            isMulti
                                            options={filteredOrOptions}
                                            classNamePrefix="react-select"
                                            className={`react-select-container ${errors.orRule ? "is-invalid" : ""}`}
                                            isClearable
                                            id="orRule"
                                            value={metricsOptions.filter((opt) =>
                                                field.value?.includes(opt.value)
                                            )}
                                            onChange={(selected) => {
                                                field.onChange(selected ? selected.map((opt) => opt.value) : []);
                                            }}
                                            placeholder="OR metrics..."
                                        />
                                      )
                                    }}
                                />
                                {errors.orRule && (
                                    <span className="invalid-feedback d-block">{errors.orRule.message as string}</span>
                                )}
                            </div>
                        </Col>
                    </Row>
                    {/* <Row>
                        <Col className="col-sm-6">
                            <div className="form-group pl-4 pr-4">
                                <label htmlFor="allSystems" className="block font-medium">Apply To</label>
                                <Controller
                                    name="allSystems"
                                    control={control}
                                    render={({ field }) => (
                                    <Select<Option, false>
                                        {...field}
                                        // isMulti
                                        options={allSystemOptions}
                                        classNamePrefix="react-select"
                                        className={`react-select-container ${errors.allSystems ? "is-invalid" : ""}`}
                                        isClearable
                                        id="allSystems"
                                        value={allSystemOptions.find((opt) => opt.value === field.value) || null}
                                        onChange={(selected) => field.onChange(selected?.value ?? "")}
                                        placeholder="Apply to..."
                                    />
                                    )}
                                />
                                {errors.allSystems && (
                                    <span className="invalid-feedback d-block">{errors.allSystems.message as string}</span>
                                )}
                            </div>
                        </Col>
                        {showClientGroup && (
                            <Col className="col-sm-6">
                                <div className="form-group pl-4 pr-4">
                                    <label htmlFor="clientGroupId" className="block font-medium">Client Group</label>
                                    <Controller
                                        name="clientGroupId"
                                        control={control}
                                        render={({ field }) => (
                                        <Select<Option, false>
                                            {...field}
                                            // isMulti
                                            options={clientGroupOptions}
                                            classNamePrefix="react-select"
                                            className={`react-select-container ${errors.clientGroupId ? "is-invalid" : ""}`}
                                            isClearable
                                            id="clientGroupId"
                                            value={clientGroupOptions.find((opt) => opt.value === field.value) || null}
                                            onChange={(selected) => field.onChange(selected?.value ?? "")}
                                            placeholder="Client group..."
                                        />
                                        )}
                                    />
                                    {errors.clientGroupId && (
                                        <span className="invalid-feedback d-block">{errors.clientGroupId.message as string}</span>
                                    )}
                                </div>
                            </Col>
                        )}
                    </Row> */}
                </FormCard>
            </Col>
          </Row>
        </div>
      </Section>
    </ContentWrapper>
  );
}