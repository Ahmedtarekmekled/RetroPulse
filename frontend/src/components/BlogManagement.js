import { useState, useEffect } from 'react';
import api from '../utils/axios';
import DynamicText from '../components/DynamicText';
import { Editor } from '@tinymce/tinymce-react';
import { TINYMCE_CONFIG } from '../config';

function BlogManagement() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: null
  });

  // ... rest of your component code

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-green-500">
        <DynamicText text="Blog Management" />
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ... other form fields */}
        
        <div className="border border-green-500 p-4">
          <Editor
            apiKey={TINYMCE_CONFIG.apiKey}
            init={TINYMCE_CONFIG.init}
            value={formData.content}
            onEditorChange={(content) => setFormData(prev => ({ ...prev, content }))}
          />
        </div>

        {/* ... rest of your form */}
      </form>

      {/* ... rest of your component */}
    </div>
  );
}

export default BlogManagement; 