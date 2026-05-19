'use client';

import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

type MediaItem = { url: string; type: 'image' | 'video' };

type Project = {
  id: string;
  title: string;
  category: string;
  year: number;
  location: string;
  description: string;
  cover_image: string;
  media: MediaItem[];
};

export default function ProjectPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();

  const [project, setProject] = useState<Project | null>(null);
  const [allMedia, setAllMedia] = useState<MediaItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [infoOpen, setInfoOpen] = useState(false);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (data) {
        setProject(data);

        const cover = data.cover_image
          ? [{ url: data.cover_image, type: 'image' as const }]
          : [];

        const media = Array.isArray(data.media) ? data.media : [];

        setAllMedia([...cover, ...media]);
      }
    }

    load();
  }, [id]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!project) {
    return (
      <div className="fixed inset-0 bg-[#080808] flex items-center justify-center">
        <span className="text-white/20 text-xs tracking-widest uppercase animate-pulse">
          Loading...
        </span>
      </div>
    );
  }

  const current = allMedia[currentIndex];

  const navigate = (dir: number) => {
    setDirection(dir);

    setCurrentIndex((prev) => {
      if (dir === 1) {
        return prev === allMedia.length - 1 ? 0 : prev + 1;
      }

      return prev === 0 ? allMedia.length - 1 : prev - 1;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 bg-black z-[100]"
    >
      {/* IMAGE */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={{
            enter: (d) => ({
              x: d > 0 ? '60%' : '-60%',
              opacity: 0,
            }),
            center: {
              x: 0,
              opacity: 1,
            },
            exit: (d) => ({
              x: d > 0 ? '-60%' : '60%',
              opacity: 0,
            }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            duration: 1.05,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="absolute inset-0"
        >
          {current?.type === 'video' ? (
            <video
              src={current.url}
              autoPlay
              muted
              loop
              className={`w-full h-full object-cover transition-all duration-700 ${
                infoOpen ? 'blur-md scale-105' : 'blur-0 scale-100'
              }`}
            />
          ) : (
            <img
              src={current?.url}
              alt={project.title}
              className={`w-full h-full object-cover transition-all duration-700 ${
                infoOpen ? 'blur-md scale-105' : 'blur-0 scale-100'
              }`}
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30" />

          <motion.div
            animate={{ opacity: infoOpen ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-black/40"
          />
        </motion.div>
      </AnimatePresence>

      {/* BACK */}
      <button
        onClick={() => router.back()}
        className="absolute top-8 left-10 z-20 flex items-center gap-3 text-white/40 text-xs tracking-widest uppercase hover:text-white transition-colors"
      >
        ← Back
      </button>

      {/* COUNTER */}
      {allMedia.length > 1 && (
        <div className="absolute top-8 right-10 z-20 text-white/30 text-xs tracking-widest">
          {String(currentIndex + 1).padStart(2, '0')} /{' '}
          {String(allMedia.length).padStart(2, '0')}
        </div>
      )}

      {/* INFO */}
      <div className="absolute bottom-0 left-0 right-0 z-20 px-10 pb-10">
        <div className="flex items-end justify-between">
          <div className="max-w-xl">
            <span className="text-white/40 text-xs tracking-widest uppercase">
              {project.category} — {project.year}
            </span>

            <h1 className="mt-2 text-5xl font-thin text-white leading-tight">
              {project.title}
            </h1>

            {project.location && (
              <p className="mt-2 text-white/40 text-sm tracking-widest">
                {project.location}
              </p>
            )}

            <AnimatePresence>
              {infoOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 24 }}
                  transition={{ duration: 0.5 }}
                  className="mt-6 max-w-md"
                >
                  <p className="text-white/70 text-sm font-light leading-relaxed">
                    {project.description}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {project.description && (
              <button
                onClick={() => setInfoOpen((p) => !p)}
                className="mt-5 inline-flex items-center gap-3 group"
              >
                <motion.div
                  animate={{ width: infoOpen ? 32 : 16 }}
                  transition={{ duration: 0.4 }}
                  className="h-[1px] bg-white/40"
                />
                <span className="text-white/30 text-xs tracking-widest uppercase group-hover:text-white transition-colors duration-300">
                  {infoOpen ? 'Close' : 'Info'}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ARROWS */}
      {allMedia.length > 1 && (
        <>
          <button
            onClick={() => navigate(-1)}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 border border-white/20 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:border-white/60 transition-all"
          >
            ←
          </button>

          <button
            onClick={() => navigate(1)}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 border border-white/20 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:border-white/60 transition-all"
          >
            →
          </button>
        </>
      )}
    </motion.div>
  );
}