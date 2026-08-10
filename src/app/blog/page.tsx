import { getPublishedBlogs } from "@/lib/blogs";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";

export const metadata = {
  title: "Blog | Pegasus",
  description: "Read the latest news, updates, and tutorials from the Pegasus team.",
};

export default async function BlogIndexPage() {
  const blogs = await getPublishedBlogs();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden pt-24 pb-16">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 blur-[120px] rounded-full pointer-events-none opacity-50" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-5xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-foreground mb-4 tracking-tight">
            Pegasus <span className="text-primary">Blog</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
            Latest news, updates, and deep dives into the Pegasus Discord bot ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <Link 
              key={blog.id} 
              href={`/blog/${blog.slug}`}
              className="group bg-card/40 backdrop-blur-xl border border-border/50 rounded-2xl p-6 transition-all duration-300 hover:bg-card/60 hover:shadow-2xl hover:-translate-y-1 hover:border-primary/30 flex flex-col h-full"
            >
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-4">
                <Calendar className="w-3.5 h-3.5" />
                {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : 'Draft'}
              </div>
              
              <h2 className="text-2xl font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                {blog.title}
              </h2>
              
              <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-1">
                {blog.shortDescription}
              </p>
              
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                <div className="flex items-center gap-2">
                  {blog.authorImage ? (
                    <img src={blog.authorImage} alt={blog.authorName || 'Author'} className="w-6 h-6 rounded-full" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-primary/20" />
                  )}
                  <span className="text-xs font-medium text-muted-foreground">{blog.authorName || 'Pegasus Team'}</span>
                </div>
                <div className="text-primary group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
          
          {blogs.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground border border-border/50 rounded-2xl bg-card/20 backdrop-blur-sm">
              <p>No blogs published yet. Check back later!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
