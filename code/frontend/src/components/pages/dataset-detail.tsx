import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';  // Import useParams to access route parameters
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import DatasetService from '../../services/dataset-service';  // Import DatasetService
import MainLayout from '../templates/main-layout';

const DatasetDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();  // Get the dataset ID from the URL
  const [dataset, setDataset] = useState<any | null>(null);

  useEffect(() => {
    const fetchDataset = async () => {
      const data = await DatasetService.getDatasetById(Number(id));
      setDataset(data);
    };

    fetchDataset();
  }, [id]);

  if (!dataset) {
    return (
      <MainLayout>
        <Container>
          <Typography variant="h5">Loading dataset details...</Typography>
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Container>
        <Typography variant="h4" gutterBottom>
          Dataset Details
        </Typography>
        <Typography variant="h6">Name: {dataset.name}</Typography>
        <Typography variant="body1">Description: {dataset.description}</Typography>
        <Typography variant="body1">Type: {dataset.type}</Typography>
        <Typography variant="body1">Species: {dataset.species}</Typography>
        <Typography variant="body1">Category: {dataset.category}</Typography>
        <Typography variant="body1">Technique: {dataset.technique}</Typography>
        <Typography variant="body1">Date: {dataset.date}</Typography>
      </Container>
    </MainLayout>
  );
};

export default DatasetDetail;
