import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function RegisterPage() {
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (form.password !== form.password_confirmation) {
      setErrors({ password_confirmation: 'Passwords do not match.' });
      return;
    }

    try {
      await register(form.name, form.email, form.password, form.password_confirmation);
      navigate('/');
    } catch (err: unknown) {
      const data = (err as { response?: { data?: { errors?: Record<string, string[]>; message?: string } } })
        ?.response?.data;
      if (data?.errors) {
        const flat: Record<string, string> = {};
        for (const [k, v] of Object.entries(data.errors)) flat[k] = v[0];
        setErrors(flat);
      } else {
        setErrors({ general: data?.message ?? 'Registration failed.' });
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <i className="bi bi-lightning-charge-fill auth-brand-icon" />
          <h1 className="auth-brand-name">ChatFlow</h1>
        </div>
        <p className="auth-subtitle">Create your account</p>

        {errors.general && (
          <div className="alert alert-danger auth-alert" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2" />
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="auth-field">
            <label htmlFor="reg-name" className="auth-label">Full Name</label>
            <div className="input-icon-wrap">
              <i className="bi bi-person input-icon" />
              <input id="reg-name" type="text" className={`auth-input ${errors.name ? 'input--error' : ''}`}
                placeholder="John Doe" value={form.name} onChange={set('name')} required autoFocus />
            </div>
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>

          <div className="auth-field">
            <label htmlFor="reg-email" className="auth-label">Email</label>
            <div className="input-icon-wrap">
              <i className="bi bi-envelope input-icon" />
              <input id="reg-email" type="email" className={`auth-input ${errors.email ? 'input--error' : ''}`}
                placeholder="you@example.com" value={form.email} onChange={set('email')} required autoComplete="email" />
            </div>
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="auth-field">
            <label htmlFor="reg-password" className="auth-label">Password</label>
            <div className="input-icon-wrap">
              <i className="bi bi-lock input-icon" />
              <input id="reg-password" type={showPassword ? 'text' : 'password'}
                className={`auth-input auth-input--padded-right ${errors.password ? 'input--error' : ''}`}
                placeholder="Min 8 characters" value={form.password} onChange={set('password')} required />
              <button type="button" className="show-password-btn"
                onClick={() => setShowPassword((s) => !s)} aria-label="Toggle password">
                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`} />
              </button>
            </div>
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          <div className="auth-field">
            <label htmlFor="reg-confirm" className="auth-label">Confirm Password</label>
            <div className="input-icon-wrap">
              <i className="bi bi-lock-fill input-icon" />
              <input id="reg-confirm" type={showPassword ? 'text' : 'password'}
                className={`auth-input ${errors.password_confirmation ? 'input--error' : ''}`}
                placeholder="Repeat password" value={form.password_confirmation} onChange={set('password_confirmation')} required />
            </div>
            {errors.password_confirmation && <span className="field-error">{errors.password_confirmation}</span>}
          </div>

          <button id="register-submit-btn" type="submit" className="auth-submit-btn" disabled={isLoading}>
            {isLoading ? <span className="spinner-border spinner-border-sm me-2" role="status" /> : <i className="bi bi-person-plus me-2" />}
            Create Account
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
