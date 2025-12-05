
export type WithId<T> = T & { id: string };

export type PricingTier = {
    minQuantity: number;
    price: number;
}

export type Product = {
    name: string;
    description: string;
    categoryId: string;
    imageUrls: string[];
    pricingTiers: PricingTier[];
    moq: number;
    availableStock: number;
    supplierId: string;
}

export type Order = {
    buyerId: string;
    orderDate: string; // Should be ISO string
    totalAmount: number;
    status: 'awaiting-payment' | 'pending' | 'processing' | 'shipped' | 'delivered';
    trackingNumber?: string;
    paymentProofUrl?: string;
}
