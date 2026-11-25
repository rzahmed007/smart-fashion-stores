import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  HelpCircle,
  Info,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from 'lucide-react';
import { CONTACT_INFO_PLACEHOLDERS, FAQ_CATEGORIES } from '@/data/brandContent';
import { customerService } from '@/services/customerService';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Button } from '@/components/ui/Button';

export default function ContactPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<{
    type: 'idle' | 'success' | 'error';
    text?: string;
  }>({ type: 'idle' });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (fullName.trim().length < 2) {
      setStatus({ type: 'error', text: 'Please enter your full name.' });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setStatus({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }
    if (phone.trim() && phone.replace(/\D/g, '').length !== 10) {
      setStatus({ type: 'error', text: 'Please enter a valid 10-digit mobile number.' });
      return;
    }
    if (!subject.trim()) {
      setStatus({ type: 'error', text: 'Please enter a subject for your inquiry.' });
      return;
    }
    if (message.trim().length < 10) {
      setStatus({ type: 'error', text: 'Please enter a message of at least 10 characters.' });
      return;
    }

    const res = await customerService.submitContactFormDemo({
      fullName,
      email,
      subject,
      message,
    });

    if (res.success) {
      setStatus({ type: 'success', text: res.message });
      setFullName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
    } else {
      setStatus({ type: 'error', text: res.message });
    }
  };

  const quickFaqs = FAQ_CATEGORIES.slice(0, 3).map((cat) => cat.items[0]);

  return (
    <section className="py-8 sm:py-12 bg-ivory min-h-[75vh]">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: 'Contact Us' }]} />

        <div className="max-w-2xl pb-8">
          <p className="font-sans text-xs font-medium uppercase tracking-[0.2em] text-brand-secondary">
            Customer Concierge · Client Demo
          </p>
          <h1 className="mt-2 font-serif text-[32px] sm:text-[42px] font-medium leading-[1.1] text-ink">
            Contact Us
          </h1>
          <p className="mt-2.5 font-sans text-sm sm:text-base leading-relaxed text-ink-secondary">
            Need styling advice, sizing assistance, or order support? Reach out through the demo
            concierge form below or explore our Frequently Asked Questions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Contact Details Column */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-white border border-border rounded-[4px] p-6 space-y-5">
              <div className="rounded-[4px] border border-brand-green/25 bg-ivory p-3.5 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-brand-green shrink-0 mt-0.5" />
                <p className="font-sans text-xs text-ink-secondary">
                  Provisional contact details shown below pending final client confirmation.
                </p>
              </div>

              <div className="space-y-4 font-sans text-sm">
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-brand-green shrink-0 mt-1" />
                  <div>
                    <p className="text-xs uppercase tracking-wider text-ink-secondary">Email</p>
                    <p className="font-medium text-ink">{CONTACT_INFO_PLACEHOLDERS.supportEmail}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-brand-green shrink-0 mt-1" />
                  <div>
                    <p className="text-xs uppercase tracking-wider text-ink-secondary">Phone</p>
                    <p className="font-medium text-ink">{CONTACT_INFO_PLACEHOLDERS.supportPhone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MessageCircle className="w-4 h-4 text-brand-green shrink-0 mt-1" />
                  <div>
                    <p className="text-xs uppercase tracking-wider text-ink-secondary">WhatsApp</p>
                    <a
                      href="https://wa.me/919820000000"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-brand-green hover:underline"
                    >
                      {CONTACT_INFO_PLACEHOLDERS.whatsappNumber}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-brand-green shrink-0 mt-1" />
                  <div>
                    <p className="text-xs uppercase tracking-wider text-ink-secondary">
                      Business Address
                    </p>
                    <p className="text-ink">{CONTACT_INFO_PLACEHOLDERS.addressLine}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-brand-green shrink-0 mt-1" />
                  <div>
                    <p className="text-xs uppercase tracking-wider text-ink-secondary">
                      Business Hours
                    </p>
                    <p className="text-ink">{CONTACT_INFO_PLACEHOLDERS.businessHours}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick FAQ Preview */}
            <div className="bg-white border border-border rounded-[4px] p-6 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-xl font-medium text-ink flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-brand-green" />
                  <span>Quick Answers</span>
                </h2>
                <Link to="/faq" className="font-sans text-xs font-medium text-brand-green hover:underline">
                  View All FAQs
                </Link>
              </div>
              <ul className="divide-y divide-border">
                {quickFaqs.map((faq) => (
                  <li key={faq.question} className="py-2.5 first:pt-1 last:pb-0">
                    <p className="font-sans text-xs font-semibold text-ink">{faq.question}</p>
                    <p className="mt-1 font-sans text-xs text-ink-secondary leading-relaxed">
                      {faq.answer}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Form Column */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-border rounded-[4px] p-6 sm:p-8">
              <h2 className="font-serif text-2xl sm:text-3xl font-medium text-ink">
                Send a Message (Demo)
              </h2>
              <p className="mt-1 font-sans text-xs text-ink-secondary">
                Simulated form submission — no data is sent to external email or CRM services.
              </p>

              <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="cnt-name" className="block font-sans text-xs font-medium text-ink mb-1.5">
                      Full Name *
                    </label>
                    <input
                      id="cnt-name"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full h-11 px-3.5 rounded-[4px] border border-border bg-ivory/30 font-sans text-sm focus:outline-none focus:border-brand-green"
                    />
                  </div>
                  <div>
                    <label htmlFor="cnt-email" className="block font-sans text-xs font-medium text-ink mb-1.5">
                      Email Address *
                    </label>
                    <input
                      id="cnt-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full h-11 px-3.5 rounded-[4px] border border-border bg-ivory/30 font-sans text-sm focus:outline-none focus:border-brand-green"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="cnt-phone" className="block font-sans text-xs font-medium text-ink mb-1.5">
                      Mobile Number (Optional)
                    </label>
                    <input
                      id="cnt-phone"
                      type="tel"
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="10-digit mobile number"
                      className="w-full h-11 px-3.5 rounded-[4px] border border-border bg-ivory/30 font-sans text-sm focus:outline-none focus:border-brand-green"
                    />
                  </div>
                  <div>
                    <label htmlFor="cnt-subject" className="block font-sans text-xs font-medium text-ink mb-1.5">
                      Subject *
                    </label>
                    <input
                      id="cnt-subject"
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Sizing, styling, or order query"
                      className="w-full h-11 px-3.5 rounded-[4px] border border-border bg-ivory/30 font-sans text-sm focus:outline-none focus:border-brand-green"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="cnt-msg" className="block font-sans text-xs font-medium text-ink mb-1.5">
                    Message *
                  </label>
                  <textarea
                    id="cnt-msg"
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can our concierge team assist you?"
                    className="w-full p-3.5 rounded-[4px] border border-border bg-ivory/30 font-sans text-sm focus:outline-none focus:border-brand-green"
                  />
                </div>

                {status.type === 'error' && (
                  <p className="font-sans text-xs font-medium text-red-700" role="alert">
                    {status.text}
                  </p>
                )}

                {status.type === 'success' && (
                  <div
                    role="status"
                    className="flex items-start gap-2 rounded-[4px] border border-brand-secondary/40 bg-ivory px-4 py-3 font-sans text-xs sm:text-sm text-brand-green"
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{status.text}</span>
                  </div>
                )}

                <Button type="submit" variant="primary" size="lg">
                  Submit Inquiry (Demo)
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
