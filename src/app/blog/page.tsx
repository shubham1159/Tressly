import Link from "next/link";
import { posts } from "@/data/blog";

export const metadata = {
  title: "Journal",
  description: "Styling ideas, hair-care guides and stories from the Tressly team.",
};

export default function BlogIndexPage() {
  return (
    <div className="container-page py-10">
      <h1 className="font-display text-3xl">Journal</h1>
      <div className="mt-8 grid gap-8 sm:grid-cols-2">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
            <p className="text-xs text-ink/50">{new Date(post.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
            <h2 className="mt-2 font-display text-xl group-hover:text-berry">{post.title}</h2>
            <p className="mt-2 text-sm text-ink/70">{post.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
