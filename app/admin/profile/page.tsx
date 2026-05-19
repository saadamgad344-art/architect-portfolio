'use client';
 
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
 
export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [profileId, setProfileId] = useState('');
  const [form, setForm] = useState({
    name: '',
    bio: '',
    email: '',
    whatsapp: '',
    instagram: '',
    facebook: '',
    linkedin: '',
    behance: '',
    years_experience: '',
    projects_count: '',
    awards_count: '',
    countries_count: '',
  });
 
  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('profile').select('*').maybeSingle();
      if (data) {
        setProfileId(data.id);
        setForm({
          name: data.name || '',
          bio: data.bio || '',
          email: data.email || '',
          whatsapp: data.whatsapp || '',
          instagram: data.instagram || '',
          facebook: data.facebook || '',
          linkedin: data.linkedin || '',
          behance: data.behance || '',
          years_experience: data.years_experience || '',
          projects_count: data.projects_count || '',
          awards_count: data.awards_count || '',
          countries_count: data.countries_count || '',
        });
      }
    }
    load();
  }, []);
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
 
    const { error } = await supabase.from('profile').update({
      name: form.name,
      bio: form.bio,
      email: form.email,
      whatsapp: form.whatsapp,
      instagram: form.instagram,
      facebook: form.facebook,
      linkedin: form.linkedin,
      behance: form.behance,
      years_experience: form.years_experience,
      projects_count: form.projects_count,
      awards_count: form.awards_count,
      countries_count: form.countries_count,
    }).eq('id', profileId);
 
    if (error) console.error('Save error:', error);
    setLoading(false);
    alert('Saved!');
  };
 
  return (
    <div className="min-h-screen bg-[#080808] text-white/80">
      <div className="flex justify-between items-center px-12 py-6 border-b border-white/10">
        <h1 className="text-sm tracking-widest uppercase">Profile</h1>
        <button
          onClick={() => router.push('/admin/dashboard')}
          className="text-xs tracking-widest uppercase text-white/40 hover:text-white/80 transition-colors"
        >
          ← Back
        </button>
      </div>
 
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-12 py-10 flex flex-col gap-8">
 
        {/* Basic Info */}
        <div className="flex flex-col gap-3">
          <label className="text-xs tracking-widest uppercase text-white/40">Name</label>
          <input
            value={form.name}
            onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))}
            className="bg-transparent border-b border-white/20 text-white/80 py-3 outline-none focus:border-white/60 transition-colors"
          />
        </div>
 
        <div className="flex flex-col gap-3">
          <label className="text-xs tracking-widest uppercase text-white/40">Bio</label>
          <textarea
            value={form.bio}
            onChange={(e) => setForm(p => ({ ...p, bio: e.target.value }))}
            rows={4}
            className="bg-transparent border-b border-white/20 text-white/80 py-3 outline-none focus:border-white/60 transition-colors resize-none"
          />
        </div>
 
        {/* Contact */}
        <p className="text-xs tracking-widest uppercase text-white/20 mt-4">Contact</p>
 
        <div className="flex flex-col gap-3">
          <label className="text-xs tracking-widest uppercase text-white/40">Email</label>
          <input
            value={form.email}
            onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))}
            className="bg-transparent border-b border-white/20 text-white/80 py-3 outline-none focus:border-white/60 transition-colors"
          />
        </div>
 
        <div className="flex flex-col gap-3">
          <label className="text-xs tracking-widest uppercase text-white/40">WhatsApp</label>
          <input
            value={form.whatsapp}
            placeholder="+966..."
            onChange={(e) => setForm(p => ({ ...p, whatsapp: e.target.value }))}
            className="bg-transparent border-b border-white/20 text-white/80 py-3 outline-none focus:border-white/60 transition-colors"
          />
        </div>
 
        {/* Social */}
        <p className="text-xs tracking-widest uppercase text-white/20 mt-4">Social Media</p>
 
        {[
          { key: 'instagram', label: 'Instagram URL' },
          { key: 'facebook', label: 'Facebook URL' },
          { key: 'linkedin', label: 'LinkedIn URL' },
          { key: 'behance', label: 'Behance URL' },
        ].map((field) => (
          <div key={field.key} className="flex flex-col gap-3">
            <label className="text-xs tracking-widest uppercase text-white/40">{field.label}</label>
            <input
              value={(form as any)[field.key]}
              onChange={(e) => setForm(p => ({ ...p, [field.key]: e.target.value }))}
              placeholder="https://..."
              className="bg-transparent border-b border-white/20 text-white/80 py-3 outline-none focus:border-white/60 transition-colors"
            />
          </div>
        ))}
 
        {/* Stats */}
        <p className="text-xs tracking-widest uppercase text-white/20 mt-4">Stats (About Section)</p>
 
        <div className="grid grid-cols-2 gap-8">
          {[
            { key: 'years_experience', label: 'Years Experience' },
            { key: 'projects_count', label: 'Projects' },
            { key: 'awards_count', label: 'Awards' },
            { key: 'countries_count', label: 'Countries' },
          ].map((field) => (
            <div key={field.key} className="flex flex-col gap-3">
              <label className="text-xs tracking-widest uppercase text-white/40">{field.label}</label>
              <input
                value={(form as any)[field.key]}
                placeholder="12+"
                onChange={(e) => setForm(p => ({ ...p, [field.key]: e.target.value }))}
                className="bg-transparent border-b border-white/20 text-white/80 py-3 outline-none focus:border-white/60 transition-colors"
              />
            </div>
          ))}
        </div>
 
        <button
          type="submit"
          disabled={loading}
          className="border border-white/20 text-white/80 py-4 tracking-widest uppercase text-sm hover:bg-white/5 transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
}