import { getAllBlogs } from "@/lib/blogs";
import { BlogsClient } from "./_components/blogs-client";

export const metadata = {
  title: "Manage Blogs | Admin",
};

export default async function AdminBlogsPage() {
  const blogs = await getAllBlogs();
  
  return <BlogsClient initialBlogs={blogs} />;
}
