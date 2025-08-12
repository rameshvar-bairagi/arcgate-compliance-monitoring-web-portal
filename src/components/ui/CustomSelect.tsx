/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useRef } from 'react';

interface CustomSelectProps {
  label?: string;
  options?: { label: string; value: string }[];
  selected?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export default function CustomSelect({
  label,
  options,
  selected,
  onChange,
  placeholder = 'Select an option',
}: CustomSelectProps) {
  const selectRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    const $ = (window as any).jQuery;
    if ($ && $.fn.select2 && selectRef.current) {
      const $select = $(selectRef.current);
      
      // Initialize Select2
      $select.select2({
        placeholder,
        // allowClear: true,
        // tags: true,
        width: '100%',
      });

      // Bind change event
      $select.on('change', (e: any) => {
        const value = (e.target as HTMLSelectElement).value;
        onChange?.(value);
      });

      // Cleanup on unmount
      return () => {
        $select.off('change'); // remove event listener
        $select.select2('destroy'); // destroy select2
      };
    }
  }, [placeholder, onChange]);

  return (
    <>
      {label && <label>{label}</label>}
      <select
        className="form-control select2"
        style={{ width: '100%' }}
        value={selected || ''}
        onChange={(e) => onChange?.(e.target.value)}
        ref={selectRef}
      >
        <option value="" disabled>{placeholder}</option>
        {options?.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </>
  );
}
