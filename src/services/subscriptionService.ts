export interface WhatsAppSubscriptionPayload {
  phone: string;
  consent: boolean;
}

export interface WhatsAppSubscriptionResponse {
  success: boolean;
  message: string;
}

const STORAGE_KEY = 'sfs_whatsapp_subscribers_demo';

export const subscriptionService = {
  async subscribeWhatsApp(
    payload: WhatsAppSubscriptionPayload
  ): Promise<WhatsAppSubscriptionResponse> {
    const normalized = payload.phone.replace(/\D/g, '');
    if (normalized.length < 10) {
      return {
        success: false,
        message: 'Please enter a valid 10-digit Indian mobile number.',
      };
    }
    if (!payload.consent) {
      return {
        success: false,
        message: 'Please confirm consent to receive curated WhatsApp updates.',
      };
    }

    // Demo simulation persisted locally
    try {
      const existingRaw = localStorage.getItem(STORAGE_KEY);
      const existing: string[] = existingRaw ? JSON.parse(existingRaw) : [];
      if (!existing.includes(normalized)) {
        existing.push(normalized);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
      }
    } catch {
      // Ignore storage errors in restricted browsing modes
    }

    return {
      success: true,
      message: 'Demo Confirmed: You are subscribed for early collection previews on WhatsApp.',
    };
  },
};
