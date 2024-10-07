import React from 'react';
import {FourSquare } from 'react-loading-indicators'; // Import the loader you want to use

const Loader = ({ isLoading, children }) => {
  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <FourSquare color="#002233" width="100" />
      </div>
    );
  }

  return children; 
};

export default Loader;
