import React, { createContext } from 'react';
import useAxiosInstance from './useAxiosInstance';

const AxiosContext = createContext(null);

export const AxiosProvider = ({ children }) => {
  const axiosInstance = useAxiosInstance();

  return (
    <AxiosContext.Provider value={axiosInstance}>
      {children}
    </AxiosContext.Provider>
  );
};

export default AxiosContext;
