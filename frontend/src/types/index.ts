// Interface representing the products in our catalog (products.csv)
export interface Product {
  product_id: number;
  name: string;
  price_brl: number;
  category_id: number;
  description: string;
  stock_quantity: number;
  status: "active" | "discontinued" | "coming_soon";
  image_url?: string | null;
  specs?: string;
  created_at?: string;
}

// Interface representing individual items within an order
export interface OrderItem {
  order_item_id?: number;
  order_id?: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  product_name?: string;
}

// Interface representing an order returned by the API (orders.csv)
export interface Order {
  order_id: number;
  customer_id: number;
  order_date: string;
  total_amount: number;
  payment_method: string;
  status: string;
  tracking_code?: string | null;
  estimated_delivery?: string | null;
  items?: OrderItem[];
}

// Interface representing promotional campaigns (promotions.csv)
export interface Promotion {
  promotion_id: number;
  product_id: number;
  discount_percent: number;
  description: string;
  is_active: number | boolean;
}

// Interfaces for the AI Agent Chat messages and payloads
export interface ChatMessage {
  id: string;
  sender: "user" | "agent";
  text: string;
  timestamp: string;
}

export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  reply: string;
}

// Interface for the API Health Check status response
export interface HealthStatus {
  status: string;
  system?: string;
  service?: string;
}
