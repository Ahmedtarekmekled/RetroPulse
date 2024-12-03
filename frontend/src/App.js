import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import BlogManagement from './pages/BlogManagement';
import ProjectManagement from './pages/ProjectManagement';
import ContactMessages from './pages/ContactMessages';
import Home from './pages/Home';
import UserManagement from './pages/UserManagement';
import About from './pages/About';
import Projects from './pages/Projects';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import { NavigationProvider } from './contexts/NavigationContext';
import Layout from './components/Layout';
import SocialLinksManagement from './pages/SocialLinksManagement';
import AboutManagement from './pages/AboutManagement';
import NotFound from './pages/NotFound';
import BlogPost from './components/BlogPost';
import { HelmetProvider } from 'react-helmet-async';
import AnalyticsPage from './pages/AnalyticsPage';

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <NavigationProvider>
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route element={<PrivateRoute />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/dashboard/analytics" element={<AnalyticsPage />} />
                  <Route path="/dashboard/blogs" element={<BlogManagement />} />
                  <Route path="/dashboard/projects" element={<ProjectManagement />} />
                  <Route path="/dashboard/messages" element={<ContactMessages />} />
                  <Route path="/dashboard/users" element={<UserManagement />} />
                  <Route path="/dashboard/about" element={<AboutManagement />} />
                  <Route path="/dashboard/social" element={<SocialLinksManagement />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </NavigationProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App; 