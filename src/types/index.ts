export interface HomemakerProfile {
  uid: string;
  displayName: string;
  bio: string;
  location: {
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  photoURL: string;
  certifications: {
    foodSafety: boolean;
    otherCertifications: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Recipe {
  id?: string;
  homemakerId: string;
  name: string;
  description: string;
  ingredients: {
    name: string;
    quantity: string;
    unit: string;
  }[];
  instructions: string[];
  cookingTime: number;
  servingSize: number;
  price: number;
  photos: string[];
  status: 'draft' | 'published';
  category: 'breakfast' | 'lunch' | 'dinner';
  dietary: string[];
  availableDays: string[];
  preparationTime: string;
  createdAt: Date;
  updatedAt: Date;
}

export type OnboardingStep = 'profile' | 'location' | 'certifications' | 'complete';

export interface Order {
  id?: string;
  userId: string;
  recipe: {
    id: string;
    name: string;
    price: number;
    homemakerId: string;
    homemakerName: string;
    photos: string[];
    category: string;
  };
  quantity: number;
  totalAmount: number;
  deliveryDate: string;
  deliveryTime: string;
  address: {
    fullName: string;
    phone: string;
    street: string;
    apartment?: string;
    landmark?: string;
    city: string;
    pincode: string;
  };
  specialInstructions?: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered';
  paymentStatus: 'pending' | 'completed' | 'failed';
  transactionId?: string;
  createdAt: Date;
  updatedAt: Date;
}