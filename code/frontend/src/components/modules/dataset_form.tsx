import React, { useState } from 'react';
import InputElement from '../elements/input';  // Import the reusable InputElement component

// Define the type for the dataset
interface Dataset {
  id: number;
  name: string;
  description: string;
  type: string;
  species: string;
  category: string;
  technique: string;
  date: string;
}

// Define the props for the component
interface DatasetFormProps {
  dataset: Dataset;
  onSubmit: (formData: Dataset) => void;
}

const DatasetForm: React.FC<DatasetFormProps> = ({ dataset, onSubmit }) => {
  const [formData, setFormData] = useState<Dataset>(dataset);

  // Handle form input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Dynamically generate input fields based on formData */}
      {Object.keys(formData).map((key) => (
        <InputElement
          key={key}
          label={key.charAt(0).toUpperCase() + key.slice(1)}  
          name={key}
          value={formData[key]}
          onChange={handleChange}
          required
        />
      ))}
      <button type="submit">Add Dataset</button>
    </form>
  );
};

export default DatasetForm;
