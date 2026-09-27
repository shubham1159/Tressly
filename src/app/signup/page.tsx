import AuthForm from "@/components/auth/AuthForm";

export const metadata = { title: "Create your account" };

export default function SignupPage() {
  return <AuthForm mode="signup" />;
}
