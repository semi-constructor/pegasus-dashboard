"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Plus, Edit2, Trash2, Calendar, FileText, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteBlog } from "../actions";

export function BlogsClient({ initialBlogs }: { initialBlogs: any[] }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    startTransition(async () => {
      await deleteBlog(id);
    });
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 border-b border-border pb-8">
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-medium tracking-[0.3em] uppercase flex items-center gap-4 text-foreground">
            <FileText className="w-5 h-5" />
            Manage Blogs
          </h2>
          <p className="text-foreground/50 text-sm tracking-wide">Create, edit, and schedule blog posts.</p>
        </div>
        <Link href="/dashboard/admin/blogs/new">
          <button className="px-6 py-3 border border-border text-foreground text-[10px] uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors w-full md:w-auto flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> New Blog Post
          </button>
        </Link>
      </div>

      <div className="space-y-12">
        {initialBlogs.length === 0 ? (
          <div className="bg-background border border-border p-12 text-center">
            <p className="text-foreground/50 text-sm tracking-widest uppercase">No blogs found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-foreground/10 border border-border">
            {initialBlogs.map((blog) => (
              <div key={blog.id} className="bg-background p-8 hover:bg-foreground/5 transition-colors flex flex-col justify-between group min-h-[250px]">
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-2 text-[10px] tracking-widest uppercase text-foreground/30">
                    <Calendar className="w-3 h-3" />
                    {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : 'Draft / Scheduled'}
                  </div>
                  <h3 className="font-medium text-foreground text-lg tracking-wide leading-tight">{blog.title}</h3>
                  <p className="text-xs font-mono text-foreground/50">/{blog.slug}</p>
                </div>
                
                <div className="flex gap-4 justify-start mt-auto pt-8 border-t border-border">
                  <Link href={`/dashboard/admin/blogs/${blog.id}/preview`}>
                    <button className="px-4 py-2 border border-border/30 text-foreground/70 hover:border-border hover:text-foreground transition-colors text-[10px] uppercase tracking-widest flex items-center gap-2">
                      <Eye className="w-3 h-3" /> Preview
                    </button>
                  </Link>
                  <Link href={`/dashboard/admin/blogs/${blog.id}`}>
                    <button className="px-4 py-2 border border-border/30 text-foreground/70 hover:border-border hover:text-foreground transition-colors text-[10px] uppercase tracking-widest flex items-center gap-2">
                      <Edit2 className="w-3 h-3" /> Edit
                    </button>
                  </Link>
                  <button 
                    onClick={() => handleDelete(blog.id)} 
                    disabled={isPending}
                    className="px-4 py-2 border border-rose-500/30 text-rose-500/70 hover:border-rose-500 hover:text-rose-500 transition-colors text-[10px] uppercase tracking-widest flex items-center gap-2 ml-auto"
                  >
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
