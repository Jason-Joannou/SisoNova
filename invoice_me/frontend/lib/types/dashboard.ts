import { FinancingKPIs, InvoicingKPIs, CollectionKPIs } from "./kpis";
export interface Invoice {
  id: string;
  invoiceNumber: string;
  buyerName: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue' | 'financed';
  service: 'financing' | 'collections' | 'invoicing';
  createdAt: string;
  proofOfWork?: string;
  dedicatedAccount?: string;
  reserveAmount?: number;
}

export interface FinancingOffer {
  id: string;
  invoiceId: string;
  fundingPartner: string;
  advanceAmount: number;
  fee: number;
  reservePercentage: number;
  status: 'pending' | 'accepted' | 'declined';
  expiresAt: string;
}

export interface CollectionStats {
  totalOutstanding: number;
  overdueAmount: number;
  averageDaysToPayment: number;
  collectionRate: number;
}

export interface DashboardStats {
  totalInvoices: number;
  totalFinanced: number;
  totalCollected: number;
  pendingAmount: number;
  monthlyGrowth: number;
}

export interface DashboardKPIs {
  financing: FinancingKPIs;
  collections: CollectionKPIs;
  invoicing: InvoicingKPIs;
}