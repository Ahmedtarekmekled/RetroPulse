import { Editor } from '@tinymce/tinymce-react';
import { TINYMCE_CONFIG } from '../config';

function MyEditor({ value, onChange }) {
  return (
    <Editor
      apiKey={TINYMCE_CONFIG.apiKey}
      init={TINYMCE_CONFIG.init}
      value={value}
      onEditorChange={onChange}
    />
  );
}

export default MyEditor; 