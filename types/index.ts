import { ObjectId } from 'mongodb';

export interface Location {
  _id?: ObjectId;
  id?: string;
  latitude: number;
  longitude: number;
  timestamp: Date;
  accuracy?: number;
}