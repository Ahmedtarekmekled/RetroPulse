import { Editor } from '@tinymce/tinymce-react';
import { TINYMCE_CONFIG } from '../config';

function BlogEditor({ value, onChange, height = 500 }) {
  return (
    <div className="border border-green-500 rounded-md overflow-hidden">
      <Editor
        apiKey={TINYMCE_CONFIG.apiKey}
        value={value}
        onEditorChange={onChange}
        init={{
          ...TINYMCE_CONFIG.init,
          height,
          setup: (editor) => {
            // Add custom styles for the dark theme
            editor.on('init', () => {
              editor.getContainer().style.backgroundColor = '#000';
              editor.getContainer().style.border = '1px solid #22c55e';
            });
          }
        }}
      />
    </div>
  );
}

export default BlogEditor; 