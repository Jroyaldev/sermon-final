import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import clientPromise from '@/lib/mongodb';
import { MongoClient, ObjectId } from 'mongodb';

interface SermonSeries {
  _id?: ObjectId;
  userId: string;
  name: string;
  color?: string; // Optional color for UI tagging
  active: boolean;
  createdAt: Date;
  archivedAt?: Date | null;
}

// GET: Fetch series for the user (filter by active status)
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const activeFilter = searchParams.get('active'); // Check for 'true' or 'false'

  const query: { userId: string; active?: boolean } = { userId: session.user.id };
  if (activeFilter === 'true') {
    query.active = true;
  } else if (activeFilter === 'false') {
    query.active = false;
  }
  // If no filter, fetch all (active and inactive)

  try {
    const client: MongoClient = await clientPromise;
    const db = client.db('sermon_flow_app');
    const seriesCollection = db.collection<SermonSeries>('sermon_series');

    const series = await seriesCollection.find(query).sort({ createdAt: -1 }).toArray();
    return NextResponse.json(series, { status: 200 });
  } catch (error) {
    console.error('Error fetching series:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Create a new series
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Type for data expected from the client
    const { name, color }: { name: string; color?: string } = await req.json();

    if (!name) {
      return NextResponse.json({ message: 'Missing required field: name' }, { status: 400 });
    }

    const client: MongoClient = await clientPromise;
    const db = client.db('sermon_flow_app');
    const seriesCollection = db.collection<SermonSeries>('sermon_series');

    const newSeries: Omit<SermonSeries, '_id'> = {
      userId: session.user.id,
      name,
      color: color || 'gray', // Default color if not provided
      active: true,
      createdAt: new Date(),
      archivedAt: null,
    };

    const result = await seriesCollection.insertOne(newSeries);
    // Return the full new series object including the generated _id
    const createdSeries = await seriesCollection.findOne({ _id: result.insertedId });

    return NextResponse.json(createdSeries, { status: 201 });

  } catch (error) {
    console.error('Error creating series:', error);
    if (error instanceof SyntaxError) {
       return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// PATCH: Archive or Unarchive a series
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { seriesId, active }: { seriesId: string; active: boolean } = await req.json();

    if (!seriesId || typeof active !== 'boolean') {
      return NextResponse.json({ message: 'Missing required fields: seriesId (string), active (boolean)' }, { status: 400 });
    }

    if (!ObjectId.isValid(seriesId)) {
        return NextResponse.json({ message: 'Invalid seriesId format' }, { status: 400 });
    }

    const client: MongoClient = await clientPromise;
    const db = client.db('sermon_flow_app');
    const seriesCollection = db.collection<SermonSeries>('sermon_series');

    const updateResult = await seriesCollection.updateOne(
      { _id: new ObjectId(seriesId), userId: session.user.id }, // Ensure user owns the series
      {
        $set: {
          active: active,
          archivedAt: active ? null : new Date(), // Set archive date if becoming inactive
          updatedAt: new Date() // Add an updatedAt field if desired
        }
      }
    );

    if (updateResult.matchedCount === 0) {
      return NextResponse.json({ message: 'Series not found or user unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ message: `Series ${active ? 'unarchived' : 'archived'} successfully` }, { status: 200 });

  } catch (error) {
    console.error('Error updating series:', error);
     if (error instanceof SyntaxError) {
       return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
} 