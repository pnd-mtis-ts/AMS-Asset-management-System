import React, { createContext, useState } from 'react';

export const ScannedDataContext = createContext();

export const ScannedDataProvider = ({ children }) => {
  const [scannedData, setScannedData] = useState(null);

  return (
    <ScannedDataContext.Provider value={{ scannedData, setScannedData }}>
      {children}
    </ScannedDataContext.Provider>
  );
};
