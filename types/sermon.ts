// types/sermon.ts

// Defines a Sermon Series
export interface SermonSeries {
  _id: string; // Use string ID on frontend, corresponds to MongoDB ObjectId
  name: string;
  color?: string; // Optional color identifier (e.g., 'blue', 'green')
  active: boolean; // Whether the series is currently active or archived
  createdAt?: string | Date; // ISO string or Date object
  archivedAt?: string | Date | null; // ISO string, Date object, or null if not archived
}

// Define section types for better organization
export interface SermonSection {
  id: string;
  type: 'introduction' | 'mainPoint' | 'illustration' | 'application' | 'conclusion' | 'custom';
  title: string;
  content: string;
  order: number;
  customType?: string; // Used when type is 'custom'
}

// Add Block interface
export interface Block {
  id: string;
  type: string;
  text?: string;
  level?: number;
  reference?: string;
  items?: string[];
}

// Defines a Sermon, potentially populated with its series information
export interface PopulatedSermon {
  _id: string;
  userId: string; // ID of the user who created the sermon
  title: string;
  // Series should be the full object when populated for list/display views
  series?: SermonSeries;
  date?: string | Date; // ISO string or Date object
  scripture?: string; // e.g., "John 3:16-17"
  notes?: string; // General notes or outline
  inspiration?: string; // Where the idea came from
  progress?: number; // Could represent completion percentage (e.g., 0-100)
  // Display properties derived from series or set individually (consider if needed)
  color?: string; 
  borderColor?: string;
  textColor?: string;
  // Sermon content details using structured sections
  sections?: SermonSection[]; // Organized sections of the sermon
  blocks?: Block[]; // Block-based content structure
  keyPoints?: string[];
  scriptureText?: string; // Full text of the scripture passage
  illustrations?: string[]; // Anecdotes, stories
  practicalApplications?: string[]; // How the message applies to life
  createdAt?: string | Date; // ISO string or Date object
  updatedAt?: string | Date; // ISO string or Date object
}

// Type for the data needed to create/save a sermon (subset of PopulatedSermon)
export type SermonSaveData = Omit<PopulatedSermon, '_id' | 'userId' | 'series' | 'createdAt' | 'updatedAt'> & {
  date?: Date; // Use Date object for input, convert to ISO string before sending API
  seriesId?: string | null; // Use seriesId when saving
};

// Type for the data structure expected by the onSave handler in NewSermonDialog
export interface NewSermonSaveHandlerData {
  sermonData: SermonSaveData;
  seriesId?: string | null;
  newSeriesName?: string;
} 