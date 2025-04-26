// components/sermon-journey/JourneyList.tsx
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, BookOpen, Plus, ChevronDown, Sparkles, Pencil } from "lucide-react";
import { PopulatedSermon, SermonSeries } from "@/types/sermon"; // Import types
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"; // Import router type

// Remove local interface definitions
// interface SermonSeries { ... }
// interface PopulatedSermon { ... }

// Helper to check if series is fully populated or just an ID (though API returns populated)
function isSermonSeriesPopulated(series: SermonSeries | string | undefined): series is SermonSeries {
  return typeof series === 'object' && series !== null && '_id' in series && 'name' in series;
}

interface JourneyListProps {
    sermons: PopulatedSermon[]; // Use imported type
    expandedSermon: string | null;
    toggleExpandSermon: (id: string) => void;
    getSeriesColorClasses: (colorName?: string) => { bg: string; border: string; text: string };
    setNewMessageOpen: (open: boolean) => void;
    router: AppRouterInstance; // Add router prop
}

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { 
            staggerChildren: 0.08,
            delayChildren: 0.1
        }
    }
};

const listItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    }
};

export function JourneyList({
    sermons,
    expandedSermon,
    toggleExpandSermon,
    getSeriesColorClasses,
    setNewMessageOpen,
    router // Destructure router prop
}: JourneyListProps) {
    return (
        <div>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-serif font-medium tracking-tight text-foreground">
                        Your Sermon Journey
                    </h2>
                    <p className="mt-1 text-muted-foreground font-light tracking-wide">
                        Cultivating ideas into messages that transform
                    </p>
                </div>
                <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                >
                    <Button 
                        onClick={() => setNewMessageOpen(true)} 
                        className="rounded-full bg-gradient-to-r from-accent-3/50 to-accent-3/30 text-accent-1/90 hover:bg-gradient-to-r hover:from-accent-3/60 hover:to-accent-3/40 dark:from-accent-3/40 dark:to-accent-3/20 dark:text-accent-1/90 border border-accent-3/40 shadow-sm hover:shadow-md transition-all duration-300"
                    >
                        <Sparkles className="mr-1 h-4 w-4" />
                        New Sermon
                    </Button>
                </motion.div>
            </div>

            <motion.div 
                className="space-y-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {sermons.length === 0 ? (
                    <motion.div 
                        className="text-center py-12 px-6"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-accent-3/30 to-accent-3/10 mb-4">
                            <BookOpen className="h-5 w-5 text-accent-1" />
                        </div>
                        <p className="text-muted-foreground mt-2 font-light">
                            No sermons planned yet. Click "New Sermon" to start your journey.
                        </p>
                    </motion.div>
                ) : (
                    sermons.map((sermon, index) => {
                        // Check if series exists and is an object (not a string)
                        const seriesObject = sermon.series && typeof sermon.series === 'object' ? sermon.series : null;
                        const seriesColors = getSeriesColorClasses(seriesObject?.color);

                        return (
                            <motion.div
                                key={sermon._id}
                                layout
                                variants={listItemVariants}
                                className={cn(
                                    "rounded-lg border backdrop-blur-sm overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md",
                                    expandedSermon === sermon._id 
                                        ? "bg-gradient-to-br from-card/80 to-card/60 shadow-lg ring-1 ring-primary/20" 
                                        : "bg-card",
                                    sermon.borderColor || "border-border hover:border-accent-3/30"
                                )}
                            >
                                <CardHeader
                                    className={cn(
                                        "flex flex-row items-start justify-between p-5 sm:p-6 cursor-pointer gap-4 border-b border-border/20 bg-white/90 dark:bg-[#23201c]/90",
                                    )}
                                    onClick={() => toggleExpandSermon(sermon._id)}
                                >
                                    <div className="flex-1 space-y-2 min-w-0">
                                        {/* Only render badge if series is an object with name property */}
                                        {seriesObject && 'name' in seriesObject && (
                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    "w-fit text-xs uppercase tracking-wider border font-medium mb-1 px-2 py-0.5 rounded-full",
                                                    seriesColors.bg,
                                                    seriesColors.border,
                                                    seriesColors.text
                                                )}
                                            >
                                                {seriesObject.name}
                                            </Badge>
                                        )}

                                        <CardTitle className="text-lg sm:text-xl font-serif font-bold leading-tight pt-0.5 truncate" title={sermon.title}>
                                            {sermon.title}
                                        </CardTitle>
                                        <div className="text-xs text-muted-foreground flex items-center flex-wrap gap-x-3 gap-y-1 pt-1">
                                            {sermon.date && (
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-3.5 w-3.5" />
                                                    <span>{new Date(sermon.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                </div>
                                            )}
                                            {sermon.date && sermon.scripture && <span className="hidden sm:inline text-accent-1/30">&bull;</span>}
                                            {sermon.scripture && (
                                                <div className="flex items-center gap-1">
                                                    <BookOpen className="h-3.5 w-3.5" />
                                                    <span className="truncate" title={sermon.scripture}>{sermon.scripture}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {/* Controls Area: Edit Button and Expand Chevron */}
                                    <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
                                        {/* Edit Button Navigates to Edit Page */}
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-8 w-8 rounded-full hover:bg-accent-3/10"
                                            onClick={(e) => { 
                                                e.stopPropagation(); 
                                                // Navigate to the edit page for this sermon
                                                router.push(`/sermon-journey/${sermon._id}/edit`); 
                                            }}
                                        >
                                            <Pencil className="h-4 w-4 text-muted-foreground hover:text-accent-1" />
                                        </Button>
                                        <motion.div
                                            animate={{ 
                                                rotate: expandedSermon === sermon._id ? 180 : 0 
                                            }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                        >
                                            <ChevronDown
                                                className="h-5 w-5 text-muted-foreground"
                                            />
                                        </motion.div>
                                    </div>
                                </CardHeader>

                                <AnimatePresence>
                                    {expandedSermon === sermon._id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                            className="overflow-hidden"
                                        >
                                            <CardContent className="p-6 border-t bg-gradient-to-br from-background/60 to-background/30">
                                                <h4 className="text-base font-serif font-semibold mb-2 text-foreground/90">Notes</h4>
                                                <p className="text-sm text-muted-foreground whitespace-pre-wrap font-light leading-relaxed">
                                                    {sermon.notes || 'No notes yet. Add your sermon thoughts here.'}
                                                </p>
                                            </CardContent>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )
                    })
                )}
            </motion.div>
        </div>
    );
} 