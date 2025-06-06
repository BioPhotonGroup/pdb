import React from 'react';
import { Box, Typography } from '@mui/material';
import logo from '../../assets/phobios_logo.png';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        display: 'flex',
        flexDirection: 'column',           
        alignItems: 'center',              
        justifyContent: 'center',          
        padding: 2,
        width: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden',
        textAlign: 'center',
      }}
    >
      <Box
        component="a"
        href="https://lightbiosurface.com/"
        target="_blank"
        rel="noopener noreferrer"
        sx={{ display: 'block', mb: 1 }}   
      >
        <Box 
          component="img" 
          src={logo} 
          alt="Logo" 
          sx={{
            height: 40,
            maxWidth: '100%',
            display: 'block',
            margin: '0 auto',
          }} 
        />
      </Box>

      <Typography variant="body2" color="text.secondary">
        © 2025 COST Association
      </Typography>
    </Box>
  );
};

export default Footer;
