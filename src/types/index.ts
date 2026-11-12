export type ProductCategory =
  | "Women's Dresses"
  | "Tops & Blouses"
  | "Co-ords & Sets"
  | "Jeans & Trousers"
  | "Skirts"
  | "Kurties & Modern Ethnic"
  | "Hoodies & Winterwear"
  | "Handbags & Accessories";

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number; // in INR ₹
  originalPrice?: number; // for discount calculation
  discountPercent?: number;
  description: string;
  features: string[];
  fabricCare?: string;
  image: string;
  secondaryImage?: string;
  availableSizes: string[];
  availableColors: { name: string; hex: string }[];
  stock: number;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isSpecialOffer?: boolean;
  gender: 'Women' | 'Ladies' | 'Girls';
  rating: number;
  reviewCount: number;
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  selectedColor: { name: string; hex: string };
  quantity: number;
}

export type OrderStatus =
  | 'Confirmed'
  | 'Processing'
  | 'Out for Delivery'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled';

export interface CustomerDetails {
  fullName: string;
  phone: string;
  email: string;
  addressLine: string;
  landmark?: string;
  city: string;
  state: string;
  pinCode: string;
  notes?: string;
}

export interface CustomerUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  password?: string;
  addressLine?: string;
  landmark?: string;
  city?: string;
  state?: string;
  pinCode?: string;
  createdAt: string;
}

export interface DeliveryAgent {
  id: string;
  name: string;
  phone: string;
  email: string;
  vehicleType: 'Motorcycle' | 'Scooter' | 'Electric Bike' | 'Delivery Van' | 'Auto Rickshaw';
  vehicleNumber?: string;
  serviceArea: string; // e.g., 'Todinagar & Station Road, Sikar'
  status: 'Active' | 'On Delivery' | 'Offline';
  assignedOrdersCount: number;
  createdAt: string;
}

export interface PaymentDetails {
  gateway: 'Cash on Delivery' | 'UPI Direct' | 'Card Gateway' | 'Net Banking' | 'Razorpay';
  transactionId?: string;
  upiId?: string;
  utrNumber?: string;
  cardBrand?: string;
  cardLast4?: string;
  bankName?: string;
  paidAt?: string;
  codInstructions?: string;
}

export interface Order {
  id: string; // e.g., SGM-2026-7841
  createdAt: string;
  customer: CustomerDetails;
  customerId?: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  paymentMethod: 'Cash on Delivery (COD)' | 'UPI / Instant QR' | 'Cards & Net Banking';
  paymentStatus: 'Cash on Delivery' | 'Payment Received' | 'Pending Verification';
  orderStatus: OrderStatus;
  trackingNumber?: string;
  notes?: string;
  assignedAgentId?: string;
  assignedAgentName?: string;
  assignedAgentPhone?: string;
  assignedAt?: string;
  paymentDetails?: PaymentDetails;
}

export type ActivePage =
  | 'home'
  | 'catalog'
  | 'cart'
  | 'checkout'
  | 'admin'
  | 'order-confirmation'
  | 'track-order'
  | 'account';

export interface OrderNotification {
  id: string;
  orderId: string;
  timestamp: string;
  recipientEmail: string; // 'homelander69.brrbrrpatapim@gmail.com'
  recipientPhone: string; // '9799896438'
  customerName: string;
  customerPhone: string;
  orderTotal: number;
  paymentMethod: string;
  smsBody: string;
  emailSubject: string;
  emailBody: string;
  status: 'Sent' | 'Delivered' | 'Queued';
  smsUrl: string;
  whatsappUrl: string;
  emailUrl: string;
}

export interface OwnerNotificationConfig {
  ownerPhone: string; // '9799896438'
  ownerEmail: string; // 'homelander69.brrbrrpatapim@gmail.com'
  upiVpa?: string; // '9799896438@upi'
  razorpayKeyId?: string;
  enableSms: boolean;
  enableEmail: boolean;
  enableWhatsapp: boolean;
}
