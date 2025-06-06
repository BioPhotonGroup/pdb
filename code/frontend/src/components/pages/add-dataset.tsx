import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DatasetService from '../../services/dataset-service';  // Import DatasetService
import MainLayout from '../templates/main-layout';

const AddDataset: React.FC = () => {
  const [datasetName, setDatasetName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [species, setSpecies] = useState('');
  const [category, setCategory] = useState('');
  const [technique, setTechnique] = useState('');
  const [date, setDate] = useState('');

  const navigate = useNavigate();  // Initialize useNavigate

  const handleAddDataset = async () => {
    const newDataset = {
      name: datasetName,
      description,
      type,
      species,
      category,
      technique,
      date
    };

    await DatasetService.addDataset(newDataset);
    // Reset form after submission
    setDatasetName('');
    setDescription('');
    setType('');
    setSpecies('');
    setCategory('');
    setTechnique('');
    setDate('');
    // You can also add logic to notify the user of success or failure
    // Navigate to home page after successful submission
    navigate('/');
  };

  return (
    <MainLayout>
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Add New Dataset
      </Typography>
      <TextField
        label="Dataset Name"
        fullWidth
        value={datasetName}
        onChange={(e) => setDatasetName(e.target.value)}
        margin="normal"
        variant="outlined"
      />
      <TextField
        label="Description"
        fullWidth
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        margin="normal"
        variant="outlined"
      />
      <TextField
        label="Type"
        fullWidth
        value={type}
        onChange={(e) => setType(e.target.value)}
        margin="normal"
        variant="outlined"
      />
      {/* Add more fields for species, category, etc. */}
      <Button variant="contained" color="primary" onClick={handleAddDataset}>
        Submit
      </Button>
    </Container>
    </MainLayout>
  );
};

export default AddDataset;
