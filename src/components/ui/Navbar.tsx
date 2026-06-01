'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  avatar_url: string;
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastY, setLastY] = useState(0);
  const [openProfile, setOpenProfile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
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
    supabase.from('profile').select('*').single().then(({ data }) => {
      if (data) setProfile(data);
    });
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

  const links = [
    { label: 'Work', href: '#work' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <>
      <motion.nav
        animate={{ y: hidden ? -100 : 0 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled ? 'backdrop-blur-md bg-black/30 border-b border-white/5' : ''
        }`}
      >
        <div className="flex items-center justify-between px-6 md:px-16 py-5">

          {/* Logo */}
          <motion.button
            onClick={() => setOpenProfile(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative w-12 h-12 md:w-14 md:h-14 rounded-full border border-white/20 overflow-hidden hover:border-white/50 transition-colors duration-300 flex-shrink-0"
          >
            <img
              src={profile?.avatar_url || '/logo2.png'}
              alt="Logo"
              className="w-full h-full object-cover"
            />
          </motion.button>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-16">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-white/50 text-sm tracking-[0.25em] uppercase hover:text-white transition-colors duration-300 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white/40 group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
     
<div className="flex md:hidden items-center gap-5">
  {links.map((link) => (
    <a
      key={link.label}
      href={link.href}
      className="text-white/50 text-xs tracking-[0.2em] uppercase hover:text-white transition-colors duration-300"
    >
      {link.label}
    </a>
  ))}
</div>
</div>
        
      </motion.nav>

      {/* Profile Modal */}
      <AnimatePresence>
        {openProfile && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpenProfile(false)}
              className="fixed inset-0 z-[99990] bg-black/70 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, x: -40, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.97 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-0 left-0 bottom-0 z-[99991] w-full max-w-sm bg-[#0a0a0a] border-r border-white/10 flex flex-col"
            >
              {/* Avatar Header */}
              <div className="relative h-48 overflow-hidden flex-shrink-0">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.name}
                    className="w-full h-full object-cover opacity-60"
                  />
                ) : (
                  <div className="w-full h-full bg-white/5" />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a0a]" />
                <button
                  onClick={() => setOpenProfile(false)}
                  className="absolute top-4 right-4 text-white/30 hover:text-white/80 transition-colors text-sm"
                >
                  ✕
                </button>
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 overflow-y-auto px-8 pb-8 -mt-6">
                <h3 className="text-white/90 text-xl font-light mb-1">
                  {profile?.name || 'Abdullah Al-Saeed'}
                </h3>
                <p className="text-white/30 text-xs tracking-widest uppercase mb-6">Architect</p>

                <div className="w-full h-[1px] bg-white/10 mb-6" />

                {profile?.bio && (
                  <p className="text-white/40 text-sm font-light leading-relaxed mb-6">
                    {profile.bio}
                  </p>
                )}

                {profile?.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    className="text-white/40 text-xs tracking-widest hover:text-white/80 transition-colors block mb-8"
                  >
                    {profile.email}
                  </a>
                )}

                {socials.length > 0 && (
                  <div className="flex flex-col gap-3 mt-auto">
                    {socials.map((s) => (
                      <a
                        key={s.label}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between text-white/30 text-xs tracking-widest uppercase hover:text-white/80 transition-colors border-b border-white/5 pb-3"
                      >
                        {s.label}
                        <span>↗</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}