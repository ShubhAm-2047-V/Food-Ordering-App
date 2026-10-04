import { FoodItem, BudgetCombo, DietaryPreference } from '@/types';
import { FOODS } from '@/data/foods';

export function generateBudgetCombos(
  targetBudget: number = 100,
  preference: DietaryPreference = 'all',
  categoryFilter?: string,
  peopleCount: number = 1
): BudgetCombo[] {
  const budgetPerPerson = Math.floor(targetBudget / peopleCount);
  
  // Filter foods by diet
  let available = FOODS.filter(item => {
    if (preference === 'veg' && !item.isVeg) return false;
    if (preference === 'non-veg' && item.isVeg) return false;
    if (preference === 'egg' && !item.isEgg && item.isVeg) return false;
    return true;
  });

  if (categoryFilter && categoryFilter !== 'all') {
    available = available.filter(item => item.category === categoryFilter || item.tags.includes(categoryFilter));
  }

  const combos: BudgetCombo[] = [];

  // Group by role
  const mains = available.filter(f => ['lunch', 'dinner', 'breakfast'].includes(f.category) || f.price >= 45);
  const snacks = available.filter(f => f.category === 'snacks' || (f.price >= 25 && f.price < 60));
  const drinks = available.filter(f => f.category === 'drinks');
  const desserts = available.filter(f => f.category === 'dessert');

  // Strategy 1: Perfect Balanced 3-Item Combo (Main/Snack + Drink + Snack/Dessert)
  for (const main of mains) {
    if (main.price > budgetPerPerson - 30) continue;
    for (const drink of drinks) {
      if (main.price + drink.price > budgetPerPerson - 15) continue;
      const rem = budgetPerPerson - (main.price + drink.price);
      
      const affordableSides = [...snacks, ...desserts].filter(
        s => s.id !== main.id && s.id !== drink.id && s.price <= rem && s.price >= rem - 20
      );

      if (affordableSides.length > 0) {
        const side = affordableSides[0];
        const comboTotal = main.price + drink.price + side.price;
        const originalTotal = (main.originalPrice || main.price) + 
                              (drink.originalPrice || drink.price) + 
                              (side.originalPrice || side.price);
        
        combos.push({
          id: `combo-balanced-${main.id}-${drink.id}-${side.id}`,
          title: `Super Saver ${main.name.split(' ')[0]} Feast`,
          targetBudget,
          actualPrice: comboTotal * peopleCount,
          savings: (originalTotal - comboTotal) * peopleCount + (budgetPerPerson - comboTotal) * peopleCount,
          items: [main, side, drink],
          tags: ['Super Saver', '3-Course', 'Popular']
        });
        if (combos.length >= 2) break;
      }
    }
    if (combos.length >= 3) break;
  }

  // Strategy 2: Power Duo (High protein / Filling Main + Premium Beverage)
  for (const main of mains) {
    for (const drink of [...drinks, ...snacks]) {
      if (main.id === drink.id) continue;
      const sum = main.price + drink.price;
      if (sum <= budgetPerPerson && sum >= budgetPerPerson - 25) {
        const originalTotal = (main.originalPrice || main.price) + (drink.originalPrice || drink.price);
        combos.push({
          id: `combo-duo-${main.id}-${drink.id}`,
          title: `Power Duo: ${main.name.split(' ')[0]} & ${drink.name.split(' ')[0]}`,
          targetBudget,
          actualPrice: sum * peopleCount,
          savings: (originalTotal - sum) * peopleCount + (budgetPerPerson - sum) * peopleCount,
          items: [main, drink],
          tags: ['High Value', 'Quick Bite']
        });
        if (combos.length >= 5) break;
      }
    }
    if (combos.length >= 5) break;
  }

  // Strategy 3: Street Craver Triple (3 lighter items)
  for (const s1 of snacks) {
    for (const s2 of snacks) {
      if (s1.id === s2.id) continue;
      for (const d of drinks) {
        const sum = s1.price + s2.price + d.price;
        if (sum <= budgetPerPerson && sum >= budgetPerPerson - 15) {
          combos.push({
            id: `combo-street-${s1.id}-${s2.id}-${d.id}`,
            title: `Street Snacker Special`,
            targetBudget,
            actualPrice: sum * peopleCount,
            savings: 25 * peopleCount,
            items: [s1, s2, d],
            tags: ['Street Food', 'Triple Combo']
          });
          break;
        }
      }
      if (combos.length >= 6) break;
    }
    if (combos.length >= 6) break;
  }

  // Fallback if empty
  if (combos.length === 0) {
    const sorted = [...available].sort((a, b) => a.price - b.price);
    if (sorted.length >= 2) {
      const p1 = sorted[0];
      const p2 = sorted[1];
      combos.push({
        id: 'combo-fallback',
        title: 'Budget Friendly Duo',
        targetBudget,
        actualPrice: (p1.price + p2.price) * peopleCount,
        savings: 15,
        items: [p1, p2],
        tags: ['Budget Pick']
      });
    }
  }

  return combos;
}
