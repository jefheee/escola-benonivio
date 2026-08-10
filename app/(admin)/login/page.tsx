'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { login } from './actions';
import { GraduationCap, Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';

const initialState = {
  error: null as string | null,
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-[#00185f] hover:bg-[#001144] disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 outline-none focus:ring-2 focus:ring-[#00185f] focus:ring-offset-2"
    >
      {pending ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Acessando...</span>
        </>
      ) : (
        <span>Entrar no Sistema</span>
      )}
    </button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useFormState(login, initialState);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-subtle border border-slate-100 p-8 space-y-6">

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-[#00185f]/5 text-[#00185f] rounded-2xl mb-2">
            <GraduationCap className="h-8 w-8 text-[#00185f]" />
          </div>
          <h1 className="text-xl font-bold text-[#00185f] font-display tracking-tight">
            EEB Prof. Benonívio João Martins
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Painel Administrativo da Escola
          </p>
        </div>

        {/* Form */}
        <form action={formAction} className="space-y-5">
          {/* Error Message */}
          {state?.error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start gap-3 text-sm font-medium">
              <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
              <span>{state.error}</span>
            </div>
          )}

          {/* Email Input */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              E-mail de Acesso
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="h-5 w-5" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="exemplo@escola.com"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#00185f] focus:ring-1 focus:ring-[#00185f] outline-none transition-all"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label htmlFor="password" className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Senha
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="h-5 w-5" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#00185f] focus:ring-1 focus:ring-[#00185f] outline-none transition-all"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <SubmitButton />
          </div>
        </form>

        {/* Footer info */}
        <div className="text-center pt-2">
          <p className="text-[11px] text-slate-400 font-medium">
            Acesso restrito para funcionários da escola.
          </p>
        </div>
      </div>
    </div>
  );
}
