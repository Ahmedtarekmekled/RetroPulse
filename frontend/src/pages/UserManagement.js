import { useState, useEffect } from 'react';
import api from '../utils/axios';
import { useAuth } from '../contexts/AuthContext';
import DynamicText from '../components/DynamicText';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user'
  });

  const { user: currentUser } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/auth/users');
      setUsers(response.data);
    } catch (error) {
      setError('Error fetching users: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      if (!formData.username || !formData.email || !formData.password) {
        setError('All fields are required');
        return;
      }

      await api.post('/api/auth/register', formData);
      
      setSuccess('User created successfully!');
      setFormData({
        username: '',
        email: '',
        password: '',
        role: 'user'
      });
      
      fetchUsers();
    } catch (error) {
      setError(error.response?.data?.message || 'Error creating user');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (userId === currentUser?.id) {
      setError("You cannot delete your own account!");
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        setLoading(true);
        await api.delete(`/api/auth/users/${userId}`);
        setSuccess('User deleted successfully');
        fetchUsers();
      } catch (error) {
        setError('Error deleting user: ' + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-green-500">
        <DynamicText text="User Management_" typewriter={true} />
      </h1>
      
      {/* Error and Success Messages */}
      {error && (
        <div className="bg-red-900 border border-red-500 text-red-300 px-4 py-3 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-900 border border-green-500 text-green-300 px-4 py-3 rounded">
          {success}
        </div>
      )}

      {/* User Creation Form */}
      <form onSubmit={handleSubmit} className="border border-green-500 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium">&gt; Username_</label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className="mt-1 block w-full px-3 py-2 bg-black border border-green-500 text-green-500 focus:border-green-300"
            required
            minLength="3"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium">&gt; Email_</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="mt-1 block w-full px-3 py-2 bg-black border border-green-500 text-green-500 focus:border-green-300"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium">&gt; Password_</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="mt-1 block w-full px-3 py-2 bg-black border border-green-500 text-green-500 focus:border-green-300"
            required
            minLength="6"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">&gt; Role_</label>
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="mt-1 block w-full px-3 py-2 bg-black border border-green-500 text-green-500 focus:border-green-300"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 border border-green-500 hover:bg-green-500 hover:text-black transition-colors ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Creating...' : 'Create User_'}
        </button>
      </form>

      {/* Users List */}
      <div className="border border-green-500">
        <table className="min-w-full divide-y divide-green-500">
          <thead>
            <tr className="bg-green-500 text-black">
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Username</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-green-500">
            {users.map((user) => (
              <tr key={user._id}>
                <td className="px-6 py-4 whitespace-nowrap">{user.username}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {user._id !== currentUser?.id && (
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="text-red-500 hover:text-red-300"
                    >
                      Delete_
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserManagement; 