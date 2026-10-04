export type DietaryPreference = 'all' | 'veg' | 'non-veg' | 'egg';

export interface FoodItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  image: string;
  price: number;
  originalPrice?: number;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snacks' | 'drinks' | 'dessert';
  cuisine: string;
  isVeg: boolean;
  isEgg?: boolean;
  isBestseller?: boolean;
  calories: number;
  protein: number; // in grams
  spiceLevel: 0 | 1 | 2 | 3; // 0: None, 1: Mild, 2: Medium, 3: Hot/Spicy
  deliveryTime: number; // in minutes
  rating: number;
  ratingCount: number;
  tags: string[]; // e.g. ['comfort', 'budget', 'spicy', 'protein', 'dessert', 'healthy', 'quick', 'party']
}

export interface Restaurant {
  id: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  logo?: string;
  location: string;
  distanceKm: number;
  rating: number;
  ratingCount: number;
  deliveryTimeMin: number;
  deliveryTimeMax: number;
  minOrder: number;
  cuisines: string[];
  isOpen: boolean;
  tags: string[];
}

export interface Mood {
  id: string;
  name: string;
  tagline: string;
  emoji: string;
  description: string;
  accentColor: string;
  gradientBg: string;
  heroHeadline: string;
  heroSubheadline: string;
  recommendedTags: string[];
  spiceFilter?: number;
  quote: string;
}

export interface CartItem {
  food: FoodItem;
  restaurantName: string;
  quantity: number;
  customizationNotes?: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  minOrder: number;
  maxDiscount?: number;
  description: string;
}

export type OrderStatus = 'confirmed' | 'preparing' | 'picked_up' | 'on_the_way' | 'delivered';

export interface OrderTimelineStep {
  status: OrderStatus;
  label: string;
  time: string;
  completed: boolean;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  discount: number;
  couponApplied?: string;
  total: number;
  status: OrderStatus;
  deliveryAddress: {
    street: string;
    city: string;
    tag: 'Home' | 'Work' | 'Other';
    instructions?: string;
  };
  paymentMethod: 'upi' | 'card' | 'cod';
  createdAt: string;
  estimatedDeliveryMin: number;
  foodPointsEarned: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  loyaltyPoints: number;
  loyaltyLevel: 'Food Explorer' | 'Food Lover' | 'Food Hunter' | 'Food Master';
  favoriteMoods: string[];
  favoriteFoodIds: string[];
  dietPreference: DietaryPreference;
  budgetPreference: number;
  savedAddresses: Array<{
    id: string;
    tag: 'Home' | 'Work' | 'Other';
    address: string;
    isDefault: boolean;
  }>;
}

export interface AIRecommendationResult {
  headline: string;
  explanation: string;
  primaryDish: FoodItem;
  suggestedAddOn?: FoodItem;
  totalPrice: number;
  totalCalories: number;
  totalProtein: number;
  estimatedTime: number;
  reasons: string[];
  alternativeDishes: FoodItem[];
}

export interface BudgetCombo {
  id: string;
  title: string;
  targetBudget: number;
  actualPrice: number;
  savings: number;
  items: FoodItem[];
  tags: string[];
}
