import React, { useContext } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import { Link, useNavigate  } from 'react-router-dom';
import { AuthContext } from '../../context/auth-context'; // Assuming you have an AuthProvider

const Navbar: React.FC = () => {
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();
  
    if (!authContext) {
      return null; // Ensure authContext is not undefined
    }
  
    const { isAuthenticated, login, logout } = authContext;
  
    const handleLogout = () => {
      logout();
      navigate('/login'); // Redirect to login page after logout
    };
  
    return (
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <img href="../../assets/phobios_logo.png" />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Photonic Database
          </Typography>
  
          {!isAuthenticated ? (
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/">
                Search Dataset
              </Button>
              <Button color="inherit" component={Link} to="/add-dataset">
                Add Dataset
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    );
  };
  
  export default Navbar;