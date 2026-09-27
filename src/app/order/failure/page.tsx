import Link from "next/link";
import { XCircle } from "lucide-react";
import Button from "@/components/ui/Button";

export default function OrderFailurePage() {
  return (
    <div className="container-page flex flex-col items-center py-24 text-center">
      <XCircle className="text-berry" size={48} />
      <h1 className="mt-5 font-display text-3xl">Payment didn't go through</h1>
      <p className="mt-2 max-w-[46ch] text-ink/70">
        No amount has been deducted for this attempt. Your cart is still saved — you can try paying again.
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/checkout">
          <Button>Try again</Button>
        </Link>
        <Link href="/cart">
          <Button variant="secondary">Back to cart</Button>
        </Link>
      </div>
    </div>
  );
}
