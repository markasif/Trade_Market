

export type WithId<T> = T & { id: string };

export type PricingTier = {
    minQuantity: number;
    price: number;
}

export type Product = {
    name: string;
    description: string;
    category_id: string;
    image_urls: string[];
    pricing_tiers: PricingTier[];
    moq: number;
    available_stock: number;
    supplier_id: string;
}

export type Order = {
    buyer_id: string;
    order_date: string; // Should be ISO string
    total_amount: number;
    status: 'awaiting-payment' | 'pending' | 'processing' | 'shipped' | 'delivered';
    tracking_number?: string;
    payment_proof_url?: string;
}

export type UserRole = 'admin' | 'supplier' | 'buyer' | null;
