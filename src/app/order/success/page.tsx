import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import Button from "@/components/ui/Button";

export default function OrderSuccessPage({ searchParams }: { searchParams: { orderId?: string; method?: string } }) {
  return (
    <div className="container-page flex flex-col items-center py-24 text-center">
      <CheckCircle2 className="text-sage" size={48} />
      <h1 className="mt-5 font-display text-3xl">Order confirmed</h1>
      <p className="mt-2 max-w-[46ch] text-ink/70">
        Thank you — your order has been placed.
        {searchParams.method === "cod" && " Please keep the cash ready, you will pay when it is delivered."}
        {searchParams.orderId && (
          <>
            {" "}
            Order reference: <span className="font-medium text-ink">{searchParams.orderId}</span>
          </>
        )}
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/dashboard/orders">
          <Button variant="secondary">Track your order</Button>
        </Link>
        <Link href="/products">
          <Button>Continue shopping</Button>
        </Link>
      </div>
    </div>
  );
}
