import { FinancingKPIs, InvoicingKPIs, CollectionKPIs } from "./kpis";

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

export interface ServiceQuickStats {
  serviceTilte: string;
  serviceValue: number;
  serviceValueAffix?: string;
  affixPosition?: string;
}

export interface AvailableService {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  bgColor: string;
  borderColor: string;
  isActive: boolean;
  comingSoon?: boolean;
  summary: {
    label: string;
    value: string | number;
    trend?: "up" | "down" | "neutral";
  }[];
  route: string;
}