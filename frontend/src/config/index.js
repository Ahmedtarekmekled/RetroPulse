export const TINYMCE_API_KEY = process.env.REACT_APP_TINYMCE_API_KEY;

export const TINYMCE_CONFIG = {
  apiKey: TINYMCE_API_KEY,
  init: {
    height: 500,
    menubar: true,
    plugins: [
      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
      'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount',
      'codesample', 'emoticons', 'paste'
    ],
    toolbar: 'undo redo | formatselect | ' +
      'bold italic forecolor backcolor | alignleft aligncenter ' +
      'alignright alignjustify | bullist numlist outdent indent | ' +
      'removeformat | image media | codesample emoticons | help',
    content_style: `
      body { 
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        font-size: 16px;
        line-height: 1.6;
        color: #22c55e;
        background-color: #000;
      }
      p { margin: 0 0 1em 0; }
      pre { background-color: #1a1a1a; padding: 1em; border-radius: 4px; }
      code { background-color: #1a1a1a; padding: 0.2em 0.4em; border-radius: 3px; }
      img { max-width: 100%; height: auto; }
      a { color: #22c55e; }
      table { border-collapse: collapse; }
      table td, table th { border: 1px solid #22c55e; padding: 0.4em; }
    `,
    skin: 'oxide-dark',
    content_css: 'dark',
    images_upload_handler: async (blobInfo, progress) => {
      try {
        const formData = new FormData();
        formData.append('image', blobInfo.blob(), blobInfo.filename());
        
        const response = await api.post('/api/blog/upload-image', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (e) => {
            progress(e.loaded / e.total * 100);
          }
        });

        return response.data.url;
      } catch (error) {
        console.error('Error uploading image:', error);
        throw new Error('Image upload failed');
      }
    },
    file_picker_types: 'image',
    paste_data_images: true,
    paste_as_text: false,
    browser_spellcheck: true,
    contextmenu: 'link image table spellchecker',
    setup: (editor) => {
      editor.on('init', () => {
        editor.getContainer().style.transition = "border-color 0.15s ease-in-out";
      });
      editor.on('focus', () => {
        editor.getContainer().style.borderColor = "#22c55e";
      });
      editor.on('blur', () => {
        editor.getContainer().style.borderColor = "#374151";
      });
    }
  }
}; 