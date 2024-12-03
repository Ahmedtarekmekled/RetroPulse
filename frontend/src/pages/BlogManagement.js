import { useState, useEffect } from 'react';
import api from '../utils/axios';
import DynamicText from '../components/DynamicText';
import { Editor } from '@tinymce/tinymce-react';
import { TINYMCE_API_KEY } from '../config';

function BlogManagement() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: null
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (selectedPost) {
      setFormData({
        title: selectedPost.title,
        content: selectedPost.content,
        image: null
      });
    }
  }, [selectedPost]);

  const fetchPosts = async () => {
    try {
      const response = await api.get('/api/blog');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('content', formData.content);
    
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }

    try {
      if (selectedPost) {
        await api.put(`/api/blog/${selectedPost._id}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        await api.post('/api/blog', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      fetchPosts();
      resetForm();
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  const resetForm = () => {
    setSelectedPost(null);
    setFormData({
      title: '',
      content: '',
      image: null
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await api.delete(`/api/blog/${id}`);
        fetchPosts();
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  const handleImageUpload = async (blobInfo) => {
    try {
      const formData = new FormData();
      formData.append('image', blobInfo.blob(), blobInfo.filename());
      
      const response = await api.post('/api/blog/upload-image', formData);
      return response.data.url;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-green-500">
        <DynamicText text="Blog Management_" typewriter={true} />
      </h1>
      
      <form onSubmit={handleSubmit} className="border border-green-500 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium">&gt; Title_</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="mt-1 block w-full px-3 py-2 bg-black border border-green-500 text-green-500 focus:border-green-300"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">&gt; Content_</label>
          <Editor
            apiKey={TINYMCE_API_KEY}
            value={formData.content}
            onEditorChange={(content) => setFormData({ ...formData, content })}
            init={{
              height: 500,
              menubar: true,
              plugins: [
                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount', 'paste'
              ],
              toolbar: 'undo redo | blocks | ' +
                'bold italic forecolor | alignleft aligncenter ' +
                'alignright alignjustify | bullist numlist outdent indent | ' +
                'image | removeformat | help',
              images_upload_handler: handleImageUpload,
              automatic_uploads: true,
              file_picker_types: 'image',
              content_style: `
                body { 
                  background-color: #000; 
                  color: #22c55e; 
                  font-family: monospace;
                  font-size: 14px;
                  line-height: 1.5;
                }
                p { margin: 0; padding: 0; }
                a { color: #22c55e; }
                pre { 
                  background-color: #111; 
                  padding: 1em; 
                  border: 1px solid #22c55e;
                }
                code { 
                  background-color: #111; 
                  padding: 0.2em 0.4em;
                  border-radius: 3px;
                }
              `,
              skin: 'oxide-dark',
              content_css: 'dark',
              paste_data_images: true,
              paste_as_text: false,
              paste_enable_default_filters: true,
              paste_word_valid_elements: "b,strong,i,em,h1,h2,h3,p,br,a[href],ul,ol,li",
              paste_retain_style_properties: "color,background-color,font-family,font-size,text-align,text-decoration"
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">&gt; Featured Image_</label>
          <div className="mt-1 flex items-center space-x-4">
            <input
              type="file"
              onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
              className="block w-full text-green-500"
              accept="image/*"
            />
            {selectedPost?.image && (
              <div className="relative w-20 h-20 border border-green-500">
                <img
                  src={selectedPost.image.url}
                  alt="Current"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={resetForm}
            className="px-4 py-2 border border-green-500 hover:bg-green-500 hover:text-black transition-colors"
          >
            Cancel_
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-green-500 hover:bg-green-500 hover:text-black transition-colors"
          >
            {selectedPost ? 'Update_' : 'Create_'}
          </button>
        </div>
      </form>

      <div className="border border-green-500">
        <table className="min-w-full divide-y divide-green-500">
          <thead>
            <tr className="bg-green-500 text-black">
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-green-500">
            {posts.map((post) => (
              <tr key={post._id}>
                <td className="px-6 py-4">
                  <DynamicText text={post.title} size="medium" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(post.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => setSelectedPost(post)}
                    className="text-green-500 hover:text-green-300 mr-4"
                  >
                    Edit_
                  </button>
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="text-red-500 hover:text-red-300"
                  >
                    Delete_
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BlogManagement; 