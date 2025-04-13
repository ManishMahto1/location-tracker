import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { Location } from '../../../types';

interface ExtendedLocation extends Location {
  accuracy?: number;
}

export async function POST(request: Request) {
  console.log('POST /api/locations called');
  try {
    const { latitude, longitude, accuracy }: { latitude: number; longitude: number; accuracy?: number } = await request.json();
    console.log('Received:', { latitude, longitude, accuracy });

    if (!latitude || !longitude) {
      return NextResponse.json({ error: 'Missing coordinates' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const location: ExtendedLocation = {
      latitude,
      longitude,
      timestamp: new Date(),
      ...(accuracy && { accuracy }),
    };

    const result = await db.collection('locations').insertOne(location);
    console.log('Insert result:', result);

    return NextResponse.json({ ...location, id: result.insertedId.toString() }, { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ error: 'Failed to save location' }, { status: 500 });
  }
}

export async function GET() {
  console.log('GET /api/locations called');
  try {
    const { db } = await connectToDatabase();
    const locations = (await db.collection('locations').find({}).toArray()) as ExtendedLocation[];

    const formattedLocations = locations.map((loc) => ({
      ...loc,
      id: (loc._id as ObjectId).toString(),
      _id: undefined,
    }));

    console.log('Locations fetched:', formattedLocations);
    return NextResponse.json(formattedLocations);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch locations' }, { status: 500 });
  }
}