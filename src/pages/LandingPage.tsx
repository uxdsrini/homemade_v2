import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Recipe } from '../types';
import { Coffee, Sun, Moon, ArrowRight, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { seedDatabase } from '../lib/seedData';
import RecipeCard from '../components/RecipeCard';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import SubscriptionPlans from '../components/SubscriptionPlans';
import Footer from '../components/Footer';

export default function LandingPage() {
  const [recipes, setRecipes] = useState<(Recipe & { homemakerName: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<'breakfast' | 'lunch' | 'dinner'>('breakfast');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser } = useAuth();
  const { cart } = useCart();

  useEffect(() => {
    fetchRecipes();
  }, []);

  async function fetchRecipes() {
    try {
      await seedDatabase();
      const recipesQuery = query(
        collection(db, 'recipes'),
        where('status', '==', 'published')
      );
      const recipesSnapshot = await getDocs(recipesQuery);
      
      const recipesWithHomemaker = await Promise.all(
        recipesSnapshot.docs.map(async (doc) => {
          const recipeData = { id: doc.id, ...doc.data() } as Recipe;
          const homemakerDoc = await getDocs(query(
            collection(db, 'homemakers'),
            where('uid', '==', recipeData.homemakerId)
          ));
          const homemakerName = homemakerDoc.docs[0]?.data()?.displayName || 'Unknown Chef';
          return { ...recipeData, homemakerName };
        })
      );

      setRecipes(recipesWithHomemaker);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredRecipes = recipes.filter(recipe => recipe.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-orange-600">
                HomeMade
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {currentUser ? (
                <>
                  <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">
                    Dashboard
                  </Link>
                  <Link to="/cart" className="text-gray-600 hover:text-gray-900">
                    Cart ({cart.length})
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-600 hover:text-gray-900">
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-600 hover:text-gray-900"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {currentUser ? (
                <>
                  <Link
                    to="/dashboard"
                    className="block px-3 py-2 text-gray-600 hover:text-gray-900"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/cart"
                    className="block px-3 py-2 text-gray-600 hover:text-gray-900"
                  >
                    Cart ({cart.length})
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-gray-600 hover:text-gray-900"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="block px-3 py-2 bg-orange-600 text-white rounded-md"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              Homemade Food,{' '}
              <span className="text-orange-600">Delivered Fresh</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Discover authentic home-cooked meals from talented home chefs in your neighborhood.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Tabs */}
        <div className="flex justify-center space-x-4 mb-8">
          {(['breakfast', 'lunch', 'dinner'] as const).map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-md ${
                selectedCategory === category
                  ? 'bg-orange-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Recipe Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
            {filteredRecipes.length === 0 && (
              <div className="col-span-full text-center py-12">
                <Coffee className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No recipes available</h3>
                <p className="text-gray-500">Check back later for more delicious options!</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Subscription Plans Section */}
      <SubscriptionPlans />

      {/* Footer */}
      <Footer />
    </div>
  );
}