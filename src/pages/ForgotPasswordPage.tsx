import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { customerService } from '@/services/customerService';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Button } from '@/components/ui/Button';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<{ type: 'idle' | 'success' | 'error'; message?: string }>({
    type: 'idle',
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const res = await customerService.requestPasswordResetDemo(email);
    if (res.success) {
      setStatus({ type: 'success', message: res.message });
    } else {
      setStatus({ type: 'error', message: res.message });
    }
  };

  return (
    <section className="py-10 sm:py-16 bg-ivory min-h-[70vh]">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[{ label: 'Sign In', to: '/login' }, { label: 'Reset Password' }]}
        />

        <div className="mx-auto max-w-md bg-white border border-border rounded-[6px] p-6 sm:p-8 space-y-5">
          <div className="text-center">
            <p className="font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-brand-secondary">
              Account Recovery · Demo
            </p>
            <h1 className="mt-2 font-serif text-[30px] sm:text-[34px] font-medium text-ink">
              Forgot Password
            </h1>
            <p className="mt-1.5 font-sans text-sm text-ink-secondary">
              Enter your email address to simulate a password reset confirmation.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label htmlFor="fp-email" className="block font-sans text-xs font-medium text-ink mb-1.5">
                Email Address
              </label>
              <input
                id="fp-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ananya@example.com"
                className="w-full h-11 px-3.5 rounded-[4px] border border-border bg-ivory/30 font-sans text-sm text-ink focus:outline-none focus:border-brand-green"
              />
            </div>

            {status.type === 'error' && (
              <p className="font-sans text-xs font-medium text-red-700" role="alert">
                {status.message}
              </p>
            )}

            {status.type === 'success' && (
              <div
                role="status"
                className="flex items-start gap-2 rounded-[4px] border border-brand-secondary/40 bg-ivory px-3.5 py-3 font-sans text-xs text-brand-green"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{status.message}</span>
              </div>
            )}

            <Button type="submit" variant="primary" size="lg" className="w-full">
              Reset Password
            </Button>
          </form>

          <div className="pt-2 border-t border-border text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 font-sans text-xs font-medium text-brand-green hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Sign In</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
