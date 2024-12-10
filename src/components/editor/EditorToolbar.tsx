import React from 'react';
import { Bold, Italic, Underline, Heading1, Heading2, Heading3, 
         List, Minus, Link as LinkIcon, Code, Paintbrush, Type, Highlighter, SmilePlus } from 'lucide-react';
import { Editor } from '@tiptap/react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface EditorToolbarProps {
  editor: Editor;
}

export const EditorToolbar = ({ editor }: EditorToolbarProps) => {
  const addLink = () => {
    const url = window.prompt('URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addEmoji = () => {
    const emojis = ["😀", "😂", "😊", "🥰", "😎", "🤔", "👍", "❤️", "✨", "🎉"];
    return (
      <div className="grid grid-cols-5 gap-2">
        {emojis.map((emoji) => (
          <button
            key={emoji}
            onClick={() => editor.chain().focus().insertContent(emoji).run()}
            className="p-2 hover:bg-gray-100 rounded"
          >
            {emoji}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border p-2 flex gap-1 items-center">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-1.5 rounded hover:bg-gray-100 ${editor.isActive('bold') ? 'bg-primary/20' : ''}`}
        title="Bold"
      >
        <Bold className="h-4 w-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-1.5 rounded hover:bg-gray-100 ${editor.isActive('italic') ? 'bg-primary/20' : ''}`}
        title="Italic"
      >
        <Italic className="h-4 w-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`p-1.5 rounded hover:bg-gray-100 ${editor.isActive('underline') ? 'bg-primary/20' : ''}`}
        title="Underline"
      >
        <Underline className="h-4 w-4" />
      </button>

      <div className="w-px h-4 bg-gray-200 mx-1" />

      <Popover>
        <PopoverTrigger asChild>
          <button
            className={`p-1.5 rounded hover:bg-gray-100 ${
              editor.isActive('heading') ? 'bg-primary/20' : ''
            }`}
            title="Headings"
          >
            <Type className="h-4 w-4" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2">
          <div className="flex flex-col gap-1">
            {[1, 2, 3, 4, 5, 6].map((level) => (
              <button
                key={level}
                onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
                className={`p-1.5 rounded hover:bg-gray-100 flex items-center gap-2 ${
                  editor.isActive('heading', { level }) ? 'bg-primary/20' : ''
                }`}
              >
                <Type className="h-4 w-4" />
                <span>Heading {level}</span>
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-1.5 rounded hover:bg-gray-100 ${editor.isActive('bulletList') ? 'bg-primary/20' : ''}`}
        title="Bullet List"
      >
        <List className="h-4 w-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className="p-1.5 rounded hover:bg-gray-100"
        title="Horizontal Rule"
      >
        <Minus className="h-4 w-4" />
      </button>

      <button
        onClick={addLink}
        className={`p-1.5 rounded hover:bg-gray-100 ${editor.isActive('link') ? 'bg-primary/20' : ''}`}
        title="Add Link"
      >
        <LinkIcon className="h-4 w-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={`p-1.5 rounded hover:bg-gray-100 ${editor.isActive('code') ? 'bg-primary/20' : ''}`}
        title="Code"
      >
        <Code className="h-4 w-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        className={`p-1.5 rounded hover:bg-gray-100 ${editor.isActive('highlight') ? 'bg-primary/20' : ''}`}
        title="Highlight"
      >
        <Highlighter className="h-4 w-4" />
      </button>

      <Popover>
        <PopoverTrigger asChild>
          <button
            className={`p-1.5 rounded hover:bg-gray-100`}
            title="Text Color"
          >
            <Paintbrush className="h-4 w-4" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2">
          <div className="grid grid-cols-5 gap-1">
            {['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00'].map((color) => (
              <button
                key={color}
                onClick={() => editor.chain().focus().setColor(color).run()}
                className="w-6 h-6 rounded"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <button
            className="p-1.5 rounded hover:bg-gray-100"
            title="Add Emoji"
          >
            <SmilePlus className="h-4 w-4" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2">
          {addEmoji()}
        </PopoverContent>
      </Popover>
    </div>
  );
};