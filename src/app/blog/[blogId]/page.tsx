import { getBlogBySlug, getPublishedBlogs } from "@/lib/blogs";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";
import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

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
    <div className="min-h-screen bg-background relative overflow-hidden pt-24 pb-16">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 blur-[120px] rounded-full pointer-events-none opacity-50" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-4xl">
        <div className="mb-10">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-6 tracking-tight leading-tight">
            {blog.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground border-y border-border/50 py-4">
            <div className="flex items-center gap-3">
              {blog.authorImage ? (
                <img src={blog.authorImage} alt={blog.authorName || 'Author'} className="w-8 h-8 rounded-full border border-border" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                  <span className="text-primary font-bold text-xs">P</span>
                </div>
              )}
              <div className="flex flex-col">
                <span className="font-semibold text-foreground">{blog.authorName || 'Pegasus Team'}</span>
                <span className="text-xs">Author</span>
              </div>
            </div>
            
            <div className="w-px h-8 bg-border/50 hidden sm:block" />
            
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>
                {blog.publishedAt 
                  ? new Date(blog.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) 
                  : 'Draft'}
              </span>
            </div>
          </div>
        </div>

        <div className="prose prose-invert prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-xl prose-img:border prose-img:border-border/50 bg-card/20 backdrop-blur-sm border border-border/50 rounded-3xl p-6 md:p-10 shadow-xl">
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
            {blog.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
