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