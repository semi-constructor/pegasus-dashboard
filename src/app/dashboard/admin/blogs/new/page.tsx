import { BlogForm } from "../_components/blog-form";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Create New Blog | Admin",
};

export default async function NewBlogPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/dashboard");
  
  return <BlogForm currentUserId={session.user.id} />;
}
