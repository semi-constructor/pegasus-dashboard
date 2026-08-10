"use server";

import { db } from "@/lib/db";
import { blogs } from "schemas/blogs";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createBlog(data: {
  title: string;
  slug: string;
  shortDescription: string;
  content: string;
  publishedAt: Date;
  authorId: string;
}) {
  await db.insert(blogs).values({
    title: data.title,
    slug: data.slug,
    shortDescription: data.shortDescription,
    content: data.content,
    publishedAt: data.publishedAt,
    authorId: data.authorId,
  });
  revalidatePath('/blog');
  revalidatePath('/dashboard/admin/blogs');
  return { success: true };
}

export async function updateBlog(id: string, data: {
  title: string;
  slug: string;
  shortDescription: string;
  content: string;
  publishedAt: Date;
}) {
  await db.update(blogs).set({
    ...data,
    updatedAt: new Date(),
  }).where(eq(blogs.id, id));
  
  revalidatePath('/blog');
  revalidatePath(`/blog/${data.slug}`);
  revalidatePath('/dashboard/admin/blogs');
  return { success: true };
}

export async function deleteBlog(id: string) {
  await db.delete(blogs).where(eq(blogs.id, id));
  revalidatePath('/blog');
  revalidatePath('/dashboard/admin/blogs');
  return { success: true };
}
