'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

type Profile = {
  name: string;
  bio: string;
  email: string;
  whatsapp: string;
  instagram: string;
  facebook: string;
  linkedin: string;
  behance: string;
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastY, setLastY] = useState(0);
  const [lang, setLang] = useState<'EN' | 'AR'>('EN');
  const [openProfile, setOpenProfile] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 50);
      setHidden(y > lastY && y > 100);
      setLastY(y);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastY]);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('profile').select('*').single();
      if (data) setProfile(data);
    }
    load();
  }, []);

  const socials = [
    { label: 'Instagram', href: profile?.instagram },
    { label: 'Facebook', href: profile?.facebook },
    { label: 'LinkedIn', href: profile?.linkedin },
    { label: 'Behance', href: profile?.behance },
    {
      label: 'WhatsApp',
      href: profile?.whatsapp
        ? `https://wa.me/${profile.whatsapp.replace(/\D/g, '')}`
        : undefined,
    },
  ].filter((s) => s.href);

  const links = ['Work', 'About', 'Contact'];

  return (
    <>
      <motion.nav
        animate={{ y: hidden ? -100 : 0 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        className={`fixed top-0 left-0 w-full z-50 px-16 py-6 flex items-center justify-between transition-all duration-500 ${
          scrolled ? 'backdrop-blur-md bg-black/20 border-b border-white/5' : ''
        }`}
      >
        {/* Logo — يفتح بيانات المهندس */}
        <motion.button
          onClick={() => setOpenProfile(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="w-10 h-10 rounded-full border border-white/30 overflow-hidden hover:border-white/60 transition-colors"
        >
          <img src="/logo2.png" alt="Logo" className="w-full h-full object-cover" />
        </motion.button>

        {/* Links */}
        <div className="flex items-center gap-12">
          {links.map((link) => (
            <Link
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-white/40 text-xs tracking-widest uppercase hover:text-white/90 transition-colors duration-300"
            >
              {link}
            </Link>
          ))}

          {/* Language Toggle */}
         
        </div>
      </motion.nav>

      {/* Profile Modal */}
      <AnimatePresence>
        {openProfile && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpenProfile(false)}
              className="fixed inset-0 z-[99990] bg-black/60 backdrop-blur-sm"
            />

            {/* Card */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-20 left-8 z-[99991] w-80 bg-[#0f0f0f] border border-white/10 p-8"
            >
              {/* Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full overflow-hidden border border-white/20">
                  <img src="/logo2.png" alt="Logo" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-white/90 font-light text-base">
                    {profile?.name || 'Abdullah Al-Saeed'}
                  </h3>
                  <p className="text-white/30 text-xs tracking-widest uppercase mt-1">
                    Architect
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="w-full h-[1px] bg-white/10 mb-6" />

              {/* Bio */}
              {profile?.bio && (
                <p className="text-white/40 text-sm font-light leading-relaxed mb-6">
                  {profile.bio}
                </p>
              )}

              {/* Email */}
              {profile?.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="text-white/50 text-xs tracking-widest hover:text-white/90 transition-colors block mb-6"
                >
                  {profile.email}
                </a>
              )}

              {/* Socials */}
              {socials.length > 0 && (
                <div className="flex flex-wrap gap-4">
                  {socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/30 text-xs tracking-widest uppercase hover:text-white/80 transition-colors"
                    >
                      {s.label} ↗
                    </a>
                  ))}
                </div>
              )}

              {/* Close */}
              <button
                onClick={() => setOpenProfile(false)}
                className="absolute top-4 right-4 text-white/20 hover:text-white/60 transition-colors text-xs"
              >
                ✕
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}