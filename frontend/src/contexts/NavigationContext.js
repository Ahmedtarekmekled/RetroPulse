import { createContext, useContext, useState } from 'react';

const NavigationContext = createContext();

export function useNavigation() {
  return useContext(NavigationContext);
}

export function NavigationProvider({ children }) {
  const [currentPage, setCurrentPage] = useState('home');

  const value = {
    currentPage,
    setCurrentPage
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
} 