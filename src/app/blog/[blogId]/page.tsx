import { getBlogBySlug, getPublishedBlogs } from "@/lib/blogs";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";
import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { MarketingLayout } from "@/components/MarketingLayout";

export async function generateMetadata({ params }: { params: Promise<{ blogId: string }> }) {
  const resolvedParams = await params;
  const blog = await getBlogBySlug(resolvedParams.blogId);
  if (!blog) return { title: "Blog Not Found | Pegasus" };
  
  return {
    title: `${blog.title} | Pegasus Blog`,
    description: blog.shortDescription,
    openGraph: {
      title: blog.title,
      description: blog.shortDescription,
      type: "article",
      publishedTime: blog.publishedAt?.toISOString(),
      authors: [blog.authorName || 'Pegasus Team'],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ blogId: string }> }) {
  const resolvedParams = await params;
  const blog = await getBlogBySlug(resolvedParams.blogId);
  
  if (!blog) {
    notFound();
  }

  return (
    <MarketingLayout>
      <div className="relative min-h-screen bg-background pt-48 pb-32 overflow-hidden selection:bg-foreground selection:text-background">
        <div className="absolute top-0 left-12 md:left-24 w-px h-full bg-foreground/[0.03]" />
        <div className="absolute top-0 right-12 md:right-24 w-px h-full bg-foreground/[0.03]" />
        
        <div className="max-w-4xl mx-auto px-6 lg:px-24 relative z-10">
          <div className="mb-16">
            <Link href="/blog" className="inline-flex items-center gap-2 text-xs text-foreground/30 uppercase tracking-[0.3em] hover:text-foreground transition-colors mb-12">
              <ArrowLeft className="w-3 h-3" />
              Back to Blog
            </Link>
            
            <h1 className="text-4xl md:text-6xl font-medium text-foreground mb-8 tracking-tighter uppercase leading-[0.95]">
              {blog.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-xs border-y border-border py-4">
              <div className="flex items-center gap-3">
                {blog.authorImage ? (
                  <img src={blog.authorImage} alt={blog.authorName || 'Author'} className="w-6 h-6 grayscale border border-border" />
                ) : (
                  <div className="w-6 h-6 bg-foreground/10 flex items-center justify-center border border-border">
                    <span className="text-foreground text-[10px] font-bold">P</span>
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-foreground text-xs uppercase tracking-[0.2em]">{blog.authorName || 'Pegasus Team'}</span>
                  <span className="text-foreground/20 text-[10px] uppercase tracking-[0.3em]">Author</span>
                </div>
              </div>
              
              <div className="w-px h-6 bg-foreground/10 hidden sm:block" />
              
              <div className="flex items-center gap-2 text-foreground/30 uppercase tracking-[0.3em]">
                <Calendar className="w-3 h-3" />
                <span>
                  {blog.publishedAt 
                    ? new Date(blog.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) 
                    : 'Draft'}
                </span>
              </div>
            </div>
          </div>

          <div className="prose prose-invert prose-lg max-w-none prose-headings:font-medium prose-headings:tracking-tighter prose-headings:uppercase prose-a:text-foreground prose-a:underline prose-a:underline-offset-4 prose-img:border prose-img:border-border border border-border bg-[#050505] p-8 md:p-12">
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
                      className="my-4 border border-border"
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
              {blog.content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
}
