import { supabase } from './supabase';

export interface Recipe {
  id: string;
  name: string;
  description: string;
  prep_time: number;
  cook_time: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  ingredients: {
    item: string;
    amount: number;
    unit: string;
  }[];
  instructions: string[];
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  dietary_restrictions: string[];
  image_url?: string;
}

export interface MealType {
  breakfast: Recipe | null;
  lunch: Recipe | null;
  dinner: Recipe | null;
  snack1: Recipe | null;
  snack2: Recipe | null;
}

export interface MealPlan {
  id?: string;
  user_id?: string;
  start_date: string;
  end_date: string;
  preferences: {
    dietaryRestrictions: string[];
    calorieGoal: number;
    skillLevel: 'beginner' | 'intermediate' | 'advanced';
    prepTime: number;
    servings: number;
    excludedIngredients: string[];
    budget: 'low' | 'medium' | 'high';
    equipment: string[];
  };
  meals: {
    [day: string]: MealType;
  };
}

export interface ShoppingListItem {
  item: string;
  amount: number;
  unit: string;
  recipes: string[];
  category: 'produce' | 'meat' | 'dairy' | 'bakery' | 'canned' | 'dry' | 'frozen' | 'other';
}

export interface ShoppingList {
  id?: string;
  user_id?: string;
  meal_plan_id?: string;
  items: ShoppingListItem[];
  created_at?: string;
}

export async function saveMealPlan(mealPlan: MealPlan): Promise<MealPlan> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('meal_plans')
      .insert({
        user_id: user.id, // Include the user_id
        start_date: mealPlan.start_date,
        end_date: mealPlan.end_date,
        preferences: mealPlan.preferences,
        meals: mealPlan.meals
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to save meal plan: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error saving meal plan:', error);
    throw error;
  }
}

export async function getMealPlans(): Promise<MealPlan[]> {
  try {
    const { data, error } = await supabase
      .from('meal_plans')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch meal plans: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching meal plans:', error);
    throw error;
  }
}

export async function getMealPlan(id: string): Promise<MealPlan> {
  try {
    const { data, error } = await supabase
      .from('meal_plans')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(`Failed to fetch meal plan: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error fetching meal plan:', error);
    throw error;
  }
}

export async function saveShoppingList(shoppingList: ShoppingList): Promise<ShoppingList> {
  try {
    const { data, error } = await supabase
      .from('shopping_lists')
      .insert({
        meal_plan_id: shoppingList.meal_plan_id,
        items: shoppingList.items
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to save shopping list: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error saving shopping list:', error);
    throw error;
  }
}

export async function getShoppingList(mealPlanId: string): Promise<ShoppingList | null> {
  try {
    const { data, error } = await supabase
      .from('shopping_lists')
      .select('*')
      .eq('meal_plan_id', mealPlanId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to fetch shopping list: ${error.message}`);
    }

    return data || null;
  } catch (error) {
    console.error('Error fetching shopping list:', error);
    throw error;
  }
}

