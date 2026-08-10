import { getBlogById } from "@/lib/blogs";
import { BlogForm } from "../_components/blog-form";
import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";

export const metadata = {
  title: "Edit Blog | Admin",
};

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/dashboard");
  
  const resolvedParams = await params;
  const blog = await getBlogById(resolvedParams.id);
  if (!blog) notFound();
  
  return <BlogForm initialData={blog} currentUserId={session.user.id} />;
}
