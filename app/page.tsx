'use client';

import { useState } from 'react';
import ShareLink from '../components/ShareLink';

export default function Home() {
  const [link, setLink] = useState<string>('');

  const generateLink = () => {
    const uniqueLink = `${window.location.origin}/track/${Math.random().toString(36).substring(2, 10)}`;
    setLink(uniqueLink);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-6">Location Tracker</h1>
      <button
        onClick={generateLink}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
      >
        Generate Shareable Link
      </button>
      {link && <ShareLink link={link} />}
    </div>
  );
}