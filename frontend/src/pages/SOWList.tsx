import { useState, useEffect, useRef } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../lib/useAuth';
import { Card, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import type { SOWData } from '@/types/page';
import { Button } from '@/components/ui/button';
import BackToGeneratorButton from '@/components/BackToGeneratorButton';
import LogoutButton from '@/components/LogoutButton';
import { Trash } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';
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
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [sows, setSows] = useState<SOWData[] | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sowToDelete, setSowToDelete] = useState<any>(null);
  const dialogContentRef = useRef<HTMLDivElement>(null);

  // --- Card sizing refs and state ---
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [maxCardSize, setMaxCardSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  useEffect(() => {
    const fetchSows = async () => {
      if (token) {
        try {
          const fetchedSows = await api.sows.getSows(token);
          console.log('Fetched SOWs:', fetchedSows);
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

  useEffect(() => {
    if (sows && sows.length > 0) {
      setTimeout(() => {
        let maxWidth = 0;
        let maxHeight = 0;
        cardRefs.current.forEach((ref) => {
          if (ref) {
            const rect = ref.getBoundingClientRect();
            if (rect.width > maxWidth) maxWidth = rect.width;
            if (rect.height > maxHeight) maxHeight = rect.height;
          }
        });
        if (maxWidth !== maxCardSize.width || maxHeight !== maxCardSize.height) {
          setMaxCardSize({ width: maxWidth, height: maxHeight });
        }
      }, 0);
    }
  }, [sows]);

  const backgroundClass = theme === 'light' ? 'bg-linear-to-br from-gray-200 via-gray-300 to-gray-200' : 'bg-linear-to-br from-gray-900 via-gray-800 to-gray-900';
  const cardClass = theme === 'light' ? 'bg-white/50 text-gray-800 border-gray-300 backdrop-blur-md' : 'bg-white/10 text-white border-white/20';
  const textClass = theme === 'light' ? 'text-gray-800' : 'text-white/80';

  return (
    <div className={`min-h-screen p-4 md:p-8 flex flex-col items-center relative ${backgroundClass}`}>
      {/* Top Toolbar */}
      <div className="w-full flex justify-center" style={{ position: 'absolute', top: 0, left: 0, zIndex: 20, pointerEvents: 'none' }}>
        <div className={`mt-4 max-w-5xl w-full rounded-2xl shadow-lg backdrop-blur-md px-6 py-2 flex items-center justify-between relative ${cardClass}`} style={{ minHeight: 40, fontSize: '0.95rem', pointerEvents: 'auto' }}>
          <div className="flex items-center gap-4">
            <BackToGeneratorButton />
          </div>
          <span className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-lg font-bold select-none pointer-events-none flex items-center gap-2 ${textClass}`}>
            Generated SOWs
          </span>
          <div className="flex items-center gap-2 ml-auto">
            <ThemeToggle />
            <LogoutButton />
          </div>
        </div>
      </div>
      {/* Main content below toolbar */}
      <div className="w-full max-w-5xl flex flex-col items-center pt-24">
        {error ? (
          <div className="text-red-400">{error}</div>
        ) : sows === undefined ? (
          <div className="min-h-[40vh] flex items-center justify-center w-full">
            <div className="flex flex-col items-center justify-center gap-6 p-10 rounded-2xl shadow-2xl border border-white/20 bg-white/10 backdrop-blur-md">
              <span className="animate-spin text-yellow-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="mx-auto">
                  <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                  <path d="M22 12a10 10 0 0 1-10 10" />
                </svg>
              </span>
              <span className="text-white text-lg font-medium tracking-wide">Loading SOWs...</span>
            </div>
          </div>
        ) : sows.length === 0 ? (
          <div className="text-white/70">No SOWs generated yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl">
            {sows.map((sow, idx) => (
              <div className="relative group" key={(sow as any)._id || sow.sowNumber || sow.title}>
                <Card
                  ref={el => { cardRefs.current[idx] = el; }}
                  style={maxCardSize.width && maxCardSize.height ? { width: maxCardSize.width, height: maxCardSize.height } : {}}
                  className={`${theme === 'light' ? 'bg-white/50 border-gray-300 text-gray-800 hover:bg-gray-100' : 'bg-white/10 border-white/20 text-white hover:bg-white/20'} pt-6 pb-8 px-6 cursor-pointer transition-colors`}
                  onClick={(e) => {
                    // Prevent navigation if delete button or dialog is clicked
                    const target = e.target as HTMLElement;
                    if (
                      target.closest('.delete-btn') ||
                      target.closest('.regenerate-btn') ||
                      (dialogContentRef.current && dialogContentRef.current.contains(target))
                    ) {
                      return;
                    }
                    navigate('/presentation', {
                      state: { presentation: { ...sow, totalSlides: sow.slides.length } },
                    });
                  }}
                >
                  <div className="absolute top-3 left-3 right-3 flex flex-row justify-between items-start z-10 pointer-events-none">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="regenerate-btn opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto bg-transparent border-0 shadow-none hover:bg-transparent focus:bg-transparent focus:ring-0 focus:outline-none text-inherit hover:text-blue-500 focus:text-blue-600"
                      title="Regenerate SOW with same prompt"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (sow.prompt) {
                          sessionStorage.setItem('regeneratePrompt', JSON.stringify(sow.prompt));
                          navigate('/generate?regenerate=1');
                        }
                      }}
                    >
                      ↻
                    </Button>
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
                          className="delete-btn opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto bg-transparent border-0 shadow-none hover:bg-transparent focus:bg-transparent focus:ring-0 focus:outline-none text-inherit hover:text-red-500 focus:text-red-600"
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
                      <AlertDialogContent ref={dialogContentRef}
                        className="shadow-2xl border border-white/20 bg-white/10 backdrop-blur-md p-0 md:p-2 rounded-2xl max-w-md w-full"
                      >
                        <div className="mt-4" />
                        <div className="px-8 pb-8 pt-2">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete SOW?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete <span className="font-bold">{sow.title || 'this SOW'}</span>? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="mt-6 flex flex-row gap-4 justify-end">
                            <AlertDialogCancel
                              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                              onClick={() => {
                                setDeleteDialogOpen(false);
                                setSowToDelete(null);
                              }}
                            >
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-600 hover:bg-red-700 text-white border-0 px-6 py-2 rounded-lg shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 font-semibold"
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
                        </div>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                  <div className="mt-6" />
                  <CardTitle className={`mb-2 text-lg font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{sow.title || 'Untitled SOW'}</CardTitle>
                  <p className={`text-sm mb-1 ${theme === 'light' ? 'text-gray-700' : 'text-white/80'}`}>SOW Number: <span className="font-mono">{sow.sowNumber || 'N/A'}</span></p>
                  <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-white/60'}`}>Client: {sow.clientName || 'N/A'}</p>
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
