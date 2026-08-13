import { getPublishedBlogs } from "@/lib/blogs";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { MarketingLayout } from "@/components/MarketingLayout";

export const metadata = {
  title: "Blog | Pegasus",
  description: "Read the latest news, updates, and tutorials from the Pegasus team.",
};

export default async function BlogIndexPage() {
  const blogs = await getPublishedBlogs();

  return (
    <MarketingLayout>
      <div className="relative min-h-screen bg-background pt-48 pb-32 overflow-hidden selection:bg-foreground selection:text-background">
        <div className="absolute top-0 left-12 md:left-24 w-px h-full bg-foreground/[0.03]" />
        <div className="absolute top-0 right-12 md:right-24 w-px h-full bg-foreground/[0.03]" />

        <div className="max-w-5xl mx-auto px-6 lg:px-24 relative z-10">
          <div className="mb-24">
            <div className="inline-flex items-center text-foreground/30 text-xs tracking-[0.3em] uppercase mb-8 border border-border px-4 py-2">
              // TRANSMISSION_LOG
            </div>
            <h1 className="text-5xl md:text-7xl font-medium tracking-tighter text-foreground mb-8 uppercase leading-[0.9]">
              Blog
            </h1>
            <p className="text-foreground/40 text-sm uppercase tracking-[0.1em] max-w-2xl leading-relaxed">
              Latest news, updates, and deep dives into the Pegasus Discord bot ecosystem.
            </p>
          </div>

          <div className="w-full h-px bg-foreground/10 mb-16" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-foreground/10">
            {blogs.map((blog) => (
              <Link 
                key={blog.id} 
                href={`/blog/${blog.slug}`}
                className="group bg-[#050505] p-8 transition-all duration-500 hover:bg-foreground/[0.02] flex flex-col h-full"
              >
                <div className="flex items-center gap-2 text-[10px] font-mono text-foreground/30 mb-6 uppercase tracking-[0.3em]">
                  <Calendar className="w-3 h-3" />
                  {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : 'Draft'}
                </div>
                
                <h2 className="text-xl font-medium text-foreground mb-4 uppercase tracking-[0.05em] line-clamp-2 group-hover:tracking-[0.1em] transition-all duration-500">
                  {blog.title}
                </h2>
                
                <p className="text-foreground/40 text-sm line-clamp-3 mb-8 flex-1 font-light leading-relaxed">
                  {blog.shortDescription}
                </p>
                
                <div className="flex items-center justify-between mt-auto pt-6 border-t border-border">
                  <div className="flex items-center gap-3">
                    {blog.authorImage ? (
                      <img src={blog.authorImage} alt={blog.authorName || 'Author'} className="w-5 h-5 grayscale" />
                    ) : (
                      <div className="w-5 h-5 bg-foreground/10" />
                    )}
                    <span className="text-[10px] uppercase tracking-[0.3em] text-foreground/30">{blog.authorName || 'Pegasus Team'}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-foreground/20 group-hover:text-foreground group-hover:translate-x-1 transition-all duration-500" />
                </div>
              </Link>
            ))}
            
            {blogs.length === 0 && (
              <div className="col-span-full py-20 text-center text-foreground/30 text-xs uppercase tracking-[0.3em] bg-[#050505]">
                No transmissions published yet. Check back later.
              </div>
            )}
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
}
