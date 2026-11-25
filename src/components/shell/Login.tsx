'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

/** Entrada com e-mail e senha. Funciona bem no iPhone, inclusive com o site salvo na tela de início. */
export function Login() {
  const [mode, setMode] = useState<'entrar' | 'criar'>('entrar');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setMessage('');
    const { error } =
      mode === 'entrar'
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });
    setBusy(false);
    if (error) {
      setMessage(
        error.message.includes('Invalid login') ? 'E-mail ou senha não conferem.'
        : error.message.includes('Password should') ? 'A senha precisa ter pelo menos 6 caracteres.'
        : error.message.includes('already registered') ? 'Este e-mail já tem conta. Use “Entrar”.'
        : 'Não foi possível concluir. Verifique a conexão e tente de novo.',
      );
    } else if (mode === 'criar') {
      setMessage('Conta criada. Se pedir confirmação, abra o e-mail que enviamos e depois entre aqui.');
    }
  };

  return (
    <div className="login">
      <h1 className="front-title"><span className="mix">Boas-vindas</span></h1>
      <p className="kicker">{mode === 'entrar' ? 'Entre para ver o seu dia.' : 'Crie seu acesso. Os dados ficam guardados na nuvem.'}</p>
      <form onSubmit={submit} className="login-form">
        <label htmlFor="email" className="sr-only">E-mail</label>
        <input id="email" type="email" autoComplete="email" required placeholder="e-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
        <label htmlFor="password" className="sr-only">Senha</label>
        <input id="password" type="password" autoComplete={mode === 'entrar' ? 'current-password' : 'new-password'} required minLength={6} placeholder="senha" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="btn" type="submit" disabled={busy}>{busy ? 'Aguarde…' : mode === 'entrar' ? 'Entrar' : 'Criar conta'}</button>
      </form>
      {message && <p className="login-msg" role="status">{message}</p>}
      <button className="link" onClick={() => { setMode(mode === 'entrar' ? 'criar' : 'entrar'); setMessage(''); }}>
        {mode === 'entrar' ? 'primeira vez? criar conta' : 'já tenho conta'}
      </button>
    </div>
  );
}
