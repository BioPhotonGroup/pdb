import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AddDataset from '../components/pages/add-dataset';
import SearchDataset from '../components/pages/search-dataset';
import DatasetDetail from '../components/pages/dataset-detail';  // Import DatasetDetail
import Login from '../components/pages/login';
import AuthGuard from '../@guards/auth-guard';  
import { AuthProvider } from '../context/auth-context';

const AppRoutes: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <AuthGuard>
                <SearchDataset />
              </AuthGuard>
            }
          />
          <Route
            path="/add-dataset"
            element={
              <AuthGuard>
                <AddDataset />
              </AuthGuard>
            }
          />
          <Route
            path="/dataset/:id" 
            element={
              <AuthGuard>
                <DatasetDetail />
              </AuthGuard>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default AppRoutes;
