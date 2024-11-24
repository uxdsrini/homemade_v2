import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db, storage } from '../../lib/firebase';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Recipe } from '../../types';
import { Camera, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface RecipeFormProps {
  initialData?: Recipe | null;
  onSuccess: () => void;
}

export default function RecipeForm({ initialData, onSuccess }: RecipeFormProps) {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<Partial<Recipe>>(
    initialData || {
      name: '',
      description: '',
      ingredients: [{ name: '', quantity: '', unit: '' }],
      instructions: [''],
      cookingTime: 30,
      servingSize: 1,
      price: 0,
      photos: [],
      status: 'draft',
      category: '',
      dietary: [],
    }
  );

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !currentUser) return;

    try {
      setLoading(true);
      const file = e.target.files[0];
      const photoRef = ref(storage, `recipes/${currentUser.uid}/${Date.now()}`);
      await uploadBytes(photoRef, file);
      const photoURL = await getDownloadURL(photoRef);
      
      setRecipe(prev => ({
        ...prev,
        photos: [...(prev.photos || []), photoURL],
      }));
      toast.success('Photo uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload photo');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent, status: 'draft' | 'published') => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      setLoading(true);
      const recipeData = {
        ...recipe,
        status,
        homemakerId: currentUser.uid,
        updatedAt: new Date(),
      };

      if (initialData?.id) {
        await updateDoc(doc(db, 'recipes', initialData.id), recipeData);
        toast.success('Recipe updated successfully');
      } else {
        recipeData.createdAt = new Date();
        await addDoc(collection(db, 'recipes'), recipeData);
        toast.success('Recipe created successfully');
      }
      
      onSuccess();
    } catch (error) {
      toast.error('Failed to save recipe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Recipe Name</label>
        <input
          type="text"
          value={recipe.name}
          onChange={e => setRecipe(prev => ({ ...prev, name: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={recipe.description}
          onChange={e => setRecipe(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Photos</label>
        <div className="mt-2 flex items-center space-x-4">
          {recipe.photos?.map((photo, index) => (
            <div key={index} className="relative">
              <img src={photo} alt="" className="w-24 h-24 object-cover rounded-lg" />
              <button
                type="button"
                onClick={() => {
                  setRecipe(prev => ({
                    ...prev,
                    photos: prev.photos?.filter((_, i) => i !== index),
                  }));
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          <label className="w-24 h-24 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orange-500">
            <Camera className="w-6 h-6 text-gray-400" />
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Cooking Time (min)</label>
          <input
            type="number"
            value={recipe.cookingTime}
            onChange={e => setRecipe(prev => ({ ...prev, cookingTime: Number(e.target.value) }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Serving Size</label>
          <input
            type="number"
            value={recipe.servingSize}
            onChange={e => setRecipe(prev => ({ ...prev, servingSize: Number(e.target.value) }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
          <input
            type="number"
            step="0.01"
            value={recipe.price}
            onChange={e => setRecipe(prev => ({ ...prev, price: Number(e.target.value) }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            required
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={(e) => handleSubmit(e, 'draft')}
          disabled={loading}
          className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Save as Draft
        </button>
        <button
          type="button"
          onClick={(e) => handleSubmit(e, 'published')}
          disabled={loading}
          className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          {loading ? 'Saving...' : initialData ? 'Update Recipe' : 'Publish Recipe'}
        </button>
      </div>
    </form>
  );
}