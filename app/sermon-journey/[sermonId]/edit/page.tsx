"use client";

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { PopulatedSermon, SermonSection } from '@/types/sermon';
import { ArrowLeft, Sparkles, Lightbulb, SendHorizonal, Calendar, Tag, Save, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { SermonSectionEditor } from '@/components/SermonSectionEditor'; 
import { toast } from 'sonner';
import useAutoSave, { SaveStatus } from '@/hooks/useAutoSave';
import { SaveStatusIndicator } from '@/components/ui/save-status';
import { 
    Popover, 
    PopoverContent, 
    PopoverTrigger 
} from '@/components/ui/popover';
import { 
    Select, 
    SelectContent, 
    SelectGroup, 
    SelectItem, 
    SelectLabel, 
    SelectTrigger, 
    SelectValue 
} from '@/components/ui/select';
import { SermonSeries } from '@/types/sermon';

export default function SermonEditPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const params = useParams();
    const sermonId = params.sermonId as string;
    
    // State for sermon data
    const [sermon, setSermon] = useState<PopulatedSermon | null>(null);
    const [title, setTitle] = useState('');
    const [scripture, setScripture] = useState('');
    const [notes, setNotes] = useState('');
    const [sections, setSections] = useState<SermonSection[]>([]);
    const [seriesId, setSeriesId] = useState<string | null>(null);

    // State for series data
    const [seriesList, setSeriesList] = useState<SermonSeries[]>([]);
    const [isLoadingSeries, setIsLoadingSeries] = useState(false);

    // UI state
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    
    // Chat state
    const [chatInput, setChatInput] = useState('');

    // Collect sermon data for saving
    const sermonData = {
        title,
        scripture,
        notes,
        sections,
        seriesId
    };

    // Save handler function for the hook
    const saveHandler = useCallback(async (data: typeof sermonData) => {
        if (!sermonId) throw new Error('Missing sermon ID');
        
        const response = await fetch(`/api/sermons/${sermonId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Failed to parse error response' }));
            throw new Error(errorData.message || `Failed to save: ${response.statusText}`);
        }
        
        return await response.json();
    }, [sermonId]);

    // Initialize auto-save functionality
    const { saveStatus, isDirty, manualSave, reset: resetAutoSave } = useAutoSave({
        data: sermonData,
        onSave: saveHandler,
        interval: 2500, // 2.5 seconds debounce
        onSuccess: (updatedSermon) => {
            // Update sermon with data from the server if needed
            setSermon(prevSermon => ({
                ...prevSermon!,
                ...updatedSermon,
            }));
        },
        enabled: !!sermonId && status === 'authenticated'
    });

    // --- Fetch Active Series ---
    const fetchSeries = useCallback(async () => {
        if (status === 'authenticated') {
            setIsLoadingSeries(true);
            try {
                const response = await fetch('/api/series?active=true');
                if (!response.ok) throw new Error(`Series Fetch Error: ${response.statusText} (${response.status})`);
                const data: SermonSeries[] = await response.json();
                setSeriesList(data);
            } catch (err: any) {
                console.error("Fetch Series Error:", err);
                toast.error("Failed to load series list");
                setSeriesList([]);
            } finally {
                setIsLoadingSeries(false);
            }
        }
    }, [status]);

    // --- Data Fetching ---
    const fetchSermon = useCallback(async () => {
        if (status === 'authenticated' && sermonId) {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(`/api/sermons/${sermonId}`); 
                if (!response.ok) {
                     if (response.status === 404) {
                         throw new Error(`Sermon not found.`);
                     }
                    throw new Error(`Error fetching sermon: ${response.statusText} (${response.status})`);
                }
                const data: PopulatedSermon = await response.json();
                
                // Set sermon state
                setSermon(data);
                
                // Initialize form fields
                setTitle(data.title || '');
                setScripture(data.scripture || '');
                setNotes(data.notes || '');
                setSections(data.sections || []);
                
                // Set series ID if it exists
                if (data.series?._id) {
                    setSeriesId(data.series._id);
                } else {
                    // In case the sermon has a seriesId that hasn't been populated yet
                    // This is handled as a separate API response property
                    const responseSeriesId = (data as any).seriesId;
                    setSeriesId(responseSeriesId || null);
                }
                
                // Reset auto-save with new data
                resetAutoSave({
                    title: data.title || '',
                    scripture: data.scripture || '',
                    notes: data.notes || '',
                    sections: data.sections || [],
                    seriesId: data.series?._id || (data as any).seriesId || null
                });
                
            } catch (err: any) {
                console.error("Fetch Sermon Error:", err);
                setError(err.message || 'Could not load sermon data.');
                setSermon(null);
            } finally {
                setIsLoading(false);
            }
        } else if (status === 'loading') {
            setIsLoading(true);
        } else {
             setError('Not authorized or invalid request.');
             setIsLoading(false);
        }
    }, [sermonId, status, resetAutoSave]);

    useEffect(() => {
        fetchSermon();
        fetchSeries();
    }, [fetchSermon, fetchSeries]);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin'); 
        }
    }, [status, router]);

    // --- Handlers ---
    const handleManualSave = () => {
        toast.loading('Saving sermon...');
        manualSave()
            .then(() => toast.success('Sermon saved successfully!'))
            .catch((err) => toast.error(`Error saving: ${err.message}`));
    };

    // Series handler
    const handleSeriesChange = (value: string) => {
        setSeriesId(value === "none" ? null : value);
    };

    // --- AI & Chat Handlers ---
    const handleGenerateOutline = () => console.log('Generate outline points');
    const handleSuggestIllustrations = () => console.log('Suggest illustrations');
    const handleSendChatMessage = () => {
        if (!chatInput.trim()) return;
        console.log('Sending message:', chatInput);
        setChatInput('');
    };

    // --- CRUD Operations ---
    const updateSermon = async () => {
        if (!session?.user) return;
        
        try {
            setIsSaving(true);
            
            const updateData = {
                title,
                scripture,
                notes,
                sections,
                seriesId
            };
            
            const response = await fetch(`/api/sermons/${sermonId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData)
            });
            
            if (!response.ok) {
                throw new Error(`Error updating sermon: ${response.statusText}`);
            }
            
            // Get updated sermon data
            const updatedSermon = await response.json();
            setSermon(updatedSermon);
            
            // Reset auto-save with new data
            resetAutoSave({
                title,
                scripture,
                notes,
                sections,
                seriesId
            });
            
            toast.success("Sermon saved successfully!");
            return true;
            
        } catch (error: any) {
            console.error("Update Error:", error);
            toast.error(error.message || "Failed to save sermon");
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    // --- Render Logic ---
    if (isLoading && !sermon) {
        return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-6 w-6 animate-spin mr-2"/> Loading Sermon Editor...</div>;
    }

    if (error) {
         return (
             <div className="flex flex-col min-h-screen items-center justify-center p-4 text-center">
                 <p className="text-red-600 font-semibold mb-2">Error Loading Sermon</p>
                 <p className="text-red-500 mt-1 mb-4">{error}</p>
                 <Button variant="outline" onClick={() => router.push('/sermon-journey')}>
                     <ArrowLeft className="mr-2 h-4 w-4" /> Back to Journey
                 </Button>
             </div>
         );
    }
    
    if (!sermon) {
        return <div className="flex min-h-screen items-center justify-center">Sermon data unavailable.</div>;
    }

    // Get series name from either series object or series list
    const currentSeriesName = sermon.series?.name || 
        (seriesId ? seriesList.find(s => s._id === seriesId)?.name : null);

    return (
        <div className="flex flex-col h-screen bg-white dark:bg-black">
            {/* Header Area */} 
            <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b bg-white/90 dark:bg-black/90 backdrop-blur px-5">
                <div className="flex items-center gap-2">
                     <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => router.push('/sermon-journey')}>
                        <ArrowLeft className="h-4 w-4" />
                        <span className="sr-only">Back to Journey</span>
                     </Button>
                    <h1 className="text-base font-medium tracking-tight truncate">
                        {title || 'Editing Sermon'}
                    </h1>
                    {/* Save Status Indicator */} 
                    <span className="ml-4 text-xs text-muted-foreground flex items-center">
                        <SaveStatusIndicator status={saveStatus} isDirty={isDirty} size="sm" />
                    </span>
                </div>
                <div className="flex items-center">
                    <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={handleManualSave} 
                        disabled={saveStatus === 'saving' || !isDirty} // Disable if saving or no changes
                        className="flex gap-1.5 items-center text-sm font-normal"
                    >
                        {saveStatus === 'saving' ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                            <Save className="h-3.5 w-3.5" />
                        )}
                        {saveStatus === 'saving' ? 'Saving...' : 'Save Now'}
                    </Button> 
                </div>
            </header>

            {/* Main Content */} 
            <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 max-w-7xl mx-auto w-full">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Main Editor Column */} 
                    <div className="lg:col-span-2 space-y-6">
                        {/* Title & Scripture Row */}
                        <div className="space-y-6">
                            <div className="space-y-1.5">
                                <Label htmlFor="title" className="text-sm font-medium text-gray-500 dark:text-gray-400 sr-only">Title</Label>
                                <Input 
                                    id="title" 
                                    value={title} 
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Sermon Title" 
                                    className="h-10 text-2xl font-bold border-0 focus-visible:ring-0 p-0 bg-transparent shadow-none !mt-0" // Larger title 
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="scripture" className="text-sm font-medium text-gray-500 dark:text-gray-400 sr-only">Scripture</Label>
                                <Input 
                                    id="scripture" 
                                    value={scripture} 
                                    onChange={(e) => setScripture(e.target.value)}
                                    placeholder="Primary Scripture (e.g., John 3:16-17)" 
                                    className="h-9 bg-transparent border-0 focus-visible:ring-0 p-0 shadow-none text-muted-foreground"
                                />
                            </div>
                        </div>
                        
                        {/* Date & Series Row */} 
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100 dark:border-gray-800/50">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-gray-500 dark:text-gray-400">Date</Label>
                                <Button 
                                    variant="outline" 
                                    className="w-full justify-start font-normal text-sm h-9 px-3 bg-transparent"
                                >
                                    <Calendar className="mr-2 h-3.5 w-3.5 opacity-70" />
                                    {sermon.date ? new Date(sermon.date).toLocaleDateString() : <span>Select Date</span>}
                                </Button>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-gray-500 dark:text-gray-400">Series</Label>
                                <Select 
                                    value={seriesId || ""} 
                                    onValueChange={handleSeriesChange}
                                >
                                    <SelectTrigger className="w-full justify-start font-normal text-sm h-9 px-3 bg-transparent">
                                        <SelectValue placeholder="Assign to Series">
                                            <div className="flex items-center">
                                                <Tag className="mr-2 h-3.5 w-3.5 opacity-70" />
                                                {currentSeriesName || <span>Assign to Series</span>}
                                            </div>
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Active Series</SelectLabel>
                                            {seriesList.map(series => (
                                                <SelectItem key={series._id} value={series._id}>
                                                    {series.name}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                        {seriesId && (
                                            <SelectItem value="none">Remove from Series</SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Section Editor Component */}
                        <div className="space-y-1.5 pt-4 border-t border-gray-100 dark:border-gray-800/50">
                            <SermonSectionEditor 
                                sections={sections} 
                                onChange={setSections} // Directly pass setter
                                generalNotes={notes}
                                onGeneralNotesChange={setNotes} // Directly pass setter
                            />
                        </div>
                    </div>

                    {/* AI Assistant Column */} 
                    <div className="lg:col-span-1">
                        {/* Simplified AI assistant styling */}
                        <div className="sticky top-20 space-y-6"> {/* Make assistant sticky */} 
                            <div>
                                <h2 className="text-sm font-medium mb-3 text-gray-600 dark:text-gray-400">AI Assistant</h2>
                                <div className="space-y-2">
                                    <Button 
                                        variant="outline" 
                                        onClick={handleGenerateOutline}
                                        className="w-full justify-start gap-2 text-sm h-9 bg-white dark:bg-gray-900/50 hover:bg-gray-50 dark:hover:bg-gray-800/80 border-gray-200 dark:border-gray-700/80"
                                    >
                                        <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
                                        Generate Outline Points
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        onClick={handleSuggestIllustrations}
                                        className="w-full justify-start gap-2 text-sm h-9 bg-white dark:bg-gray-900/50 hover:bg-gray-50 dark:hover:bg-gray-800/80 border-gray-200 dark:border-gray-700/80"
                                    >
                                        <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
                                        Suggest Illustrations
                                    </Button>
                                </div>
                            </div>
                            
                            {/* Research Chat Section */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Research Chat</h3>
                                <div className="h-48 mb-3 border border-gray-200 dark:border-gray-700/80 rounded-md bg-white dark:bg-gray-900/50 p-3 overflow-y-auto flex items-center justify-center text-center">
                                    <p className="text-xs text-gray-400 dark:text-gray-500">(Chat history will appear here)</p>
                                </div>
                                <div className="flex gap-1">
                                    <Textarea 
                                        value={chatInput}
                                        onChange={(e) => setChatInput(e.target.value)}
                                        placeholder="Ask about scripture, context, etc..." 
                                        rows={2}
                                        className="flex-1 text-sm px-3 py-2 min-h-[40px] resize-none bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-700/80"
                                    />
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        onClick={handleSendChatMessage}
                                        className="h-10 w-10 shrink-0"
                                        disabled={!chatInput.trim()}
                                    >
                                        <SendHorizonal className="h-4 w-4" />
                                        <span className="sr-only">Send message</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
} 