export async function searchRecipes(query: string, filters: any = {}): Promise<Recipe[]> {
  try {
    let queryBuilder = supabase
      .from('recipes')
      .select('*');
    
    if (query) {
      queryBuilder = queryBuilder.ilike('name', `%${query}%`);
    }
    
    if (filters.dietaryRestrictions && filters.dietaryRestrictions.length > 0) {
      queryBuilder = queryBuilder.contains('dietary_restrictions', filters.dietaryRestrictions);
    }
    
    if (filters.maxPrepTime) {
      queryBuilder = queryBuilder.lte('prep_time', filters.maxPrepTime);
    }
    
    if (filters.difficulty) {
      queryBuilder = queryBuilder.eq('difficulty', filters.difficulty);
    }

    const { data, error } = await queryBuilder.order('name');

    if (error) {
      // Check if the error is because the table doesn't exist
      if (error.code === '42P01') {
        console.warn('Recipes table does not exist yet, returning empty array');
        return [];
      }
      throw new Error(`Failed to search recipes: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error searching recipes:', error);
    throw error;
  }
}

export async function saveRecipe(recipe: Recipe): Promise<Recipe> {
  try {
    const { data, error } = await supabase
      .from('recipes')
      .insert({
        name: recipe.name,
        description: recipe.description,
        prep_time: recipe.prep_time,
        cook_time: recipe.cook_time,
        servings: recipe.servings,
        difficulty: recipe.difficulty,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        nutrition: recipe.nutrition,
        dietary_restrictions: recipe.dietary_restrictions,
        image_url: recipe.image_url
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to save recipe: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error saving recipe:', error);
    throw error;
  }
}

export async function getRecipe(id: string): Promise<Recipe> {
  try {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(`Failed to fetch recipe: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error fetching recipe:', error);
    throw error;
  }
}

export function generateShoppingList(mealPlan: MealPlan): ShoppingListItem[] {
  const ingredientMap = new Map<string, ShoppingListItem>();
  
  // Process each day's meals
  Object.entries(mealPlan.meals).forEach(([day, meals]) => {
    // Process each meal type
    Object.entries(meals).forEach(([mealType, recipe]) => {
      if (!recipe) return;
      
      // Process each ingredient
      recipe.ingredients.forEach((ingredient: { item: string; amount: number; unit: string }) => {
        const key = `${ingredient.item.toLowerCase()}-${ingredient.unit}`;
        
        if (ingredientMap.has(key)) {
          // Update existing ingredient
          const existingItem = ingredientMap.get(key)!;
          existingItem.amount += ingredient.amount;
          if (!existingItem.recipes.includes(recipe.name)) {
            existingItem.recipes.push(recipe.name);
          }
        } else {
          // Add new ingredient
          const category = categorizeIngredient(ingredient.item);
          ingredientMap.set(key, {
            item: ingredient.item,
            amount: ingredient.amount,
            unit: ingredient.unit,
            recipes: [recipe.name],
            category
          });
        }
      });
    });
  });
  
  // Convert map to array and sort by category
  return Array.from(ingredientMap.values()).sort((a, b) => 
    a.category.localeCompare(b.category)
  );
}

// Helper function to categorize ingredients
function categorizeIngredient(item: string): ShoppingListItem['category'] {
  const lowerItem = item.toLowerCase();
  
  // Define category keywords
  const categories: Record<ShoppingListItem['category'], string[]> = {
    produce: ['fruit', 'vegetable', 'apple', 'banana', 'lettuce', 'tomato', 'onion', 'garlic', 'herb', 'lemon', 'lime'],
    meat: ['meat', 'beef', 'chicken', 'pork', 'fish', 'salmon', 'tuna', 'shrimp', 'turkey'],
    dairy: ['milk', 'cheese', 'yogurt', 'butter', 'cream', 'egg'],
    bakery: ['bread', 'roll', 'bun', 'bagel', 'pastry', 'cake'],
    canned: ['can', 'canned', 'jar', 'preserved', 'soup'],
    dry: ['rice', 'pasta', 'cereal', 'flour', 'sugar', 'spice', 'herb', 'bean', 'lentil', 'nut'],
    frozen: ['frozen', 'ice cream', 'pizza'],
    other: []
  };
  
  // Check each category
  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => lowerItem.includes(keyword))) {
      return category as ShoppingListItem['category'];
    }
  }
  
  return 'other';
}

