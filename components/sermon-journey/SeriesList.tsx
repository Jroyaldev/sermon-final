// components/sermon-journey/SeriesList.tsx
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Archive, ArchiveRestore, Library, Plus } from "lucide-react";

// Re-define or import necessary types
interface SermonSeries {
    _id: string;
    name: string;
    color?: string;
    active: boolean;
}

interface PopulatedSermon {
    _id: string;
    series?: { _id: string }; // Only need series ID for filtering
}

interface SeriesListProps {
    seriesList: SermonSeries[];
    sermons: PopulatedSermon[]; // Pass sermons to calculate count
    handleToggleSeriesArchive: (seriesId: string, currentActiveState: boolean) => void;
    getSeriesColorClasses: (colorName?: string) => { bg: string; border: string; text: string };
}

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { 
            staggerChildren: 0.06,
            delayChildren: 0.1
        }
    }
};

const listItemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
    }
};

export function SeriesList({
    seriesList,
    sermons,
    handleToggleSeriesArchive,
    getSeriesColorClasses
}: SeriesListProps) {
    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-serif font-medium tracking-tight text-foreground">Manage Series</h2>
                    <p className="mt-1 text-muted-foreground font-light tracking-wide">
                        Organize your sermons into thematic collections
                    </p>
                </div>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button
                        className="rounded-full bg-gradient-to-r from-accent-3/50 to-accent-3/30 text-accent-1/90 hover:bg-gradient-to-r hover:from-accent-3/60 hover:to-accent-3/40 dark:from-accent-3/40 dark:to-accent-3/20 dark:text-accent-1/90 border border-accent-3/40 shadow-sm hover:shadow-md transition-all duration-300"
                    >
                        <Plus className="mr-1 h-4 w-4" />
                        New Series
                    </Button>
                </motion.div>
            </div>
            
            <motion.div 
                className="space-y-3"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {seriesList.length === 0 ? (
                    <motion.div 
                        className="text-center py-12 px-6"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-accent-3/30 to-accent-3/10 mb-4">
                            <Library className="h-5 w-5 text-accent-1" />
                        </div>
                        <p className="text-muted-foreground mt-2 font-light">
                            No series created yet. Create your first series to organize your sermons.
                        </p>
                    </motion.div>
                ) : (
                    seriesList.map((s, index) => {
                        const seriesColors = getSeriesColorClasses(s.color);
                        // Calculate sermon count for this series
                        const sermonCount = sermons.filter(sermon => sermon.series?._id === s._id).length;
                        return (
                            <motion.div
                                key={s._id}
                                variants={listItemVariants}
                                className="group"
                            >
                                <Card className={cn(
                                    "flex items-center justify-between p-4 sm:p-5 gap-3 transition-all duration-300 border-b border-border/20 bg-white/90 dark:bg-[#23201c]/90",
                                    !s.active && "opacity-60 bg-muted/50",
                                    s.active && "hover:shadow-md hover:border-accent-3/20 group-hover:bg-gradient-to-r group-hover:from-card/90 group-hover:to-card/70"
                                )}>
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <span className={cn(
                                            "h-3.5 w-3.5 rounded-full block flex-shrink-0 border shadow-sm",
                                            seriesColors.bg,
                                            seriesColors.border
                                        )}></span>
                                        <span className="font-serif text-lg font-bold truncate" title={s.name}>{s.name}</span>
                                        <motion.span 
                                            className="text-xs text-muted-foreground flex-shrink-0 bg-background/60 px-2 py-0.5 rounded-full ml-2"
                                            whileHover={{ scale: 1.05 }}
                                        > 
                                            {sermonCount} {sermonCount === 1 ? 'sermon' : 'sermons'}
                                        </motion.span>
                                    </div>
                                    <div className="flex items-center flex-shrink-0 gap-2">
                                        {!s.active && (
                                            <Badge 
                                                variant="outline" 
                                                className="text-xs h-fit bg-background/40 border-accent-3/20 font-light px-2 py-0.5 rounded-full"
                                            >
                                                Archived
                                            </Badge>
                                        )}
                                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleToggleSeriesArchive(s._id, s.active)}
                                                title={s.active ? "Archive Series" : "Unarchive Series"}
                                                className="h-8 w-8 p-0 rounded-full hover:bg-accent-3/10 hover:text-accent-1"
                                            >
                                                {s.active ? 
                                                    <Archive className="h-4 w-4" /> : 
                                                    <ArchiveRestore className="h-4 w-4" />
                                                }
                                            </Button>
                                        </motion.div>
                                    </div>
                                </Card>
                            </motion.div>
                        )
                    })
                )}
            </motion.div>
        </div>
    );
} 