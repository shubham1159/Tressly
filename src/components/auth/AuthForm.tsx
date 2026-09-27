"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Mail, Lock, User as UserIcon, Eye, EyeOff } from "lucide-react";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

export default function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const { refresh } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/auth/${mode === "login" ? "login" : "register"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mode === "login" ? { email, password } : { name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }
      await refresh();
      toast.success(mode === "login" ? "Welcome back" : "Account created");
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-page grid min-h-[80vh] items-center gap-0 py-10 md:grid-cols-2">
      {/* Decorative side panel — hidden on small screens */}
      <div className="relative hidden h-full overflow-hidden rounded-3xl bg-sand md:block">
        <img
          src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1000"
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/10 to-transparent" />
        <div className="absolute bottom-8 left-8 right-8 text-ivory">
          <p className="font-display text-3xl leading-tight">Hair accessories worth keeping.</p>
          <p className="mt-2 text-sm text-ivory/80">
            Scrunchies, clips, clutchers and pins — track orders, save favourites, and check out faster.
          </p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex justify-center px-2 py-10 md:px-12">
        <div className="w-full max-w-sm">
          <p className="font-display text-2xl">Tressly</p>
          <h1 className="mt-4 font-display text-3xl">{mode === "login" ? "Welcome back" : "Create your account"}</h1>
          <p className="mt-2 text-sm text-ink/60">
            {mode === "login" ? "New here?" : "Already have an account?"}{" "}
            <Link href={mode === "login" ? "/signup" : "/login"} className="link-underline text-ink">
              {mode === "login" ? "Create an account" : "Sign in"}
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {mode === "signup" && (
              <IconField
                label="Full name"
                value={name}
                onChange={setName}
                type="text"
                required
                icon={<UserIcon size={16} className="text-ink/40" />}
              />
            )}
            <IconField
              label="Email"
              value={email}
              onChange={setEmail}
              type="email"
              required
              icon={<Mail size={16} className="text-ink/40" />}
            />
            <IconField
              label="Password"
              value={password}
              onChange={setPassword}
              type={showPassword ? "text" : "password"}
              required
              minLength={6}
              icon={<Lock size={16} className="text-ink/40" />}
              trailing={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-ink/40 hover:text-ink"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />

            {error && (
              <p className="rounded-lg bg-berry/10 px-3 py-2 text-sm text-berry">{error}</p>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-ink/40">
            By continuing you agree to our Terms and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}

function IconField({
  label,
  value,
  onChange,
  type,
  required,
  minLength,
  icon,
  trailing,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type: string;
  required?: boolean;
  minLength?: number;
  icon: React.ReactNode;
  trailing?: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-ink/15 bg-ivory px-3 py-2.5 focus-within:border-ink/40">
        {icon}
        <input
          type={type}
          required={required}
          minLength={minLength}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-sm outline-none"
        />
        {trailing}
      </div>
    </label>
  );
}
