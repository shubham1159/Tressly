import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export default function Button({ variant = "primary", className, ...props }: Props) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none",
        variant === "primary" && "bg-ink text-ivory hover:bg-berry",
        variant === "secondary" && "border border-ink/20 bg-transparent hover:border-ink",
        variant === "ghost" && "hover:bg-ink/5",
        className
      )}
      {...props}
    />
  );
}
