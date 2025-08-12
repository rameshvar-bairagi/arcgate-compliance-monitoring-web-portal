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

  // useEffect(() => {
  //   if (selectRef.current) {
  //     const $select = initSelect2(selectRef.current, { placeholder, allowClear: true });

  //     $select.on('change', (e) => {
  //       const value = (e.target as HTMLSelectElement).value;
  //       onChange?.(value);
  //     });
  //   }

  //   return () => {
  //     if (selectRef.current) {
  //       ($(selectRef.current) as any).select2('destroy');
  //     }
  //   };
  // }, [placeholder, onChange]);

  useEffect(() => {
    const $ = (window as any).jQuery;
    if ($ && $.fn.select2 && selectRef.current) {
      $(selectRef.current).select2({
        placeholder: 'Search...',
          // tags: true,
          allowClear: true,
          width: '100%',
      });
    }
  }, []);

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
