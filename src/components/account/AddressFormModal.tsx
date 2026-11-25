import { useEffect, useState, type FormEvent } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import type { SavedAddress } from '@/types';
import { Button } from '@/components/ui/Button';

interface AddressFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialAddress?: SavedAddress | null;
  onSave: (address: Omit<SavedAddress, 'id'>) => void;
}

export function AddressFormModal({
  open,
  onOpenChange,
  initialAddress,
  onSave,
}: AddressFormModalProps) {
  const [label, setLabel] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [recipientName, setRecipientName] = useState('');
  const [phone, setPhone] = useState('');
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [pincode, setPincode] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      if (initialAddress) {
        setLabel(initialAddress.label);
        setRecipientName(initialAddress.recipientName);
        setPhone(initialAddress.phone);
        setLine1(initialAddress.line1);
        setLine2(initialAddress.line2 ?? '');
        setCity(initialAddress.city);
        setStateName(initialAddress.state);
        setPincode(initialAddress.pincode);
        setIsDefault(initialAddress.isDefault);
      } else {
        setLabel('Home');
        setRecipientName('');
        setPhone('');
        setLine1('');
        setLine2('');
        setCity('');
        setStateName('');
        setPincode('');
        setIsDefault(false);
      }
      setError(null);
    }
  }, [open, initialAddress]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!recipientName.trim() || !line1.trim() || !city.trim() || !stateName.trim()) {
      setError('Please complete all required address fields.');
      return;
    }
    if (phone.replace(/\D/g, '').length !== 10) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }
    if (pincode.replace(/\D/g, '').length !== 6) {
      setError('Please enter a valid 6-digit PIN code.');
      return;
    }

    onSave({
      label,
      recipientName: recipientName.trim(),
      phone: phone.replace(/\D/g, ''),
      line1: line1.trim(),
      line2: line2.trim() || undefined,
      city: city.trim(),
      state: stateName.trim(),
      pincode: pincode.replace(/\D/g, ''),
      isDefault,
    });
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-[2px]" />
        <Dialog.Content className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[94%] max-w-lg max-h-[90vh] overflow-y-auto bg-ivory border border-border rounded-[6px] p-5 sm:p-6 shadow-xl focus:outline-none">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div>
              <Dialog.Title className="font-serif text-2xl font-medium text-ink">
                {initialAddress ? 'Edit Demo Address' : 'Add New Demo Address'}
              </Dialog.Title>
              <Dialog.Description className="font-sans text-xs text-ink-secondary">
                Stored locally in browser for client demonstration.
              </Dialog.Description>
            </div>
            <Dialog.Close
              aria-label="Close address modal"
              className="h-9 w-9 rounded-[4px] border border-border bg-white flex items-center justify-center text-ink"
            >
              <X className="w-4 h-4" />
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
            <div className="flex gap-2">
              {(['Home', 'Work', 'Other'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setLabel(type)}
                  className={
                    label === type
                      ? 'px-3.5 py-1.5 rounded-[4px] bg-brand-green text-white font-sans text-xs font-medium'
                      : 'px-3.5 py-1.5 rounded-[4px] bg-white border border-border text-ink font-sans text-xs'
                  }
                >
                  {type}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="addr-name" className="block font-sans text-xs font-medium text-ink mb-1">
                  Recipient Name *
                </label>
                <input
                  id="addr-name"
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full h-10 px-3 rounded-[4px] border border-border bg-white font-sans text-sm"
                />
              </div>
              <div>
                <label htmlFor="addr-phone" className="block font-sans text-xs font-medium text-ink mb-1">
                  Mobile (10 digits) *
                </label>
                <input
                  id="addr-phone"
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  className="w-full h-10 px-3 rounded-[4px] border border-border bg-white font-sans text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="addr-line1" className="block font-sans text-xs font-medium text-ink mb-1">
                Address Line 1 *
              </label>
              <input
                id="addr-line1"
                type="text"
                value={line1}
                onChange={(e) => setLine1(e.target.value)}
                className="w-full h-10 px-3 rounded-[4px] border border-border bg-white font-sans text-sm"
              />
            </div>

            <div>
              <label htmlFor="addr-line2" className="block font-sans text-xs font-medium text-ink mb-1">
                Locality / Landmark (Optional)
              </label>
              <input
                id="addr-line2"
                type="text"
                value={line2}
                onChange={(e) => setLine2(e.target.value)}
                className="w-full h-10 px-3 rounded-[4px] border border-border bg-white font-sans text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label htmlFor="addr-city" className="block font-sans text-xs font-medium text-ink mb-1">
                  City *
                </label>
                <input
                  id="addr-city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full h-10 px-3 rounded-[4px] border border-border bg-white font-sans text-sm"
                />
              </div>
              <div>
                <label htmlFor="addr-state" className="block font-sans text-xs font-medium text-ink mb-1">
                  State *
                </label>
                <input
                  id="addr-state"
                  type="text"
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                  className="w-full h-10 px-3 rounded-[4px] border border-border bg-white font-sans text-sm"
                />
              </div>
              <div>
                <label htmlFor="addr-pin" className="block font-sans text-xs font-medium text-ink mb-1">
                  PIN Code *
                </label>
                <input
                  id="addr-pin"
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  className="w-full h-10 px-3 rounded-[4px] border border-border bg-white font-sans text-sm"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={isDefault}
                onChange={(e) => setIsDefault(e.target.checked)}
                className="h-4 w-4 rounded border-border accent-brand-green"
              />
              <span className="font-sans text-xs text-ink">Set as default delivery address</span>
            </label>

            {error && (
              <p className="font-sans text-xs text-red-700" role="alert">
                {error}
              </p>
            )}

            <div className="flex justify-end gap-2.5 pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Save Address
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
