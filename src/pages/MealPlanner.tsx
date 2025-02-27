import React, { useState, useEffect } from 'react';
import { Calendar, Clock, ChefHat, ShoppingBag, Filter, Save, Plus, X, AlertTriangle } from 'lucide-react';
import RecipeSelector from '../components/RecipeSelector';
import ShoppingListModal from '../components/ShoppingListModal';
import { 
  MealPlan, 
  Recipe, 
  MealType,
  ShoppingListItem,
  generateShoppingList,
  saveMealPlan,
  sampleRecipes
} from '../lib/mealPlanner';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MEAL_TYPES = [
  { id: 'breakfast', label: 'Breakfast' },
  { id: 'lunch', label: 'Lunch' },
  { id: 'dinner', label: 'Dinner' },
  { id: 'snack1', label: 'Snack 1' },
  { id: 'snack2', label: 'Snack 2' }
];

const MealPlanner: React.FC = () => {
  const [preferences, setPreferences] = useState({
    dietaryRestrictions: [] as string[],
    calorieGoal: 2000,
    skillLevel: 'intermediate' as 'beginner' | 'intermediate' | 'advanced',
    prepTime: 30,
    servings: 2,
    excludedIngredients: [] as string[],
    budget: 'medium' as 'low' | 'medium' | 'high',
    equipment: [] as string[],
  });

  const [showPreferences, setShowPreferences] = useState(false);
  const [showRecipeSelector, setShowRecipeSelector] = useState(false);
  const [showShoppingList, setShowShoppingList] = useState(false);
  const [currentDay, setCurrentDay] = useState('');
  const [currentMealType, setCurrentMealType] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [databaseError, setDatabaseError] = useState<string | null>(null);
  
  // Initialize meal plan with empty meals for each day and meal type
  const [mealPlan, setMealPlan] = useState<MealPlan>({
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    preferences: preferences,
    meals: DAYS_OF_WEEK.reduce((acc, day) => {
      acc[day] = MEAL_TYPES.reduce((mealAcc, mealType) => {
        mealAcc[mealType.id as keyof MealType] = null;
        return mealAcc;
      }, {} as MealType);
      return acc;
    }, {} as Record<string, MealType>)
  });
  
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);

  // Update meal plan when preferences change
  useEffect(() => {
    setMealPlan(prev => ({
      ...prev,
      preferences
    }));
  }, [preferences]);

  const handleAddRecipe = (day: string, mealType: string) => {
    setCurrentDay(day);
    setCurrentMealType(mealType);
    setShowRecipeSelector(true);
  };

  const handleSelectRecipe = (recipe: Recipe) => {
    setMealPlan(prev => {
      const updatedMeals = { ...prev.meals };
      updatedMeals[currentDay] = {
        ...updatedMeals[currentDay],
        [currentMealType as keyof MealType]: recipe
      };
      
      return {
        ...prev,
        meals: updatedMeals
      };
    });
    
    setShowRecipeSelector(false);
  };

  const handleRemoveRecipe = (day: string, mealType: keyof MealType) => {
    setMealPlan(prev => {
      const updatedMeals = { ...prev.meals };
      updatedMeals[day] = {
        ...updatedMeals[day],
        [mealType]: null
      };
      
      return {
        ...prev,
        meals: updatedMeals
      };
    });
  };

  const handleGenerateShoppingList = () => {
    const items = generateShoppingList(mealPlan);
    setShoppingList(items);
    setShowShoppingList(true);
  };

  const handleSaveMealPlan = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError(null);
    
    try {
      await saveMealPlan(mealPlan);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save meal plan';
      setSaveError(errorMessage);
      
      // Check if it's a database error
      if (errorMessage.includes('404') || errorMessage.includes('not found')) {
        setDatabaseError('Database tables not found. Please make sure to run the Supabase migrations first.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">7-Day Meal Plan</h1>
          <p className="text-gray-600 mt-2">Personalized meal planning made easy</p>
        </div>
        <button
          onClick={() => setShowPreferences(!showPreferences)}
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
        >
          <Filter className="h-5 w-5" />
          Preferences
        </button>
      </div>

      {databaseError && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-8">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-amber-800 font-medium">Database Setup Required</h3>
              <p className="text-amber-700 mt-1">{databaseError}</p>
              <p className="text-amber-700 mt-2">
                For now, you can still create and view meal plans, but they won't be saved to the database.
              </p>
            </div>
          </div>
        </div>
      )}

      {showPreferences && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Meal Plan Preferences</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dietary Restrictions
              </label>
              <select
                multiple
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                value={preferences.dietaryRestrictions}
                onChange={(e) => setPreferences({
                  ...preferences,
                  dietaryRestrictions: Array.from(e.target.selectedOptions, option => option.value)
                })}
              >
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="gluten-free">Gluten-free</option>
                <option value="dairy-free">Dairy-free</option>
                <option value="keto">Keto</option>
                <option value="paleo">Paleo</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Daily Calorie Goal
              </label>
              <input
                type="number"
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                value={preferences.calorieGoal}
                onChange={(e) => setPreferences({
                  ...preferences,
                  calorieGoal: parseInt(e.target.value)
                })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cooking Skill Level
              </label>
              <select
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                value={preferences.skillLevel}
                onChange={(e) => setPreferences({
                  ...preferences,
                  skillLevel: e.target.value as 'beginner' | 'intermediate' | 'advanced'
                })}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Prep Time (minutes)
              </label>
              <input
                type="number"
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                value={preferences.prepTime}
                onChange={(e) => setPreferences({
                  ...preferences,
                  prepTime: parseInt(e.target.value)
                })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Servings
              </label>
              <input
                type="number"
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                value={preferences.servings}
                onChange={(e) => setPreferences({
                  ...preferences,
                  servings: parseInt(e.target.value)
                })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget Level
              </label>
              <select
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                value={preferences.budget}
                onChange={(e) => setPreferences({
                  ...preferences,
                  budget: e.target.value as 'low' | 'medium' | 'high'
                })}
              >
                <option value="low">Budget-friendly</option>
                <option value="medium">Moderate</option>
                <option value="high">Premium</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700"
              onClick={() => setShowPreferences(false)}
            >
              Apply Preferences
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
        {DAYS_OF_WEEK.map((day) => (
          <div key={day} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-emerald-600 text-white p-3">
              <h3 className="font-semibold">{day}</h3>
            </div>
            <div className="p-4 space-y-4">
              {MEAL_TYPES.map((mealType) => {
                const recipe = mealPlan.meals[day]?.[mealType.id as keyof MealType] as Recipe | null;
                
                return (
                  <div key={mealType.id} className="border rounded-lg p-3">
                    <h4 className="font-medium text-sm text-gray-600 mb-2">{mealType.label}</h4>
                    
                    {recipe ? (
                      <div className="relative">
                        <div className="flex items-start">
                          {recipe.image_url && (
                            <img 
                              src={recipe.image_url} 
                              alt={recipe.name} 
                              className="w-16 h-16 object-cover rounded mr-3"
                            />
                          )}
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900">{recipe.name}</h5>
                            <div className="flex items-center text-xs text-gray-500 mt-1">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{recipe.prep_time + recipe.cook_time} min</span>
                              <span className="mx-2">•</span>
                              <span>{recipe.nutrition.calories} cal</span>
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleRemoveRecipe(day, mealType.id as keyof MealType)}
                          className="absolute top-0 right-0 text-gray-400 hover:text-red-500"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleAddRecipe(day, mealType.id)}
                        className="w-full bg-gray-50 border border-dashed border-gray-300 rounded-lg p-3 text-gray-500 hover:bg-gray-100 transition-colors flex items-center justify-center"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Recipe
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {saveSuccess && (
        <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          Meal plan saved successfully!
        </div>
      )}
      
      {saveError && !databaseError && (
        <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {saveError}
        </div>
      )}

      <div className="mt-8 flex justify-end gap-4">
        <button 
          onClick={handleGenerateShoppingList}
          className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
        >
          <ShoppingBag className="h-5 w-5" />
          Generate Shopping List
        </button>
        <button 
          onClick={handleSaveMealPlan}
          disabled={isSaving}
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <>
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="h-5 w-5" />
              Save Meal Plan
            </>
          )}
        </button>
      </div>

      {showRecipeSelector && (
        <RecipeSelector 
          onSelectRecipe={handleSelectRecipe} 
          onClose={() => setShowRecipeSelector(false)}
          dietaryRestrictions={preferences.dietaryRestrictions}
          maxPrepTime={preferences.prepTime}
        />
      )}
      
      {showShoppingList && (
        <ShoppingListModal 
          shoppingList={shoppingList} 
          onClose={() => setShowShoppingList(false)} 
        />
      )}
    </div>
  );
};

export default MealPlanner;