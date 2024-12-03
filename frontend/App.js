import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import BlogManagement from './pages/BlogManagement';
import ProjectManagement from './pages/ProjectManagement';
import ContactMessages from './pages/ContactMessages';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/blogs" element={<BlogManagement />} />
            <Route path="/dashboard/projects" element={<ProjectManagement />} />
            <Route path="/dashboard/messages" element={<ContactMessages />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App; 