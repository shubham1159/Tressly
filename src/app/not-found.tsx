import Link from "next/link";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="container-page flex flex-col items-center py-28 text-center">
      <h1 className="font-display text-3xl">Page not found</h1>
      <p className="mt-2 text-ink/60">The page you're looking for doesn't exist or has moved.</p>
      <Link href="/" className="mt-6">
        <Button>Back to home</Button>
      </Link>
    </div>
  );
}
