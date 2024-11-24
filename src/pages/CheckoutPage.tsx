import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import AddressForm from '../components/order/AddressForm';
import DeliveryTimeSelector from '../components/order/DeliveryTimeSelector';
import PaymentModal from '../components/order/PaymentModal';
import { createOrder, verifyPayment } from '../lib/orders';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  const subtotal = cart.reduce((sum, item) => sum + item.recipe.price * item.quantity, 0);
  const deliveryFee = 40;
  const total = subtotal + deliveryFee;

  const [deliveryInfo, setDeliveryInfo] = useState({
    address: {},
    deliveryDate: '',
    deliveryTime: '',
    specialInstructions: ''
  });

  const handleAddressSubmit = (address: any) => {
    setDeliveryInfo(prev => ({ ...prev, address }));
  };

  const handleDeliveryTimeSelect = (date: string, time: string) => {
    setDeliveryInfo(prev => ({ ...prev, deliveryDate: date, deliveryTime: time }));
  };

  const handleCheckout = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      const orderData = {
        userId: currentUser.uid,
        items: cart,
        deliveryInfo,
        totalAmount: total,
        status: 'pending',
        paymentStatus: 'pending',
        createdAt: new Date()
      };

      setOrderDetails(orderData);
      setShowPaymentModal(true);
    } catch (error) {
      toast.error('Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentComplete = async (transactionId: string) => {
    try {
      setLoading(true);
      const orderId = await createOrder(orderDetails);
      await verifyPayment(orderId, transactionId);
      clearCart();
      navigate(`/order-confirmation/${orderId}`);
    } catch (error) {
      toast.error('Payment verification failed');
    } finally {
      setLoading(false);
      setShowPaymentModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-8">
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Address</h2>
                <AddressForm onAddressSubmit={handleAddressSubmit} />
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Time</h2>
                <DeliveryTimeSelector onSelect={handleDeliveryTimeSelect} />
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Special Instructions</h2>
                <textarea
                  value={deliveryInfo.specialInstructions}
                  onChange={(e) => setDeliveryInfo(prev => ({
                    ...prev,
                    specialInstructions: e.target.value
                  }))}
                  rows={3}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                  placeholder="Any special requests or dietary restrictions?"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.recipe.id} className="flex justify-between text-sm">
                    <span>{item.recipe.name} × {item.quantity}</span>
                    <span>₹{(item.recipe.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t pt-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 mt-2">
                    <span>Delivery Fee</span>
                    <span>₹{deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base font-medium text-gray-900 mt-4">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="mt-6 w-full px-4 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-orange-600 hover:bg-orange-700 disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showPaymentModal && (
        <PaymentModal
          orderDetails={orderDetails}
          onClose={() => setShowPaymentModal(false)}
          onPaymentComplete={handlePaymentComplete}
        />
      )}
    </div>
  );
}