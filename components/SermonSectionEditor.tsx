import { useState, useRef } from 'react';
import { nanoid } from 'nanoid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, ChevronDown, ChevronUp, Type, BookOpen, List, Lightbulb, Sparkles, Bold, Italic, Heading, MessageSquareQuote } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

// Block types
const BLOCK_TYPES = [
  { type: 'heading', icon: <Type className="h-5 w-5 text-blue-500" />, label: 'Heading' },
  { type: 'paragraph', icon: <Type className="h-5 w-5 text-gray-500" />, label: 'Paragraph' },
  { type: 'scripture', icon: <BookOpen className="h-5 w-5 text-green-500" />, label: 'Scripture' },
  { type: 'list', icon: <List className="h-5 w-5 text-indigo-500" />, label: 'List' },
  { type: 'illustration', icon: <Lightbulb className="h-5 w-5 text-amber-500" />, label: 'Illustration' },
];

// Block interface
interface Block {
  id: string;
  type: string;
  text?: string;
  level?: number;
  reference?: string;
  items?: string[];
}

interface SermonBlockEditorProps {
  blocks: Block[];
  onChange: (blocks: Block[]) => void;
  title?: string;
  onTitleChange?: (title: string) => void;
  manualSave?: () => void;
}

export function SermonSectionEditor({
  blocks,
  onChange,
  title = '',
  onTitleChange,
  manualSave
}: SermonBlockEditorProps) {
  const [hoveredBlockId, setHoveredBlockId] = useState<string | null>(null);
  const blockRefs = useRef<{ [key: string]: HTMLTextAreaElement | null }>({});

  // Floating toolbar state
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState<{ top: number; left: number } | null>(null);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [selectedText, setSelectedText] = useState<string>('');
  const [aiPopover, setAiPopover] = useState<{ open: boolean; action: string | null }>({ open: false, action: null });

  // Always use a safe array for blocks
  const safeBlocks = Array.isArray(blocks) ? blocks : [];

  // Show toolbar on text selection in eligible blocks
  const handleTextSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>, blockId: string) => {
    const textarea = e.target as HTMLTextAreaElement;
    if (textarea.selectionStart !== textarea.selectionEnd) {
      const rect = textarea.getBoundingClientRect();
      setToolbarPosition({
        top: rect.top + window.scrollY - 48,
        left: rect.left + window.scrollX + rect.width / 2,
      });
      setShowToolbar(true);
      setSelectedBlockId(blockId);
      setSelectedText(textarea.value.substring(textarea.selectionStart, textarea.selectionEnd));
    } else {
      setShowToolbar(false);
      setSelectedBlockId(null);
      setSelectedText('');
    }
  };

  const handleBlur = () => {
    setTimeout(() => setShowToolbar(false), 150);
  };

  // Formatting actions (mock, real implementation would use markdown/rich text logic)
  const applyFormatting = (type: 'bold' | 'italic' | 'heading' | 'list') => {
    if (!selectedBlockId) return;
    const block = safeBlocks.find(b => b.id === selectedBlockId);
    if (!block) return;
    let newText = block.text || '';
    switch (type) {
      case 'bold':
        newText = newText.replace(selectedText, `**${selectedText}**`);
        break;
      case 'italic':
        newText = newText.replace(selectedText, `*${selectedText}*`);
        break;
      case 'heading':
        newText = `# ${selectedText}`;
        break;
      case 'list':
        newText = selectedText.split('\n').map(line => `- ${line}`).join('\n');
        break;
    }
    updateBlock(selectedBlockId, { text: newText });
    setShowToolbar(false);
  };

  // AI action handler (mock, real implementation would call API)
  const handleAIAction = (action: string) => {
    setAiPopover({ open: true, action });
    setShowToolbar(false);
  };

  // Add a new block
  const addBlock = (type: string, afterBlockId?: string) => {
    const newBlock: Block = {
      id: nanoid(),
      type,
      text: '',
      ...(type === 'heading' ? { level: 2 } : {}),
      ...(type === 'list' ? { items: [''] } : {}),
    };
    let idx = safeBlocks.length;
    if (afterBlockId) {
      idx = safeBlocks.findIndex(b => b.id === afterBlockId) + 1;
    }
    const newBlocks = [...safeBlocks];
    newBlocks.splice(idx, 0, newBlock);
    onChange(newBlocks);
  };

  // Update a block
  const updateBlock = (id: string, updates: Partial<Block>) => {
    onChange(safeBlocks.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  // Delete a block
  const deleteBlock = (id: string) => {
    onChange(safeBlocks.filter(b => b.id !== id));
  };

  // Move block up/down
  const moveBlock = (id: string, direction: 'up' | 'down') => {
    const idx = safeBlocks.findIndex(b => b.id === id);
    if ((direction === 'up' && idx === 0) || (direction === 'down' && idx === safeBlocks.length - 1)) return;
    const newBlocks = [...safeBlocks];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    [newBlocks[idx], newBlocks[targetIdx]] = [newBlocks[targetIdx], newBlocks[idx]];
    onChange(newBlocks);
  };

  // Render block
  const renderBlock = (block: Block, idx: number) => {
    const isTextBlock = ['paragraph', 'heading', 'illustration'].includes(block.type);
    switch (block.type) {
      case 'heading':
        return (
          <Input
            value={block.text || ''}
            onChange={e => updateBlock(block.id, { text: e.target.value })}
            className={cn(
              'text-2xl font-bold bg-transparent border-none focus:ring-0 w-full mb-2',
              'placeholder:text-gray-400 dark:placeholder:text-gray-600'
            )}
            placeholder="Heading..."
            onBlur={e => { handleBlur(); manualSave && manualSave(); }}
          />
        );
      case 'paragraph':
        return (
          <Textarea
            ref={el => { blockRefs.current[block.id] = el; }}
            value={block.text || ''}
            onChange={e => updateBlock(block.id, { text: e.target.value })}
            onSelect={e => handleTextSelect(e, block.id)}
            onBlur={e => { handleBlur(); manualSave && manualSave(); }}
            className="text-lg bg-transparent border-none focus:ring-0 w-full mb-2 resize-y min-h-[80px] placeholder:text-gray-400 dark:placeholder:text-gray-600"
            placeholder="Write your paragraph..."
          />
        );
      case 'scripture':
        return (
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 mb-2 flex flex-col gap-2">
            <Input
              value={block.reference || ''}
              onChange={e => updateBlock(block.id, { reference: e.target.value })}
              className="text-base font-semibold bg-transparent border-none focus:ring-0 w-full mb-1 placeholder:text-green-700 dark:placeholder:text-green-300"
              placeholder="Scripture Reference (e.g., John 3:16)"
              onBlur={manualSave}
            />
            <Textarea
              value={block.text || ''}
              onChange={e => updateBlock(block.id, { text: e.target.value })}
              className="text-base bg-transparent border-none focus:ring-0 w-full min-h-[60px] placeholder:text-green-700 dark:placeholder:text-green-300"
              placeholder="Scripture text..."
              onBlur={manualSave}
            />
          </div>
        );
      case 'list':
        return (
          <ul className="list-disc pl-6 mb-2">
            {(block.items || ['']).map((item, i) => (
              <li key={i}>
                <Input
                  value={item}
                  onChange={e => {
                    const newItems = [...(block.items || [])];
                    newItems[i] = e.target.value;
                    updateBlock(block.id, { items: newItems });
                  }}
                  className="bg-transparent border-none focus:ring-0 w-full placeholder:text-gray-400 dark:placeholder:text-gray-600"
                  placeholder={`List item ${i + 1}`}
                  onBlur={manualSave}
                />
              </li>
            ))}
            <li>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => updateBlock(block.id, { items: [...(block.items || []), ''] })}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200"
              >
                <Plus className="h-3 w-3 mr-1" /> Add Item
              </Button>
            </li>
          </ul>
        );
      case 'illustration':
        return (
          <Textarea
            value={block.text || ''}
            onChange={e => updateBlock(block.id, { text: e.target.value })}
            onSelect={e => handleTextSelect(e, block.id)}
            onBlur={e => { handleBlur(); manualSave && manualSave(); }}
            className="italic bg-yellow-50 dark:bg-yellow-900/20 border-none focus:ring-0 w-full min-h-[60px] placeholder:text-yellow-700 dark:placeholder:text-yellow-300 mb-2"
            placeholder="Illustration or story..."
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="editor-container mx-auto max-w-2xl py-12 px-4 font-serif relative">
      {/* Title Input */}
      <Input
        className="editor-title text-4xl font-serif font-bold mb-8 bg-transparent border-none focus:ring-0 w-full placeholder:text-gray-400 dark:placeholder:text-gray-600"
        placeholder="Sermon Title"
        value={title}
        onChange={e => onTitleChange?.(e.target.value)}
      />
      {/* Blocks */}
      <div className="space-y-10">
        {safeBlocks.map((block, idx) => (
          <div
            key={block.id}
            onMouseEnter={() => setHoveredBlockId(block.id)}
            onMouseLeave={() => setHoveredBlockId(null)}
            className="editor-block group relative"
          >
            {/* Block Controls (only on hover) */}
            <div className={cn(
              'absolute -left-12 top-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200',
              hoveredBlockId === block.id && 'opacity-100'
            )}>
              <Button variant="ghost" size="icon" onClick={() => moveBlock(block.id, 'up')} disabled={idx === 0} className="h-7 w-7 rounded-full">
                <ChevronUp className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => moveBlock(block.id, 'down')} disabled={idx === safeBlocks.length - 1} className="h-7 w-7 rounded-full">
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => deleteBlock(block.id)} className="h-7 w-7 rounded-full text-destructive hover:text-destructive hover:bg-destructive/10">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            {/* Block Content */}
            {renderBlock(block, idx)}
            {/* Add Block Button (inline) */}
            <div className="flex gap-2 mt-2">
              {BLOCK_TYPES.map(bt => (
                <Button
                  key={bt.type}
                  variant="ghost"
                  size="sm"
                  onClick={() => addBlock(bt.type, block.id)}
                  className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-primary"
                >
                  {bt.icon} {bt.label}
                </Button>
              ))}
            </div>
            <Separator className="my-8" />
          </div>
        ))}
      </div>
      {/* Add Block Footer */}
      <div className="pt-6 border-t border-gray-200 dark:border-gray-800 mt-12">
        <h4 className="text-sm font-medium text-gray-500 mb-3">Add New Block</h4>
        <div className="flex flex-wrap gap-1">
          {BLOCK_TYPES.map(bt => (
            <Button
              key={bt.type}
              variant="ghost"
              size="sm"
              onClick={() => addBlock(bt.type)}
              className="h-9 w-9 p-0 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {bt.icon}
            </Button>
          ))}
        </div>
      </div>
      {/* Floating Toolbar */}
      {showToolbar && toolbarPosition && (
        <div
          style={{
            position: 'absolute',
            top: toolbarPosition.top,
            left: toolbarPosition.left,
            transform: 'translate(-50%, -100%)',
            zIndex: 50,
          }}
          className="floating-toolbar bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg rounded-xl px-4 py-2 flex gap-2 animate-fade-in"
        >
          {/* Formatting actions */}
          <Button variant="ghost" size="icon" onClick={() => applyFormatting('bold')} title="Bold"><Bold className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" onClick={() => applyFormatting('italic')} title="Italic"><Italic className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" onClick={() => applyFormatting('heading')} title="Heading"><Heading className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" onClick={() => applyFormatting('list')} title="List"><List className="h-4 w-4" /></Button>
          {/* AI actions */}
          <Button variant="ghost" size="icon" onClick={() => handleAIAction('summarize')} title="Summarize"><Sparkles className="h-4 w-4 text-blue-500" /></Button>
          <Button variant="ghost" size="icon" onClick={() => handleAIAction('rewrite')} title="Rewrite"><MessageSquareQuote className="h-4 w-4 text-indigo-500" /></Button>
          <Button variant="ghost" size="icon" onClick={() => handleAIAction('illustration')} title="Suggest Illustration"><Lightbulb className="h-4 w-4 text-amber-500" /></Button>
          <Button variant="ghost" size="icon" onClick={() => handleAIAction('scripture')} title="Find Scripture"><BookOpen className="h-4 w-4 text-green-500" /></Button>
        </div>
      )}
      {/* AI Popover Placeholder */}
      {aiPopover.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-8 max-w-lg w-full relative">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" onClick={() => setAiPopover({ open: false, action: null })}>&times;</button>
            <h3 className="text-lg font-bold mb-4">AI: {aiPopover.action && aiPopover.action.charAt(0).toUpperCase() + aiPopover.action.slice(1)}</h3>
            <div className="text-gray-500 italic mb-4">(AI response would appear here...)</div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setAiPopover({ open: false, action: null })}>Cancel</Button>
              <Button variant="default" onClick={() => setAiPopover({ open: false, action: null })}>Insert</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 