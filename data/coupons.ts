import { Coupon } from '@/types';

export const COUPONS: Coupon[] = [
  {
    code: 'CRAVO100',
    discountType: 'flat',
    discountValue: 100,
    minOrder: 199,
    description: 'Flat ₹100 OFF on orders above ₹199'
  },
  {
    code: 'FIRSTBITE',
    discountType: 'percentage',
    discountValue: 30,
    minOrder: 99,
    maxDiscount: 75,
    description: '30% OFF up to ₹75 on your first order'
  },
  {
    code: 'MOODMEAL',
    discountType: 'flat',
    discountValue: 50,
    minOrder: 149,
    description: 'Flat ₹50 OFF for Food Mood explorers'
  },
  {
    code: 'BUDGETSAVER',
    discountType: 'percentage',
    discountValue: 20,
    minOrder: 80,
    maxDiscount: 40,
    description: '20% OFF on budget combo meals'
  }
];
