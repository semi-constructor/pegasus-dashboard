"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save, ArrowLeft, Eye } from "lucide-react";
import Link from "next/link";
import { createBlog, updateBlog } from "../actions";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { format } from "date-fns";

export function BlogForm({ initialData, currentUserId }: { initialData?: any, currentUserId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isPreview, setIsPreview] = useState(false);
  
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    shortDescription: initialData?.shortDescription || "",
    content: initialData?.content || "",
    publishedAt: initialData?.publishedAt 
      ? format(new Date(initialData.publishedAt), "yyyy-MM-dd'T'HH:mm") 
      : format(new Date(), "yyyy-MM-dd'T'HH:mm"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.slug || !formData.content) return;
    
    startTransition(async () => {
      const payload = {
        title: formData.title,
        slug: formData.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
        shortDescription: formData.shortDescription,
        content: formData.content,
        publishedAt: new Date(formData.publishedAt),
        authorId: currentUserId,
      };

      if (initialData?.id) {
        await updateBlog(initialData.id, payload);
      } else {
        await createBlog(payload);
      }
      
      router.push("/dashboard/admin/blogs");
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/admin/blogs">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
        </Link>
        <h2 className="text-2xl font-bold text-foreground">
          {initialData ? "Edit Blog Post" : "Create New Blog Post"}
        </h2>
        {initialData?.id && (
          <Link href={`/dashboard/admin/blogs/${initialData.id}/preview`} className="ml-auto">
            <Button variant="outline" size="sm" className="bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20">
              <Eye className="w-4 h-4 mr-2" /> Full Page Preview
            </Button>
          </Link>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-white/70 uppercase tracking-wider">Title</label>
            <Input 
              required
              value={formData.title}
              onChange={(e) => {
                const title = e.target.value;
                setFormData(prev => ({ 
                  ...prev, 
                  title, 
                  slug: !initialData ? title.toLowerCase().replace(/[^a-z0-9-]/g, '-') : prev.slug 
                }));
              }}
              placeholder="e.g. Pegasus 2.0 is Here"
              className="bg-white/5 border-white/10 text-white min-h-[40px] px-3 py-2"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-white/70 uppercase tracking-wider">URL Slug</label>
            <Input 
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="e.g. pegasus-2-0-release"
              className="bg-white/5 border-white/10 text-white min-h-[40px] px-3 py-2"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-bold text-white/70 uppercase tracking-wider">Short Description (SEO & Preview)</label>
            <Textarea 
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              placeholder="Brief summary of the article..."
              className="bg-white/5 border-white/10 text-white min-h-[40px] px-3 py-2"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-white/70 uppercase tracking-wider">Publish / Schedule Date</label>
            <Input 
              type="datetime-local"
              required
              value={formData.publishedAt}
              onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
              className="bg-white/5 border-white/10 text-white min-h-[40px] px-3 py-2 [color-scheme:dark]"
            />
            <p className="text-xs text-muted-foreground">Setting a future date will schedule the post.</p>
          </div>
        </div>

        <div className="space-y-2 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-white/70 uppercase tracking-wider">Content (Markdown & HTML)</label>
            <Button type="button" variant="outline" size="sm" onClick={() => setIsPreview(!isPreview)} className="bg-white/5 border-white/10 hover:bg-white/10">
              <Eye className="w-4 h-4 mr-2" />
              {isPreview ? "Edit Content" : "Preview"}
            </Button>
          </div>
          
          {isPreview ? (
            <div className="prose prose-invert max-w-none p-6 border border-white/10 rounded-xl bg-black/20 min-h-[400px]">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]} 
                rehypePlugins={[rehypeRaw]}
                components={{
                  code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={atomDark as any}
                        language={match[1]}
                        PreTag="div"
                        className="rounded-xl my-4"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  }
                }}
              >
                {formData.content || "*No content yet*"}
              </ReactMarkdown>
            </div>
          ) : (
            <Textarea 
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Write your blog post here using Markdown..."
              className="bg-white/5 border-white/10 text-white min-h-[400px] px-4 py-3 font-mono text-sm"
            />
          )}
        </div>

        <div className="flex justify-end pt-4 border-t border-white/10">
          <Button type="submit" disabled={isPending} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
            <Save className="w-4 h-4 mr-2" />
            {isPending ? "Saving..." : "Save Blog Post"}
          </Button>
        </div>
      </form>
    </div>
  );
}
