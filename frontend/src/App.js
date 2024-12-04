import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NavigationProvider } from './contexts/NavigationContext';
import { HelmetProvider } from 'react-helmet-async';

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <NavigationProvider>
          <BrowserRouter future={{ 
            v7_startTransition: true,
            v7_relativeSplatPath: true 
          }}>
            <Layout>
              <Routes>
                {/* Your routes */}
              </Routes>
            </Layout>
          </BrowserRouter>
        </NavigationProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App; 