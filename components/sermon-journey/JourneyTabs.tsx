import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JourneyList } from "./JourneyList";
import { SeriesList } from "./SeriesList";
import { PopulatedSermon, SermonSeries } from "@/types/sermon"; // Import types
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"; // Import router type

// Remove local interface definitions
// interface SermonSeries { ... }
// interface PopulatedSermon { ... }

interface JourneyTabsProps {
    activeTab: string;
    setActiveTab: (tabId: string) => void;
    sermons: PopulatedSermon[];
    seriesList: SermonSeries[]; // Use imported type
    expandedSermon: string | null;
    toggleExpandSermon: (id: string) => void;
    handleToggleSeriesArchive: (seriesId: string, currentActiveState: boolean) => void;
    getSeriesColorClasses: (colorName?: string) => { bg: string; border: string; text: string };
    setNewMessageOpen: (open: boolean) => void;
    router: AppRouterInstance; // Add router prop type
}

export function JourneyTabs({
    activeTab,
    setActiveTab,
    sermons,
    seriesList,
    expandedSermon,
    toggleExpandSermon,
    handleToggleSeriesArchive,
    getSeriesColorClasses,
    setNewMessageOpen,
    router // Destructure router prop
}: JourneyTabsProps) {

    // Determine which tab is currently selected for the Tabs component
    // The activeTab prop controls the overall view (journey, inspiration, etc.)
    // We need a local state or logic to determine if 'journey' or 'series' sub-tab is active
    // For now, let's assume the parent `activeTab` passed corresponds to the main sections,
    // and we introduce a new state here OR modify the parent to handle sub-tabs if needed.
    // Simplest approach: Use the parent's activeTab if it distinguishes between journey/series,
    // or default to 'journey' if activeTab is something else like 'inspiration'.

    const currentSubTab = (activeTab === "journey" || activeTab === "series") ? activeTab : "journey";

    const handleTabChange = (value: string) => {
        // Update the main activeTab state in the parent page
        // This assumes setActiveTab can handle both main nav items and these sub-tabs
        setActiveTab(value);
    }


    return (
        <Tabs value={currentSubTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="mb-4">
                {/* These triggers will now update the parent's activeTab state */}
                <TabsTrigger value="journey">Journey</TabsTrigger>
                <TabsTrigger value="series">Series</TabsTrigger>
            </TabsList>

            <TabsContent value="journey" className="mt-0">
                <JourneyList
                    sermons={sermons}
                    expandedSermon={expandedSermon}
                    toggleExpandSermon={toggleExpandSermon}
                    getSeriesColorClasses={getSeriesColorClasses}
                    setNewMessageOpen={setNewMessageOpen}
                    router={router} // Pass router down to JourneyList
                />
            </TabsContent>

            <TabsContent value="series" className="mt-0">
                <SeriesList
                    seriesList={seriesList}
                    sermons={sermons}
                    handleToggleSeriesArchive={handleToggleSeriesArchive}
                    getSeriesColorClasses={getSeriesColorClasses}
                />
            </TabsContent>
        </Tabs>
    );
} 