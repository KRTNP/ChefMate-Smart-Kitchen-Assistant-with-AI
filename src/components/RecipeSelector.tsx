import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Recipe, sampleRecipes } from '../lib/mealPlanner';

interface RecipeSelectorProps {
  onSelectRecipe: (recipe: Recipe) => void;
  onClose: () => void;
  dietaryRestrictions?: string[];
  maxPrepTime?: number;
}

const RecipeSelector: React.FC<RecipeSelectorProps> = ({ 
  onSelectRecipe, 
  onClose,
  dietaryRestrictions,
  maxPrepTime
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch from the API
    // For now, we'll use the sample recipes
    setRecipes(sampleRecipes);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    let filtered = recipes;
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(recipe => 
        recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply dietary restrictions filter
    if (dietaryRestrictions && dietaryRestrictions.length > 0) {
      filtered = filtered.filter(recipe => 
        dietaryRestrictions.every(restriction => 
          recipe.dietary_restrictions.includes(restriction)
        )
      );
    }
    
    // Apply prep time filter
    if (maxPrepTime) {
      filtered = filtered.filter(recipe => recipe.prep_time <= maxPrepTime);
    }
    
    setFilteredRecipes(filtered);
  }, [searchQuery, recipes, dietaryRestrictions, maxPrepTime]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-4 bg-emerald-600 text-white flex justify-between items-center">
          <h2 className="text-xl font-semibold">Select a Recipe</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-4 border-b">
          <div className="relative">
            <input
              type="text"
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
        
        <div className="overflow-y-auto p-4" style={{ maxHeight: 'calc(90vh - 130px)' }}>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading recipes...</p>
            </div>
          ) : filteredRecipes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No recipes found. Try adjusting your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredRecipes.map((recipe) => (
                <div 
                  key={recipe.id}
                  className="border rounded-lg overflow-hidden hover:shadow-md cursor-pointer transition-shadow"
                  onClick={() => onSelectRecipe(recipe)}
                >
                  <div className="flex h-32">
                    {recipe.image_url && (
                      <div className="w-1/3">
                        <img 
                          src={recipe.image_url} 
                          alt={recipe.name} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <div className={`${recipe.image_url ? 'w-2/3' : 'w-full'} p-3`}>
                      <h3 className="font-medium text-gray-900 mb-1">{recipe.name}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{recipe.description}</p>
                      <div className="mt-2 flex items-center text-xs text-gray-500">
                        <span className="mr-2">Prep: {recipe.prep_time} min</span>
                        <span className="mr-2">•</span>
                        <span>Difficulty: {recipe.difficulty}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeSelector;