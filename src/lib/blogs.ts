import { db } from "@/lib/db";
import { blogs } from "schemas/blogs";
import { authUsers } from "schemas/auth";
import { eq, desc, and, lte } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getPublishedBlogs() {
  return await db
    .select({
      id: blogs.id,
      title: blogs.title,
      slug: blogs.slug,
      shortDescription: blogs.shortDescription,
      publishedAt: blogs.publishedAt,
      authorId: blogs.authorId,
      authorName: authUsers.name,
      authorImage: authUsers.image,
    })
    .from(blogs)
    .leftJoin(authUsers, eq(blogs.authorId, authUsers.id))
    .where(lte(blogs.publishedAt, new Date()))
    .orderBy(desc(blogs.publishedAt));
}

export async function getBlogBySlug(slug: string) {
  const result = await db
    .select({
      id: blogs.id,
      title: blogs.title,
      slug: blogs.slug,
      shortDescription: blogs.shortDescription,
      content: blogs.content,
      publishedAt: blogs.publishedAt,
      authorId: blogs.authorId,
      authorName: authUsers.name,
      authorImage: authUsers.image,
    })
    .from(blogs)
    .leftJoin(authUsers, eq(blogs.authorId, authUsers.id))
    .where(eq(blogs.slug, slug))
    .limit(1);
    
  return result[0] || null;
}

export async function getAllBlogs() {
  return await db
    .select({
      id: blogs.id,
      title: blogs.title,
      slug: blogs.slug,
      publishedAt: blogs.publishedAt,
      createdAt: blogs.createdAt,
    })
    .from(blogs)
    .orderBy(desc(blogs.createdAt));
}

export async function getBlogById(id: string) {
  const result = await db
    .select({
      id: blogs.id,
      title: blogs.title,
      slug: blogs.slug,
      shortDescription: blogs.shortDescription,
      content: blogs.content,
      publishedAt: blogs.publishedAt,
      authorId: blogs.authorId,
      authorName: authUsers.name,
      authorImage: authUsers.image,
    })
    .from(blogs)
    .leftJoin(authUsers, eq(blogs.authorId, authUsers.id))
    .where(eq(blogs.id, id))
    .limit(1);
  return result[0] || null;
}

