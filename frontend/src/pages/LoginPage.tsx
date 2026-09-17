import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      navigate('/');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      setError(msg ?? 'Invalid email or password.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <i className="bi bi-lightning-charge-fill auth-brand-icon" />
          <h1 className="auth-brand-name">ChatFlow</h1>
        </div>
        <p className="auth-subtitle">Sign in to continue</p>

        {error && (
          <div className="alert alert-danger auth-alert" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="auth-field">
            <label htmlFor="login-email" className="auth-label">Email</label>
            <div className="input-icon-wrap">
              <i className="bi bi-envelope input-icon" />
              <input
                id="login-email"
                type="email"
                className="auth-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                autoComplete="email"
              />
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="login-password" className="auth-label">Password</label>
            <div className="input-icon-wrap">
              <i className="bi bi-lock input-icon" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                className="auth-input auth-input--padded-right"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="show-password-btn"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`} />
              </button>
            </div>
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            className="auth-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="spinner-border spinner-border-sm me-2" role="status" />
            ) : (
              <i className="bi bi-arrow-right-circle me-2" />
            )}
            Sign In
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account?{' '}
          <Link to="/register" className="auth-link">Create one</Link>
        </p>
      </div>
    </div>
  );
}
