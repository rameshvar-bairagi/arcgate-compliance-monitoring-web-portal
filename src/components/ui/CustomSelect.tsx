// components/CustomSelect.tsx
'use client';
// import 'bootstrap/dist/css/select2'; // select2.min.css
import 'select2/dist/css/select2.min.css';

interface CustomSelectProps {
  label?: string;
  options?: { label: string; value: string }[];
  selected?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

const CustomSelect = ({
  label,
  options,
  selected,
  onChange,
  placeholder = 'Select an option',
}: CustomSelectProps) => {

  return (
    <>
      {label && <label>{label}</label>}
      <select
        className="form-control select2"
        style={{ width: '100%' }}
        value={selected || ''}
        onChange={(e) => onChange?.(e.target.value)}
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
};

export default CustomSelect;