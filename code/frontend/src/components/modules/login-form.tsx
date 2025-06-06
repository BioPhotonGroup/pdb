import React, { useState } from 'react';
import InputElement from '../elements/input';  // Updated InputElement
import CustomButton from '../elements/button';      // Updated Button

interface LoginFormProps {
  onSubmit: (username: string, password: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData.username, formData.password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <InputElement label="Username" type="text" name="username" value={formData.username} placeholder={formData.username} onChange={handleChange} />
      <InputElement label="Password" type="password" name="password" value={formData.password} placeholder={formData.password} onChange={handleChange} />
      <CustomButton label="Login" onClick={() => {}} type="submit" />
    </form>
  );
};

export default LoginForm;
