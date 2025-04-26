"use client"

import { useState, useEffect, useCallback } from "react"
import {
  BookOpen,
  Calendar,
  ChevronDown,
  Edit3,
  Feather,
  Heart,
  Lightbulb,
  Menu,
  MessageSquare,
  Mic,
  Plus,
  Search,
  Sparkles,
  Users,
  LayoutDashboard,
  Archive,
  ArchiveRestore,
  Circle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { DatePicker } from "@/components/date-picker"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

// Import newly created components
import { SidebarNav } from "@/components/sermon-journey/SidebarNav";
import { JourneyHeader } from "@/components/sermon-journey/JourneyHeader";
import { JourneyTabs } from "@/components/sermon-journey/JourneyTabs";
// import { RightSidebar } from "@/components/sermon-journey/RightSidebar"; // Removed import
import { NewSermonDialog } from "@/components/sermon-journey/NewSermonDialog";

// Assuming Sermon interface matches the one in api/sermons/route.ts
// If not, define or import it here
interface SermonSeries {
  _id: string; // Use string ID on frontend
  name: string;
  color?: string;
  active: boolean;
  createdAt?: string | Date;
  archivedAt?: string | Date | null;
}

// Updated Sermon interface to match populated data from API
interface PopulatedSermon {
  _id: string;
  userId: string;
  title: string;
  series?: SermonSeries; // Populated series data
  date?: string | Date;
  scripture?: string;
  notes?: string;
  inspiration?: string;
  progress?: number;
  color?: string;
  borderColor?: string;
  textColor?: string;
  keyPoints?: string[];
  scriptureText?: string;
  illustrations?: string[];
  practicalApplications?: string[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

// --- Helper Function for Series Color ---
const tailwindColorMap: { [key: string]: { bg: string; border: string; text: string } } = {
  gray: { bg: 'bg-gray-100', border: 'border-gray-300', text: 'text-gray-700' },
  red: { bg: 'bg-red-100', border: 'border-red-300', text: 'text-red-700' },
  orange: { bg: 'bg-orange-100', border: 'border-orange-300', text: 'text-orange-700' },
  amber: { bg: 'bg-amber-100', border: 'border-amber-300', text: 'text-amber-700' },
  yellow: { bg: 'bg-yellow-100', border: 'border-yellow-300', text: 'text-yellow-700' },
  lime: { bg: 'bg-lime-100', border: 'border-lime-300', text: 'text-lime-700' },
  green: { bg: 'bg-green-100', border: 'border-green-300', text: 'text-green-700' },
  emerald: { bg: 'bg-emerald-100', border: 'border-emerald-300', text: 'text-emerald-700' },
  teal: { bg: 'bg-teal-100', border: 'border-teal-300', text: 'text-teal-700' },
  cyan: { bg: 'bg-cyan-100', border: 'border-cyan-300', text: 'text-cyan-700' },
  sky: { bg: 'bg-sky-100', border: 'border-sky-300', text: 'text-sky-700' },
  blue: { bg: 'bg-blue-100', border: 'border-blue-300', text: 'text-blue-700' },
  indigo: { bg: 'bg-indigo-100', border: 'border-indigo-300', text: 'text-indigo-700' },
  violet: { bg: 'bg-violet-100', border: 'border-violet-300', text: 'text-violet-700' },
  purple: { bg: 'bg-purple-100', border: 'border-purple-300', text: 'text-purple-700' },
  fuchsia: { bg: 'bg-fuchsia-100', border: 'border-fuchsia-300', text: 'text-fuchsia-700' },
  pink: { bg: 'bg-pink-100', border: 'border-pink-300', text: 'text-pink-700' },
  rose: { bg: 'bg-rose-100', border: 'border-rose-300', text: 'text-rose-700' },
};

const getSeriesColorClasses = (colorName?: string) => {
  return tailwindColorMap[colorName || 'gray'] || tailwindColorMap.gray;
};

export default function SermonJourney() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [sermons, setSermons] = useState<PopulatedSermon[]>([]);
  const [seriesList, setSeriesList] = useState<SermonSeries[]>([]); // All series for management tab
  const [activeSeriesList, setActiveSeriesList] = useState<SermonSeries[]>([]); // Active series for dropdown
  const [isLoadingSermons, setIsLoadingSermons] = useState(true);
  const [isLoadingSeries, setIsLoadingSeries] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("journey");
  const [expandedSermon, setExpandedSermon] = useState<string | null>(null);
  const [newMessageOpen, setNewMessageOpen] = useState(false);

  const fetchSermons = useCallback(async () => {
    if (status === 'authenticated') {
      setIsLoadingSermons(true);
      setError(null);
      try {
        const response = await fetch('/api/sermons');
        if (!response.ok) throw new Error(`Sermons Fetch Error: ${response.statusText} (${response.status})`);
        // Check if response is empty or not JSON
        const text = await response.text();
        if (!text) {
          setSermons([]); // Handle empty response
          return;
        }
        const data: PopulatedSermon[] = JSON.parse(text); // Parse after checking
        setSermons(data);
      } catch (err: any) {
        console.error("Fetch Sermons Error:", err);
        setError(err.message || 'Could not load sermons.');
        setSermons([]); // Reset sermons on error
      } finally {
        setIsLoadingSermons(false);
      }
    } else {
      // If not authenticated, clear sermons and don't attempt fetch
      setSermons([]);
      setIsLoadingSermons(false);
    }
  }, [status]);

  const fetchSeries = useCallback(async (fetchActiveOnly = false) => {
    if (status === 'authenticated') {
      setIsLoadingSeries(true);
      // Don't reset error here if sermons failed, keep the first error
      try {
        const url = fetchActiveOnly ? '/api/series?active=true' : '/api/series';
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Series Fetch Error: ${response.statusText} (${response.status})`);
        const text = await response.text();
        if (!text) {
           if (fetchActiveOnly) setActiveSeriesList([]);
           else setSeriesList([]);
           return;
        }
        const data: SermonSeries[] = JSON.parse(text);
        if (fetchActiveOnly) {
          setActiveSeriesList(data);
        } else {
          setSeriesList(data);
        }
      } catch (err: any) {
        console.error("Fetch Series Error:", err);
        // Only set error if there isn't one already from fetching sermons
        if (!error) setError(err.message || 'Could not load series.');
        if (fetchActiveOnly) setActiveSeriesList([]);
        else setSeriesList([]);
      } finally {
        setIsLoadingSeries(false);
      }
    } else {
       // If not authenticated, clear series lists
       setActiveSeriesList([]);
       setSeriesList([]);
       setIsLoadingSeries(false);
    }
  }, [status, error]); // Add error to dependency array

  useEffect(() => {
    if (status === 'authenticated') {
      // Reset error before fetching
       setError(null);
      fetchSermons();
      fetchSeries(true); // Fetch active series for dropdown
      fetchSeries(false); // Fetch all series for management tab
    } else if (status === 'unauthenticated') {
       // Clear data if user logs out
       setSermons([]);
       setSeriesList([]);
       setActiveSeriesList([]);
       setError(null);
    }
  }, [status, fetchSermons, fetchSeries]); // Dependencies are correct

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin'); // Redirect to signin if not logged in
    }
  }, [status, router]);

  useEffect(() => {
    // Open dialog if 'new=true' query param exists
    if (searchParams.get('new') === 'true') {
      setNewMessageOpen(true);
      // Optional: remove the query param after opening
      // router.replace('/sermon-journey', undefined); // Using replace to avoid history entry
    }
  }, [searchParams, router]); // Add router dependency

  const handleSaveSermon = async (data: { sermonData: Omit<PopulatedSermon, '_id' | 'userId' | 'series' | 'createdAt' | 'updatedAt'> & { date?: Date | undefined }; seriesId?: string | null; newSeriesName?: string }) => {
    const { sermonData, seriesId, newSeriesName } = data;
    let finalSeriesId: string | undefined = seriesId || undefined;
    let createdNewSeries = false;

    // 1. Create New Series if requested
    if (newSeriesName && !seriesId) { // Ensure it's the "create new" case
      try {
        const seriesRes = await fetch('/api/series', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newSeriesName /* TODO: Add color selection later */ }),
        });
        if (!seriesRes.ok) {
          const errData = await seriesRes.json().catch(() => ({ message: 'Failed to parse series creation error' }));
          throw new Error(errData.message || 'Failed to create new series');
        }
        const newSeries: SermonSeries = await seriesRes.json();
        finalSeriesId = newSeries._id;
        createdNewSeries = true; // Mark that we created a series
      } catch (err: any) {
        console.error("Error creating series inline:", err);
        alert(`Error creating series: ${err.message}`);
        return false; // Stop if series creation failed
      }
    }

    // 2. Save the Sermon
    try {
      // Ensure date is ISO string if present
      const payload = {
        ...sermonData,
        ...(finalSeriesId && { seriesId: finalSeriesId }),
        date: sermonData.date ? sermonData.date.toISOString() : undefined
      };

      const response = await fetch('/api/sermons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to parse sermon save error' }));
        throw new Error(errorData.message || 'Failed to save sermon');
      }

      // 3. Refetch data & close dialog ONLY on success
      setNewMessageOpen(false); // Close dialog
      fetchSermons(); // Refetch sermons to show the new one

      // Refetch series lists if a new series was created
      if (createdNewSeries) {
        fetchSeries(true); // Refresh active list
        fetchSeries(false); // Refresh all list
      }

      return true; // Indicate success
    } catch (err: any) {
      console.error("Error saving sermon:", err);
      alert(`Error saving sermon: ${err.message}`);
      return false; // Indicate failure
    }
  };

  const handleToggleSeriesArchive = async (seriesId: string, currentActiveState: boolean) => {
    try {
      const response = await fetch('/api/series', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seriesId: seriesId, active: !currentActiveState }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to parse series update error' }));
        throw new Error(errorData.message || 'Failed to update series status');
      }
      // Refetch both series lists to update state everywhere
      fetchSeries(true);
      fetchSeries(false);
      // Also refetch sermons in case the series color/info changed display
      fetchSermons();
    } catch (err: any) {
      console.error("Error archiving/unarchiving series:", err);
      alert(`Error: ${err.message}`);
    }
  };

  const toggleExpandSermon = (id: string) => {
    setExpandedSermon(expandedSermon === id ? null : id);
  };

  // Loading and error states
  const isLoading = status === 'loading' || isLoadingSermons || isLoadingSeries;

  if (isLoading) {
    // Consistent Loading UI
    return <div className="flex min-h-screen items-center justify-center"><p>Loading Sermon Flow...</p></div>;
  }

  // Display error prominently if exists
  if (error) {
    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <div className="text-center">
                <p className="text-red-600 font-semibold">Error Loading Data</p>
                <p className="text-red-500 mt-1">{error}</p>
                <button
                    onClick={() => {
                         setError(null); // Clear error
                         // Re-attempt fetch if authenticated
                         if (status === 'authenticated') {
                            fetchSermons();
                            fetchSeries(true);
                            fetchSeries(false);
                         }
                    }}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                 >
                     Retry
                </button>
            </div>
        </div>
    );
  }

  // Should be handled by useEffect redirect, but good as a fallback
  if (status !== 'authenticated') {
    return <div className="flex min-h-screen items-center justify-center"><p>Redirecting to sign in...</p></div>;
  }

  // Main component structure using imported components
  return (
    <div className="flex h-screen w-full bg-[#f9f8f6] dark:bg-[#1d1a17]">
      {/* Sidebar Navigation */}
      <SidebarNav activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <JourneyHeader activeTab={activeTab} session={session} />

        <div className="flex flex-1 overflow-hidden">
          {/* Main Content Area with Tabs */}
          <main className="flex-1 p-6 md:p-8 overflow-y-auto">
             {/* Conditionally render JourneyTabs or other content based on activeTab */}
             { (activeTab === "journey" || activeTab === "series") ? (
                 <JourneyTabs
                    activeTab={activeTab}
                    setActiveTab={setActiveTab} // Pass setter to allow tabs to change parent state
                    sermons={sermons}
                    seriesList={seriesList} // Pass all series for the "Series" tab
                    expandedSermon={expandedSermon}
                    toggleExpandSermon={toggleExpandSermon}
                    handleToggleSeriesArchive={handleToggleSeriesArchive}
                    getSeriesColorClasses={getSeriesColorClasses} // Pass the helper function
                    setNewMessageOpen={setNewMessageOpen} // Pass setter to open dialog
                    router={router} // Pass the router object down
                 />
             ) : (
                 // Placeholder for other tab content (Inspiration, Congregation, etc.)
                 <div className="mt-4">
                    <h2 className="text-2xl font-medium tracking-tight text-foreground mb-4">
                      {/* Dynamically show title based on activeTab */}
                      { activeTab === "inspiration" && "Inspiration Garden" }
                      { activeTab === "congregation" && "Congregation Insights" }
                      { activeTab === "delivery" && "Delivery Preparation" }
                      { activeTab === "reflection" && "Reflection & Impact" }
                    </h2>
                    <p className="text-muted-foreground">Content for {activeTab} will go here.</p>
                 </div>
             )}
          </main>

          {/* Right Sidebar */}
          {/* <RightSidebar /> */}
        </div>
      </div>

      {/* New Sermon Dialog */}
      <NewSermonDialog
        isOpen={newMessageOpen}
        setIsOpen={setNewMessageOpen}
        onSave={handleSaveSermon}
        activeSeries={activeSeriesList} // Pass only active series for the dropdown
      />
    </div>
  );
}
