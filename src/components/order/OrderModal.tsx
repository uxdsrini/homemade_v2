import React, { useState } from 'react';
import { X, Clock, Calendar, MapPin } from 'lucide-react';
import { Recipe } from '../../types';
import DeliveryTimeSelector from './DeliveryTimeSelector';
import AddressForm from './AddressForm';

interface OrderModalProps {
  recipe: Recipe & { homemakerName: string };
  onClose: () => void;
  onProceed: (orderDetails: any) => void;
}

export default function OrderModal({ recipe, onClose, onProceed }: OrderModalProps) {
  const [step, setStep] = useState(1);
  const [orderDetails, setOrderDetails] = useState({
    quantity: 1,
    deliveryTime: '',
    deliveryDate: '',
    address: {},
    specialInstructions: '',
  });

  const totalAmount = recipe.price * orderDetails.quantity;

  const handleProceed = () => {
    onProceed({ ...orderDetails, recipe, totalAmount });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Order Details</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Recipe Summary */}
            <div className="flex space-x-4">
              {recipe.photos && recipe.photos[0] && (
                <img
                  src={recipe.photos[0]}
                  alt={recipe.name}
                  className="w-24 h-24 rounded-lg object-cover"
                />
              )}
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{recipe.name}</h3>
                <p className="text-sm text-gray-500">by {recipe.homemakerName}</p>
                <p className="text-orange-600 font-semibold mt-1">₹{recipe.price.toFixed(2)}</p>
              </div>
            </div>

            {/* Quantity Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setOrderDetails(prev => ({
                    ...prev,
                    quantity: Math.max(1, prev.quantity - 1)
                  }))}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                >
                  -
                </button>
                <span className="text-lg font-medium">{orderDetails.quantity}</span>
                <button
                  onClick={() => setOrderDetails(prev => ({
                    ...prev,
                    quantity: prev.quantity + 1
                  }))}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            {/* Delivery Time Selection */}
            <DeliveryTimeSelector
              onSelect={(date, time) => setOrderDetails(prev => ({
                ...prev,
                deliveryDate: date,
                deliveryTime: time
              }))}
            />

            {/* Delivery Address */}
            <AddressForm
              onAddressSubmit={(address) => setOrderDetails(prev => ({
                ...prev,
                address
              }))}
            />

            {/* Special Instructions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Instructions (Optional)
              </label>
              <textarea
                value={orderDetails.specialInstructions}
                onChange={(e) => setOrderDetails(prev => ({
                  ...prev,
                  specialInstructions: e.target.value
                }))}
                rows={3}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                placeholder="Any special requests or dietary restrictions?"
              />
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Order Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Price per item</span>
                  <span>₹{recipe.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Quantity</span>
                  <span>×{orderDetails.quantity}</span>
                </div>
                <div className="flex justify-between font-medium text-lg pt-2 border-t">
                  <span>Total Amount</span>
                  <span>₹{totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleProceed}
                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}