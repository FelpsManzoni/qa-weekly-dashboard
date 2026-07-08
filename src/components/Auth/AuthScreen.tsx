import { useState, type FormEvent } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { bilingualText, copy } from '../../utils/copy';
import './AuthScreen.css';

type Mode = 'login' | 'register';

export function AuthScreen() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<Mode>('login');
  const [values, setValues] = useState({ username: '', email: '', password: '', display_name: '' });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const update = (field: keyof typeof values) => (event: { target: { value: string } }) =>
    setValues((current) => ({ ...current, [field]: event.target.value }));

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const apiError =
      mode === 'login'
        ? await login(values.username, values.password)
        : await register({
            username: values.username,
            email: values.email,
            password: values.password,
            display_name: values.display_name || undefined
          });

    setSubmitting(false);
    if (apiError) {
      setError(apiError.message);
    }
  };

  return (
    <div className="auth-screen">
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="auth-card__brand">SiDi QA</div>
        <h1 className="auth-card__title">{bilingualText(mode === 'login' ? copy.signIn : copy.signUp)}</h1>
        <p className="auth-card__subtitle">{bilingualText(copy.authSubtitle)}</p>

        {error ? <div className="auth-card__error">{error}</div> : null}

        <label className="auth-card__field">
          {bilingualText(copy.username)}
          <input value={values.username} onChange={update('username')} autoComplete="username" required />
        </label>

        {mode === 'register' ? (
          <>
            <label className="auth-card__field">
              {bilingualText(copy.email)}
              <input type="email" value={values.email} onChange={update('email')} autoComplete="email" required />
            </label>
            <label className="auth-card__field">
              {bilingualText(copy.displayName)}
              <input value={values.display_name} onChange={update('display_name')} autoComplete="name" />
            </label>
          </>
        ) : null}

        <label className="auth-card__field">
          {bilingualText(copy.password)}
          <input
            type="password"
            value={values.password}
            onChange={update('password')}
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            required
          />
        </label>

        <button className="auth-card__submit" type="submit" disabled={submitting}>
          {bilingualText(mode === 'login' ? copy.signIn : copy.signUp)}
        </button>

        <button
          className="auth-card__toggle"
          type="button"
          onClick={() => {
            setError(null);
            setMode((current) => (current === 'login' ? 'register' : 'login'));
          }}
        >
          {bilingualText(mode === 'login' ? copy.needAccount : copy.haveAccount)}
        </button>
      </form>
    </div>
  );
}
