'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  FoodItem, 
  Restaurant, 
  CartItem, 
  Order, 
  UserProfile, 
  Coupon, 
  DietaryPreference,
  OrderStatus 
} from '@/types';
import { FOODS as initialFoods } from '@/data/foods';
import { RESTAURANTS as initialRestaurants } from '@/data/restaurants';
import { COUPONS as initialCoupons } from '@/data/coupons';

export interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  // Foods & Restaurants
  foods: FoodItem[];
  restaurants: Restaurant[];
  coupons: Coupon[];
  
  // Cart
  cart: CartItem[];
  appliedCoupon: Coupon | null;
  addToCart: (food: FoodItem, quantity?: number) => void;
  removeFromCart: (foodId: string) => void;
  updateCartQuantity: (foodId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  cartSubtotal: number;
  cartDeliveryFee: number;
  cartTax: number;
  cartDiscount: number;
  cartTotal: number;
  cartItemCount: number;
  freeDeliveryThreshold: number;
  distanceToFreeDelivery: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // User & Gamification
  user: UserProfile;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  toggleFavoriteFood: (foodId: string) => void;
  toggleFavoriteMood: (moodId: string) => void;
  addLoyaltyPoints: (points: number, reason?: string) => void;

  // Location
  currentLocation: string;
  setCurrentLocation: (loc: string) => void;

  // Orders
  orders: Order[];
  activeOrder: Order | null;
  placeOrder: (
    address: { street: string; city: string; tag: 'Home' | 'Work' | 'Other'; instructions?: string },
    paymentMethod: 'upi' | 'card' | 'cod'
  ) => Promise<Order>;
  cancelOrder: (orderId: string) => void;

  // Quick food preview modal
  previewFood: FoodItem | null;
  setPreviewFood: (food: FoodItem | null) => void;

  // Admin Actions
  addRestaurant: (restaurant: Restaurant) => void;
  updateRestaurant: (id: string, updates: Partial<Restaurant>) => void;
  deleteRestaurant: (id: string) => void;
  addFoodItem: (food: FoodItem) => void;
  updateFoodItem: (id: string, updates: Partial<FoodItem>) => void;
  deleteFoodItem: (id: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;

  // Toast
  toasts: ToastNotification[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
}

const defaultUser: UserProfile = {
  id: 'user-001',
  name: 'Aarav Sharma',
  email: 'aarav@cravo.food',
  phone: '+91 98765 43210',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  loyaltyPoints: 120,
  loyaltyLevel: 'Food Lover',
  favoriteMoods: ['spicy', 'delicious', 'protein'],
  favoriteFoodIds: ['food-7', 'food-21', 'food-1'],
  dietPreference: 'all',
  budgetPreference: 150,
  savedAddresses: [
    {
      id: 'addr-1',
      tag: 'Home',
      address: 'Flat 402, Sunshine Heights, 12th Main, Indiranagar, Bengaluru',
      isDefault: true
    },
    {
      id: 'addr-2',
      tag: 'Work',
      address: 'Tower B, Tech Park, Outer Ring Road, Bengaluru',
      isDefault: false
    }
  ]
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [foods, setFoods] = useState<FoodItem[]>(initialFoods);
  const [restaurants, setRestaurants] = useState<Restaurant[]>(initialRestaurants);
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [user, setUser] = useState<UserProfile>(defaultUser);
  const [currentLocation, setCurrentLocation] = useState<string>('Indiranagar, Bengaluru');
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [previewFood, setPreviewFood] = useState<FoodItem | null>(null);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cravo_cart');
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedUser = localStorage.getItem('cravo_user');
      if (savedUser) setUser(JSON.parse(savedUser));

      const savedOrders = localStorage.getItem('cravo_orders');
      if (savedOrders) {
        const parsedOrders = JSON.parse(savedOrders);
        setOrders(parsedOrders);
        if (parsedOrders.length > 0 && parsedOrders[0].status !== 'delivered') {
          setActiveOrderId(parsedOrders[0].id);
        }
      }

      const savedFoods = localStorage.getItem('cravo_admin_foods');
      if (savedFoods) setFoods(JSON.parse(savedFoods));

      const savedRestaurants = localStorage.getItem('cravo_admin_restaurants');
      if (savedRestaurants) setRestaurants(JSON.parse(savedRestaurants));
    } catch (e) {
      console.error('Failed to load storage:', e);
    }
  }, []);

  // Save Cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cravo_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Save Orders
  useEffect(() => {
    try {
      localStorage.setItem('cravo_orders', JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  // Save User
  useEffect(() => {
    try {
      localStorage.setItem('cravo_user', JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
  }, [user]);

  // Toast Helper
  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Cart Calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.food.price * item.quantity, 0);
  const freeDeliveryThreshold = 199;
  const cartDeliveryFee = cartSubtotal === 0 ? 0 : cartSubtotal >= freeDeliveryThreshold ? 0 : 25;
  const cartTax = Math.round(cartSubtotal * 0.05); // 5% GST
  
  let cartDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'flat') {
      cartDiscount = Math.min(appliedCoupon.discountValue, cartSubtotal);
    } else {
      const pct = (cartSubtotal * appliedCoupon.discountValue) / 100;
      cartDiscount = appliedCoupon.maxDiscount ? Math.min(pct, appliedCoupon.maxDiscount) : pct;
    }
  }

  const cartTotal = Math.max(0, cartSubtotal + cartDeliveryFee + cartTax - cartDiscount);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const distanceToFreeDelivery = Math.max(0, freeDeliveryThreshold - cartSubtotal);

  // Cart Actions
  const addToCart = (food: FoodItem, quantity: number = 1) => {
    const rest = restaurants.find(r => r.id === food.restaurantId);
    const restName = rest?.name || 'CRAVO Partner Kitchen';

    setCart(prev => {
      const existing = prev.find(item => item.food.id === food.id);
      if (existing) {
        return prev.map(item => 
          item.food.id === food.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { food, restaurantName: restName, quantity }];
    });
    showToast(`Added "${food.name}" to cart! 😋`, 'success');
  };

  const removeFromCart = (foodId: string) => {
    setCart(prev => prev.filter(item => item.food.id !== foodId));
    showToast('Item removed from cart', 'info');
  };

  const updateCartQuantity = (foodId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(foodId);
      return;
    }
    setCart(prev => prev.map(item => 
      item.food.id === foodId ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (code: string) => {
    const found = coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
    if (!found) {
      showToast('Invalid coupon code. Try CRAVO100 or FIRSTBITE', 'error');
      return { success: false, message: 'Invalid coupon code' };
    }
    if (cartSubtotal < found.minOrder) {
      const msg = `Add ₹${found.minOrder - cartSubtotal} more to use ${found.code}`;
      showToast(msg, 'warning');
      return { success: false, message: msg };
    }
    setAppliedCoupon(found);
    showToast(`Coupon "${found.code}" applied successfully! 🎉`, 'success');
    return { success: true, message: 'Coupon applied!' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed', 'info');
  };

  // User Actions
  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updates }));
    showToast('Profile updated!', 'success');
  };

  const toggleFavoriteFood = (foodId: string) => {
    setUser(prev => {
      const exists = prev.favoriteFoodIds.includes(foodId);
      const updated = exists 
        ? prev.favoriteFoodIds.filter(id => id !== foodId)
        : [...prev.favoriteFoodIds, foodId];
      return { ...prev, favoriteFoodIds: updated };
    });
  };

  const toggleFavoriteMood = (moodId: string) => {
    setUser(prev => {
      const exists = prev.favoriteMoods.includes(moodId);
      const updated = exists 
        ? prev.favoriteMoods.filter(id => id !== moodId)
        : [...prev.favoriteMoods, moodId];
      return { ...prev, favoriteMoods: updated };
    });
  };

  const addLoyaltyPoints = (points: number, reason?: string) => {
    setUser(prev => {
      const newPoints = prev.loyaltyPoints + points;
      let level: UserProfile['loyaltyLevel'] = 'Food Explorer';
      if (newPoints >= 500) level = 'Food Master';
      else if (newPoints >= 250) level = 'Food Hunter';
      else if (newPoints >= 100) level = 'Food Lover';

      return {
        ...prev,
        loyaltyPoints: newPoints,
        loyaltyLevel: level
      };
    });
    if (reason) {
      showToast(`+${points} CRAVO Points! (${reason}) 🌟`, 'success');
    }
  };

  // Place Order Action
  const placeOrder = async (
    address: { street: string; city: string; tag: 'Home' | 'Work' | 'Other'; instructions?: string },
    paymentMethod: 'upi' | 'card' | 'cod'
  ): Promise<Order> => {
    const newOrderId = `FD${Math.floor(1000 + Math.random() * 9000)}`;
    const pointsEarned = Math.max(10, Math.floor(cartTotal / 10));

    const newOrder: Order = {
      id: newOrderId,
      userId: user.id,
      items: [...cart],
      subtotal: cartSubtotal,
      deliveryFee: cartDeliveryFee,
      tax: cartTax,
      discount: cartDiscount,
      couponApplied: appliedCoupon?.code,
      total: cartTotal,
      status: 'confirmed',
      deliveryAddress: address,
      paymentMethod,
      createdAt: new Date().toISOString(),
      estimatedDeliveryMin: 25,
      foodPointsEarned: pointsEarned
    };

    setOrders(prev => [newOrder, ...prev]);
    setActiveOrderId(newOrderId);
    clearCart();
    addLoyaltyPoints(pointsEarned, 'Order Completed');

    // Simulate order progression steps in background
    setTimeout(() => {
      updateOrderStatus(newOrderId, 'preparing');
    }, 8000);
    setTimeout(() => {
      updateOrderStatus(newOrderId, 'picked_up');
    }, 18000);
    setTimeout(() => {
      updateOrderStatus(newOrderId, 'on_the_way');
    }, 28000);

    return newOrder;
  };

  const cancelOrder = (orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
    if (activeOrderId === orderId) setActiveOrderId(null);
    showToast('Order cancelled', 'info');
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  // Admin Actions
  const addRestaurant = (newRest: Restaurant) => {
    setRestaurants(prev => {
      const updated = [newRest, ...prev];
      localStorage.setItem('cravo_admin_restaurants', JSON.stringify(updated));
      return updated;
    });
    showToast(`Added restaurant "${newRest.name}"`, 'success');
  };

  const updateRestaurant = (id: string, updates: Partial<Restaurant>) => {
    setRestaurants(prev => {
      const updated = prev.map(r => r.id === id ? { ...r, ...updates } : r);
      localStorage.setItem('cravo_admin_restaurants', JSON.stringify(updated));
      return updated;
    });
    showToast('Restaurant updated', 'success');
  };

  const deleteRestaurant = (id: string) => {
    setRestaurants(prev => {
      const updated = prev.filter(r => r.id !== id);
      localStorage.setItem('cravo_admin_restaurants', JSON.stringify(updated));
      return updated;
    });
    showToast('Restaurant deleted', 'info');
  };

  const addFoodItem = (newFood: FoodItem) => {
    setFoods(prev => {
      const updated = [newFood, ...prev];
      localStorage.setItem('cravo_admin_foods', JSON.stringify(updated));
      return updated;
    });
    showToast(`Added dish "${newFood.name}"`, 'success');
  };

  const updateFoodItem = (id: string, updates: Partial<FoodItem>) => {
    setFoods(prev => {
      const updated = prev.map(f => f.id === id ? { ...f, ...updates } : f);
      localStorage.setItem('cravo_admin_foods', JSON.stringify(updated));
      return updated;
    });
    showToast('Dish updated', 'success');
  };

  const deleteFoodItem = (id: string) => {
    setFoods(prev => {
      const updated = prev.filter(f => f.id !== id);
      localStorage.setItem('cravo_admin_foods', JSON.stringify(updated));
      return updated;
    });
    showToast('Dish deleted', 'info');
  };

  const activeOrder = orders.find(o => o.id === activeOrderId) || orders[0] || null;

  return (
    <AppContext.Provider
      value={{
        foods,
        restaurants,
        coupons,
        cart,
        appliedCoupon,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
        cartSubtotal,
        cartDeliveryFee,
        cartTax,
        cartDiscount,
        cartTotal,
        cartItemCount,
        freeDeliveryThreshold,
        distanceToFreeDelivery,
        isCartOpen,
        setIsCartOpen,
        user,
        updateUserProfile,
        toggleFavoriteFood,
        toggleFavoriteMood,
        addLoyaltyPoints,
        currentLocation,
        setCurrentLocation,
        orders,
        activeOrder,
        placeOrder,
        cancelOrder,
        previewFood,
        setPreviewFood,
        addRestaurant,
        updateRestaurant,
        deleteRestaurant,
        addFoodItem,
        updateFoodItem,
        deleteFoodItem,
        updateOrderStatus,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
