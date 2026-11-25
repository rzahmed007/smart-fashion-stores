import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Info, Sparkles } from 'lucide-react';
import { useCustomerStore } from '@/store/useCustomerStore';
import { customerService } from '@/services/customerService';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const loginDemoSession = useCustomerStore((s) => s.loginDemoSession);

  const redirectTo = (location.state as { from?: string } | null)?.from || '/account';

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError('Please enter your email address or 10-digit mobile number.');
      return;
    }
    if (password.length < 6) {
      setError('Please enter a password of at least 6 characters (demo check only).');
      return;
    }

    const res = await customerService.loginDemo(identifier);
    if (!res.success) {
      setError(res.message);
      return;
    }

    setError(null);
    const isEmail = identifier.includes('@');
    loginDemoSession(
      isEmail
        ? { email: identifier.trim() }
        : { phone: identifier.replace(/\D/g, '').slice(0, 10) || '9820000001' },
      rememberMe
    );
    navigate(redirectTo, { replace: true });
  };

  const handleInstantDemoLogin = () => {
    loginDemoSession(undefined, true);
    navigate(redirectTo, { replace: true });
  };

  return (
    <section className="py-10 sm:py-16 bg-ivory min-h-[75vh]">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: 'Sign In' }]} />

        <div className="mx-auto max-w-md bg-white border border-border rounded-[6px] p-6 sm:p-8 space-y-6">
          <div className="text-center">
            <p className="font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-brand-secondary">
              Customer Portal · Client Demo
            </p>
            <h1 className="mt-2 font-serif text-[32px] sm:text-[38px] font-medium leading-tight text-ink">
              Welcome Back
            </h1>
            <p className="mt-1.5 font-sans text-sm text-ink-secondary">
              Access your simulated orders, saved addresses, and curated wishlist.
            </p>
          </div>

          <div className="rounded-[4px] border border-brand-green/25 bg-ivory p-3.5 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-brand-green shrink-0 mt-0.5" aria-hidden="true" />
            <p className="font-sans text-xs text-ink-secondary leading-relaxed">
              Simulated authentication for client demonstration. Passwords are never saved or sent
              to external servers.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={handleInstantDemoLogin}
            className="w-full"
          >
            <Sparkles className="w-4 h-4" />
            <span>Continue with Demo Customer Login</span>
          </Button>

          <div className="relative flex items-center justify-center">
            <span className="border-t border-border w-full" />
            <span className="bg-white px-3 font-sans text-[11px] uppercase tracking-[0.14em] text-ink-secondary shrink-0">
              or sign in manually
            </span>
            <span className="border-t border-border w-full" />
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label htmlFor="login-id" className="block font-sans text-xs font-medium text-ink mb-1.5">
                Email or Mobile Number
              </label>
              <input
                id="login-id"
                type="text"
                autoComplete="username"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="ananya@example.com or 9820000001"
                className="w-full h-11 px-3.5 rounded-[4px] border border-border bg-ivory/30 font-sans text-sm text-ink focus:outline-none focus:border-brand-green"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="login-pw" className="font-sans text-xs font-medium text-ink">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="font-sans text-xs text-brand-green hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="login-pw"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter demo password (min 6 chars)"
                  className="w-full h-11 pl-3.5 pr-11 rounded-[4px] border border-border bg-ivory/30 font-sans text-sm text-ink focus:outline-none focus:border-brand-green"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center text-ink-secondary hover:text-ink"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-border accent-brand-green"
              />
              <span className="font-sans text-xs text-ink-secondary">
                Remember my demo session on this browser
              </span>
            </label>

            {error && (
              <p className="font-sans text-xs font-medium text-red-700" role="alert">
                {error}
              </p>
            )}

            <Button type="submit" variant="primary" size="lg" className="w-full">
              Sign In
            </Button>
          </form>

          <p className="text-center font-sans text-xs text-ink-secondary pt-2 border-t border-border">
            New to Smart Fashion Stores?{' '}
            <Link to="/register" className="font-medium text-brand-green hover:underline">
              Create an Account
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
