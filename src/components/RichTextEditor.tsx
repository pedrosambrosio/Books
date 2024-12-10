import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Heading from '@tiptap/extension-heading';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import Link from '@tiptap/extension-link';
import { SmilePlus } from 'lucide-react';
import { EditorToolbar } from './editor/EditorToolbar';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export const RichTextEditor = ({ value, onChange }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6],
      }),
      HorizontalRule,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const addEmoji = (emoji: string) => {
    if (editor) {
      editor.chain().focus().insertContent(emoji).run();
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="rich-text-editor">
      <div className="relative">
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="absolute right-3 top-3 p-1.5 rounded hover:bg-gray-100 z-10"
              title="Adicionar Emoji"
            >
              <SmilePlus className="h-4 w-4" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2">
            <div className="grid grid-cols-5 gap-2">
              {["😀", "😂", "😊", "🥰", "😎", "🤔", "👍", "❤️", "✨", "🎉", 
                "🙏", "📖", "✝️", "⛪", "🕊️", "🌟", "🎵", "🌿", "🕯️", "📿"].map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => addEmoji(emoji)}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        {editor && (
          <BubbleMenu 
            editor={editor} 
            tippyOptions={{ 
              duration: 100,
              placement: 'top',
            }}
          >
            <EditorToolbar editor={editor} />
          </BubbleMenu>
        )}
        <EditorContent 
          editor={editor} 
          className="prose prose-sm max-w-none min-h-[400px] focus:outline-none cursor-text"
        />
      </div>
    </div>
  );
};