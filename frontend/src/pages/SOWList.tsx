import React from 'react';
import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../lib/useAuth';
import { Card, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import type { SOWData } from '@/types/presentation';
import { Button } from '@/components/ui/button';
import BackToGeneratorButton from '@/components/BackToGeneratorButton';
import LogoutButton from '@/components/LogoutButton';
import { FileText } from 'lucide-react';

const SOWList: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [sows, setSows] = useState<SOWData[] | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSows = async () => {
      if (token) {
        try {
          const fetchedSows = await api.sows.getSows(token);
          setSows(
            Array.isArray(fetchedSows)
              ? fetchedSows.map((sow: any) => ({
                  ...sow,
                  slides: Array.isArray(sow.slides) ? sow.slides : [],
                  totalSlides: Array.isArray(sow.slides) ? sow.slides.length : 0,
                }))
              : []
          );
          setError(null);
        } catch (err: any) {
          setError(err?.message || 'Failed to fetch SOWs');
          setSows([]);
        }
      } else {
        setSows([]);
      }
    };
    fetchSows();
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 md:p-8 flex flex-col items-center relative">
      {/* Top Toolbar */}
      <div className="w-full flex justify-center" style={{ position: 'absolute', top: 0, left: 0, zIndex: 20, pointerEvents: 'none' }}>
        <div className="mt-4 max-w-5xl w-full rounded-2xl shadow-lg bg-white/10 backdrop-blur-md border border-white/20 px-6 py-2 flex items-center justify-between relative" style={{ minHeight: 40, fontSize: '0.95rem', pointerEvents: 'auto' }}>
          <div className="flex items-center gap-4">
            <BackToGeneratorButton />
          </div>
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white/80 text-lg font-bold select-none pointer-events-none flex items-center gap-2">
            Generated SOWs
          </span>
          <div className="flex items-center gap-2 ml-auto">
            <LogoutButton />
          </div>
        </div>
      </div>
      {/* Main content below toolbar */}
      <div className="w-full max-w-5xl flex flex-col items-center pt-24">
        {error ? (
          <div className="text-red-400">{error}</div>
        ) : sows === undefined ? (
          <div className="text-white">Loading SOWs</div>
        ) : sows.length === 0 ? (
          <div className="text-white/70">No SOWs generated yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl">
            {sows.map((sow) => (
              <Card
                key={(sow as any)._id || sow.sowNumber || sow.title}
                className="bg-white/10 border-white/20 text-white p-6 cursor-pointer hover:bg-white/20 transition-colors"
                onClick={() =>
                  navigate('/presentation', {
                    state: { presentation: { ...sow, totalSlides: sow.slides.length } },
                  })
                }
              >
                <CardTitle className="mb-2 text-lg font-semibold">{sow.title || 'Untitled SOW'}</CardTitle>
                <p className="text-sm text-white/80 mb-1">
                  SOW Number: <span className="font-mono">{sow.sowNumber || 'N/A'}</span>
                </p>
                <p className="text-sm text-white/60">Client: {sow.clientName || 'N/A'}</p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SOWList;
