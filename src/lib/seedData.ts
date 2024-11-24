import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebase';

const dummyRecipes = [
  {
    name: "Classic Masala Dosa",
    description: "Crispy rice crepe served with potato masala, coconut chutney, and sambar",
    category: "breakfast",
    price: 120,
    cookingTime: 25,
    servingSize: 1,
    photos: ["https://images.unsplash.com/photo-1630383249896-424e482df921?w=800"],
    status: "published",
    ingredients: [
      { name: "Rice Batter", quantity: "200", unit: "ml" },
      { name: "Potato Masala", quantity: "150", unit: "g" }
    ],
    instructions: ["Spread batter", "Add masala", "Fold and serve"],
    dietary: ["vegetarian"],
    availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    preparationTime: "20 minutes"
  },
  {
    name: "Butter Chicken",
    description: "Rich and creamy butter chicken made with tender chicken pieces in tomato gravy",
    category: "dinner",
    price: 280,
    cookingTime: 45,
    servingSize: 2,
    photos: ["https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800"],
    status: "published",
    ingredients: [
      { name: "Chicken", quantity: "500", unit: "g" },
      { name: "Tomato Gravy", quantity: "300", unit: "ml" }
    ],
    instructions: ["Marinate chicken", "Prepare gravy", "Cook and serve"],
    dietary: ["non-vegetarian"],
    availableDays: ["Monday", "Wednesday", "Friday", "Saturday"],
    preparationTime: "45 minutes"
  },
  {
    name: "Veg Thali",
    description: "Complete meal with rice, dal, 2 vegetables, roti, and dessert",
    category: "lunch",
    price: 150,
    cookingTime: 60,
    servingSize: 1,
    photos: ["https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800"],
    status: "published",
    ingredients: [
      { name: "Rice", quantity: "200", unit: "g" },
      { name: "Dal", quantity: "150", unit: "ml" }
    ],
    instructions: ["Prepare all items", "Arrange in thali", "Serve hot"],
    dietary: ["vegetarian"],
    availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    preparationTime: "60 minutes"
  }
];

const dummyHomemakers = [
  {
    displayName: "Priya's Kitchen",
    bio: "Specializing in South Indian breakfast",
    location: {
      address: "123 Food Street, Bangalore",
      coordinates: { latitude: 12.9716, longitude: 77.5946 }
    },
    certifications: {
      foodSafety: true,
      otherCertifications: ["Culinary Arts Certificate"]
    }
  },
  {
    displayName: "Punjabi Flavors by Simran",
    bio: "Authentic North Indian cuisine",
    location: {
      address: "456 Taste Avenue, Delhi",
      coordinates: { latitude: 28.7041, longitude: 77.1025 }
    },
    certifications: {
      foodSafety: true,
      otherCertifications: ["Professional Cook Certification"]
    }
  },
  {
    displayName: "Mumbai Tiffins",
    bio: "Home-style Maharashtra cuisine",
    location: {
      address: "789 Spice Road, Mumbai",
      coordinates: { latitude: 19.0760, longitude: 72.8777 }
    },
    certifications: {
      foodSafety: true,
      otherCertifications: ["Food Handling Certificate"]
    }
  }
];

export async function seedDatabase() {
  try {
    // Check if data already exists
    const recipesQuery = query(collection(db, 'recipes'), where('status', '==', 'published'));
    const recipesSnapshot = await getDocs(recipesQuery);
    
    if (recipesSnapshot.empty) {
      // Add homemakers
      for (const homemakerData of dummyHomemakers) {
        const homemakerRef = await addDoc(collection(db, 'homemakers'), {
          ...homemakerData,
          createdAt: new Date(),
          updatedAt: new Date()
        });

        // Add recipes for each homemaker
        for (const recipe of dummyRecipes) {
          await addDoc(collection(db, 'recipes'), {
            ...recipe,
            homemakerId: homemakerRef.id,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
      }
      
      console.log('Database seeded successfully');
      return true;
    }
    
    console.log('Database already contains data');
    return false;
  } catch (error) {
    console.error('Error seeding database:', error);
    return false;
  }
}