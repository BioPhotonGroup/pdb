import React, { ReactNode } from 'react';
import Navbar from '../widgets/navbar'; // Import your Navbar component
import Footer from '../widgets/footer';
import '../../assets/styles/layout.css'

const MainLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div id="flex-container">
      <Navbar />  {/* Add the Navbar */}
      <div id="main">
        {children}
      </div>
      <div id="footer">
        <Footer /> 
      </div>
    </div>
  );
};

export default MainLayout;
