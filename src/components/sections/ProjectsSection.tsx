'use client';

import {
  useEffect,
  useRef,
  useState,
  useMemo,
} from 'react';

import Link from 'next/link';

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  animate,
  AnimatePresence,
} from 'framer-motion';

import { supabase } from '@/lib/supabase';

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */

type Project = {
  id: string;
  title: string;
  category: string;
  year: number;
  cover_image: string;
  location: string;
  description: string;
  media: { url: string; type: 'image' | 'video' }[];
};
/* ─────────────────────────────────────────────
   TRANSITION ENGINE
───────────────────────────────────────────── */

const transitionModes = [
  'zoom',
  'circle',
  'slideLeft',
  'slideRight',
  'flip',
  'reveal',
  'blur',
  'vertical',
] as const;

type TransitionMode = (typeof transitionModes)[number];

function getProjectMode(id: string): TransitionMode {
  let hash = 0;

  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }

  return transitionModes[Math.abs(hash) % transitionModes.length];
}

/* ─────────────────────────────────────────────
   IMAGE STRIP
───────────────────────────────────────────── */

function ImageStrip({
  images,
}: {
  images: string[];
}) {
  const x = useMotionValue(0);

  const containerRef =
    useRef<HTMLDivElement>(null);

  const animRef =
    useRef<ReturnType<typeof animate> | null>(
      null
    );

  const limited = images
    .filter(Boolean)
    .slice(0, 10);

  const doubled = [...limited, ...limited];

  useEffect(() => {
    if (!containerRef.current) return;

    const itemW = 200 + 16;

    const totalW =
      itemW * limited.length;

    const startLoop = (from: number) => {
      animRef.current = animate(
        x,
        [from, from - totalW],
        {
          duration: limited.length * 4,
          ease: 'linear',

          onComplete: () => {
            x.set(0);
            startLoop(0);
          },
        }
      );
    };

    startLoop(0);

    return () => animRef.current?.stop();
  }, [limited.length]);

  return (
    <div className="relative w-full overflow-hidden py-2">

      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#080808] to-transparent z-10 pointer-events-none" />

      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#080808] to-transparent z-10 pointer-events-none" />

      <motion.div
        ref={containerRef}
        style={{ x }}
        className="flex gap-4 w-max"
      >
        {doubled.map((url, i) => (
          <div
            key={i}
            className="relative overflow-hidden rounded-sm flex-shrink-0"
            style={{
              width: 200,
              height: 130,
            }}
          >
            <img
              src={url}
              alt=""
              className="w-full h-full object-cover opacity-50 hover:opacity-80 transition-opacity duration-500"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   FULLSCREEN OVERLAY
───────────────────────────────────────────── */

{/* غيّر FullscreenProject بالكامل بالكود ده */}

function FullscreenProject({
  project,
  mode,
  onClose,
}: {
  project: Project;
  mode: TransitionMode;
  onClose: () => void;
}) {
  const allMedia = [
    ...(project.cover_image ? [{ url: project.cover_image, type: 'image' as const }] : []),
    ...(Array.isArray(project.media) ? project.media : []),
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const navigate = (dir: number) => {
    setDirection(dir);
    setCurrentIndex(prev => {
      if (dir === 1) return prev === allMedia.length - 1 ? 0 : prev + 1;
      return prev === 0 ? allMedia.length - 1 : prev - 1;
    });
  };

  const current = allMedia[currentIndex];

  const variants = {
    zoom: { initial: { scale: 1.6, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0.92, opacity: 0 } },
    circle: { initial: { scale: 0, borderRadius: '100%', opacity: 0 }, animate: { scale: 1, borderRadius: '0%', opacity: 1 }, exit: { scale: 0.4, borderRadius: '100%', opacity: 0 } },
    slideLeft: { initial: { x: '-140%', opacity: 0 }, animate: { x: 0, opacity: 1 }, exit: { x: '140%', opacity: 0 } },
    slideRight: { initial: { x: '140%', opacity: 0 }, animate: { x: 0, opacity: 1 }, exit: { x: '-140%', opacity: 0 } },
    flip: { initial: { rotateY: 120, opacity: 0, scale: 0.8 }, animate: { rotateY: 0, opacity: 1, scale: 1 }, exit: { rotateY: -120, opacity: 0, scale: 0.8 } },
    reveal: { initial: { clipPath: 'circle(0% at 50% 50%)', opacity: 0 }, animate: { clipPath: 'circle(150% at 50% 50%)', opacity: 1 }, exit: { opacity: 0 } },
    blur: { initial: { opacity: 0, filter: 'blur(50px)', scale: 1.25 }, animate: { opacity: 1, filter: 'blur(0px)', scale: 1 }, exit: { opacity: 0, filter: 'blur(30px)' } },
    vertical: { initial: { y: '120%', opacity: 0 }, animate: { y: 0, opacity: 1 }, exit: { y: '-120%', opacity: 0 } },
  };

  return (
    <AnimatePresence>
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants[mode]}
        transition={{ duration: 8, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-0 z-[99998] bg-black cursor-none"
      >
        {/* الصورة/الفيديو مع التقليب */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={{
              enter: (d: number) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
              center: { x: 0, opacity: 1 },
              exit: (d: number) => ({ x: d > 0 ? '-100%' : '100%', opacity: 0 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
         {current?.type === 'video' ? (
  <video
    src={current.url}
    autoPlay
    muted
    loop
    className="absolute inset-0 w-full h-full object-contain md:object-cover"
  />
) : (
  <motion.img
    src={current?.url}
    alt={project.title}
    className="absolute inset-0 w-full h-full object-contain md:object-cover"
    initial={{ scale: 1.4, filter: 'blur(20px)' }}
    animate={{ scale: 1, filter: 'blur(0px)' }}
    transition={{ duration: 12, ease: [0.22, 1, 0.36, 1] }}
  />
)}
          </motion.div>
        </AnimatePresence>

        {/* overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.8 }}
          className="absolute inset-0 bg-black/45 pointer-events-none"
        />

        {/* Arrows — بس لو في أكتر من صورة */}
        {allMedia.length > 1 && (
          <>
            <button
              onClick={() => navigate(-1)}
              className="absolute left-8 top-1/2 -translate-y-1/2 w-12 h-12 border border-white/20 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:border-white/60 transition-all z-20"
            >←</button>
            <button
              onClick={() => navigate(1)}
              className="absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 border border-white/20 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:border-white/60 transition-all z-20"
            >→</button>

            {/* Counter */}
            <div className="absolute top-10 left-1/2 -translate-x-1/2 text-white/30 text-xs tracking-widest z-20">
              {currentIndex + 1} / {allMedia.length}
            </div>

            {/* Dots */}
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {allMedia.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setDirection(i > currentIndex ? 1 : -1); setCurrentIndex(i); }}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    i === currentIndex ? 'bg-white w-6' : 'bg-white/30 w-1'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* content */}
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-8 left-4 right-4 md:bottom-16 md:left-16 md:right-auto md:max-w-2xl z-10"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1.2 }}
            className="text-white/40 text-xs tracking-[0.35em] uppercase mb-5"
          >
            {project.category}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.5, duration: 4, ease: [0.22, 1, 0.36, 1] }}
            className="text-white text-4xl md:text-7xl font-thin tracking-tight leading-none"
          >
            {project.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 1.5 }}
            className="mt-8 text-white/60 text-lg leading-relaxed"
          >
            {project.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 1.2 }}
            className="mt-10 flex gap-10 text-white/35 text-sm uppercase tracking-[0.25em]"
          >
            <span>{project.location}</span>
            <span>{project.year}</span>
          </motion.div>
        </motion.div>

        {/* close */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          onClick={onClose}
          className="absolute top-10 right-10 text-white/50 hover:text-white transition z-20 tracking-[0.3em] text-xs uppercase"
        >
          Close
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
}
/* ─────────────────────────────────────────────
    PROJECT CARD
───────────────────────────────────────────── */

function ProjectCard({
  project,
  index,
  large,
  onOpen,
}: {
  project: Project;
  index: number;
  large?: boolean;
  onOpen: (project: Project) => void;
}) {
  const cardRef =
    useRef<HTMLDivElement>(null);

  const [ambientColor, setAmbientColor] =
    useState('0,0,0');

  const [isHovered, setIsHovered] =
    useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(
    useTransform(mouseY, [-0.5, 0.5], [6, -6]),
    {
      stiffness: 300,
      damping: 30,
    }
  );

  const rotateY = useSpring(
    useTransform(mouseX, [-0.5, 0.5], [-6, 6]),
    {
      stiffness: 300,
      damping: 30,
    }
  );

  const imgX = useSpring(
    useTransform(mouseX, [-0.5, 0.5], [-12, 12]),
    {
      stiffness: 200,
      damping: 25,
    }
  );

  const imgY = useSpring(
    useTransform(mouseY, [-0.5, 0.5], [-12, 12]),
    {
      stiffness: 200,
      damping: 25,
    }
  );

  useEffect(() => {
    if (!project.cover_image) return;

    const img = new Image();

    img.crossOrigin = 'anonymous';

    img.src =
      project.cover_image + '?t=1';

    img.onload = () => {
      try {
        const canvas =
          document.createElement('canvas');

        canvas.width = 50;
        canvas.height = 50;

        const ctx =
          canvas.getContext('2d');

        if (!ctx) return;

        ctx.drawImage(img, 0, 0, 50, 50);

        const data = ctx.getImageData(
          0,
          0,
          50,
          50
        ).data;

        let r = 0;
        let g = 0;
        let b = 0;
        let count = 0;

        for (
          let i = 0;
          i < data.length;
          i += 4
        ) {
          if (
            data[i] +
              data[i + 1] +
              data[i + 2] >
            30
          ) {
            r += data[i];
            g += data[i + 1];
            b += data[i + 2];
            count++;
          }
        }

        if (count > 0) {
          setAmbientColor(
            `${Math.round(r / count)},${Math.round(
              g / count
            )},${Math.round(b / count)}`
          );
        }
      } catch {}
    };
  }, [project.cover_image]);

  const handleMouseMove = (
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    if (!cardRef.current) return;

    const rect =
      cardRef.current.getBoundingClientRect();

    mouseX.set(
      (e.clientX - rect.left) /
        rect.width -
        0.5
    );

    mouseY.set(
      (e.clientY - rect.top) /
        rect.height -
        0.5
    );
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{
        opacity: 0,
        y: 80,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        margin: '-80px',
      }}
      transition={{
        duration: 1,
        ease: [0.16, 1, 0.3, 1],
        delay: index * 0.08,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      className="relative group cursor-pointer"
      onClick={() => onOpen(project)}
    >

      <motion.div
        animate={{
          opacity: isHovered ? 0.4 : 0,
          scale: isHovered ? 1 : 0.8,
        }}
        transition={{
          duration: 0.5,
        }}
        style={{
          background: `radial-gradient(ellipse at center, rgb(${ambientColor}), transparent 70%)`,
        }}
        className="absolute -inset-8 rounded-full blur-3xl pointer-events-none z-0"
      />

      <div className="relative z-10 overflow-hidden">

        <div
          className={`relative overflow-hidden ${
            large
              ? 'aspect-[16/9]'
              : 'aspect-[4/3]'
          }`}
        >

          {project.cover_image ? (
            <motion.img
              src={project.cover_image}
              alt={project.title}
              style={{
                x: imgX,
                y: imgY,
                scale: 1.12,
              }}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-white/5 flex items-center justify-center">
              <span className="text-white/20 text-xs tracking-widest uppercase">
                No Image
              </span>
            </div>
          )}

          <motion.div
            animate={{
              opacity: isHovered
                ? 0.15
                : 0.45,
            }}
            className="absolute inset-0 bg-black"
          />

          <div className="absolute top-4 left-4 text-white/50 text-xs tracking-widest uppercase">
            {project.category}
          </div>

          {large && (
            <motion.div
              animate={{
                opacity: isHovered ? 1 : 0,
                y: isHovered ? 0 : 10,
              }}
              transition={{
                duration: 0.4,
              }}
              className="absolute bottom-6 left-6 right-6"
            >
              <p className="text-white/60 text-sm font-light leading-relaxed line-clamp-2">
                {project.description}
              </p>
            </motion.div>
          )}
        </div>

        <div className="pt-5 flex items-end justify-between">

          <motion.h3
            animate={{
              x: isHovered ? 8 : 0,
            }}
            transition={{
              duration: 0.3,
            }}
            className={`text-white/90 font-light tracking-wide ${
              large
                ? 'text-2xl'
                : 'text-xl'
            }`}
          >
            {project.title}
          </motion.h3>

          <span className="text-white/30 text-xs tracking-widest">
            {project.year}
          </span>
        </div>

        <motion.div
          animate={{
            scaleX: isHovered ? 1 : 0,
          }}
          transition={{
            duration: 0.4,
          }}
          style={{
            originX: 0,
          }}
          className="mt-3 h-[1px] bg-white/20"
        />
      </div>
    </motion.div>
  );
}

function AutoScrollCategories({
  categories,
  activeFilter,
  setActiveFilter,
}: {
  categories: string[];
  activeFilter: string;
  setActiveFilter: (cat: string) => void;
}) {
  const x = useMotionValue(0);
  const animRef = useRef<ReturnType<typeof animate> | null>(null);
  const isDragging = useRef(false);
  const ITEM_W = typeof window !== 'undefined' && window.innerWidth < 768 ? 120 : 180;
  const totalW = ITEM_W * categories.length;

  // كرر الـ categories عدد كفاية عشان يملى الشاشة من الأول
 const repeated = Array(Math.max(8, Math.ceil(2000 / (ITEM_W * categories.length)) * categories.length))
  .fill(categories)
  .flat();

  const startLoop = (from: number) => {
    animRef.current?.stop();
    animRef.current = animate(x, [from, from - totalW], {
      duration: categories.length * 6,
      ease: 'linear',
      repeat: Infinity,
      repeatType: 'loop',
    });
  };

  useEffect(() => {
    x.set(0);
    startLoop(0);
    return () => animRef.current?.stop();
  }, [categories.length]);

  const handleClick = (cat: string) => {
    if (!isDragging.current) setActiveFilter(cat);
  };

  return (
    <div className="overflow-hidden py-2">
      <motion.div
        style={{ x }}
        drag="x"
        dragConstraints={{ left: -totalW * 3, right: 0 }}
        dragElastic={0}
        onDragStart={() => {
          isDragging.current = true;
          animRef.current?.stop();
        }}
        onDragEnd={() => {
          setTimeout(() => { isDragging.current = false; }, 100);
          // يكمل من نفس المكان اللي وقف فيه
          startLoop(x.get());
        }}
        className="flex gap-4 w-max cursor-grab active:cursor-grabbing"
      >
        {repeated.map((cat, i) => (
          <motion.button
            key={`${cat}-${i}`}
            onClick={() => handleClick(cat)}
            className={`relative flex-shrink-0 tracking-[0.2em] uppercase transition-all duration-300
              text-sm md:text-base px-8 py-4
              ${activeFilter === cat ? 'text-white' : 'text-white/35 hover:text-white/70'}
            `}
            style={{ minWidth: ITEM_W }}
          >
            {activeFilter === cat && (
              <motion.div
                layoutId={`cat-${i % categories.length}`}
                className="absolute inset-0 border border-white/30 bg-white/5 rounded-sm"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10 font-light">{cat}</span>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}


/* ─────────────────────────────────────────────
   MAIN SECTION
───────────────────────────────────────────── */

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [loading, setLoading] = useState(true);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [activeMode, setActiveMode] = useState<TransitionMode>('zoom');

  useEffect(() => {
    async function load() {
      const [{ data: projects }, { data: cats }] = await Promise.all([
        supabase.from('projects').select('*').order('created_at', { ascending: false }),
        supabase.from('categories').select('name').order('created_at'),
      ]);
      setProjects(projects || []);
      setCategories(['All', ...(cats?.map((c: any) => c.name) || [])]);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = activeFilter === 'All'
    ? projects
    : projects.filter((p) => p.category === activeFilter);

  const groups: Project[][] = [];
  let i = 0;
  while (i < filtered.length) {
    if (i % 3 === 0) { groups.push([filtered[i]]); i++; }
    else { groups.push(filtered.slice(i, i + 2)); i += 2; }
  }

  const allImages = projects.map((p) => p.cover_image).filter(Boolean);

  const openProject = (project: Project) => {
    setActiveProject(project);
    setActiveMode(getProjectMode(project.id));
    document.body.style.overflow = 'hidden';
  };

  const closeProject = () => {
    setActiveProject(null);
    document.body.style.overflow = 'auto';
  };

  const renderGroups = () => {
    const elements: React.ReactNode[] = [];
    let stripCount = 0;
    groups.forEach((group, gi) => {
      elements.push(
        group.length === 1 ? (
          <ProjectCard key={group[0].id} project={group[0]} index={gi} large onOpen={openProject} />
        ) : (
          <div key={gi} className="grid grid-cols-2 gap-x-8">
            {group.map((p, pi) => (
              <ProjectCard key={p.id} project={p} index={gi + pi} onOpen={openProject} />
            ))}
          </div>
        )
      );
      if ((gi + 1) % 3 === 0 && allImages.length >= 4) {
        stripCount++;
        elements.push(
          <div key={`strip-${stripCount}`} className="-mx-16">
            <ImageStrip images={allImages} />
          </div>
        );
      }
    });
    return elements;
  };

  return (
    <>
      <section id="work" className="relative pt-16 pb-32 px-16">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12 flex items-end justify-between"
        >
          <div>
            <span className="text-white/30 text-xs tracking-widest uppercase">Selected Work</span>
            <h2 className="mt-3 text-5xl font-thin text-white/90 tracking-tight">Projects</h2>
          </div>
          <span className="text-white/20 text-xs tracking-widest">( {filtered.length} )</span>
        </motion.div>

 {/* Category Filter — auto-scrolling */}
{categories.length > 1 && (
  <div style={{ marginTop: '4rem', marginBottom: '5rem', position: 'relative' }}>
    <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#080808] to-transparent z-10 pointer-events-none" />
    <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#080808] to-transparent z-10 pointer-events-none" />
    <AutoScrollCategories
      categories={categories}
      activeFilter={activeFilter}
      setActiveFilter={setActiveFilter}
    />
  </div>
)}


        {loading ? (
          <div className="flex items-center justify-center h-64">
            <span className="text-white/20 text-xs tracking-widest uppercase animate-pulse">Loading...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <span className="text-white/20 text-xs tracking-widest uppercase">No projects in this category</span>
          </div>
        ) : (
          <div className="flex flex-col gap-24">{renderGroups()}</div>
        )}
      </section>

      <AnimatePresence mode="wait">
        {activeProject && (
          <FullscreenProject project={activeProject} mode={activeMode} onClose={closeProject} />
        )}
      </AnimatePresence>
    </>
  );
}