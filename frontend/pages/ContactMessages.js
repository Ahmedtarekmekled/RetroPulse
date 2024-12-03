import { useState, useEffect } from 'react';
import axios from 'axios';

function ContactMessages() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get('/api/contact');
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await axios.delete(`/api/contact/${id}`);
        fetchMessages();
      } catch (error) {
        console.error('Error deleting message:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Contact Messages</h1>

      <div className="bg-white rounded-lg shadow">
        <div className="grid gap-6 p-6">
          {messages.map((message) => (
            <div key={message._id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium">{message.name}</h3>
                  <p className="text-sm text-gray-500">{message.email}</p>
                </div>
                <button
                  onClick={() => handleDelete(message._id)}
                  className="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </div>
              <p className="mt-2">{message.message}</p>
              <p className="text-sm text-gray-500 mt-2">
                Received: {new Date(message.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ContactMessages; 