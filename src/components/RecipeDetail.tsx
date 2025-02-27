import React, { useState } from 'react';
import { X, Clock, ChefHat, Users, Printer, Heart, Share, BookmarkPlus } from 'lucide-react';
import { Recipe } from '../lib/mealPlanner';

interface RecipeDetailProps {
  recipe: Recipe;
  onClose: () => void;
}

const RecipeDetail: React.FC<RecipeDetailProps> = ({ recipe, onClose }) => {
  const [servings, setServings] = useState(recipe.servings);
  
  const handlePrint = () => {
    window.print();
  };
  
  const adjustIngredientAmount = (amount: number): number => {
    if (recipe.servings === 0) return amount;
    return (amount * servings) / recipe.servings;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-4 bg-emerald-600 text-white flex justify-between items-center">
          <h2 className="text-xl font-semibold">Recipe Details</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 60px)' }}>
          {recipe.image_url && (
            <div className="h-64 overflow-hidden">
              <img 
                src={recipe.image_url} 
                alt={recipe.name} 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="p-6">
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{recipe.name}</h1>
              <div className="flex space-x-2">
                <button className="p-2 text-gray-500 hover:text-emerald-600 rounded-full hover:bg-gray-100">
                  <Heart className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-500 hover:text-emerald-600 rounded-full hover:bg-gray-100">
                  <BookmarkPlus className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-500 hover:text-emerald-600 rounded-full hover:bg-gray-100">
                  <Share className="h-5 w-5" />
                </button>
                <button 
                  onClick={handlePrint}
                  className="p-2 text-gray-500 hover:text-emerald-600 rounded-full hover:bg-gray-100"
                >
                  <Printer className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <p className="text-gray-600 mb-6">{recipe.description}</p>
            
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-emerald-600 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Prep Time</p>
                  <p className="font-medium">{recipe.prep_time} min</p>
                </div>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-emerald-600 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Cook Time</p>
                  <p className="font-medium">{recipe.cook_time} min</p>
                </div>
              </div>
              <div className="flex items-center">
                <ChefHat className="h-5 w-5 text-emerald-600 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Difficulty</p>
                  <p className="font-medium capitalize">{recipe.difficulty}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 text-emerald-600 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Servings</p>
                  <div className="flex items-center">
                    <button 
                      onClick={() => setServings(Math.max(1, servings - 1))}
                      className="text-gray-500 hover:text-emerald-600"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={servings}
                      onChange={(e) => setServings(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-12 text-center mx-2 border-b border-gray-300 focus:outline-none focus:border-emerald-600"
                    />
                    <button 
                      onClick={() => setServings(servings + 1)}
                      className="text-gray-500 hover:text-emerald-600"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Ingredients</h2>
              <ul className="space-y-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-center">
                    <div className="w-6 h-6 rounded-full border border-emerald-600 flex items-center justify-center mr-3">
                      <input type="checkbox" className="accent-emerald-600" />
                    </div>
                    <span>
                      {adjustIngredientAmount(ingredient.amount).toFixed(ingredient.amount % 1 === 0 ? 0 : 2)} {ingredient.unit} {ingredient.item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Instructions</h2>
              <ol className="space-y-4">
                {recipe.instructions.map((step, index) => (
                  <li key={index} className="flex">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center mr-3 flex-shrink-0">
                      {index + 1}
                    </div>
                    <p>{step}</p>
                  </li>
                ))}
              </ol>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Nutrition Information</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <p className="text-sm text-gray-500">Calories</p>
                  <p className="font-semibold">{recipe.nutrition.calories}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <p className="text-sm text-gray-500">Protein</p>
                  <p className="font-semibold">{recipe.nutrition.protein}g</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <p className="text-sm text-gray-500">Carbs</p>
                  <p className="font-semibold">{recipe.nutrition.carbs}g</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <p className="text-sm text-gray-500">Fat</p>
                  <p className="font-semibold">{recipe.nutrition.fat}g</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <p className="text-sm text-gray-500">Fiber</p>
                  <p className="font-semibold">{recipe.nutrition.fiber}g</p>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-4">Dietary Information</h2>
              <div className="flex flex-wrap gap-2">
                {recipe.dietary_restrictions.map((restriction, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full"
                  >
                    {restriction}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;