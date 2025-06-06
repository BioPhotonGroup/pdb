import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import DatasetService from '../../services/dataset-service';  // Import DatasetService
import MainLayout from '../templates/main-layout';

const SearchDataset: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  interface Dataset {
    id: number;
    name: string;
    description: string;
    type: string;
  }
  
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [filteredData, setFilteredData] = useState<Dataset[]>([]);
  const navigate = useNavigate();  // Initialize useNavigate

  useEffect(() => {
    // Fetch datasets when the component loads
    const fetchDatasets = async () => {
      const data = await DatasetService.getAllDatasets();
      setDatasets(data);
      setFilteredData(data);  // Initially set filtered data to all datasets
    };

    fetchDatasets();
  }, []);

  // Handle search input changes
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);

    // Filter data based on the search query
    const filtered = datasets.filter(dataset =>
      dataset.name.toLowerCase().includes(query.toLowerCase()) ||
      dataset.description.toLowerCase().includes(query.toLowerCase()) ||
      dataset.type.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredData(filtered);
  };

  // Handle row click event
  const handleRowClick = (id: string) => {
    navigate(`/dataset/${id}`);  // Navigate to dataset detail page with the dataset ID
  };

  return (
    <MainLayout>
      <Container maxWidth="md">
        <Typography variant="h4" gutterBottom>
          Search Datasets
        </Typography>

        {/* Search input field */}
        <TextField
          label="Search Datasets"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={handleSearchChange}
          margin="normal"
        />

        {/* Table to display datasets */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Type</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((dataset) => (
                  <TableRow key={dataset.id} hover onClick={() => handleRowClick(dataset.id.toString())}>
                    <TableCell>{dataset.id}</TableCell>
                    <TableCell>{dataset.name}</TableCell>
                    <TableCell>{dataset.description}</TableCell>
                    <TableCell>{dataset.type}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No datasets found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </MainLayout>
  );
};

export default SearchDataset;
