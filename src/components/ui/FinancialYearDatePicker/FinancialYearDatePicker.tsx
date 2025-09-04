import React, { useState } from "react";
import DatePicker from "react-datepicker";
import Select from "react-select";
import { getFinancialYearRanges } from "@/utils/dateUtils";

import "react-datepicker/dist/react-datepicker.css";

type PresetType = 'today' | 'last7Days' | 'last30Days' | 'thisFY' | 'lastFY' | 'custom';

interface FinancialYearDatePickerProps {
  onChange?: (range: { startDate: Date; endDate: Date, date?: string }) => void;
}

const presetOptions = [
  { label: "Today", value: "today" },
  { label: "Last 7 Days", value: "last7Days" },
  // { label: "Last 30 Days", value: "last30Days" },
  // { label: "This Financial Year", value: "thisFY" },
  // { label: "Last Financial Year", value: "lastFY" },
  // { label: "Custom Range", value: "custom" },
] as const;

const FinancialYearDatePicker: React.FC<FinancialYearDatePickerProps> = ({ onChange }) => {
  const [selectedPreset, setSelectedPreset] = useState<PresetType>("today");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());

  const applyPreset = (preset: PresetType) => {
    const ranges = getFinancialYearRanges();
    const range = ranges[preset] || [new Date(), new Date()];
    setStartDate(range[0]);
    setEndDate(range[1]);
    onChange?.({ startDate: range[0], endDate: range[1], date: preset, });
  };

  const handlePresetChange = (selected: { value: PresetType; label: string } | null) => {
    const value = selected?.value;
    if (!value) return;

    setSelectedPreset(value);

    if (value !== "custom") {
      applyPreset(value);
    }
  };

  return (
    <div className="d-flex flex-column gap-2">
      <Select
        options={presetOptions}
        value={presetOptions.find((opt) => opt.value === selectedPreset)}
        onChange={handlePresetChange}
        className="react-select-container"
        classNamePrefix="react-select"
        placeholder={"Select a preset range..."}
        isClearable={false}
      />

      {selectedPreset === "custom" && (
        <div className="d-flex gap-2">
          <DatePicker
            selected={startDate}
            onChange={(date: Date | null) => {
                if (!date) return; // guard clause for null

                setStartDate(date);
                onChange?.({ startDate: date, endDate });
            }}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            placeholderText="Start Date"
            className="form-control"
            />
          <DatePicker
            selected={endDate}
            onChange={(date: Date | null) => {
                if (!date) return; // guard clause for null
                setEndDate(date);
                onChange?.({ startDate, endDate: date });
            }}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            placeholderText="End Date"
            className="form-control"
          />
        </div>
      )}
    </div>
  );
};

export default FinancialYearDatePicker;