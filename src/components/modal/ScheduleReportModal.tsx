/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState } from 'react';
import Modal from '@/components/modal/Modal';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Button, Form } from 'react-bootstrap'; // Or your UI lib
import { ScheduleForm } from '@/types/scheduleForm';
import RequiredLabel from '../ui/RequiredLabel';
import { useScheduledReportsList } from '@/hooks/useOptionList';
import { getReportTypeOptions } from '@/utils/commonMethod';
export interface Option<T = string> {
  label: string;
  value: T;
}

const reportTypes = [
  { label: 'Overall Compliance Summary', value: 'Overall Compliance Summary' },
  { label: 'SOC2 Compliance', value: 'SOC2 Compliance' },
  { label: 'Client Group Compliance', value: 'Client Group Compliance' },
  { label: 'Alert History', value: 'Alert History' },
];

const frequencies = [
  { label: 'Daily', value: 'Daily' },
  { label: 'Weekly', value: 'Weekly' },
  { label: 'Monthly', value: 'Monthly' },
];

const formats = [
  { label: 'PDF', value: 'PDF' },
  { label: 'CSV', value: 'CSV' },
  { label: 'EXCEL', value: 'EXCEL' },
  { label: 'DOC', value: 'DOC' },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ScheduleForm) => void;
  initialData?: ScheduleForm | null;
}

const ScheduleReportModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [form, setForm] = useState<ScheduleForm>({
    name: '',
    frequency: 'Weekly',
    recipients: [],
    format: 'PDF',
    start_date: new Date(),
    status: 'ON',
  });

  const [recipientInput, setRecipientInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValid, setIsValid] = useState(false);

  const { 
    list: scheduledReportsList,
    loading: scheduledReportsLoading,
    error: scheduledReportsError
  } = useScheduledReportsList();
  // console.log(scheduledReportsList,'scheduledReportsList');
  const reportTypes: Option<string | number>[] = getReportTypeOptions(scheduledReportsList ?? []);
  // console.log(reportTypes,'reportTypesreportTypesreportTypes');
  

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!form.name) newErrors.name = 'Report type is required';
    if (!form.frequency) newErrors.frequency = 'Frequency is required';
    if (!form.format) newErrors.format = 'Format is required';
    if (!form.start_date) newErrors.start_date = 'Start date is required';
    if (!recipientInput.trim()) {
      newErrors.recipients = 'At least one recipient is required';
    } else {
      const emails = recipientInput
        .split(',')
        .map((email) => email.trim())
        .filter((email) => email.length > 0);

      const invalid = emails.filter((email) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
      if (invalid.length > 0) {
        newErrors.recipients = `Invalid email(s): ${invalid.join(', ')}`;
      } else {
        setForm((prev) => ({ ...prev, recipients: emails }));
      }
    }

    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
    // return Object.keys(newErrors).length === 0;
  };

  // Run validation when inputs change
  useEffect(() => {
    validate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.name, form.frequency, form.format, form.start_date, recipientInput]);

  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialData,
        recipients: Array.isArray(initialData.recipients)
          ? initialData.recipients
          : typeof initialData.recipients === "string"
            ? initialData?.recipients?.split(", ").map((e:any) => e.trim())
            : [],
      });

      setRecipientInput(
        Array.isArray(initialData.recipients)
          ? initialData.recipients.join(", ")
          : typeof initialData.recipients === "string"
            ? initialData.recipients
            : ""
      );
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValid) return;

    onSave(form);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Schedule Report" showFooter={false}>
      <Form onSubmit={handleSubmit} className='row mt-4'>
        <Form.Group className="mb-3 col-md-6">
          <RequiredLabel>Report Type</RequiredLabel>
          <Select
            options={reportTypes}
            value={reportTypes.find((opt) => opt.value === form.name)}
            onChange={(selected) =>
              setForm((prev) => ({ ...prev, name: String(selected?.value || '') }))
            }
            placeholder="Select report type..."
            classNamePrefix="react-select"
            className={`react-select-container`}
            isDisabled={!!initialData}   // disable when editing
          />
          {errors.name && <div className="text-sm text-danger">{errors.name}</div>}
        </Form.Group>

        <Form.Group className="mb-3 col-md-6">
            <RequiredLabel>Frequency</RequiredLabel>
            <Select
                options={frequencies}
                value={frequencies.find((opt) => opt.value === form.frequency)}
                onChange={(selected) =>
                setForm((prev) => ({ ...prev, frequency: selected?.value as any }))
                }
                placeholder="Select frequency..."
                classNamePrefix="react-select"
                className={`react-select-container`}
            />
            {errors.frequency && <div className="text-sm text-danger">{errors.frequency}</div>}
        </Form.Group>

        <Form.Group className="mb-3 col-md-6">
          <RequiredLabel>Recipients (comma-separated emails)</RequiredLabel>
          <Form.Control
            type="text"
            placeholder="e.g. admin@example.com, team@example.com"
            value={recipientInput}
            onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setRecipientInput(e.target.value)}
            onBlur={() => {
              const emails = recipientInput
                .split(',')
                .map((email) => email.trim())
                .filter((email) => email.includes('@'));
              setForm((prev) => ({ ...prev, recipients: emails }));
            }}
          />
          {errors.recipients && <div className="text-sm text-danger">{errors.recipients}</div>}
        </Form.Group>

        <Form.Group className="mb-3 col-md-6">
            <RequiredLabel>Format</RequiredLabel>
            <Select
                options={formats}
                value={formats.find((opt) => opt.value === form.format)}
                onChange={(selected) =>
                setForm((prev) => ({ ...prev, format: selected?.value as any }))
                }
                placeholder="Select format..."
                classNamePrefix="react-select"
                className={`react-select-container`}
            />
            {errors.format && <div className="text-sm text-danger">{errors.format}</div>}
        </Form.Group>

        <Form.Group className="mb-3 col-md-6">
          <RequiredLabel>Start Date</RequiredLabel>
          <div className="input-group date">
            <DatePicker
                selected={form.start_date}
                onChange={(date) =>
                setForm((prev) => ({ ...prev, start_date: date }))
                }
                className="form-control datetimepicker-input"
                dateFormat="yyyy-MM-dd"
                minDate={new Date()}
            />
            <span className="input-group-text">
                <i className="fas fa-calendar"></i>
            </span>
          </div>
          {errors.start_date && <div className="text-sm text-danger">{errors.start_date}</div>}
        </Form.Group>

        <Form.Group className="mb-3 col-md-6">
            <RequiredLabel>Status</RequiredLabel>
            <div className="input-group">
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={form.status === 'ON'}
                    onChange={(e) =>
                        setForm((prev) => ({
                        ...prev,
                        status: e.target.checked ? 'ON' : 'OFF',
                        }))
                    }
                  />
                  <span className="slider">
                    <span className="on">ON</span>
                    <span className="off">OFF</span>
                  </span>
                </label>
            </div>
        </Form.Group>
        
        <div className='col col-md-12 mt-4'>
          <div className="d-flex justify-content-between align-items-center">
            <Button variant="secondary" onClick={onClose} className="btn btn-default">
              Cancel
            </Button>
            <Button type="submit" variant="success" className='btn btn-success float-right' disabled={!isValid}>
              Save Schedule
            </Button>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default ScheduleReportModal;