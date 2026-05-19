'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

type MediaItem = { url: string; type: 'image' | 'video' };

export default function EditProject() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [newCover, setNewCover] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [newMediaFiles, setNewMediaFiles] = useState<File[]>([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    year: new Date().getFullYear(),
    featured: false,
    cover_image: '',
  });

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();
      if (data) {
        setForm(data);
        setCoverPreview(data.cover_image || '');
        setMediaItems(Array.isArray(data.media) ? data.media : []);
      }
    }
    load();
  }, [id]);

  const uploadFile = async (file: File): Promise<string> => {
    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from('projects').upload(fileName, file);
    if (error) throw error;
    const { data } = supabase.storage.from('projects').getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleNewMedia = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setNewMediaFiles(prev => [...prev, ...files]);
  };

  const removeExistingMedia = (index: number) => {
    setMediaItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let coverUrl = form.cover_image;
      if (newCover) coverUrl = await uploadFile(newCover);

      const newUploaded: MediaItem[] = await Promise.all(
        newMediaFiles.map(async (file) => ({
          url: await uploadFile(file),
          type: file.type.startsWith('video') ? 'video' as const : 'image' as const,
        }))
      );

      const { error } = await supabase
        .from('projects')
        .update({
          ...form,
          year: Number(form.year),
          cover_image: coverUrl,
          media: [...mediaItems, ...newUploaded],
        })
        .eq('id', id);

      if (error) throw error;
      router.push('/admin/dashboard');
    } catch (err) {
      console.error(err);
      alert('Error updating project');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white/80">
      <div className="flex justify-between items-center px-12 py-6 border-b border-white/10">
        <h1 className="text-sm tracking-widest uppercase">Edit Project</h1>
        <button
          onClick={() => router.push('/admin/dashboard')}
          className="text-xs tracking-widest uppercase text-white/40 hover:text-white/80 transition-colors"
        >
          ← Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-12 py-10 flex flex-col gap-8">

        {/* Cover Image */}
        <div className="flex flex-col gap-3">
          <label className="text-xs tracking-widest uppercase text-white/40">Cover Image</label>
          {coverPreview && (
            <div className="relative">
              <img src={coverPreview} alt="cover" className="w-full h-48 object-cover opacity-80" />
              <button
                type="button"
                onClick={() => { setNewCover(null); setCoverPreview(''); setForm(p => ({ ...p, cover_image: '' })); }}
                className="absolute top-2 right-2 w-7 h-7 bg-black/70 text-white/60 hover:text-white flex items-center justify-center text-xs"
              >✕</button>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) { setNewCover(file); setCoverPreview(URL.createObjectURL(file)); }
            }}
            className="text-sm text-white/40 file:mr-4 file:py-2 file:px-4 file:border file:border-white/20 file:bg-transparent file:text-white/60 file:text-xs file:tracking-widest file:uppercase hover:file:bg-white/5"
          />
        </div>

        {/* Existing Media */}
        {mediaItems.length > 0 && (
          <div className="flex flex-col gap-3">
            <label className="text-xs tracking-widest uppercase text-white/40">Current Media</label>
            <div className="grid grid-cols-3 gap-3">
              {mediaItems.map((item, i) => (
                <div key={i} className="relative aspect-video bg-white/5">
                  {item.type === 'video' ? (
                    <video src={item.url} className="w-full h-full object-cover opacity-70" muted />
                  ) : (
                    <img src={item.url} alt="" className="w-full h-full object-cover opacity-70" />
                  )}
                  <button
                    type="button"
                    onClick={() => removeExistingMedia(i)}
                    className="absolute top-1 right-1 w-6 h-6 bg-black/70 text-white/60 hover:text-red-400 flex items-center justify-center text-xs"
                  >✕</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add New Media */}
        <div className="flex flex-col gap-3">
          <label className="text-xs tracking-widest uppercase text-white/40">Add More Media</label>
          {newMediaFiles.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {newMediaFiles.map((file, i) => (
                <div key={i} className="relative aspect-video bg-white/5">
                  {file.type.startsWith('video') ? (
                    <video src={URL.createObjectURL(file)} className="w-full h-full object-cover opacity-70" muted />
                  ) : (
                    <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover opacity-70" />
                  )}
                  <button
                    type="button"
                    onClick={() => setNewMediaFiles(prev => prev.filter((_, j) => j !== i))}
                    className="absolute top-1 right-1 w-6 h-6 bg-black/70 text-white/60 hover:text-red-400 flex items-center justify-center text-xs"
                  >✕</button>
                </div>
              ))}
            </div>
          )}
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleNewMedia}
            className="text-sm text-white/40 file:mr-4 file:py-2 file:px-4 file:border file:border-white/20 file:bg-transparent file:text-white/60 file:text-xs file:tracking-widest file:uppercase hover:file:bg-white/5"
          />
        </div>

        {/* Title */}
        <div className="flex flex-col gap-3">
          <label className="text-xs tracking-widest uppercase text-white/40">Title</label>
          <input
            name="title"
            value={form.title}
            onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))}
            className="bg-transparent border-b border-white/20 text-white/80 py-3 outline-none focus:border-white/60 transition-colors"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-3">
          <label className="text-xs tracking-widest uppercase text-white/40">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))}
            rows={4}
            className="bg-transparent border-b border-white/20 text-white/80 py-3 outline-none focus:border-white/60 transition-colors resize-none"
          />
        </div>

        {/* Category & Location */}
        <div className="grid grid-cols-2 gap-8">
          <div className="flex flex-col gap-3">
            <label className="text-xs tracking-widest uppercase text-white/40">Category</label>
            <input
              value={form.category}
              onChange={(e) => setForm(p => ({ ...p, category: e.target.value }))}
              className="bg-transparent border-b border-white/20 text-white/80 py-3 outline-none focus:border-white/60 transition-colors"
            />
          </div>
          <div className="flex flex-col gap-3">
            <label className="text-xs tracking-widest uppercase text-white/40">Location</label>
            <input
              value={form.location}
              onChange={(e) => setForm(p => ({ ...p, location: e.target.value }))}
              className="bg-transparent border-b border-white/20 text-white/80 py-3 outline-none focus:border-white/60 transition-colors"
            />
          </div>
        </div>

        {/* Year */}
        <div className="flex flex-col gap-3">
          <label className="text-xs tracking-widest uppercase text-white/40">Year</label>
          <input
            type="number"
            value={form.year}
            onChange={(e) => setForm(p => ({ ...p, year: Number(e.target.value) }))}
            className="bg-transparent border-b border-white/20 text-white/80 py-3 outline-none focus:border-white/60 transition-colors"
          />
        </div>

        {/* Featured */}
        <div className="flex items-center gap-4">
          <input
            type="checkbox"
            id="featured"
            checked={form.featured}
            onChange={(e) => setForm(p => ({ ...p, featured: e.target.checked }))}
            className="w-4 h-4"
          />
          <label htmlFor="featured" className="text-xs tracking-widest uppercase text-white/40">
            Featured Project
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="border border-white/20 text-white/80 py-4 tracking-widest uppercase text-sm hover:bg-white/5 transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Update Project'}
        </button>
      </form>
    </div>
  );
}