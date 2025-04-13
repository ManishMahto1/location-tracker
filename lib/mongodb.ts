import { MongoClient, Db, MongoClientOptions } from 'mongodb';

// Extend the global object type
declare global {
  interface GlobalThis {
    _mongoClientPromise?: Promise<MongoClient>;
  }
}

const uri: string = process.env.MONGODB_URI || '';
const options: MongoClientOptions = {};

if (!uri) {
  throw new Error('Please add MONGODB_URI to .env');
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development, use global to avoid multiple connections
  if (!globalThis._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalThis._mongoClientPromise = client.connect();
  }
  clientPromise = globalThis._mongoClientPromise;
} else {
  // In production, create a new connection
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function connectToDatabase(): Promise<{ db: Db; client: MongoClient }> {
  const client = await clientPromise;
  const db = client.db('locationTracker');
  return { db, client };
}