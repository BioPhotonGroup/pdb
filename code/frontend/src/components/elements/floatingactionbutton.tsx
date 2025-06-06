import React from 'react';
import { Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

type FloatingActionButtonProps = {
  onClick: () => void;
};

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onClick }) => {
  return (
    <Fab
      color="primary"
      aria-label="add"
      onClick={onClick}
      sx={{
        position: 'fixed',
        bottom: 25,
        right: 25,
        zIndex: 1000,
      }}
    >
      <AddIcon />
    </Fab>
  );
};

export default FloatingActionButton;
