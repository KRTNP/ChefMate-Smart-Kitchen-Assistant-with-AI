import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChefHat } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path ? 'text-emerald-600 font-medium' : 'text-gray-600 hover:text-emerald-600';
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <ChefHat className="h-8 w-8 text-emerald-600" />
            <span className="text-xl font-bold text-gray-900">ChefMate</span>
          </Link>

          <div className="flex items-center space-x-6">
            <Link to="/recipes" className={isActive('/recipes')}>
              Recipes
            </Link>
            <Link to="/meal-planner" className={isActive('/meal-planner')}>
              Meal Planner
            </Link>
            <Link to="/chat" className={isActive('/chat')}>
              AI Assistant
            </Link>
            {user ? (
              <>
                <span className="text-gray-600">Hello, {user.email}</span>
                <Link to="/logout" className="text-gray-600 hover:text-emerald-600">
                  Logout
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className={isActive('/login')}>
                  Login
                </Link>
                <Link to="/register" className={isActive('/register')}>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;