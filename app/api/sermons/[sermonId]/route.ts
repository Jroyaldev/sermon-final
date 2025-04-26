import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // Adjust path if needed
import clientPromise from '@/lib/mongodb'; // Corrected default import
import { MongoClient, ObjectId } from 'mongodb'; // Import MongoClient and ObjectId

// --- Interfaces (Copied from app/api/sermons/route.ts - Consider centralizing in types/sermon.ts) ---
// Ensure SermonSeries matches definition used elsewhere
interface SermonSeries {
  _id: ObjectId;
  name: string;
  color?: string;
  active: boolean;
}
// Base Sermon structure (using native driver)
interface Sermon {
  _id?: ObjectId;
  userId: string; 
  title: string;
  seriesId?: ObjectId; 
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
  createdAt?: Date;
  updatedAt?: Date;
}
// Structure after joining with series
interface PopulatedSermon extends Omit<Sermon, 'seriesId'> {
  series?: SermonSeries; // Populated series data
}
// --- End Interfaces ---

// Extend the Session type if needed to include user ID (string expected from session)
interface SessionWithId {
    user?: { 
        id?: string | null; 
        name?: string | null; 
        email?: string | null; 
        image?: string | null; 
    } | null;
    expires: string;
}

export async function GET(
    request: Request, 
    { params }: { params: { sermonId: string } }
) {
    const session: SessionWithId | null = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id; // This should be a string from the session callback
    const sermonId = params.sermonId;

    if (!ObjectId.isValid(sermonId)) {
         return NextResponse.json({ message: 'Invalid Sermon ID format' }, { status: 400 });
    }

    try {
        // Get MongoDB client
        const client: MongoClient = await clientPromise;
        const db = client.db('sermon_flow_app'); // Use your actual DB name
        const sermonsCollection = db.collection<Sermon>('sermons');

        // Use aggregation to find the sermon by ID, ensure it belongs to the user, and populate series
        const sermon = await sermonsCollection.aggregate<PopulatedSermon>([
            {
                $match: {
                    _id: new ObjectId(sermonId),
                    userId: userId // Match userId directly (assuming it's stored as string)
                    // If userId is stored as ObjectId in DB: userId: new ObjectId(userId)
                }
            },
            {
                $lookup: {
                  from: 'sermon_series', 
                  localField: 'seriesId',
                  foreignField: '_id',
                  as: 'seriesInfo'
                }
            },
            {
                $unwind: {
                  path: '$seriesInfo',
                  preserveNullAndEmptyArrays: true 
                }
            },
            {
                $addFields: {
                   series: '$seriesInfo'
                }
            },
            {
                $project: {
                    seriesInfo: 0 
                }
            }
        ]).next(); // Get the single result or null

        if (!sermon) {
            return NextResponse.json({ message: 'Sermon not found or access denied' }, { status: 404 });
        }

        // Return found sermon (potentially populated)
        return NextResponse.json(sermon, { status: 200 });

    } catch (error: any) {
        console.error('[GET_SERMON_BY_ID] Database Error:', error);
        return NextResponse.json({ message: `Internal Server Error: ${error.message}` }, { status: 500 });
    }
}

// --- PATCH Handler for Updates ---
export async function PATCH(
    request: Request, 
    { params }: { params: { sermonId: string } }
) {
    const session: SessionWithId | null = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;
    const sermonId = params.sermonId;

    if (!ObjectId.isValid(sermonId)) {
         return NextResponse.json({ message: 'Invalid Sermon ID format' }, { status: 400 });
    }

    try {
        // Parse the request body
        const updates = await request.json();
        // Valid fields that can be updated
        const validUpdateFields = [
            'title', 'scripture', 'notes', 'date', 'seriesId', 
            'inspiration', 'progress', 'keyPoints', 'scriptureText',
            'illustrations', 'practicalApplications', 'color', 
            'borderColor', 'textColor', 'sections'
        ];

        // Filter out any fields not in the valid update fields list
        const sanitizedUpdates: any = {};
        Object.keys(updates).forEach(key => {
            if (validUpdateFields.includes(key)) {
                sanitizedUpdates[key] = updates[key];
            }
        });

        // Add updatedAt timestamp
        sanitizedUpdates.updatedAt = new Date();
        
        // Handle seriesId conversion if it exists
        if (sanitizedUpdates.seriesId) {
            try {
                sanitizedUpdates.seriesId = new ObjectId(sanitizedUpdates.seriesId);
            } catch (error) {
                return NextResponse.json({ message: 'Invalid Series ID format' }, { status: 400 });
            }
        }

        // Get MongoDB client
        const client: MongoClient = await clientPromise;
        const db = client.db('sermon_flow_app');
        const sermonsCollection = db.collection<Sermon>('sermons');

        // Update the sermon document
        const result = await sermonsCollection.findOneAndUpdate(
            { 
                _id: new ObjectId(sermonId),
                userId // Ensure the sermon belongs to the current user
            },
            { $set: sanitizedUpdates },
            { returnDocument: 'after' } // Return the updated document
        );

        // Check if sermon was found and updated
        if (!result) {
            return NextResponse.json({ message: 'Sermon not found or you do not have permission to edit it' }, { status: 404 });
        }

        // Convert the MongoDB _id to string for response
        const updatedSermon = {
            ...result,
            _id: result._id.toString(),
        };

        // If seriesId exists, fetch and populate series information
        if (result.seriesId) {
            const seriesCollection = db.collection<SermonSeries>('sermon_series');
            const series = await seriesCollection.findOne({ _id: result.seriesId });
            
            if (series) {
                const populatedSermon = {
                    ...updatedSermon,
                    series: {
                        ...series,
                        _id: series._id.toString()
                    }
                } as PopulatedSermon;
                
                // Create a new object without seriesId
                const { seriesId, ...sermonWithoutSeriesId } = updatedSermon;
                return NextResponse.json({...sermonWithoutSeriesId, series: populatedSermon.series});
            }
        }

        // Return the updated sermon without series info
        return NextResponse.json(updatedSermon);
    } catch (error) {
        console.error('Error updating sermon:', error);
        return NextResponse.json({ message: 'Failed to update sermon' }, { status: 500 });
    }
}

// TODO: Implement DELETE for deleting the sermon
// export async function DELETE(...) { ... } 