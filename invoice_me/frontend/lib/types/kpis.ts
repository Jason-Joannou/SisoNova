// Can expand upon KPIs

export interface FinancingKPIs {
    active: number;
    totalAdvanced: number;
    avgProcessingTime: string;
}

export interface CollectionKPIs {
    active: number;
    collectionRate: number;
    avgDaysToPayment: number;
}

export interface InvoicingKPIs {
    thisMonth: number;
    paidOnTime: number;
    avgAmount: number;
}