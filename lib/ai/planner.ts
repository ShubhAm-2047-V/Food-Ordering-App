import { FoodItem, AIRecommendationResult, DietaryPreference } from '@/types';
import { FOODS } from '@/data/foods';

export interface AIPlanParams {
  query?: string;
  budget?: number;
  diet?: DietaryPreference;
  spiceLevel?: number;
  partySize?: number;
  moodTag?: string;
  isHighProtein?: boolean;
}

export function generateAIRecommendation(params: AIPlanParams): AIRecommendationResult {
  const {
    query = '',
    budget = 200,
    diet = 'all',
    spiceLevel = 2,
    partySize = 1,
    moodTag = '',
    isHighProtein = false
  } = params;

  const queryLower = query.toLowerCase();

  // Detect intentions from text if prompt string provided
  const wantsSpicy = queryLower.includes('spicy') || queryLower.includes('hot') || queryLower.includes('chilli') || spiceLevel >= 3;
  const wantsMild = queryLower.includes('not spicy') || queryLower.includes('mild') || queryLower.includes('no spice') || spiceLevel <= 1;
  const wantsProtein = queryLower.includes('protein') || queryLower.includes('gym') || queryLower.includes('workout') || isHighProtein;
  const wantsHealthy = queryLower.includes('healthy') || queryLower.includes('clean') || queryLower.includes('salad') || queryLower.includes('low calorie');
  const wantsComfort = queryLower.includes('comfort') || queryLower.includes('heavy') || queryLower.includes('feeling down') || queryLower.includes('cozy');
  const wantsDessert = queryLower.includes('dessert') || queryLower.includes('sweet') || queryLower.includes('chocolate');
  const wantsBiryani = queryLower.includes('biryani') || queryLower.includes('rice');
  const wantsFastFood = queryLower.includes('burger') || queryLower.includes('pizza') || queryLower.includes('fries') || queryLower.includes('cheat');

  let filtered = FOODS.filter(food => {
    // Diet check
    if (diet === 'veg' && !food.isVeg) return false;
    if (diet === 'non-veg' && food.isVeg) return false;
    if (diet === 'egg' && !food.isEgg && food.isVeg) return false;
    
    // Budget check for main dish
    if (food.price > budget) return false;

    // Spice check
    if (wantsMild && food.spiceLevel > 1) return false;
    if (wantsSpicy && food.spiceLevel < 2) return false;

    return true;
  });

  if (filtered.length === 0) {
    filtered = FOODS.filter(f => f.price <= budget);
  }

  // Scoring algorithm
  const scored = filtered.map(food => {
    let score = food.rating * 10;
    
    if (wantsProtein) score += food.protein * 2.5;
    if (wantsHealthy && food.tags.includes('healthy')) score += 30;
    if (wantsComfort && food.tags.includes('comfort')) score += 25;
    if (wantsDessert && food.category === 'dessert') score += 40;
    if (wantsBiryani && food.cuisine === 'Biryani') score += 35;
    if (wantsFastFood && (food.tags.includes('cheat') || food.cuisine === 'Burgers' || food.cuisine === 'Italian')) score += 30;
    if (wantsSpicy && food.spiceLevel === 3) score += 25;
    if (food.isBestseller) score += 15;
    if (moodTag && food.tags.includes(moodTag)) score += 25;

    return { food, score };
  });

  scored.sort((a, b) => b.score - a.score);

  const primaryDish = scored[0]?.food || FOODS[0];

  // Pick complementary add-on (Drink or Dessert or Side) within remaining budget
  const remBudget = budget - primaryDish.price;
  let suggestedAddOn: FoodItem | undefined;

  if (remBudget >= 20) {
    const addOnCandidates = FOODS.filter(f => 
      f.id !== primaryDish.id &&
      (f.category === 'drinks' || f.category === 'dessert' || f.category === 'snacks') &&
      f.price <= remBudget &&
      (diet === 'veg' ? f.isVeg : true)
    );
    if (addOnCandidates.length > 0) {
      // Pick best matching add-on
      suggestedAddOn = addOnCandidates.sort((a, b) => b.rating - a.rating)[0];
    }
  }

  // Pick 4 realistic alternatives
  const alternativeDishes = scored
    .slice(1)
    .map(s => s.food)
    .filter(f => f.id !== primaryDish.id && f.id !== suggestedAddOn?.id)
    .slice(0, 4);

  // Generate intelligent natural-language explanation
  const dietLabel = diet === 'veg' ? 'pure vegetarian' : diet === 'non-veg' ? 'protein-packed non-veg' : 'wholesome';
  const spiceLabel = primaryDish.spiceLevel >= 2 ? 'with bold, warming spices' : 'gentle and mild on spice';
  const proteinText = primaryDish.protein > 20 ? `delivering an impressive ${primaryDish.protein}g of muscle-building protein` : `perfectly proportioned at ${primaryDish.calories} calories`;
  
  let headline = `YOUR PERFECT MEAL MATCH`;
  if (wantsProtein) headline = `HIGH-PROTEIN FUEL COMBO 💪`;
  else if (wantsSpicy) headline = `FIERY FLAVOR EXPLOSION 🔥`;
  else if (wantsHealthy) headline = `CLEAN & VIBRANT NOURISHMENT 🥗`;
  else if (wantsComfort) headline = `ULTIMATE SOUL COMFORT BOWL 😴`;

  const explanation = `Based on your request, we handpicked this ${dietLabel} ${primaryDish.name} from ${primaryDish.cuisine} cuisine. It is ${spiceLabel}, ${proteinText}, and comfortably fits within your ${budget ? `₹${budget}` : 'budget'} target while arriving hot in ${primaryDish.deliveryTime} minutes.`;

  const reasons = [
    `✓ Matches your preferred ${dietLabel} dietary style`,
    `✓ ${primaryDish.protein}g+ verified high-quality protein`,
    `✓ Spice level: ${primaryDish.spiceLevel === 3 ? '🔥 Hot & Fiery' : primaryDish.spiceLevel === 2 ? '🌶️ Medium Kick' : '🌿 Mild & Smooth'}`,
    `✓ Fast delivery from top-rated kitchen in ~${primaryDish.deliveryTime} mins`,
    `✓ Fits seamlessly into your target budget`,
  ];

  const totalPrice = primaryDish.price + (suggestedAddOn?.price || 0);
  const totalCalories = primaryDish.calories + (suggestedAddOn?.calories || 0);
  const totalProtein = primaryDish.protein + (suggestedAddOn?.protein || 0);
  const estimatedTime = Math.max(primaryDish.deliveryTime, suggestedAddOn?.deliveryTime || 0);

  return {
    headline,
    explanation,
    primaryDish,
    suggestedAddOn,
    totalPrice,
    totalCalories,
    totalProtein,
    estimatedTime,
    reasons,
    alternativeDishes
  };
}
