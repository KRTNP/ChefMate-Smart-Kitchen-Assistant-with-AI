import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Clock, Calendar, MessageSquare, ChefHat, Utensils } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Your Smart Kitchen Assistant
        </h1>
        <p className="text-xl text-gray-600">
          Discover recipes, plan meals, and get cooking assistance with AI
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link 
            to="/recipes" 
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2"
          >
            <Search className="h-5 w-5" />
            Find Recipes
          </Link>
          <Link 
            to="/chat" 
            className="bg-white border border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-6 py-3 rounded-lg font-medium flex items-center gap-2"
          >
            <MessageSquare className="h-5 w-5" />
            Ask AI Chef
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
        <FeatureCard
          icon={<Search className="w-8 h-8 text-emerald-600" />}
          title="Recipe Search"
          description="Find the perfect recipe with our advanced search and filtering system"
          link="/recipes"
        />
        <FeatureCard
          icon={<Calendar className="w-8 h-8 text-emerald-600" />}
          title="Meal Planning"
          description="Plan your weekly meals with our intuitive drag-and-drop interface"
          link="/meal-planner"
        />
        <FeatureCard
          icon={<MessageSquare className="w-8 h-8 text-emerald-600" />}
          title="AI Assistant"
          description="Get real-time cooking advice and recipe modifications from our AI"
          link="/chat"
        />
      </div>

      <div className="mt-16 bg-emerald-50 rounded-xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Featured Recipes</h2>
          <p className="text-gray-600 mt-2">Discover our most popular dishes</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <RecipeCard
            title="Avocado Toast with Poached Egg"
            image="https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80"
            time="15 min"
            difficulty="Easy"
          />
          <RecipeCard
            title="Quinoa Salad with Roasted Vegetables"
            image="https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&q=80"
            time="40 min"
            difficulty="Easy"
          />
          <RecipeCard
            title="Grilled Salmon with Lemon-Dill Sauce"
            image="https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80"
            time="25 min"
            difficulty="Medium"
          />
        </div>
        
        <div className="text-center mt-8">
          <Link 
            to="/recipes" 
            className="inline-flex items-center text-emerald-600 font-medium hover:text-emerald-700"
          >
            View all recipes
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
}> = ({ icon, title, description, link }) => {
  return (
    <Link to={link} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex flex-col items-center text-center">
        <div className="mb-4">{icon}</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </Link>
  );
};

const RecipeCard: React.FC<{
  title: string;
  image: string;
  time: string;
  difficulty: string;
}> = ({ title, image, time, difficulty }) => {
  return (
    <Link to="/recipes" className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="p-4">
        <h3 className="font-medium text-gray-900">{title}</h3>
        <div className="flex items-center mt-2 text-sm text-gray-500">
          <Clock className="h-4 w-4 mr-1" />
          <span>{time}</span>
          <span className="mx-2">•</span>
          <ChefHat className="h-4 w-4 mr-1" />
          <span>{difficulty}</span>
        </div>
      </div>
    </Link>
  );
};

export default Home;