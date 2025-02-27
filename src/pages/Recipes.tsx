import React, { useState, useEffect } from 'react';
import { Search, Filter, Clock, ChefHat, BookOpen, Plus, AlertTriangle } from 'lucide-react';
import { Recipe, searchRecipes, sampleRecipes } from '../lib/mealPlanner';
import RecipeDetail from '../components/RecipeDetail';
import AddRecipeModal from '../components/AddRecipeModal';

const Recipes: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showAddRecipe, setShowAddRecipe] = useState(false);
  const [databaseError, setDatabaseError] = useState<string | null>(null);
  
  const [filters, setFilters] = useState({
    dietaryRestrictions: [] as string[],
    maxPrepTime: 0,
    difficulty: '',
    mealType: ''
  });

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        // Try to fetch from the API
        const fetchedRecipes = await searchRecipes('');
        setRecipes(fetchedRecipes.length > 0 ? fetchedRecipes : sampleRecipes);
        setFilteredRecipes(fetchedRecipes.length > 0 ? fetchedRecipes : sampleRecipes);
      } catch (error) {
        console.error('Error fetching recipes:', error);
        // If there's an error, use sample recipes
        setRecipes(sampleRecipes);
        setFilteredRecipes(sampleRecipes);
        
        // Check if it's a database error
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        if (errorMessage.includes('404') || errorMessage.includes('not found')) {
          setDatabaseError('Database tables not found. Please make sure to run the Supabase migrations first.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes();
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
    if (filters.dietaryRestrictions.length > 0) {
      filtered = filtered.filter(recipe => 
        filters.dietaryRestrictions.every(restriction => 
          recipe.dietary_restrictions.includes(restriction)
        )
      );
    }
    
    // Apply prep time filter
    if (filters.maxPrepTime > 0) {
      filtered = filtered.filter(recipe => recipe.prep_time <= filters.maxPrepTime);
    }
    
    // Apply difficulty filter
    if (filters.difficulty) {
      filtered = filtered.filter(recipe => recipe.difficulty === filters.difficulty);
    }
    
    setFilteredRecipes(filtered);
  }, [searchQuery, recipes, filters]);

  const handleAddRecipe = (newRecipe: Recipe) => {
    setRecipes(prev => [...prev, newRecipe]);
    setShowAddRecipe(false);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Recipes</h1>
          <p className="text-gray-600 mt-2">Discover and save your favorite recipes</p>
        </div>
        <button
          onClick={() => setShowAddRecipe(true)}
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
        >
          <Plus className="h-5 w-5" />
          Add Recipe
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
                For now, you can still browse and add recipes locally, but they won't be saved to the database.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200"
          >
            <Filter className="h-5 w-5" />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 p-4 border rounded-lg">
            <h3 className="font-medium mb-3">Filter Recipes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dietary Restrictions
                </label>
                <select
                  multiple
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  value={filters.dietaryRestrictions}
                  onChange={(e) => setFilters({
                    ...filters,
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Prep Time (minutes)
                </label>
                <input
                  type="number"
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  value={filters.maxPrepTime || ''}
                  onChange={(e) => setFilters({
                    ...filters,
                    maxPrepTime: parseInt(e.target.value) || 0
                  })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Difficulty
                </label>
                <select
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  value={filters.difficulty}
                  onChange={(e) => setFilters({
                    ...filters,
                    difficulty: e.target.value
                  })}
                >
                  <option value="">Any</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meal Type
                </label>
                <select
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  value={filters.mealType}
                  onChange={(e) => setFilters({
                    ...filters,
                    mealType: e.target.value
                  })}
                >
                  <option value="">Any</option>
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                  <option value="dessert">Dessert</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setFilters({
                  dietaryRestrictions: [],
                  maxPrepTime: 0,
                  difficulty: '',
                  mealType: ''
                })}
                className="text-gray-600 hover:text-gray-800 mr-4"
              >
                Reset Filters
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading recipes...</p>
        </div>
      ) : filteredRecipes.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-lg">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto" />
          <p className="mt-4 text-gray-600">No recipes found. Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <div 
              key={recipe.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => setSelectedRecipe(recipe)}
            >
              {recipe.image_url && (
                <div className="h-48 overflow-hidden">
                  <img 
                    src={recipe.image_url} 
                    alt={recipe.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{recipe.name}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{recipe.description}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{recipe.prep_time + recipe.cook_time} min</span>
                  <span className="mx-2">•</span>
                  <ChefHat className="h-4 w-4 mr-1" />
                  <span className="capitalize">{recipe.difficulty}</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {recipe.dietary_restrictions.map((restriction, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full"
                    >
                      {restriction}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedRecipe && (
        <RecipeDetail 
          recipe={selectedRecipe} 
          onClose={() => setSelectedRecipe(null)} 
        />
      )}

      {showAddRecipe && (
        <AddRecipeModal 
          onAddRecipe={handleAddRecipe} 
          onClose={() => setShowAddRecipe(false)} 
        />
      )}
    </div>
  );
};

export default Recipes;