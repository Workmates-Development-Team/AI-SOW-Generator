import { useState, useEffect, useRef } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../lib/useAuth';
import { Card, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import type { SOWData } from '@/types/presentation';
import { Button } from '@/components/ui/button';
import BackToGeneratorButton from '@/components/BackToGeneratorButton';
import LogoutButton from '@/components/LogoutButton';
import { Trash } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';

const SOWList: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [sows, setSows] = useState<SOWData[] | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sowToDelete, setSowToDelete] = useState<any>(null);
  const dialogContentRef = useRef<HTMLDivElement>(null);

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
              <div className="relative group" key={(sow as any)._id || sow.sowNumber || sow.title}>
                <Card
                  className="bg-white/10 border-white/20 text-white p-6 cursor-pointer hover:bg-white/20 transition-colors"
                  onClick={(e) => {
                    // Prevent navigation if delete button or dialog is clicked
                    const target = e.target as HTMLElement;
                    if (
                      target.closest('.delete-btn') ||
                      (dialogContentRef.current && dialogContentRef.current.contains(target))
                    ) {
                      return;
                    }
                    navigate('/presentation', {
                      state: { presentation: { ...sow, totalSlides: sow.slides.length } },
                    });
                  }}
                >
                  <AlertDialog open={deleteDialogOpen && sowToDelete?._id === (sow as any)._id} onOpenChange={(open) => {
                    if (!open) {
                      setDeleteDialogOpen(false);
                      setSowToDelete(null);
                    }
                  }}>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="delete-btn absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        title="Delete SOW"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSowToDelete(sow);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent ref={dialogContentRef}>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete SOW?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete <span className="font-bold">{sow.title || 'this SOW'}</span>? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => {
                          setDeleteDialogOpen(false);
                          setSowToDelete(null);
                        }}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-destructive text-white hover:bg-destructive/90"
                          onClick={async (e) => {
                            e.preventDefault();
                            if (!token || !sowToDelete) return;
                            try {
                              await api.sows.deleteSow((sowToDelete as any)._id, token);
                              setSows((prev) => prev ? prev.filter((s) => (s as any)._id !== (sowToDelete as any)._id) : prev);
                              setDeleteDialogOpen(false);
                              setSowToDelete(null);
                            } catch (err: any) {
                              setError(err?.message || 'Failed to delete SOW');
                            }
                          }}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <CardTitle className="mb-2 text-lg font-semibold">{sow.title || 'Untitled SOW'}</CardTitle>
                  <p className="text-sm text-white/80 mb-1">
                    SOW Number: <span className="font-mono">{sow.sowNumber || 'N/A'}</span>
                  </p>
                  <p className="text-sm text-white/60">Client: {sow.clientName || 'N/A'}</p>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SOWList;