// Sample recipes for development
export const sampleRecipes: Recipe[] = [
  {
    id: '1',
    name: 'Avocado Toast with Poached Egg',
    description: 'A nutritious breakfast with creamy avocado and perfectly poached eggs on whole grain toast.',
    prep_time: 10,
    cook_time: 5,
    servings: 1,
    difficulty: 'easy',
    ingredients: [
      { item: 'whole grain bread', amount: 2, unit: 'slice' },
      { item: 'avocado', amount: 1, unit: 'medium' },
      { item: 'eggs', amount: 2, unit: 'large' },
      { item: 'lemon juice', amount: 1, unit: 'tsp' },
      { item: 'red pepper flakes', amount: 0.25, unit: 'tsp' },
      { item: 'salt', amount: 0.25, unit: 'tsp' },
      { item: 'black pepper', amount: 0.25, unit: 'tsp' }
    ],
    instructions: [
      'Toast the bread until golden and crisp.',
      'In a small bowl, mash the avocado with lemon juice, salt, and pepper.',
      'Bring a pot of water to a gentle simmer. Add a splash of vinegar.',
      'Crack each egg into a small cup, then gently slide into the simmering water.',
      'Poach for 3-4 minutes until whites are set but yolks are still runny.',
      'Spread mashed avocado on toast, top with poached eggs.',
      'Sprinkle with red pepper flakes and additional salt and pepper if desired.'
    ],
    nutrition: {
      calories: 420,
      protein: 15,
      carbs: 30,
      fat: 28,
      fiber: 8
    },
    dietary_restrictions: ['vegetarian'],
    image_url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80'
  },
  {
    id: '2',
    name: 'Quinoa Salad with Roasted Vegetables',
    description: 'A hearty and nutritious salad with protein-rich quinoa and colorful roasted vegetables.',
    prep_time: 15,
    cook_time: 25,
    servings: 4,
    difficulty: 'easy',
    ingredients: [
      { item: 'quinoa', amount: 1, unit: 'cup' },
      { item: 'bell peppers', amount: 2, unit: 'medium' },
      { item: 'zucchini', amount: 1, unit: 'medium' },
      { item: 'red onion', amount: 1, unit: 'small' },
      { item: 'cherry tomatoes', amount: 1, unit: 'cup' },
      { item: 'olive oil', amount: 3, unit: 'tbsp' },
      { item: 'lemon juice', amount: 2, unit: 'tbsp' },
      { item: 'garlic', amount: 2, unit: 'clove' },
      { item: 'feta cheese', amount: 0.5, unit: 'cup' },
      { item: 'fresh parsley', amount: 0.25, unit: 'cup' },
      { item: 'salt', amount: 0.5, unit: 'tsp' },
      { item: 'black pepper', amount: 0.25, unit: 'tsp' }
    ],
    instructions: [
      'Preheat oven to 425°F (220°C).',
      'Rinse quinoa under cold water. Cook according to package instructions.',
      'Cut bell peppers, zucchini, and red onion into bite-sized pieces.',
      'Toss vegetables with 2 tbsp olive oil, salt, and pepper.',
      'Spread on a baking sheet and roast for 20-25 minutes until tender and slightly charred.',
      'In a small bowl, whisk together remaining olive oil, lemon juice, and minced garlic.',
      'In a large bowl, combine cooked quinoa, roasted vegetables, and cherry tomatoes.',
      'Pour dressing over the salad and toss to combine.',
      'Gently fold in crumbled feta cheese and chopped parsley.',
      'Season with additional salt and pepper to taste.'
    ],
    nutrition: {
      calories: 320,
      protein: 10,
      carbs: 42,
      fat: 14,
      fiber: 6
    },
    dietary_restrictions: ['vegetarian', 'gluten-free'],
    image_url: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&q=80'
  },
  {
    id: '3',
    name: 'Grilled Salmon with Lemon-Dill Sauce',
    description: 'Perfectly grilled salmon fillets topped with a refreshing lemon-dill sauce.',
    prep_time: 10,
    cook_time: 15,
    servings: 4,
    difficulty: 'medium',
    ingredients: [
      { item: 'salmon fillets', amount: 4, unit: '6oz pieces' },
      { item: 'olive oil', amount: 2, unit: 'tbsp' },
      { item: 'salt', amount: 1, unit: 'tsp' },
      { item: 'black pepper', amount: 0.5, unit: 'tsp' },
      { item: 'garlic powder', amount: 0.5, unit: 'tsp' },
      { item: 'Greek yogurt', amount: 0.5, unit: 'cup' },
      { item: 'fresh dill', amount: 2, unit: 'tbsp' },
      { item: 'lemon juice', amount: 1, unit: 'tbsp' },
      { item: 'lemon zest', amount: 1, unit: 'tsp' },
      { item: 'honey', amount: 1, unit: 'tsp' },
      { item: 'capers', amount: 1, unit: 'tbsp' }
    ],
    instructions: [
      'Preheat grill to medium-high heat.',
      'Pat salmon fillets dry with paper towels.',
      'Brush salmon with olive oil and season with salt, pepper, and garlic powder.',
      'Place salmon skin-side down on the grill and cook for 4-5 minutes.',
      'Carefully flip and cook for another 3-4 minutes until fish flakes easily.',
      'Meanwhile, in a small bowl, combine yogurt, chopped dill, lemon juice, lemon zest, honey, and capers.',
      'Stir sauce ingredients until well combined.',
      'Serve grilled salmon topped with the lemon-dill sauce.'
    ],
    nutrition: {
      calories: 350,
      protein: 34,
      carbs: 5,
      fat: 22,
      fiber: 0
    },
    dietary_restrictions: ['gluten-free'],
    image_url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80'
  },
  {
    id: '4',
    name: 'Vegetable Stir-Fry with Tofu',
    description: 'A quick and flavorful stir-fry with crispy tofu and colorful vegetables.',
    prep_time: 20,
    cook_time: 15,
    servings: 4,
    difficulty: 'medium',
    ingredients: [
      { item: 'extra-firm tofu', amount: 14, unit: 'oz' },
      { item: 'cornstarch', amount: 2, unit: 'tbsp' },
      { item: 'soy sauce', amount: 3, unit: 'tbsp' },
      { item: 'sesame oil', amount: 2, unit: 'tbsp' },
      { item: 'rice vinegar', amount: 1, unit: 'tbsp' },
      { item: 'honey', amount: 1, unit: 'tbsp' },
      { item: 'garlic', amount: 3, unit: 'clove' },
      { item: 'ginger', amount: 1, unit: 'tbsp' },
      { item: 'broccoli', amount: 2, unit: 'cup' },
      { item: 'bell peppers', amount: 2, unit: 'medium' },
      { item: 'carrots', amount: 2, unit: 'medium' },
      { item: 'snow peas', amount: 1, unit: 'cup' },
      { item: 'green onions', amount: 4, unit: 'stalks' },
      { item: 'sesame seeds', amount: 1, unit: 'tbsp' }
    ],
    instructions: [
      'Press tofu between paper towels to remove excess moisture. Cut into 1-inch cubes.',
      'Toss tofu with cornstarch until lightly coated.',
      'In a small bowl, whisk together soy sauce, 1 tbsp sesame oil, rice vinegar, and honey.',
      'Heat 1 tbsp sesame oil in a large wok or skillet over medium-high heat.',
      'Add tofu and cook until golden and crispy on all sides, about 5-7 minutes. Remove and set aside.',
      'In the same pan, add minced garlic and ginger, stir for 30 seconds until fragrant.',
      'Add broccoli, bell peppers, and carrots. Stir-fry for 3-4 minutes.',
      'Add snow peas and cook for another 2 minutes.',
      'Return tofu to the pan, add sauce, and toss to coat everything evenly.',
      'Cook for 1-2 more minutes until sauce thickens slightly.',
      'Garnish with sliced green onions and sesame seeds before serving.'
    ],
    nutrition: {
      calories: 280,
      protein: 16,
      carbs: 24,
      fat: 15,
      fiber: 5
    },
    dietary_restrictions: ['vegetarian', 'vegan'],
    image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80'
  },
  {
    id: '5',
    name: 'Greek Yogurt Parfait',
    description: 'A simple yet satisfying parfait with layers of Greek yogurt, fresh berries, and crunchy granola.',
    prep_time: 5,
    cook_time: 0,
    servings: 1,
    difficulty: 'easy',
    ingredients: [
      { item: 'Greek yogurt', amount: 1, unit: 'cup' },
      { item: 'mixed berries', amount: 1, unit: 'cup' },
      { item: 'granola', amount: 0.25, unit: 'cup' },
      { item: 'honey', amount: 1, unit: 'tbsp' },
      { item: 'chia seeds', amount: 1, unit: 'tsp' }
    ],
    instructions: [
      'In a glass or bowl, add a layer of Greek yogurt.',
      'Top with a layer of mixed berries.',
      'Add a layer of granola.',
      'Repeat layers until all ingredients are used.',
      'Drizzle with honey and sprinkle with chia seeds.'
    ],
    nutrition: {
      calories: 320,
      protein: 20,
      carbs: 45,
      fat: 8,
      fiber: 7
    },
    dietary_restrictions: ['vegetarian', 'gluten-free'],
    image_url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80'
  }
];