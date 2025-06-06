import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Button, TextField,
  Stack, Alert
} from '@mui/material';

import DatasetService from '../../services/dataset-service';
import MainLayout from '../templates/main-layout';
import FloatingActionButton from '../elements/floatingactionbutton';

const AddDataset: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    description: '',
    type: '',
    species: '',
    category: '',
    technique: '',
    date: '',
    authors: '',
    journal: '',
    doi: '',
    abstract: '',
    keywords: ''
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleAddDataset = async () => {
    if (!form.name || !form.description || !form.type) {
      setError('Fields "name", "description", and "type" are required.');
      setSuccess(false);
      return;
    }

    const newDataset = {
      name: form.name,
      description: form.description,
      type: form.type,
      species: form.species || undefined,
      category: form.category || undefined,
      technique: form.technique || undefined,
      date: form.date || undefined,
      authors: form.authors ? form.authors.split(',').map(a => a.trim()) : undefined,
      journal: form.journal || undefined,
      doi: form.doi || undefined,
      abstract: form.abstract || undefined,
      keywords: form.keywords ? form.keywords.split(',').map(k => k.trim()) : undefined
    };

    try {
      await DatasetService.addDataset(newDataset);
      setSuccess(true);
      setError(null);
      setForm({
        name: '', description: '', type: '', species: '', category: '',
        technique: '', date: '', authors: '', journal: '', doi: '',
        abstract: '', keywords: ''
      });
      setTimeout(() => navigate('/'), 1000);
    } catch (err) {
      setError('Failed to add dataset.');
      setSuccess(false);
    }
  };

  return (
    <MainLayout>
      <Container maxWidth="md">
        <Typography variant="h4" gutterBottom>
          Add New Dataset
        </Typography>

        <Stack spacing={2}>
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">Dataset added successfully!</Alert>}

          <TextField label="Name *" value={form.name} onChange={(e) => handleChange('name', e.target.value)} fullWidth />
          <TextField label="Description *" value={form.description} onChange={(e) => handleChange('description', e.target.value)} fullWidth />
          <TextField label="Type *" value={form.type} onChange={(e) => handleChange('type', e.target.value)} fullWidth />
          <TextField label="Species" value={form.species} onChange={(e) => handleChange('species', e.target.value)} fullWidth />
          <TextField label="Category" value={form.category} onChange={(e) => handleChange('category', e.target.value)} fullWidth />
          <TextField label="Technique" value={form.technique} onChange={(e) => handleChange('technique', e.target.value)} fullWidth />
          <TextField label="Date" type="date" InputLabelProps={{ shrink: true }} value={form.date} onChange={(e) => handleChange('date', e.target.value)} fullWidth />
          <TextField label="Authors (comma-separated)" value={form.authors} onChange={(e) => handleChange('authors', e.target.value)} fullWidth />
          <TextField label="Journal" value={form.journal} onChange={(e) => handleChange('journal', e.target.value)} fullWidth />
          <TextField label="DOI" value={form.doi} onChange={(e) => handleChange('doi', e.target.value)} fullWidth />
          <TextField label="Abstract" value={form.abstract} onChange={(e) => handleChange('abstract', e.target.value)} fullWidth multiline rows={3} />
          <TextField label="Keywords (comma-separated)" value={form.keywords} onChange={(e) => handleChange('keywords', e.target.value)} fullWidth />

          <Button variant="contained" color="primary" onClick={handleAddDataset}>
            Submit
          </Button>
        </Stack>

        <FloatingActionButton />
      </Container>
    </MainLayout>
  );
};

export default AddDataset;