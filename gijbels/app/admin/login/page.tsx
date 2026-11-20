import LoginForm from "@/components/admin/LoginForm";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-sm pt-12">
      <h1 className="font-display text-3xl">Beheer</h1>
      <p className="mt-2 text-lg text-ink/70">Log in om de berichten van de website te beheren.</p>
      <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
        <LoginForm />
      </div>
      <p className="mt-4 text-sm text-ink/60">Wachtwoord kwijt? Vraag een nieuw aan degene die dit beheer voor jullie heeft opgezet.</p>
    </div>
  );
}
