import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
// Import the exported authOptions object
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; 
import clientPromise from '@/lib/mongodb';
import { MongoClient, ObjectId } from 'mongodb';

// Import the series interface (or define it here if not shared)
// Assuming SermonSeries interface is defined elsewhere or copy it here
interface SermonSeries {
  _id: ObjectId;
  name: string;
  color?: string;
  active: boolean;
}

// Define the structure of a Sermon document
interface Sermon {
  _id?: ObjectId;
  userId: string; 
  title: string;
  seriesId?: ObjectId; // Changed from series: string
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

// Define structure for sermon after joining with series
interface PopulatedSermon extends Omit<Sermon, 'seriesId'> {
  series?: SermonSeries; // Populated series data
}

// GET handler to fetch sermons for the logged-in user, populating series info
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions); 
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const client: MongoClient = await clientPromise;
    const db = client.db('sermon_flow_app');
    const sermonsCollection = db.collection<Sermon>('sermons');

    // Use aggregation pipeline to join with sermon_series
    const sermons = await sermonsCollection.aggregate<PopulatedSermon>([
      {
        $match: { userId: session.user.id } // Filter by user ID
      },
      {
        $lookup: {
          from: 'sermon_series', // The collection to join with
          localField: 'seriesId', // Field from the sermons collection
          foreignField: '_id', // Field from the sermon_series collection
          as: 'seriesInfo' // Output array field name
        }
      },
      {
        $unwind: {
          path: '$seriesInfo', // Deconstructs the array
          preserveNullAndEmptyArrays: true // Keep sermons even if they don't have a seriesId or the series doesn't exist
        }
      },
      {
        $addFields: {
            // Promote the single object from the array to a field
           series: '$seriesInfo'
        }
      },
      {
          $project: {
              seriesInfo: 0, // Remove the temporary array field
              // Optionally project only needed series fields: 
              // 'series.name': 1, 'series.color': 1, 'series._id': 1
          }
      },
      {
        $sort: { createdAt: -1 } // Sort by creation date
      }
    ]).toArray();

    return NextResponse.json(sermons, { status: 200 });

  } catch (error) {
    console.error('Error fetching sermons with series:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// POST handler to create a new sermon
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions); 
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Expect seriesId (optional) in the body now
    const { seriesId, ...sermonData }: Omit<Sermon, '_id' | 'userId' | 'createdAt' | 'updatedAt'> & { seriesId?: string } = await req.json();

    if (!sermonData.title) {
      return NextResponse.json({ message: 'Missing required field: title' }, { status: 400 });
    }
    
    let validSeriesId: ObjectId | undefined = undefined;
    if (seriesId) {
        if (ObjectId.isValid(seriesId)) {
            validSeriesId = new ObjectId(seriesId);
            // Optional: Verify the seriesId belongs to the user? 
            // Could add a check here against the sermon_series collection
        } else {
            return NextResponse.json({ message: 'Invalid seriesId format provided' }, { status: 400 });
        }
    }

    const client: MongoClient = await clientPromise;
    const db = client.db('sermon_flow_app');
    const sermonsCollection = db.collection<Sermon>('sermons');

    const newSermon: Omit<Sermon, '_id'> = {
      ...sermonData,
      userId: session.user.id, 
      ...(validSeriesId && { seriesId: validSeriesId }), // Conditionally add seriesId
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await sermonsCollection.insertOne(newSermon);
    
    // Optionally fetch the newly created sermon with populated data to return
    const createdSermon = await sermonsCollection.aggregate<PopulatedSermon>([
      { $match: { _id: result.insertedId } },
      { $lookup: { from: 'sermon_series', localField: 'seriesId', foreignField: '_id', as: 'seriesInfo' } },
      { $unwind: { path: '$seriesInfo', preserveNullAndEmptyArrays: true } },
      { $addFields: { series: '$seriesInfo' } },
      { $project: { seriesInfo: 0 } }
    ]).next(); // Get the single result

    return NextResponse.json(createdSermon, { status: 201 });

  } catch (error) {
    console.error('Error creating sermon:', error);
    if (error instanceof SyntaxError) {
       return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
} 