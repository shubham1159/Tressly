import Link from "next/link";

export const metadata = { title: "Admin" };

export default function AdminHome() {
  return (
    <div className="container-page py-10">
      <h1 className="font-display text-3xl">Admin</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link href="/admin/products" className="rounded-2xl border border-ink/10 p-6 hover:border-ink/30">
          <p className="font-medium">Products</p>
          <p className="mt-1 text-sm text-ink/60">Add, edit, and remove catalog items</p>
        </Link>
      </div>
    </div>
  );
}
