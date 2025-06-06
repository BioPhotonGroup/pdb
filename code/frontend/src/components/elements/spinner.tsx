import React from 'react';
import '../../assets/styles/elements/_spinner.scss';  // Import SCSS from assets
import CircularProgress from '@mui/material/CircularProgress';

const Spinner: React.FC = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
    <CircularProgress />
  </div>
);

export default Spinner;