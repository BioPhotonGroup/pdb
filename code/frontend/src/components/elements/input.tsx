import React from 'react';
import TextField from '@mui/material/TextField';

interface InputElementProps {
  label: string;
  name: string;
  value: string;
  type?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
}

const InputElement: React.FC<InputElementProps> = ({ label, name, value, type = 'text', onChange, required = false, placeholder = "" }) => {
  return (
    <TextField
      label={label}
      variant="outlined"
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      fullWidth
      margin="normal"
    />
  );
};

export default InputElement;
