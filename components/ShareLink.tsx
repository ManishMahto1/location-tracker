import { useState } from 'react';

interface ShareLinkProps {
  link: string;
}

export default function ShareLink({ link }: ShareLinkProps) {
  const [copied, setCopied] = useState<boolean>(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center space-x-2">
      <input
        type="text"
        value={link}
        readOnly
        className="border p-2 rounded w-64"
      />
      <button
        onClick={copyToClipboard}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  );
}