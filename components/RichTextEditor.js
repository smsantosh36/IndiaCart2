import { useEffect, useRef } from 'react';

const buttons = [
  { cmd: 'bold', label: 'B', className: 'font-bold' },
  { cmd: 'italic', label: 'I', className: 'italic' },
  { cmd: 'underline', label: 'U', className: 'underline' },
  { cmd: 'formatBlock', arg: 'H2', label: 'H2' },
  { cmd: 'formatBlock', arg: 'H3', label: 'H3' },
  { cmd: 'formatBlock', arg: 'P', label: 'Para' },
  { cmd: 'insertUnorderedList', label: '• List' },
  { cmd: 'insertOrderedList', label: '1. List' },
  { cmd: 'formatBlock', arg: 'BLOCKQUOTE', label: '" Quote' }
];

export default function RichTextEditor({ value, onChange }) {
  const ref = useRef(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (ref.current && !initialized.current) {
      ref.current.innerHTML = value || '';
      initialized.current = true;
    }
  }, [value]);

  function exec(cmd, arg) {
    document.execCommand(cmd, false, arg);
    ref.current?.focus();
    onChange(ref.current.innerHTML);
  }

  function handleLink() {
    const url = window.prompt('Link URL:');
    if (url) exec('createLink', url);
  }

  return (
    <div className="border border-line rounded-lg overflow-hidden">
      <div className="flex flex-wrap gap-1 border-b border-line bg-paper p-2">
        {buttons.map((b) => (
          <button
            key={b.label}
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => exec(b.cmd, b.arg)}
            className={`px-2 py-1 text-sm rounded hover:bg-white border border-transparent hover:border-line ${
              b.className || ''
            }`}
          >
            {b.label}
          </button>
        ))}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleLink}
          className="px-2 py-1 text-sm rounded hover:bg-white border border-transparent hover:border-line"
        >
          Link
        </button>
      </div>
      <div
        ref={ref}
        contentEditable
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        className="rich-content min-h-[260px] px-4 py-3 focus:outline-none"
        suppressContentEditableWarning
      />
    </div>
  );
}
