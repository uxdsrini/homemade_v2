import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Clock, Users, DollarSign, ChefHat, ShoppingCart } from 'lucide-react';
import { Recipe } from '../types';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface RecipeCardProps {
  recipe: Recipe & { homemakerName: string };
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const { addToCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleOrderClick = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    addToCart(recipe);
    toast.success('Added to cart!', {
      icon: '🛒',
      position: 'bottom-center',
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative">
        {recipe.photos && recipe.photos[0] && (
          <img
            src={recipe.photos[0]}
            alt={recipe.name}
            className="w-full h-48 sm:h-56 object-cover"
            loading="lazy"
          />
        )}
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-white/90 text-orange-600 shadow-sm">
            {recipe.category}
          </span>
        </div>
      </div>
      
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{recipe.name}</h3>
        </div>

        <div className="flex items-center text-sm text-gray-500 mb-3">
          <ChefHat className="w-4 h-4 mr-1 flex-shrink-0" />
          <span className="truncate">{recipe.homemakerName}</span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{recipe.description}</p>

        <div className="grid grid-cols-3 gap-2 text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1 flex-shrink-0" />
            <span>{recipe.cookingTime}m</span>
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1 flex-shrink-0" />
            <span>Serves {recipe.servingSize}</span>
          </div>
          <div className="flex items-center justify-end font-medium text-orange-600">
            <DollarSign className="w-4 h-4 mr-1 flex-shrink-0" />
            <span>{recipe.price.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleOrderClick}
            className="flex-1 flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </button>
          <Link
            to={`/recipe/${recipe.id}`}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
}