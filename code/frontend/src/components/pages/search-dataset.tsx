import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import Pagination from '@mui/material/Pagination';

import DatasetService from '../../services/dataset-service';
import MainLayout from '../templates/main-layout';
import FloatingActionButton from '../elements/floatingactionbutton';

const SearchDataset: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [filteredData, setFilteredData] = useState<Dataset[]>([]);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const navigate = useNavigate();

  interface Dataset {
    id: number;
    name: string;
    description: string;
    type: string;
    species?: string;
    category?: string;
    technique?: string;
    date?: string;
    authors?: string[];
    journal?: string;
    doi?: string;
    abstract?: string;
    keywords?: string[];
  }

  useEffect(() => {
    const fetchDatasets = async () => {
      const data = await DatasetService.getAllDatasets();
      setDatasets(data);
      setFilteredData(data);
    };
    fetchDatasets();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = datasets.filter(dataset =>
      Object.entries(dataset).some(([key, value]) => {
        if (typeof value === 'string') {
          return value.toLowerCase().includes(query);
        }
        if (Array.isArray(value)) {
          return value.some(item => item.toLowerCase().includes(query));
        }
        return false;
      })
    );

    setFilteredData(filtered);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  const handleRowClick = (id: string) => {
    navigate(`/dataset/${id}`);
  };

  const paginatedData = filteredData.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <MainLayout>
      <Container maxWidth="md">
        <Typography variant="h4" gutterBottom>
          Search Datasets
        </Typography>

        <TextField
          label="Search Datasets"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={handleSearchChange}
          margin="normal"
        />

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
              {paginatedData.length > 0 ? (
                paginatedData.map((dataset) => (
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

        {filteredData.length > rowsPerPage && (
          <Pagination
            count={Math.ceil(filteredData.length / rowsPerPage)}
            page={page}
            onChange={handlePageChange}
            color="primary"
            sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}
          />
        )}

        <FloatingActionButton />
      </Container>
    </MainLayout>
  );
};

export default SearchDataset;