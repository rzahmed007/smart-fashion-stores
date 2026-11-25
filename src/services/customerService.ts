import type { OrderStatus, OrderSummary } from '@/types';

export interface TrackingTimelineStage {
  stage: Exclude<OrderStatus, 'Cancelled'>;
  label: string;
  description: string;
  completed: boolean;
  current: boolean;
}

const ORDERED_TRACKING_STAGES: {
  stage: Exclude<OrderStatus, 'Cancelled'>;
  label: string;
  description: string;
}[] = [
  {
    stage: 'Order Placed',
    label: 'Order Placed',
    description: 'Demo order received and logged locally.',
  },
  {
    stage: 'Confirmed',
    label: 'Order Confirmed',
    description: 'Order details verified for atelier dispatch.',
  },
  {
    stage: 'Processing',
    label: 'Processing',
    description: 'Quality inspection and folded muslin packaging.',
  },
  {
    stage: 'Shipped',
    label: 'Shipped',
    description: 'Handed over to simulated courier partner.',
  },
  {
    stage: 'Out for Delivery',
    label: 'Out for Delivery',
    description: 'With local delivery executive (simulated).',
  },
  {
    stage: 'Delivered',
    label: 'Delivered',
    description: 'Successfully delivered to destination.',
  },
];

export function buildOrderTimeline(status: OrderStatus): TrackingTimelineStage[] {
  if (status === 'Cancelled') {
    return ORDERED_TRACKING_STAGES.map((s, idx) => ({
      ...s,
      completed: idx === 0,
      current: false,
    }));
  }

  const currentIdx = ORDERED_TRACKING_STAGES.findIndex((s) => s.stage === status);
  const resolvedIdx = currentIdx === -1 ? 1 : currentIdx;

  return ORDERED_TRACKING_STAGES.map((s, idx) => ({
    ...s,
    completed: idx <= resolvedIdx,
    current: idx === resolvedIdx,
  }));
}

export const customerService = {
  async loginDemo(identifier: string): Promise<{ success: boolean; message: string }> {
    if (!identifier.trim()) {
      return { success: false, message: 'Please enter your email or mobile number.' };
    }
    return {
      success: true,
      message: 'Signed in to demo customer session.',
    };
  },

  async registerDemo(payload: {
    fullName: string;
    email: string;
    phone: string;
  }): Promise<{ success: boolean; message: string }> {
    if (!payload.fullName.trim() || !payload.email.trim()) {
      return { success: false, message: 'Please complete all required fields.' };
    }
    return {
      success: true,
      message: 'Demo customer profile created locally (no password stored).',
    };
  },

  async requestPasswordResetDemo(email: string): Promise<{ success: boolean; message: string }> {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return { success: false, message: 'Please enter a valid email address.' };
    }
    return {
      success: true,
      message: `Simulated reset link prepared for ${email.trim()} (demo only — no real email sent).`,
    };
  },

  async submitContactFormDemo(payload: {
    fullName: string;
    email: string;
    subject: string;
    message: string;
  }): Promise<{ success: boolean; referenceId?: string; message: string }> {
    if (!payload.fullName.trim() || !payload.email.trim() || !payload.message.trim()) {
      return { success: false, message: 'Please fill in all required fields.' };
    }
    const referenceId = `SFS-INQ-${Math.floor(10000 + Math.random() * 90000)}`;
    return {
      success: true,
      referenceId,
      message: `Demo inquiry ${referenceId} logged locally. No external message was transmitted.`,
    };
  },

  findOrderById(orders: OrderSummary[], rawOrderId: string): OrderSummary | undefined {
    const normalized = rawOrderId.trim().toUpperCase();
    if (!normalized) return undefined;
    return orders.find((o) => o.orderId.toUpperCase() === normalized);
  },
};
