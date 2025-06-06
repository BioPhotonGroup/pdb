import React from 'react';
import Input from '../elements/input';

interface FormFieldProps {
  label: string;
  type: string;
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
}

const FormField: React.FC<FormFieldProps> = ({ label, name, value, type = 'text', onChange, required = false, placeholder = ""}) => (
  <div className="form-field">   
    <Input
      label={label}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
    />
  </div>
);

export default FormField;