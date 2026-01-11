// Transaction and Payment Types

export type TransactionStatus =
  | 'pending_payment' // Waiting for payment
  | 'payment_processing' // Payment in progress
  | 'paid' // Payment captured, in escrow
  | 'in_progress' // Service being delivered
  | 'completed' // Service delivered
  | 'confirmed' // Buyer confirmed, funds released
  | 'disputed' // In dispute
  | 'refunded' // Refund issued
  | 'cancelled'; // Cancelled

export type DisputeStatus = 'open' | 'under_review' | 'resolved' | 'escalated';
export type DisputeResolution = 'full_refund' | 'partial_refund' | 'no_refund' | 'redo_service';

export interface Transaction {
  id: string;
  requestId: string;
  negotiationId: string;
  buyerId: string;
  providerId: string;
  offeringId: string;
  agreedPrice: number;
  currency: string;
  platformFee: number;
  providerPayout: number;
  status: TransactionStatus;
  paymentIntentId?: string;
  escrowReleaseAt?: Date;
  completedAt?: Date;
  confirmedAt?: Date;
  disputeId?: string;
  reviewId?: string;
  metadata: Record<string, unknown>;
  createdAt: Date;
}

export interface PaymentIntent {
  id: string;
  transactionId: string;
  amount: number;
  currency: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'succeeded' | 'failed';
  clientSecret: string;
  createdAt: Date;
}

export interface Dispute {
  id: string;
  transactionId: string;
  raisedBy: 'buyer' | 'provider';
  reason: string;
  evidence: string[];
  status: DisputeStatus;
  resolution?: DisputeResolution;
  refundAmount?: number;
  resolvedAt?: Date;
  createdAt: Date;
}

// Negotiation Types

export type NegotiationStatus =
  | 'active'
  | 'accepted'
  | 'declined'
  | 'countered'
  | 'expired';

export interface Negotiation {
  id: string;
  requestId: string;
  buyerId: string;
  providerId: string;
  offeringId: string;
  status: NegotiationStatus;
  currentOffer: Offer;
  offerHistory: Offer[];
  messages: NegotiationMessage[];
  expiresAt: Date;
  createdAt: Date;
}

export interface Offer {
  id: string;
  negotiationId: string;
  offeredBy: 'buyer' | 'provider';
  price: number;
  currency: string;
  scheduledTime: Date;
  duration?: number;
  terms?: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired' | 'countered';
  createdAt: Date;
  respondedAt?: Date;
}

export interface NegotiationMessage {
  id: string;
  negotiationId: string;
  senderId: string;
  senderRole: 'buyer' | 'provider';
  content: string;
  createdAt: Date;
  readAt?: Date;
}

export interface OfferInput {
  price: number;
  scheduledTime: Date;
  duration?: number;
  terms?: string;
}
