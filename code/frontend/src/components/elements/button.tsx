import React from 'react';
import Button from '@mui/material/Button';

interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  type?: 'button' | 'submit' | 'reset';
}

const CustomButton: React.FC<ButtonProps> = ({ label, onClick, variant = 'primary', type = 'button' }) => {
  let color;
  switch (variant) {
    case 'secondary':
      color = 'secondary';
      break;
    case 'danger':
      color = 'error';
      break;
    default:
      color = 'primary';
  }

  return (
    <Button variant="contained" color={color} onClick={onClick} type={type}>
      {label}
    </Button>
  );
};

export default CustomButton;