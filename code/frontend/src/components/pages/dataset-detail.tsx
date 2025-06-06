import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import DatasetService from '../../services/dataset-service';
import MainLayout from '../templates/main-layout';
import FloatingActionButton from '../elements/floatingactionbutton';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';

const DatasetDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
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

        <Box sx={{ mb: 2 }}>
          <Typography variant="h6">Name:</Typography>
          <Typography variant="body1">{dataset.name}</Typography>
        </Box>

        <Divider />

        <Box sx={{ my: 2 }}>
          <Typography variant="h6">Description:</Typography>
          <Typography variant="body1">{dataset.description}</Typography>
        </Box>

        <Divider />

        <Typography variant="body1"><strong>Type:</strong> {dataset.type}</Typography>
        <Typography variant="body1"><strong>Species:</strong> {dataset.species}</Typography>
        <Typography variant="body1"><strong>Category:</strong> {dataset.category}</Typography>
        <Typography variant="body1"><strong>Technique:</strong> {dataset.technique}</Typography>
        <Typography variant="body1"><strong>Date:</strong> {dataset.date}</Typography>

        {dataset.authors && dataset.authors.length > 0 && (
          <Typography variant="body1" sx={{ mt: 2 }}>
            <strong>Authors:</strong> {dataset.authors.join(', ')}
          </Typography>
        )}

        {dataset.journal && (
          <Typography variant="body1">
            <strong>Journal:</strong> {dataset.journal}
          </Typography>
        )}

        {dataset.doi && (
          <Typography variant="body1">
            <strong>DOI:</strong>{' '}
            <a href={`https://doi.org/${dataset.doi}`} target="_blank" rel="noopener noreferrer">
              {dataset.doi}
            </a>
          </Typography>
        )}

        {dataset.abstract && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Abstract:</Typography>
            <Typography variant="body2">{dataset.abstract}</Typography>
          </Box>
        )}

        {dataset.keywords && dataset.keywords.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Keywords:</Typography>
            <Typography variant="body2">{dataset.keywords.join(', ')}</Typography>
          </Box>
        )}

        <FloatingActionButton />
      </Container>
    </MainLayout>
  );
};

export default DatasetDetail;