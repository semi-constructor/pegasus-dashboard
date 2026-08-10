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
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            Manage Blogs
          </h2>
          <p className="text-muted-foreground text-sm">Create, edit, and schedule blog posts.</p>
        </div>
        <Link href="/dashboard/admin/blogs/new">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
            <Plus className="w-4 h-4 mr-2" /> New Blog Post
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {initialBlogs.map((blog) => (
          <div key={blog.id} className="bg-card/40 border border-border/50 rounded-xl p-5 flex flex-col justify-between hover:bg-card/60 transition-colors">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-2">
                <Calendar className="w-3 h-3" />
                {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : 'Draft / Scheduled'}
              </div>
              <h3 className="font-bold text-foreground text-lg mb-1">{blog.title}</h3>
              <p className="text-xs text-muted-foreground mb-4">/{blog.slug}</p>
            </div>
            
            <div className="flex gap-2 justify-end mt-4 pt-4 border-t border-border/50 flex-wrap">
              <Link href={`/dashboard/admin/blogs/${blog.id}/preview`}>
                <Button size="sm" variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20">
                  <Eye className="w-4 h-4 mr-2" /> Preview
                </Button>
              </Link>
              <Link href={`/dashboard/admin/blogs/${blog.id}`}>
                <Button size="sm" variant="outline" className="bg-white/5 border-white/10 hover:bg-white/10">
                  <Edit2 className="w-4 h-4 mr-2" /> Edit
                </Button>
              </Link>
              <Button size="sm" variant="destructive" onClick={() => handleDelete(blog.id)} disabled={isPending}>
                <Trash2 className="w-4 h-4 mr-2" /> Delete
              </Button>
            </div>
          </div>
        ))}
        {initialBlogs.length === 0 && (
          <div className="col-span-full py-12 text-center border border-border/50 rounded-xl bg-card/20">
            <p className="text-muted-foreground">No blogs found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
