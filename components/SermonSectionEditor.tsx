import { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { SermonSection } from '@/types/sermon';
import { Plus, Trash2, ChevronDown, ChevronUp, FileText, Lightbulb, LibraryBig, MessageSquareQuote, CheckCircle2, ListChecks } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Define props for the component
interface SermonSectionEditorProps {
  sections: SermonSection[];
  onChange: (sections: SermonSection[]) => void;
  generalNotes?: string;
  onGeneralNotesChange?: (notes: string) => void;
}

// Default sections to add when creating a new sermon
const DEFAULT_SECTIONS: Partial<SermonSection>[] = [
  { type: 'introduction', title: 'Introduction', content: '', order: 0 },
  { type: 'mainPoint', title: 'Main Point 1', content: '', order: 1 },
  { type: 'mainPoint', title: 'Main Point 2', content: '', order: 2 },
  { type: 'conclusion', title: 'Conclusion', content: '', order: 3 },
];

export function SermonSectionEditor({ 
  sections,
  onChange,
  generalNotes = '',
  onGeneralNotesChange
}: SermonSectionEditorProps) {
  const [hoveredSectionId, setHoveredSectionId] = useState<string | null>(null);

  // Initialize sections
  useEffect(() => {
    if (sections.length === 0) {
      const initialSections = DEFAULT_SECTIONS.map(section => ({
        ...section,
        id: nanoid(),
        content: '',
        title: section.title || '',
        type: section.type || 'custom',
        order: section.order || 0,
      } as SermonSection));
      onChange(initialSections);
    }
  }, []); // Run only once on mount

  // Get icon for section type
  const getSectionIcon = (type: string) => {
    const commonClasses = "h-5 w-5 mr-2 flex-shrink-0"; // Adjusted size
    switch (type) {
      case 'introduction': return <FileText className={cn(commonClasses, "text-blue-500")} />;
      case 'mainPoint': return <ListChecks className={cn(commonClasses, "text-indigo-500")} />;
      case 'illustration': return <Lightbulb className={cn(commonClasses, "text-amber-500")} />;
      case 'application': return <CheckCircle2 className={cn(commonClasses, "text-green-500")} />;
      case 'conclusion': return <MessageSquareQuote className={cn(commonClasses, "text-purple-500")} />;
      default: return <LibraryBig className={cn(commonClasses, "text-gray-500")} />;
    }
  };

  // Get label for section type
  const getSectionLabel = (type: string): string => {
    switch (type) {
      case 'introduction': return 'Intro';
      case 'mainPoint': return 'Point';
      case 'illustration': return 'Example';
      case 'application': return 'Apply';
      case 'conclusion': return 'Conclusion';
      default: return 'Custom';
    }
  };

  // Add a new section
  const addSection = (type: SermonSection['type'], afterSectionId?: string) => {
    const newOrder = afterSectionId ? sections.findIndex(s => s.id === afterSectionId) + 1 : sections.length;
    
    const newSection: SermonSection = {
      id: nanoid(),
      type,
      title: `New ${getSectionLabel(type)}`,
      content: '',
      order: newOrder,
    };

    let updatedSections = [...sections];
    updatedSections.splice(newOrder, 0, newSection);
    
    updatedSections = updatedSections.map((section, index) => ({
      ...section,
      order: index
    }));

    onChange(updatedSections);
  };

  // Update a section
  const updateSection = (id: string, updates: Partial<SermonSection>) => {
    const newSections = sections.map(section =>
      section.id === id ? { ...section, ...updates } : section
    );
    onChange(newSections);
  };

  // Delete a section
  const deleteSection = (id: string) => {
    const newSections = sections.filter(section => section.id !== id);
    const reorderedSections = newSections.map((section, index) => ({
      ...section,
      order: index
    }));
    onChange(reorderedSections);
  };

  // Move section up/down in order
  const moveSection = (id: string, direction: 'up' | 'down') => {
    const sectionIndex = sections.findIndex(s => s.id === id);
    if (
      (direction === 'up' && sectionIndex === 0) ||
      (direction === 'down' && sectionIndex === sections.length - 1)
    ) {
      return;
    }

    const newSections = [...sections];
    const targetIndex = direction === 'up' ? sectionIndex - 1 : sectionIndex + 1;

    [newSections[sectionIndex], newSections[targetIndex]] =
    [newSections[targetIndex], newSections[sectionIndex]];

    const reorderedSections = newSections.map((section, index) => ({
      ...section,
      order: index
    }));

    onChange(reorderedSections);
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div className="space-y-10 font-serif"> {/* Increased spacing, base font */}
        {/* General Notes Section (More integrated) */}
        <div>
          <h3 className="text-xl font-semibold text-gray-500 dark:text-gray-400 mb-2">General Notes</h3>
          <Textarea
            value={generalNotes}
            onChange={(e) => onGeneralNotesChange?.(e.target.value)}
            placeholder="Overall sermon theme, structure ideas, scripture focus..."
            className="min-h-[100px] resize-y text-base bg-gray-50/50 dark:bg-gray-900/30 border-gray-200 dark:border-gray-800 focus:border-primary focus:ring-primary/20 rounded-md"
          />
        </div>

        <Separator className="my-8" />

        {/* Sermon Content Flow */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">Sermon Content</h3>
          <div className="space-y-8"> {/* Spacing between sections */}
            {sections
              .sort((a, b) => a.order - b.order)
              .map((section, index) => (
                <div 
                    key={section.id}
                    onMouseEnter={() => setHoveredSectionId(section.id)}
                    onMouseLeave={() => setHoveredSectionId(null)}
                    className="relative group pt-2 pb-4" // Minimal padding
                >
                  {/* Section Header (Title Input + Hover Controls) */}
                  <div className="flex items-center gap-2 mb-3">
                    <Input
                      value={section.title}
                      onChange={(e) => updateSection(section.id, { title: e.target.value })}
                      className="h-auto p-0 text-lg font-semibold border-none focus-visible:ring-0 bg-transparent shadow-none placeholder:text-gray-400 dark:placeholder:text-gray-500 flex-grow"
                      placeholder={`${getSectionLabel(section.type)} Title`}
                    />
                    {/* Hover Controls */} 
                    <div 
                      className={cn(
                          "flex items-center gap-0 transition-opacity duration-200",
                          hoveredSectionId === section.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      )}
                    >
                        <Tooltip>
                          <TooltipTrigger asChild>
                             <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => moveSection(section.id, 'up')}
                                disabled={index === 0}
                                className="h-7 w-7 rounded-full"
                              >
                                <ChevronUp className="h-4 w-4" />
                              </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top"><p>Move Up</p></TooltipContent>
                        </Tooltip>
                       <Tooltip>
                         <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => moveSection(section.id, 'down')}
                              disabled={index === sections.length - 1}
                              className="h-7 w-7 rounded-full"
                            >
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                         </TooltipTrigger>
                         <TooltipContent side="top"><p>Move Down</p></TooltipContent>
                      </Tooltip>
                      <Tooltip>
                          <TooltipTrigger asChild>
                             <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteSection(section.id)}
                                className="h-7 w-7 rounded-full text-destructive hover:text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                         </TooltipTrigger>
                         <TooltipContent side="top"><p>Delete Section</p></TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                  
                  {/* Section Content Area */}
                  <div className="flex items-start gap-1 pl-1"> {/* Align icon with text */}
                      <span className="mt-1.5">{getSectionIcon(section.type)}</span>
                      <Textarea
                        value={section.content}
                        onChange={(e) => updateSection(section.id, { content: e.target.value })}
                        placeholder={`Write your ${getSectionLabel(section.type).toLowerCase()} content here...`}
                        className="min-h-[120px] text-base resize-y flex-1 bg-transparent border-none focus:ring-0 focus:outline-none p-0 leading-relaxed dark:placeholder:text-gray-600"
                      />
                  </div>
                  
                  {/* Contextual Add Buttons (Inline Style) */}
                  {section.type === 'mainPoint' && (
                      <div className="mt-3 pl-7 flex flex-wrap gap-4"> {/* Indent add buttons */}
                          <button
                            onClick={() => addSection('illustration', section.id)}
                            className="flex items-center text-xs text-amber-600 dark:text-amber-500 hover:text-amber-700 dark:hover:text-amber-400 font-medium"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add Illustration
                          </button>
                          <button
                            onClick={() => addSection('application', section.id)}
                            className="flex items-center text-xs text-green-600 dark:text-green-500 hover:text-green-700 dark:hover:text-green-400 font-medium"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add Application
                          </button>
                      </div>
                  )}
                </div>
              ))}
          </div>
        </div>

        {/* Add Section Footer (Minimalist) */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
          <h4 className="text-sm font-medium text-gray-500 mb-3">Add New Section</h4>
          <div className="flex flex-wrap gap-1">
            {[ 'introduction', 'mainPoint', 'illustration', 'application', 'conclusion', 'custom' ]
              .map(type => (
                <Tooltip key={type}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost" // Changed to ghost
                      size="sm"
                      onClick={() => addSection(type as SermonSection['type'])}
                      className="h-9 w-9 p-0 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800" // Icon only feel
                    >
                      {getSectionIcon(type)}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom"><p>Add {getSectionLabel(type)}</p></TooltipContent>
                </Tooltip>
            ))}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
} 