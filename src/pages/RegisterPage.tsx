import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Info } from 'lucide-react';
import { useCustomerStore } from '@/store/useCustomerStore';
import { customerService } from '@/services/customerService';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Button } from '@/components/ui/Button';

export default function RegisterPage() {
  const navigate = useNavigate();
  const loginDemoSession = useCustomerStore((s) => s.loginDemoSession);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (fullName.trim().length < 2) {
      setError('Please enter your full name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (phone.replace(/\D/g, '').length !== 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!acceptedTerms) {
      setError('Please accept the draft Terms & Conditions and Privacy Policy.');
      return;
    }

    const res = await customerService.registerDemo({
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.replace(/\D/g, ''),
    });

    if (!res.success) {
      setError(res.message);
      return;
    }

    setError(null);
    // Only non-sensitive profile display fields are persisted in localStorage; password is never stored
    loginDemoSession(
      {
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.replace(/\D/g, ''),
      },
      true
    );
    navigate('/account', { replace: true });
  };

  return (
    <section className="py-10 sm:py-16 bg-ivory min-h-[75vh]">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: 'Create Account' }]} />

        <div className="mx-auto max-w-md bg-white border border-border rounded-[6px] p-6 sm:p-8 space-y-5">
          <div className="text-center">
            <p className="font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-brand-secondary">
              Join Smart Fashion · Client Demo
            </p>
            <h1 className="mt-2 font-serif text-[32px] sm:text-[36px] font-medium leading-tight text-ink">
              Create Account
            </h1>
            <p className="mt-1.5 font-sans text-sm text-ink-secondary">
              Save your delivery addresses and review simulated order updates.
            </p>
          </div>

          <div className="rounded-[4px] border border-brand-green/25 bg-ivory p-3.5 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-brand-green shrink-0 mt-0.5" aria-hidden="true" />
            <p className="font-sans text-xs text-ink-secondary leading-relaxed">
              Demo registration only. Your password is validated in memory and is never stored in
              localStorage or sent to a server.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label htmlFor="reg-name" className="block font-sans text-xs font-medium text-ink mb-1.5">
                Full Name *
              </label>
              <input
                id="reg-name"
                type="text"
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Meera Joshi"
                className="w-full h-11 px-3.5 rounded-[4px] border border-border bg-ivory/30 font-sans text-sm text-ink focus:outline-none focus:border-brand-green"
              />
            </div>

            <div>
              <label htmlFor="reg-email" className="block font-sans text-xs font-medium text-ink mb-1.5">
                Email Address *
              </label>
              <input
                id="reg-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="meera@example.com"
                className="w-full h-11 px-3.5 rounded-[4px] border border-border bg-ivory/30 font-sans text-sm text-ink focus:outline-none focus:border-brand-green"
              />
            </div>

            <div>
              <label htmlFor="reg-phone" className="block font-sans text-xs font-medium text-ink mb-1.5">
                Mobile Number (10 digits) *
              </label>
              <input
                id="reg-phone"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                placeholder="9820000001"
                className="w-full h-11 px-3.5 rounded-[4px] border border-border bg-ivory/30 font-sans text-sm text-ink focus:outline-none focus:border-brand-green"
              />
            </div>

            <div>
              <label htmlFor="reg-pw" className="block font-sans text-xs font-medium text-ink mb-1.5">
                Password *
              </label>
              <div className="relative">
                <input
                  id="reg-pw"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
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

            <div>
              <label htmlFor="reg-cpw" className="block font-sans text-xs font-medium text-ink mb-1.5">
                Confirm Password *
              </label>
              <input
                id="reg-cpw"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full h-11 px-3.5 rounded-[4px] border border-border bg-ivory/30 font-sans text-sm text-ink focus:outline-none focus:border-brand-green"
              />
            </div>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-border accent-brand-green"
              />
              <span className="font-sans text-xs text-ink-secondary leading-relaxed">
                I accept the draft{' '}
                <Link to="/terms" className="text-brand-green hover:underline">
                  Terms & Conditions
                </Link>{' '}
                and{' '}
                <Link to="/privacy-policy" className="text-brand-green hover:underline">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>

            {error && (
              <p className="font-sans text-xs font-medium text-red-700" role="alert">
                {error}
              </p>
            )}

            <Button type="submit" variant="primary" size="lg" className="w-full">
              Create Demo Account
            </Button>
          </form>

          <p className="text-center font-sans text-xs text-ink-secondary pt-2 border-t border-border">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-brand-green hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
