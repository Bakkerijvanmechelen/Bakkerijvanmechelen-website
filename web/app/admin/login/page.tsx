import LoginForm from "@/components/admin/LoginForm";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-sm pt-12">
      <h1 className="font-display text-3xl">Beheer</h1>
      <p className="mt-2 text-ink/70">Log in om de contactaanvragen en de ZAS-documenten te beheren.</p>
      <div className="mt-8">
        <LoginForm />
      </div>
    </div>
  );
}
