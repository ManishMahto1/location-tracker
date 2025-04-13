import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI ;
const options = {};

if (!uri) {
  throw new Error('Please add MONGODB_URI to .env');
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development, use global to avoid multiple connections
  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(uri, options);
    (global as any)._mongoClientPromise = client.connect();
  }
  clientPromise = (global as any)._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function connectToDatabase(): Promise<{ db: Db; client: MongoClient }> {
  const client = await clientPromise;
  const db = client.db('locationTracker');
  return { db, client };
}