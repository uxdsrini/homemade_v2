import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { Recipe } from '../../types';
import { Plus, ChefHat, Clock, Users, DollarSign, Edit, Trash2, Package } from 'lucide-react';
import RecipeForm from '../recipes/RecipeForm';
import { useHomemakerOrders } from '../../hooks/useOrders';
import toast from 'react-hot-toast';

export default function HomemakerDashboard() {
  const { currentUser } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRecipeForm, setShowRecipeForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'breakfast' | 'lunch' | 'dinner'>('breakfast');
  const { orders, loading: ordersLoading } = useHomemakerOrders();

  useEffect(() => {
    if (currentUser) {
      fetchRecipes();
    }
  }, [currentUser]);

  async function fetchRecipes() {
    if (!currentUser) return;

    try {
      const recipesQuery = query(
        collection(db, 'recipes'),
        where('homemakerId', '==', currentUser.uid)
      );
      const recipesSnapshot = await getDocs(recipesQuery);
      const recipesData = recipesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Recipe[];
      
      setRecipes(recipesData);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      toast.error('Failed to load recipes');
    } finally {
      setLoading(false);
    }
  }

  const handleEditRecipe = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setShowRecipeForm(true);
  };

  const handleDeleteRecipe = async (recipeId: string) => {
    if (!confirm('Are you sure you want to delete this recipe?')) return;

    try {
      await deleteDoc(doc(db, 'recipes', recipeId));
      toast.success('Recipe deleted successfully');
      fetchRecipes();
    } catch (error) {
      toast.error('Failed to delete recipe');
    }
  };

  const filteredRecipes = recipes.filter(recipe => recipe.category === selectedCategory);
  const pendingOrders = orders.filter(order => order.status === 'pending').length;

  if (loading || ordersLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Recipes</p>
              <p className="text-2xl font-semibold text-gray-900">{recipes.length}</p>
            </div>
            <ChefHat className="w-8 h-8 text-orange-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Orders</p>
              <p className="text-2xl font-semibold text-gray-900">{pendingOrders}</p>
            </div>
            <Package className="w-8 h-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Today's Orders</p>
              <p className="text-2xl font-semibold text-gray-900">
                {orders.filter(order => 
                  new Date(order.deliveryDate).toDateString() === new Date().toDateString()
                ).length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-semibold text-gray-900">
                ₹{orders
                  .filter(order => order.paymentStatus === 'completed')
                  .reduce((sum, order) => sum + order.totalAmount, 0)
                  .toFixed(2)}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {!showRecipeForm ? (
        <>
          <div className="flex justify-between items-center">
            <div className="space-x-4">
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
            <button
              onClick={() => {
                setEditingRecipe(null);
                setShowRecipeForm(true);
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Recipe
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <div key={recipe.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {recipe.photos && recipe.photos[0] && (
                  <img
                    src={recipe.photos[0]}
                    alt={recipe.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{recipe.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      recipe.status === 'published' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {recipe.status.charAt(0).toUpperCase() + recipe.status.slice(1)}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {recipe.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {recipe.cookingTime} min
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      Serves {recipe.servingSize}
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-1" />
                      {recipe.price.toFixed(2)}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <button 
                      onClick={() => handleEditRecipe(recipe)}
                      className="p-2 text-gray-600 hover:text-orange-600"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteRecipe(recipe.id!)}
                      className="p-2 text-gray-600 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredRecipes.length === 0 && (
            <div className="text-center py-12">
              <ChefHat className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No {selectedCategory} Recipes</h3>
              <p className="text-gray-500">Start by adding your first {selectedCategory} recipe!</p>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              {editingRecipe ? 'Edit Recipe' : 'Add New Recipe'}
            </h2>
            <button
              onClick={() => {
                setShowRecipeForm(false);
                setEditingRecipe(null);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
          <RecipeForm 
            initialData={editingRecipe}
            onSuccess={() => {
              setShowRecipeForm(false);
              setEditingRecipe(null);
              fetchRecipes();
            }} 
          />
        </div>
      )}
    </div>
  );
}