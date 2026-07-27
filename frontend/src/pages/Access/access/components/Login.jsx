import { useState } from "react";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import Button from "../../../../components/ui/Button";
import api, { apiError } from "../../../../services/api";
import { fieldClass } from "../constants";

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await api.post("/auth/login", form);
      onLogin(data.user);
    } catch (requestError) {
      setError(apiError(requestError));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg rounded-3xl border border-border bg-card p-7 shadow-2xl md:p-10">
      <ShieldCheck className="text-primary" size={36} aria-hidden="true" />
      <h1 className="mt-5 font-title text-4xl">Acesso interno</h1>
      <p className="mt-3 leading-7 text-muted">Área exclusiva da Equipe LACE.</p>
      <form className="mt-8 space-y-5" onSubmit={submit}>
        <label className="block font-semibold">
          E-mail
          <input
            className={fieldClass}
            type="email"
            autoComplete="username"
            required
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
          />
        </label>
        <label className="block font-semibold">
          <span>Senha</span>
          <div className="relative">
            <input
              className={`${fieldClass} pr-14`}
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
            />
            <button
              type="button"
              className="absolute bottom-0 right-1 grid size-11 cursor-pointer place-items-center rounded-xl text-muted transition hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              aria-pressed={showPassword}
              title={showPassword ? "Ocultar senha" : "Mostrar senha"}
              onClick={() => setShowPassword((visible) => !visible)}
            >
              {showPassword ? <EyeOff size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}
            </button>
          </div>
        </label>
        {error && (
          <p className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-300" role="alert">
            {error}
          </p>
        )}
        <Button className="w-full disabled:cursor-wait disabled:opacity-60" type="submit" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </Button>
      </form>
    </div>
  );
}
