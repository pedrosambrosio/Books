import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export const RichTextEditor = ({ value, onChange }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="rich-text-editor border rounded-md">
      <div className="border-b p-2 flex gap-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1 rounded ${editor.isActive('bold') ? 'bg-primary/20' : ''}`}
          type="button"
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1 rounded ${editor.isActive('italic') ? 'bg-primary/20' : ''}`}
          type="button"
        >
          Italic
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1 rounded ${editor.isActive('heading') ? 'bg-primary/20' : ''}`}
          type="button"
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-1 rounded ${editor.isActive('heading', { level: 3 }) ? 'bg-primary/20' : ''}`}
          type="button"
        >
          H3
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1 rounded ${editor.isActive('bulletList') ? 'bg-primary/20' : ''}`}
          type="button"
        >
          List
        </button>
      </div>
      <EditorContent editor={editor} className="p-4" />
    </div>
  );
};