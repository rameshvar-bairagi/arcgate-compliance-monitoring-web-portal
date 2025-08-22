/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import ContentWrapper from '@/components/ui/ContentWrapper';
import ContentHeader from '@/components/ui/ContentHeader';
import Section from '@/components/ui/Section';
import Row from '@/components/ui/Row';
import Col from '@/components/ui/Col';
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

import { useMetricsNameList, useClientGroupList } from "@/hooks/useOptionList";
import { rulesSchema, RuleFormData } from '@/schemas/rulesSchema';
import { useRouter } from 'next/navigation';
import { getClientGroupOptions, getMetricsOptions, Option } from '@/utils/commonMethod';
import { FormCard } from '@/components/ui/Form/FormCard';
import Select from "react-select";
import { useRules } from "@/hooks/useRules";
import { PostRulesRequestBody } from '@/types/rules';
import { toast } from "react-toastify";

interface RuleFormProps {
  defaultValues?: Partial<RuleFormData>;
  onSubmit: (data: RuleFormData) => void;
}

export default function AddRulePage({ defaultValues }: RuleFormProps) {
  const router = useRouter();
  const { postRule, postRulesLoading, postRulesError } = useRules();
  
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Rules', href: '/rules' },
    { label: 'Add Rule', active: true },
  ];

  const {
    register,
    handleSubmit,
    control,
    watch,
    trigger,
    formState: { errors, isValid },
  } = useForm<RuleFormData>({
    resolver: zodResolver(rulesSchema),
    defaultValues: {
      name: "",
      description: "",
      andRule: [],
      orRule: [],
      allSystems: "",
      clientGroups: "",
      ...defaultValues,
    },
    mode: "all",       // <-- validate on submit
    reValidateMode: "onChange", // <-- re-validate when fields change
  });

  const onSubmit = (data: RuleFormData) => {
    // Map your form values to API body
    const requestBody: PostRulesRequestBody = {
        name: data.name,
        description: data.description ?? "",
        andRule: data.andRule?.length ? data.andRule.join(",") : "",
        orRule: data.orRule?.length ? data.orRule.join(",") : "",
        allSystems: data.allSystems === "ALL",
        clientGroupId: data.allSystems === "ALL" ? -1 : data.clientGroups || -1,
    };
    postRule(requestBody, {
      onSuccess: () => {
        // Navigate back after save
        toast.success("Rule saved successfully");
        router.push("/rules");
      },
      onError: (err) => {
        toast.error(`Failed to save rule: ${err?.message || "Unknown error"}`);
        // console.error("Failed to save rule", err);
      },
    });
  };

  const { 
    list: metricsNameList,
    // loading: metricsNameListLoading,
    // error: metricsNameListError
  } = useMetricsNameList();
  const metricsOptions = getMetricsOptions(metricsNameList ?? []);
  
  const { 
    list: clientGroupList,
    // loading: clientGroupListLoading,
    // error: clientGroupListError
  } = useClientGroupList();
  const clientGroupOptions = getClientGroupOptions(clientGroupList ?? []);
  // console.log(clientGroupList, 'clientGroupList')

  const allSystemOptions: Option[] = [
    { label: "All Systems", value: "ALL" },
    { label: "Client Group", value: "CLIENT_GROUP" },
  ];

  const nameValue = watch("name");
  const orRuleValue = watch("orRule");
  const andRuleValue = watch("andRule");
  const allSystemsValue = watch("allSystems");
  const clientGroupsValue = watch("clientGroups");

  // Determine if AND Metrics error should show
  const showAndRuleError = !orRuleValue?.length && !!errors.andRule;
  
  // Determine if Client Group should show
  const showClientGroup = allSystemsValue === "CLIENT_GROUP";

  useEffect(() => {
    trigger(); // validate the whole form on metrics change
  }, [andRuleValue, orRuleValue, allSystemsValue, clientGroupsValue, nameValue]);

  return (
    <ContentWrapper>
      <ContentHeader title="Add Rule" breadcrumbItems={breadcrumbItems} containerClassName={"container"}/>
      <Section className="content">
        <div className="container">
          <Row>
            <Col className="col-12">
                {postRulesError && (
                    <p className="text-danger text-center mt-2">Failed: {postRulesError.message}</p>
                )}
                <FormCard 
                    title="Compliance Rule"
                    onSubmit={handleSubmit(onSubmit)}
                    onCancel={() => router.push("/rules")}
                    submitLabel={postRulesLoading ? "Saving..." : "Save Rule"}
                    cancelLabel="Cancel"
                    formClassName="space-y-4"
                    cardClassName="card-secondary"
                    submitDisabled={!isValid || postRulesLoading} // <-- disable if form is invalid
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
                                    render={({ field }) => (
                                    <Select<Option, true>
                                        {...field}
                                        isMulti
                                        options={metricsOptions}
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
                                    )}
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
                                    render={({ field }) => (
                                    <Select<Option, true>
                                        {...field}
                                        isMulti
                                        options={metricsOptions}
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
                                    )}
                                />
                                {errors.orRule && (
                                    <span className="invalid-feedback d-block">{errors.orRule.message as string}</span>
                                )}
                            </div>
                        </Col>
                    </Row>
                    <Row>
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
                                    <label htmlFor="clientGroups" className="block font-medium">Client Group</label>
                                    <Controller
                                        name="clientGroups"
                                        control={control}
                                        render={({ field }) => (
                                        <Select<Option, false>
                                            {...field}
                                            // isMulti
                                            options={clientGroupOptions}
                                            classNamePrefix="react-select"
                                            className={`react-select-container ${errors.clientGroups ? "is-invalid" : ""}`}
                                            isClearable
                                            id="clientGroups"
                                            value={clientGroupOptions.find((opt) => opt.value === field.value) || null}
                                            onChange={(selected) => field.onChange(selected?.value ?? "")}
                                            placeholder="Client group..."
                                        />
                                        )}
                                    />
                                    {errors.clientGroups && (
                                        <span className="invalid-feedback d-block">{errors.clientGroups.message as string}</span>
                                    )}
                                </div>
                            </Col>
                        )}
                    </Row>
                </FormCard>
            </Col>
          </Row>
        </div>
      </Section>
    </ContentWrapper>
  );
}