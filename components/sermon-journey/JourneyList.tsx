// components/sermon-journey/JourneyList.tsx
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, BookOpen, Plus, ChevronDown } from "lucide-react";
import { PopulatedSermon, SermonSeries } from "@/types/sermon"; // Import types

// Remove local interface definitions
// interface SermonSeries { ... }
// interface PopulatedSermon { ... }

interface JourneyListProps {
    sermons: PopulatedSermon[]; // Use imported type
    expandedSermon: string | null;
    toggleExpandSermon: (id: string) => void;
    getSeriesColorClasses: (colorName?: string) => { bg: string; border: string; text: string };
    setNewMessageOpen: (open: boolean) => void;
}

// Helper to check if series is fully populated or just an ID (though API returns populated)
function isSermonSeriesPopulated(series: SermonSeries | string | undefined): series is SermonSeries {
  return typeof series === 'object' && series !== null && '_id' in series && 'name' in series;
}

export function JourneyList({
    sermons,
    expandedSermon,
    toggleExpandSermon,
    getSeriesColorClasses,
    setNewMessageOpen
}: JourneyListProps) {
    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-medium tracking-tight text-foreground">
                        Your Sermon Journey
                    </h2>
                    <p className="mt-1 text-muted-foreground">
                        Cultivating ideas into messages that transform
                    </p>
                </div>
                <Button onClick={() => setNewMessageOpen(true)} className="rounded-full bg-[#e8e3d9] text-[#3c3528] hover:bg-[#dfd8ca] dark:bg-[#2a2520] dark:text-[#e8e3d9] dark:hover:bg-[#373029]">
                    <Plus className="mr-1 h-4 w-4" />
                    New Sermon
                </Button>
            </div>

            <div className="space-y-4">
                {sermons.length === 0 ? (
                    <p className="text-center text-muted-foreground mt-8">
                        No sermons planned yet. Click "New Sermon" to start.
                    </p>
                ) : (
                    sermons.map((sermon, index) => {
                        // Check if series is populated before accessing its properties
                        const isSeriesPopulated = isSermonSeriesPopulated(sermon.series);
                        const seriesColors = getSeriesColorClasses(isSeriesPopulated ? sermon.series.color : undefined);

                        return (
                            <motion.div
                                key={sermon._id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.03 }}
                                className={cn(
                                    "rounded-lg border bg-card text-card-foreground overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md",
                                    sermon.borderColor || "border-border",
                                    expandedSermon === sermon._id && "shadow-lg ring-1 ring-primary/20"
                                )}
                            >
                                <CardHeader
                                    className={cn(
                                        "flex flex-row items-start justify-between p-4 cursor-pointer gap-4",
                                    )}
                                    onClick={() => toggleExpandSermon(sermon._id)}
                                >
                                    <div className="flex-1 space-y-1.5 min-w-0">
                                        {isSeriesPopulated && (
                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    "w-fit text-xs uppercase tracking-wider border font-medium",
                                                    seriesColors.bg,
                                                    seriesColors.border,
                                                    seriesColors.text
                                                )}
                                            >
                                                {sermon.series.name} {/* Safe to access name */}
                                            </Badge>
                                        )}
                                        {/* Handle case where series is just an ID string, though unlikely with current fetch logic */}
                                        {/* {typeof sermon.series === 'string' && <Badge>Series ID: {sermon.series}</Badge>} */}

                                        <CardTitle className="text-md font-semibold leading-tight pt-0.5 truncate" title={sermon.title}>
                                            {sermon.title}
                                        </CardTitle>
                                        <div className="text-xs text-muted-foreground flex items-center flex-wrap gap-x-2 gap-y-1 pt-1">
                                            {sermon.date && (
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    <span>{new Date(sermon.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                </div>
                                            )}
                                            {sermon.date && sermon.scripture && <span className="hidden sm:inline">&bull;</span>}
                                            {sermon.scripture && (
                                                <div className="flex items-center gap-1">
                                                    <BookOpen className="h-3 w-3" />
                                                    <span className="truncate" title={sermon.scripture}>{sermon.scripture}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <ChevronDown
                                        className={cn(
                                            "h-5 w-5 text-muted-foreground transition-transform flex-shrink-0 mt-0.5",
                                            expandedSermon === sermon._id && "rotate-180"
                                        )}
                                    />
                                </CardHeader>

                                <AnimatePresence>
                                    {expandedSermon === sermon._id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="overflow-hidden"
                                        >
                                            <CardContent className="p-4 pt-2 border-t">
                                                <h4 className="text-sm font-medium mb-1.5">Notes</h4>
                                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{sermon.notes || 'No notes yet.'}</p>
                                            </CardContent>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )
                    })
                )}
            </div>
        </div>
    );
} 