'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const isAdminUser = () => {
  return localStorage.getItem('isAdmin') === 'true';
};

export default function Track() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState<number>(3); // Retry up to 3 times

  useEffect(() => {
    if (isAdminUser()) {
      console.log('Admin user detected, skipping location save');
      alert('Admin user detected. Location not saved.');
      router.push('/dashboard');
      return;
    }

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    const getLocation = () => {
      console.log(`Attempting location capture, ${attempts} attempts left`);
      navigator.geolocation.getCurrentPosition(
        async (position: GeolocationPosition) => {
          const { latitude, longitude, accuracy } = position.coords;
          console.log('Captured location:', { latitude, longitude, accuracy });

          // Require accuracy <= 30 meters
          if (accuracy > 30 && attempts > 0) {
            console.log(`Accuracy too low (${accuracy}m), retrying...`);
            setAttempts((prev) => prev - 1);
            setTimeout(getLocation, 1500);
            return;
          }

          if (accuracy > 30) {
            setError('Could not get precise location. Please try outdoors.');
            return;
          }

          try {
            console.log('Sending location to /api/locations');
            const response = await axios.post('/api/locations', {
              latitude,
              longitude,
              accuracy,
            });
            console.log('API response:', response.data);
            alert('Location saved successfully!');
            router.push('/dashboard');
          } catch (error: any) {
            console.error('Save error:', error);
            setError(`Failed to save location: ${error.message}`);
          }
        },
        (error: GeolocationPositionError) => {
          console.error('Geolocation error:', error);
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setError('Please allow location access.');
              break;
            case error.POSITION_UNAVAILABLE:
              setError('Location unavailable. Try moving outdoors.');
              break;
            case error.TIMEOUT:
              setError('Location request timed out. Try again.');
              break;
            default:
              setError('An error occurred. Please try again.');
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 8000, // 8 seconds
          maximumAge: 0, // Fresh data only
        }
      );
    };

    getLocation();
  }, [router, attempts]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {error ? (
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null);
              setAttempts(3);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      ) : (
        <p>Fetching your location...</p>
      )}
    </div>
  );
}