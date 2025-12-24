import { InputHTMLAttributes, ReactNode } from 'react';
import Label from '../atoms/Label';
import Input from '../atoms/Input';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  required?: boolean;
}

export default function FormField({
  label,
  error,
  required = false,
  id,
  ...inputProps
}: FormFieldProps) {
  const fieldId = id || `field-${label.toLowerCase().replace(/\s+/g, '-')}`;
  
  return (
    <div>
      <Label htmlFor={fieldId} required={required}>
        {label}
      </Label>
      <Input id={fieldId} error={error} {...inputProps} />
    </div>
  );
}
