export const TINYMCE_API_KEY = process.env.REACT_APP_TINYMCE_API_KEY;

export const TINYMCE_CONFIG = {
  apiKey: TINYMCE_API_KEY,
  init: {
    height: 500,
    menubar: true,
    plugins: [
      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
      'insertdatetime', 'media', 'table', 'help', 'wordcount'
    ],
    toolbar: 'undo redo | formatselect | ' +
      'bold italic forecolor backcolor | alignleft aligncenter ' +
      'alignright alignjustify | bullist numlist outdent indent | ' +
      'removeformat | image media | help',
    content_style: `
      body { 
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        font-size: 16px;
        line-height: 1.6;
        color: #22c55e;
        background-color: #000;
      }
    `,
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
    skin: 'oxide-dark',
    content_css: 'dark'
  }
}; 