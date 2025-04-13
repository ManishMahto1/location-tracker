'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { Location } from '../../types';

const Map = dynamic(() => import('../../components/LocationMap'), { ssr: false });

export default function Dashboard() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        console.log('Fetching locations from /api/locations');
        const response = await axios.get<Location[]>('/api/locations');
        console.log('Locations received:', response.data);
        setLocations(response.data);
        setError(null);
      } catch  {
        console.error('Error fetching locations:');
        setError('Failed to load locations. Please try again later.');
      }
    };
    fetchLocations();
  }, []);

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Location Dashboard</h1>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {locations.length === 0 && !error && (
        <p className="text-gray-500 text-center mb-4">No locations available.</p>
      )}
      <Map locations={locations} />
    </div>
  );
}