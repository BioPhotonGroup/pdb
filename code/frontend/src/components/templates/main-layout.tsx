import React, { ReactNode } from 'react';
import Navbar from '../widgets/navbar'; // Import your Navbar component

const MainLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div>
      <Navbar />  {/* Add the Navbar */}
      <div style={{ padding: '20px' }}>
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
