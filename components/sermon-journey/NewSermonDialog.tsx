"use client"; // Keep use client if state hooks are used directly

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { DatePicker } from "@/components/date-picker"; // Ensure DatePicker path is correct

// Re-define or import necessary types if they are not global
interface SermonSeries {
    _id: string;
    name: string;
    color?: string;
    active: boolean;
    createdAt?: string | Date;
    archivedAt?: string | Date | null;
}

interface PopulatedSermon {
    _id: string;
    userId: string;
    title: string;
    series?: SermonSeries;
    date?: string | Date;
    scripture?: string;
    notes?: string;
    // Add other fields if needed by the save function's type
}

interface NewSermonDialogProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    onSave: (data: { sermonData: Omit<PopulatedSermon, '_id' | 'userId' | 'series' | 'createdAt' | 'updatedAt'> & { date?: Date }; seriesId?: string | null; newSeriesName?: string }) => Promise<boolean>;
    activeSeries: SermonSeries[];
    // Pass selectedDate and setSelectedDate if DatePicker state is managed outside
    // selectedDate: Date | undefined;
    // setSelectedDate: (date: Date | undefined) => void;
}

export function NewSermonDialog({
    isOpen,
    setIsOpen,
    onSave,
    activeSeries
    // Remove selectedDate, setSelectedDate if managed internally
}: NewSermonDialogProps) {
    const [title, setTitle] = useState('');
    const [scripture, setScripture] = useState('');
    const [notes, setNotes] = useState('');
    const [selectedSeriesId, setSelectedSeriesId] = useState<string | null>(null);
    const [newSeriesName, setNewSeriesName] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined); // Manage DatePicker state internally


    const isCreatingNewSeries = selectedSeriesId === 'create_new';

    const resetForm = () => {
        setTitle('');
        setScripture('');
        setNotes('');
        setSelectedSeriesId(null);
        setNewSeriesName('');
        setSelectedDate(undefined); // Reset internal date state
    }

    const handleDialogSave = async () => {
        if (!title) {
            alert("Please enter a sermon title.");
            return;
        }
        if (isCreatingNewSeries && !newSeriesName) {
            alert("Please enter a name for the new series.");
            return;
        }

        setIsSaving(true);
        // Explicitly type sermonData to match the expected Omit structure
        const sermonData: Omit<PopulatedSermon, '_id' | 'userId' | 'series' | 'createdAt' | 'updatedAt'> & { date?: Date | undefined } = {
            title,
            scripture: scripture || undefined,
            notes: notes || undefined,
            date: selectedDate, // Use internal state
        };


        const success = await onSave({
            sermonData,
            seriesId: isCreatingNewSeries ? null : selectedSeriesId,
            newSeriesName: isCreatingNewSeries ? newSeriesName : undefined
        });

        setIsSaving(false);
        if (success) {
            resetForm();
            setIsOpen(false); // Close dialog on successful save
        }
    };

    const handleOpenChange = (open: boolean) => {
        if (!open && !isSaving) { // Only reset if closing and not in the middle of saving
            resetForm();
        }
        setIsOpen(open);
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Plan New Sermon</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {/* Title Input */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">Title *</Label>
                        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3" required disabled={isSaving}/>
                    </div>
                    {/* Series Select */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="series" className="text-right">Series</Label>
                        <Select
                            value={selectedSeriesId ?? ''}
                            onValueChange={(value: string) => {
                                setSelectedSeriesId(value === 'create_new' ? 'create_new' : value || null);
                                if (value !== 'create_new') setNewSeriesName('');
                            }}
                            disabled={isSaving}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select a series (optional)" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Active Series</SelectLabel>
                                    {activeSeries.map(s => (
                                        <SelectItem key={s._id} value={s._id} disabled={isSaving}>{s.name}</SelectItem>
                                    ))}
                                </SelectGroup>
                                <SelectItem value="create_new" disabled={isSaving}>+ Create New Series...</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* New Series Name Input */}
                    {isCreatingNewSeries && (
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="new-series-name" className="text-right">New Series Name *</Label>
                            <Input
                                id="new-series-name"
                                value={newSeriesName}
                                onChange={(e) => setNewSeriesName(e.target.value)}
                                className="col-span-3"
                                placeholder="Enter name for the new series"
                                required
                                disabled={isSaving}
                            />
                        </div>
                    )}

                    {/* Date Picker */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="date" className="text-right">Date</Label>
                        <div className="col-span-3">
                            <DatePicker date={selectedDate} setDate={setSelectedDate} />
                        </div>
                    </div>

                    {/* Scripture Input */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="scripture" className="text-right">Scripture</Label>
                        <Input id="scripture" value={scripture} onChange={(e) => setScripture(e.target.value)} className="col-span-3" placeholder="e.g., John 3:16" disabled={isSaving}/>
                    </div>

                    {/* Notes Textarea */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="notes" className="text-right">Notes</Label>
                        <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} className="col-span-3" placeholder="Initial ideas, themes..." disabled={isSaving}/>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isSaving}>
                        Cancel
                    </Button>
                    <Button onClick={handleDialogSave} disabled={isSaving}>
                        {isSaving ? 'Saving...' : 'Save Sermon'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
} 