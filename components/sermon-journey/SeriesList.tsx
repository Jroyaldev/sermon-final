// components/sermon-journey/SeriesList.tsx
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Archive, ArchiveRestore } from "lucide-react";

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

export function SeriesList({
    seriesList,
    sermons,
    handleToggleSeriesArchive,
    getSeriesColorClasses
}: SeriesListProps) {
    return (
        <div>
            <h2 className="text-2xl font-medium tracking-tight text-foreground mb-4">Manage Series</h2>
            <div className="space-y-3">
                {seriesList.length === 0 ? (
                    <p className="text-center text-muted-foreground mt-8">No series created yet.</p>
                ) : (
                    seriesList.map(s => {
                        const seriesColors = getSeriesColorClasses(s.color);
                        // Calculate sermon count for this series
                        const sermonCount = sermons.filter(sermon => sermon.series?._id === s._id).length;
                        return (
                            <Card key={s._id} className={cn(
                                "flex items-center justify-between p-3 gap-3",
                                !s.active && "opacity-60 bg-muted/50" // Apply styles for inactive series
                            )}>
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                    <span className={cn(
                                        "h-3 w-3 rounded-full block flex-shrink-0 border",
                                        seriesColors.bg,
                                        seriesColors.border
                                    )}></span>
                                    <span className="font-medium truncate" title={s.name}>{s.name}</span>
                                    <span className="text-xs text-muted-foreground flex-shrink-0"> {/* Ensure count doesn't wrap weirdly */}
                                        ({sermonCount} {sermonCount === 1 ? 'sermon' : 'sermons'})
                                    </span>
                                </div>
                                <div className="flex items-center flex-shrink-0 gap-1">
                                    {!s.active && <Badge variant="outline" className="text-xs h-fit">Archived</Badge>}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleToggleSeriesArchive(s._id, s.active)}
                                        title={s.active ? "Archive Series" : "Unarchive Series"}
                                        className="h-8 w-8 p-0"
                                    >
                                        {s.active ? <Archive className="h-4 w-4" /> : <ArchiveRestore className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </Card>
                        )
                    })
                )}
            </div>
        </div>
    );
} 