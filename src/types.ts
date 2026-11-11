export interface PlanOption {
  id: string;
  duration: string;
  price: number;
  originalPrice: number;
  badge?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  image: string;
  popular?: boolean;
  deliveryType: string;
  devices: string;
  features: string[];
  plans: PlanOption[];
}

export interface CartItem {
  product: Product;
  selectedPlan: PlanOption;
}

