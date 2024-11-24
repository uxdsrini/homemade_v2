import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Recipe } from '../../types';
import { Clock, Users, DollarSign, ChefHat, Coffee, Sun, Moon } from 'lucide-react';
import OrderModal from '../order/OrderModal';
import PaymentModal from '../order/PaymentModal';
import { createOrder, verifyPayment } from '../../lib/orders';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { seedDatabase } from '../../lib/seedData';
import toast from 'react-hot-toast';

export default function CustomerDashboard() {
  const [recipes, setRecipes] = useState<(Recipe & { homemakerName: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<'breakfast' | 'lunch' | 'dinner'>('breakfast');
  const [selectedRecipe, setSelectedRecipe] = useState<(Recipe & { homemakerName: string }) | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchRecipes();
  }, []);

  async function fetchRecipes() {
    try {
      // First, try to seed the database if it's empty
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
      toast.error('Failed to load recipes');
    } finally {
      setLoading(false);
    }
  }

  // Rest of the component remains the same...
  // Previous code continues here...
}