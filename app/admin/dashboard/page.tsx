'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession, signOut } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export default function AdminDashboard() {
  const [projects, setProjects] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState('');
  const [addingCategory, setAddingCategory] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkSession();
    fetchProjects();
    fetchCategories();
  }, []);

  async function checkSession() {
    const session = await getSession();
    if (!session) router.push('/admin/login');
  }

  async function fetchProjects() {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    setProjects(data || []);
    setLoading(false);
  }

  async function fetchCategories() {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: true });
    setCategories(data || []);
  }

  async function handleAddCategory() {
    if (!newCategory.trim()) return;
    setAddingCategory(true);
    await supabase.from('categories').insert({ name: newCategory.trim() });
    setNewCategory('');
    await fetchCategories();
    setAddingCategory(false);
  }

  async function handleDeleteCategory(id: string) {
    if (!confirm('Delete this category?')) return;
    await supabase.from('categories').delete().eq('id', id);
    fetchCategories();
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this project?')) return;
    await supabase.from('projects').delete().eq('id', id);
    fetchProjects();
  }

  return (
    <div className="min-h-screen bg-[#080808] text-white/80">

      {/* Header */}
      <div className="flex justify-between items-center px-12 py-6 border-b border-white/10">
        <h1 className="text-sm tracking-widest uppercase text-white/60">Dashboard</h1>
        <div className="flex items-center gap-6">
          <button
            onClick={() => router.push('/admin/projects/new')}
            className="text-xs tracking-widest uppercase border border-white/20 px-6 py-2 hover:bg-white/5 transition-colors"
          >
            + New Project
          </button>
          <button
            onClick={() => router.push('/admin/profile')}
            className="text-xs tracking-widest uppercase text-white/40 hover:text-white/80 transition-colors"
          >
            Profile
          </button>
          <button
            onClick={async () => { await signOut(); router.push('/admin/login'); }}
            className="text-xs tracking-widest uppercase text-white/40 hover:text-white/80 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className="px-12 py-12 flex flex-col gap-16">

        {/* Categories Section */}
        <div>
          <p className="text-xs tracking-widest uppercase text-white/20 mb-6">
            Categories ({categories.length})
          </p>

          {/* Add Category */}
          <div className="flex gap-4 mb-6">
            <input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
              placeholder="Category name..."
              className="bg-transparent border-b border-white/20 text-white/80 py-2 px-0 outline-none focus:border-white/60 transition-colors text-sm tracking-wide flex-1 max-w-xs placeholder:text-white/20"
            />
            <button
              onClick={handleAddCategory}
              disabled={addingCategory || !newCategory.trim()}
              className="text-xs tracking-widest uppercase border border-white/20 px-5 py-2 hover:bg-white/5 transition-colors disabled:opacity-30"
            >
              {addingCategory ? '...' : '+ Add'}
            </button>
          </div>

          {/* Categories List */}
          {categories.length === 0 ? (
            <p className="text-white/20 text-xs tracking-widest">No categories yet.</p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center gap-3 border border-white/10 px-4 py-2 group hover:border-white/30 transition-colors"
                >
                  <span className="text-xs tracking-widest uppercase text-white/60">{cat.name}</span>
                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="text-white/20 hover:text-red-400 transition-colors text-xs opacity-0 group-hover:opacity-100"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-[1px] bg-white/5" />

        {/* Projects Section */}
        <div>
          <p className="text-xs tracking-widest uppercase text-white/20 mb-10">
            Projects ({projects.length})
          </p>

          {loading ? (
            <p className="text-white/20 text-sm animate-pulse">Loading...</p>
          ) : projects.length === 0 ? (
            <p className="text-white/20 text-sm">No projects yet.</p>
          ) : (
            <div className="grid grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="group border border-white/10 hover:border-white/30 transition-all duration-300"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-white/5">
                    {project.cover_image ? (
                      <img
                        src={project.cover_image}
                        alt={project.title}
                        className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-white/20 text-xs tracking-widest uppercase">No Image</span>
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <h3 className="text-white/80 font-light text-base mb-1">{project.title}</h3>
                    <p className="text-white/30 text-xs tracking-widest uppercase mb-5">
                      {project.category || '—'} · {project.year}
                    </p>
                    <div className="flex gap-5 border-t border-white/10 pt-4">
                      <button
                        onClick={() => router.push(`/admin/projects/${project.id}/edit`)}
                        className="text-xs tracking-widest uppercase text-white/40 hover:text-white/80 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="text-xs tracking-widest uppercase text-red-400/50 hover:text-red-400 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}