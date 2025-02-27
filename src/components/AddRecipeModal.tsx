import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Recipe } from '../lib/mealPlanner';

interface AddRecipeModalProps {
  onAddRecipe: (recipe: Recipe) => void;
  onClose: () => void;
}

const AddRecipeModal: React.FC<AddRecipeModalProps> = ({ onAddRecipe, onClose }) => {
  const [recipe, setRecipe] = useState<Partial<Recipe>>({
    name: '',
    description: '',
    prep_time: 0,
    cook_time: 0,
    servings: 2,
    difficulty: 'medium',
    ingredients: [],
    instructions: [],
    nutrition: {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0
    },
    dietary_restrictions: [],
    image_url: ''
  });

  const [newIngredient, setNewIngredient] = useState({
    item: '',
    amount: 0,
    unit: 'g'
  });

  const [newInstruction, setNewInstruction] = useState('');
  const [newDietaryRestriction, setNewDietaryRestriction] = useState('');

  const handleAddIngredient = () => {
    if (!newIngredient.item || newIngredient.amount <= 0) return;
    
    setRecipe(prev => ({
      ...prev,
      ingredients: [...(prev.ingredients || []), { ...newIngredient }]
    }));
    
    setNewIngredient({
      item: '',
      amount: 0,
      unit: 'g'
    });
  };

  const handleRemoveIngredient = (index: number) => {
    setRecipe(prev => ({
      ...prev,
      ingredients: (prev.ingredients || []).filter((_, i) => i !== index)
    }));
  };

  const handleAddInstruction = () => {
    if (!newInstruction) return;
    
    setRecipe(prev => ({
      ...prev,
      instructions: [...(prev.instructions || []), newInstruction]
    }));
    
    setNewInstruction('');
  };

  const handleRemoveInstruction = (index: number) => {
    setRecipe(prev => ({
      ...prev,
      instructions: (prev.instructions || []).filter((_, i) => i !== index)
    }));
  };

  const handleAddDietaryRestriction = () => {
    if (!newDietaryRestriction) return;
    
    setRecipe(prev => ({
      ...prev,
      dietary_restrictions: [...(prev.dietary_restrictions || []), newDietaryRestriction]
    }));
    
    setNewDietaryRestriction('');
  };

  const handleRemoveDietaryRestriction = (index: number) => {
    setRecipe(prev => ({
      ...prev,
      dietary_restrictions: (prev.dietary_restrictions || []).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!recipe.name || !recipe.description || recipe.ingredients?.length === 0 || recipe.instructions?.length === 0) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Create a complete recipe object
    const completeRecipe: Recipe = {
      id: Date.now().toString(), // Generate a temporary ID
      name: recipe.name || '',
      description: recipe.description || '',
      prep_time: recipe.prep_time || 0,
      cook_time: recipe.cook_time || 0,
      servings: recipe.servings || 2,
      difficulty: recipe.difficulty as 'easy' | 'medium' | 'hard' || 'medium',
      ingredients: recipe.ingredients || [],
      instructions: recipe.instructions || [],
      nutrition: recipe.nutrition || {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0
      },
      dietary_restrictions: recipe.dietary_restrictions || [],
      image_url: recipe.image_url
    };
    
    onAddRecipe(completeRecipe);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-4 bg-emerald-600 text-white flex justify-between items-center">
          <h2 className="text-xl font-semibold">Add New Recipe</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="overflow-y-auto p-6" style={{ maxHeight: 'calc(90vh - 60px)' }}>
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Recipe Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                    value={recipe.name}
                    onChange={(e) => setRecipe({ ...recipe, name: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                    value={recipe.image_url}
                    onChange={(e) => setRecipe({ ...recipe, image_url: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  value={recipe.description}
                  onChange={(e) => setRecipe({ ...recipe, description: e.target.value })}
                ></textarea>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prep Time (minutes) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                    value={recipe.prep_time}
                    onChange={(e) => setRecipe({ ...recipe, prep_time: parseInt(e.target.value) || 0 })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cook Time (minutes) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                    value={recipe.cook_time}
                    onChange={(e) => setRecipe({ ...recipe, cook_time: parseInt(e.target.value) || 0 })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Servings *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                    value={recipe.servings}
                    onChange={(e) => setRecipe({ ...recipe, servings: parseInt(e.target.value) || 1 })}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Difficulty *
                </label>
                <select
                  required
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  value={recipe.difficulty}
                  onChange={(e) => setRecipe({ ...recipe, difficulty: e.target.value as 'easy' | 'medium' | 'hard' })}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Ingredients *
                </label>
                <div className="space-y-3">
                  {recipe.ingredients?.map((ingredient, index) => (
                    <div key={index} className="flex items-center">
                      <div className="flex-1 flex items-center">
                        <span className="font-medium">{ingredient.amount} {ingredient.unit} {ingredient.item}</span>
                      </div>
                      <button 
                        type="button"
                        onClick={() => handleRemoveIngredient(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="mt-3 flex items-end gap-2">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">Item</label>
                    <input
                      type="text"
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                      value={newIngredient.item}
                      onChange={(e) => setNewIngredient({ ...newIngredient, item: e.target.value })}
                    />
                  </div>
                  <div className="w-20">
                    <label className="block text-xs text-gray-500 mb-1">Amount</label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                      value={newIngredient.amount || ''}
                      onChange={(e) => setNewIngredient({ ...newIngredient, amount: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="w-20">
                    <label className="block text-xs text-gray-500 mb-1">Unit</label>
                    <select
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                      value={newIngredient.unit}
                      onChange={(e) => setNewIngredient({ ...newIngredient, unit: e.target.value })}
                    >
                      <option value="g">g</option>
                      <option value="kg">kg</option>
                      <option value="ml">ml</option>
                      <option value="l">l</option>
                      <option value="tsp">tsp</option>
                      <option value="tbsp">tbsp</option>
                      <option value="cup">cup</option>
                      <option value="oz">oz</option>
                      <option value="lb">lb</option>
                      <option value="piece">piece</option>
                      <option value="slice">slice</option>
                    </select>
                  </div>
                  <button 
                    type="button"
                    onClick={handleAddIngredient}
                    className="bg-emerald-600 text-white p-2 rounded-lg hover:bg-emerald-700"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Instructions *
                </label>
                <div className="space-y-3">
                  {recipe.instructions?.map((instruction, index) => (
                    <div key={index} className="flex items-start">
                      <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center mr-3 flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p>{instruction}</p>
                      </div>
                      <button 
                        type="button"
                        onClick={() => handleRemoveInstruction(index)}
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="mt-3 flex items-end gap-2">
                  <div className="flex-1">
                    <input
                      type="text"
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                      value={newInstruction}
                      onChange={(e) => setNewInstruction(e.target.value)}
                      placeholder="Add a step..."
                    />
                  </div>
                  <button 
                    type="button"
                    onClick={handleAddInstruction}
                    className="bg-emerald-600 text-white p-2 rounded-lg hover:bg-emerald-700"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">Nutrition Information</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Calories</label>
                    <input
                      type="number"
                      min="0"
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                      value={recipe.nutrition?.calories || 0}
                      onChange={(e) => setRecipe({ 
                        ...recipe, 
                        nutrition: { 
                          ...recipe.nutrition as any, 
                          calories: parseInt(e.target.value) || 0 
                        } 
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Protein (g)</label>
                    <input
                      type="number"
                      min="0"
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                      value={recipe.nutrition?.protein || 0}
                      onChange={(e) => setRecipe({ 
                        ...recipe, 
                        nutrition: { 
                          ...recipe.nutrition as any, 
                          protein: parseInt(e.target.value) || 0 
                        } 
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Carbs (g)</label>
                    <input
                      type="number"
                      min="0"
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                      value={recipe.nutrition?.carbs || 0}
                      onChange={(e) => setRecipe({ 
                        ...recipe, 
                        nutrition: { 
                          ...recipe.nutrition as any, 
                          carbs: parseInt(e.target.value) || 0 
                        } 
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Fat (g)</label>
                    <input
                      type="number"
                      min="0"
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                      value={recipe.nutrition?.fat || 0}
                      onChange={(e) => setRecipe({ 
                        ...recipe, 
                        nutrition: { 
                          ...recipe.nutrition as any, 
                          fat: parseInt(e.target.value) || 0 
                        } 
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Fiber (g)</label>
                    <input
                      type="number"
                      min="0"
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                      value={recipe.nutrition?.fiber || 0}
                      onChange={(e) => setRecipe({ 
                        ...recipe, 
                        nutrition: { 
                          ...recipe.nutrition as any, 
                          fiber: parseInt(e.target.value) || 0 
                        } 
                      })}
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Dietary Restrictions
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {recipe.dietary_restrictions?.map((restriction, index) => (
                    <div 
                      key={index}
                      className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full flex items-center"
                    >
                      <span>{restriction}</span>
                      <button 
                        type="button"
                        onClick={() => handleRemoveDietaryRestriction(index)}
                        className="ml-2 text-emerald-800 hover:text-emerald-900"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <input
                      type="text"
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                      value={newDietaryRestriction}
                      onChange={(e) => setNewDietaryRestriction(e.target.value)}
                      placeholder="Add a dietary restriction..."
                    />
                  </div>
                  <button 
                    type="button"
                    onClick={handleAddDietaryRestriction}
                    className="bg-emerald-600 text-white p-2 rounded-lg hover:bg-emerald-700"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              >
                Add Recipe
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddRecipeModal;