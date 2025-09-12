/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useQueryClient } from "@tanstack/react-query";
import ContentWrapper from "@/components/ui/ContentWrapper";
import ContentHeader from "@/components/ui/ContentHeader";
import Section from "@/components/ui/Section";
import Row from "@/components/ui/Row";
import Col from "@/components/ui/Col";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";

import {
  useAllComplianceRulesList,
  useSystemNameList,
} from "@/hooks/useOptionList";
import { groupsSchema, GroupFormData } from "@/schemas/groupsSchema";
import { useRouter } from "next/navigation";
import { getIpOptions, getRulesOptions, Option } from "@/utils/commonMethod";
import { FormCard } from "@/components/ui/Form/FormCard";
import Select from "react-select";
import { useGroups } from "@/hooks/useGroups";
import { getClientRuleById, CheckExistGroups } from "@/services/allApiService";
import { PostGroupsRequestBody } from "@/types/groups";
import { toast } from "react-toastify";
import { useDebounce } from "use-debounce";
import { downloadTemplate, parseFile } from "@/utils/fileUtils";

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

  const [groupName, setGroupName] = useState("");
  const [debouncedGroupName] = useDebounce(groupName, 500); // wait 500ms
  const [nameError, setNameError] = useState("");
  const [checking, setChecking] = useState(false);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Groups", href: "/groups" },
    { label: isEditMode ? "Edit Group" : "Add Group", active: true },
  ];

  const {
    register,
    handleSubmit,
    control,
    watch,
    trigger,
    reset, // <-- for setting API data as defaults
    setValue,
    formState: { errors, isValid },
  } = useForm<GroupFormData>({
    resolver: zodResolver(groupsSchema),
    defaultValues: {
      name: "",
      complianceRuleId: "",
      systemIps: [],
      allSystems: "",
      ...defaultValues,
    },
    mode: "all", // <-- validate on submit
    reValidateMode: "onChange", // <-- re-validate when fields change
  });

  const onSubmit = (data: GroupFormData) => {
    // Map your form values to API body
    const requestBody: PostGroupsRequestBody = {
      id: isEditMode ? Number(id) : undefined, // only add ID in edit mode
      name: data.name,
      // complianceRuleId: data.complianceRuleId || "",
      complianceRuleIds: Array.isArray(data.complianceRuleId)
        ? data.complianceRuleId.map(Number) // already array
        : [Number(data.complianceRuleId)], // wrap single value into array
      allSystems: data.allSystems === "ALL",
      systemIps:
        data.allSystems === "ALL"
          ? null
          : data.systemIps?.length
          ? data.systemIps.map(String) // force all to string[]
          : [],
    };

    saveGroup(
      { requestBody, isEdit: isEditMode },
      {
        onSuccess: () => {
          toast.success(
            isEditMode
              ? "Client Group updated successfully!"
              : "Client Group saved successfully!"
          );
          queryClient.invalidateQueries({ queryKey: ["clientGroupList"] });
          router.push("/groups");
        },
        onError: (err) => {
          toast.error(
            `Failed to save group: ${err?.message || "Unknown error"}`
          );
        },
      }
    );
  };

  const allSystemOptions: Option[] = [
    { label: "All Systems", value: "ALL" },
    { label: "System IP`s", value: "SYSTEM_IP" },
  ];

  const { list: systemNameList } = useSystemNameList();
  // const systemNameOptions: Option[] = getIpOptions(systemNameList ?? []);
  const [systemNameOptions, setSystemNameOptions] = useState<Option[]>([]);

  useEffect(() => {
    setSystemNameOptions(getIpOptions(systemNameList ?? []));
  }, [systemNameList]);
  // console.log(systemNameOptions, 'systemNameOptions');

  const { list: allComplianceRulesList } = useAllComplianceRulesList();
  const allComplianceRuleOptions = getRulesOptions(
    allComplianceRulesList ?? []
  );
  // console.log(allComplianceRuleOptions,'allComplianceRuleOptions');

  useEffect(() => {
    trigger(["name", "complianceRuleId", "allSystems", "systemIps"]);
  }, []); // run only once on mount

  useEffect(() => {
    if (isEditMode && id) {
      setLoadingGroup(true);
      getClientRuleById(id)
        .then((res) => setGroupData(res))
        .catch((err) => {
          toast.error(
            `Failed to fetch group: ${err?.message || "Unknown error"}`
          );
        })
        .finally(() => setLoadingGroup(false));
    }
  }, [isEditMode, id]);

  useEffect(() => {
    if (
      !formInitialized &&
      groupData &&
      allComplianceRuleOptions.length > 0 &&
      systemNameOptions.length > 0
    ) {
      // console.log(groupData, "groupData");
      // Extract complianceRuleId (assuming single rule for now)
      const complianceRuleId = groupData.complianceRules?.[0]?.id;

      // Find matching option
      const matchedComplianceRule = allComplianceRuleOptions.find(
        (opt) => opt.value === complianceRuleId
      );

      const systemIpsValues = groupData.systemIps ?? [];

      // Add missing saved IPs into options
      const missingIps = systemIpsValues.filter(
        (ip: string) => !systemNameOptions.some((opt) => opt.value === ip)
      );

      if (missingIps.length > 0) {
        const newOptions = missingIps.map((ip: string) => ({
          label: ip,
          value: ip,
        }));
        setSystemNameOptions((prev) => [...prev, ...newOptions]);
      }

      const mappedData: GroupFormData = {
        name: groupData.name ?? "",
        complianceRuleId: matchedComplianceRule?.value ?? "",
        allSystems: groupData.allSystems ? "ALL" : "SYSTEM_IP",
        systemIps: systemIpsValues,
      };

      reset(mappedData, { keepDefaultValues: false });
      setFormInitialized(true);
    }
  }, [groupData, allComplianceRuleOptions, systemNameOptions, formInitialized]);

  useEffect(() => {
      if (!debouncedGroupName) {
        setNameError("");
        return;
      }
  
      setChecking(true); // start checking
  
      CheckExistGroups(debouncedGroupName)
        .then((res) => {
          // console.log(res, 'CheckExistGroup');
          if (res?.data) {
            setNameError("Group name already exists!");
          } else {
            setNameError("");
          }
        })
        .catch(() => setNameError("Error checking group name!"))
        .finally(() => setChecking(false)); // done checking
    }, [debouncedGroupName]);

  const allSystemsValue = watch("allSystems");
  const showClientGroup = allSystemsValue === "SYSTEM_IP";

  return (
    <ContentWrapper>
      <ContentHeader
        title={isEditMode ? "Edit Group" : "Add Group"}
        breadcrumbItems={breadcrumbItems}
        containerClassName={"container"}
      />
      <Section className="content">
        <div className="container">
          <Row>
            <Col className="col-12">
              {loadingGroup && (
                <p className="text-center mt-4">Loading group details...</p>
              )}
              {saveGroupError && (
                <p className="text-danger text-center mt-2">
                  Failed: {saveGroupError.message}
                </p>
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
                submitDisabled={!isValid || saveGroupLoading || !!nameError || checking} // <-- disable if form is invalid
              >
                <Row>
                  <Col className="col-sm-6">
                    <div className="form-group pl-4 pr-4">
                      <label htmlFor="name" className="block font-medium">
                        Group Name
                      </label>
                      <input
                        {...register("name")}
                        type="text"
                        id="name"
                        onChange={(e) => setGroupName(e.target.value)}
                        className={`form-control ${errors.name || nameError ? "is-invalid" : ""}`}
                        placeholder="Group name ..."
                      />
                      {(errors.name || nameError) && (
                        <span className="invalid-feedback">
                          {errors.name?.message || nameError}
                        </span>
                      )}
                    </div>
                  </Col>
                  <Col className="col-sm-6">
                    <div className="form-group pl-4 pr-4">
                      <label
                        htmlFor="complianceRuleId"
                        className="block font-medium"
                      >
                        Compliance Rule
                      </label>
                      <Controller
                        name="complianceRuleId"
                        control={control}
                        render={({ field }) => (
                          <Select<Option, false>
                            {...field}
                            // isMulti
                            options={allComplianceRuleOptions}
                            classNamePrefix="react-select"
                            className={`react-select-container ${
                              errors.complianceRuleId ? "is-invalid" : ""
                            }`}
                            isClearable
                            id="complianceRuleId"
                            value={
                              allComplianceRuleOptions.find(
                                (opt) => opt.value === field.value
                              ) || null
                            }
                            onChange={(selected) =>
                              field.onChange(selected?.value ?? "")
                            }
                            placeholder="Compliance rule..."
                          />
                        )}
                      />
                      {errors.complianceRuleId && (
                        <span className="invalid-feedback d-block">
                          {errors.complianceRuleId.message as string}
                        </span>
                      )}
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col className="col-sm-6">
                    <div className="form-group pl-4 pr-4">
                      <label htmlFor="allSystems" className="block font-medium">
                        Apply To
                      </label>
                      <Controller
                        name="allSystems"
                        control={control}
                        render={({ field }) => (
                          <Select<Option, false>
                            {...field}
                            // isMulti
                            options={allSystemOptions}
                            classNamePrefix="react-select"
                            className={`react-select-container ${
                              errors.allSystems ? "is-invalid" : ""
                            }`}
                            isClearable
                            id="allSystems"
                            value={
                              allSystemOptions.find(
                                (opt) => opt.value === field.value
                              ) || null
                            }
                            onChange={(selected) =>
                              field.onChange(selected?.value ?? "")
                            }
                            placeholder="Apply to..."
                          />
                        )}
                      />
                      {errors.allSystems && (
                        <span className="invalid-feedback d-block">
                          {errors.allSystems.message as string}
                        </span>
                      )}
                    </div>
                  </Col>
                  {showClientGroup && (
                    <Col className="col-sm-6">
                      <div className="form-group pl-4 pr-4">
                        <label htmlFor="systemIps" className="block font-medium">
                          System IP`s
                        </label>
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
                                className={`react-select-container ${
                                  errors.systemIps ? "is-invalid" : ""
                                }`}
                                isClearable
                                id="systemIps"
                                value={systemNameOptions.filter((opt) =>
                                  field.value?.includes(opt.value)
                                )}
                                onChange={(selected) => {
                                  field.onChange(
                                    selected
                                      ? selected.map((opt) => opt.value)
                                      : []
                                  );
                                }}
                                placeholder="System IP`s..."
                              />
                            );
                          }}
                        />

                        <div className="flex items-center gap-2 mb-2">
                          {/* Hidden file input */}
                          <input
                            id="import-file"
                            type="file"
                            accept=".csv, .xlsx"
                            className="hidden d-none"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                try {
                                  const ips = await parseFile(file); // e.g. ["192.168.0.1", "10.0.0.5"]

                                  const existing = watch("systemIps") || [];

                                  const newOptions = ips
                                    .filter((ip) => !systemNameOptions.some((opt) => opt.value === ip))
                                    .map((ip) => ({ label: ip, value: ip }));

                                  if (newOptions.length > 0) {
                                    setSystemNameOptions((prev) => [...prev, ...newOptions]); // ✅ update state
                                  }

                                  const uniqueIps = Array.from(new Set([...existing, ...ips]));

                                  setValue("systemIps", uniqueIps, { shouldValidate: true });

                                  toast.success(`${ips.length} IPs imported successfully`);
                                } catch (err: any) {
                                  toast.error("Failed to parse file: " + err.message);
                                }
                              }
                            }}
                          />

                          {/* Import button (triggers file input) */}
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => document.getElementById("import-file")?.click()}
                          >
                            <i className="fa fa-upload"></i> Import
                          </button>

                          {/* Download template buttons */}
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-success"
                            onClick={() => downloadTemplate("xlsx")}
                          >
                            <i className="fa fa-file-excel"></i> <i className="fa fa-download"></i> Format
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => downloadTemplate("csv")}
                          >
                            <i className="fa fa-file-csv"></i> <i className="fa fa-download"></i> Format
                          </button>
                        </div>

                        <small className="form-text text-muted">
                          Only <strong>Excel (.xlsx)</strong> or <strong>CSV (.csv)</strong> files are supported.<br />
                          The file must contain <strong>one column</strong> with header: <code>System IP</code>.
                        </small>

                        {errors.systemIps && (
                          <span className="invalid-feedback d-block">
                            {errors.systemIps?.message as string}
                          </span>
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
