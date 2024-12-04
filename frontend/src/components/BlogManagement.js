import React, { useState } from 'react';
import Editor from 'react-editor-js';

function BlogManagement() {
  const [editorConfig, setEditorConfig] = useState({
    apiKey: process.env.REACT_APP_TINYMCE_API_KEY,
    init: {
      height: 500,
      menubar: true,
      plugins: [
        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
      ],
      toolbar: 'undo redo | blocks | ' +
        'bold italic forecolor | alignleft aligncenter ' +
        'alignright alignjustify | bullist numlist outdent indent | ' +
        'removeformat | help',
      content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
      document_base_url: process.env.NODE_ENV === 'production' 
        ? 'https://retropulse.onrender.com'
        : 'http://localhost:3000'
    }
  });

  return (
    <Editor
      apiKey={process.env.REACT_APP_TINYMCE_API_KEY}
      init={editorConfig.init}
    />
  );
}

export default BlogManagement; 