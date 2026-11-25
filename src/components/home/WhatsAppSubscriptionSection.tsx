import { useState, type FormEvent } from 'react';
import { CheckCircle2, MessageCircle } from 'lucide-react';
import { subscriptionService } from '@/services/subscriptionService';
import { Button } from '@/components/ui/Button';

export function WhatsAppSubscriptionSection() {
  const [phone, setPhone] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<{ type: 'idle' | 'success' | 'error'; message?: string }>({
    type: 'idle',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await subscriptionService.subscribeWhatsApp({ phone, consent });
    setSubmitting(false);

    if (res.success) {
      setStatus({ type: 'success', message: res.message });
      setPhone('');
      setConsent(false);
    } else {
      setStatus({ type: 'error', message: res.message });
    }
  };

  return (
    <section className="py-12 sm:py-16 bg-ivory">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-border rounded-[6px] px-5 py-8 sm:px-10 sm:py-12">
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[4px] bg-ivory border border-border text-brand-green font-sans text-[11px] uppercase tracking-[0.16em] mb-4">
              <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Private WhatsApp Lookbook</span>
            </div>

            <h2 className="font-serif text-[28px] sm:text-[36px] font-medium leading-[1.15] text-ink">
              Receive Early Collection Previews on WhatsApp
            </h2>
            <p className="mt-2.5 font-sans text-sm sm:text-[15px] text-ink-secondary">
              Join our inner circle for seasonal Chanderi drops, restock alerts, and personal
              styling invitations.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-left">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex flex-1 items-center border border-border rounded-[4px] bg-ivory/50 focus-within:border-brand-green focus-within:bg-white transition-colors">
                  <span className="px-3.5 font-sans text-sm font-medium text-ink-secondary border-r border-border">
                    +91
                  </span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 10-digit WhatsApp number"
                    aria-label="Mobile number for WhatsApp updates"
                    className="h-12 flex-1 bg-transparent px-3.5 font-sans text-sm text-ink placeholder:text-ink-secondary focus:outline-none"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={submitting}
                  className="h-12 sm:px-8"
                >
                  {submitting ? 'Joining...' : 'Subscribe'}
                </Button>
              </div>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-border accent-brand-green"
                />
                <span className="font-sans text-xs text-ink-secondary leading-relaxed">
                  I agree to receive collection announcements and styling updates from Smart Fashion
                  Stores via WhatsApp (demo simulation — no real messages sent).
                </span>
              </label>

              {status.type === 'error' && (
                <p className="font-sans text-xs font-medium text-red-700" role="alert">
                  {status.message}
                </p>
              )}

              {status.type === 'success' && (
                <div
                  role="status"
                  className="flex items-center gap-2 rounded-[4px] border border-brand-secondary/40 bg-ivory px-4 py-3 font-sans text-xs sm:text-sm text-brand-green"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{status.message}</span>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
