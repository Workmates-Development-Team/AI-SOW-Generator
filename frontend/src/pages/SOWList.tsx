import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Card, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const SOWList: React.FC = () => {
  const navigate = useNavigate();
  const sows = useQuery(api.sows.getSows);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-white mb-8">Generated SOWs</h1>
      {sows === undefined ? (
        <div className="text-white">Loading SOWs</div>
      ) : sows.length === 0 ? (
        <div className="text-white/70">No SOWs generated yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl">
          {sows.map((sow: any) => (
            <Card
              key={sow._id}
              className="bg-white/10 border-white/20 text-white p-6 cursor-pointer hover:bg-white/20 transition-colors"
              onClick={() => navigate('/presentation', { state: { presentation: { ...sow, totalSlides: sow.slides.length } } })}
            >
              <CardTitle className="mb-2 text-lg font-semibold">{sow.title}</CardTitle>
              <p className="text-sm text-white/80 mb-1">SOW Number: <span className="font-mono">{sow.sowNumber}</span></p>
              <p className="text-sm text-white/60">Client: {sow.clientName}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SOWList;
