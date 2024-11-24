import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ChevronRight } from 'lucide-react';
import OrderTracker from '../components/order/OrderTracker';

interface OrderConfirmationProps {
  orderDetails: any;
}

export default function OrderConfirmation({ orderDetails }: OrderConfirmationProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Order Confirmed!</h1>
          <p className="text-gray-600 mt-2">Your order has been successfully placed</p>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h2>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Order ID</span>
              <span className="font-medium">{orderDetails.orderId}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Amount Paid</span>
              <span className="font-medium">₹{orderDetails.totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Delivery Date</span>
              <span className="font-medium">{orderDetails.deliveryDate}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Delivery Time</span>
              <span className="font-medium">{orderDetails.deliveryTime}</span>
            </div>
          </div>
        </div>

        {/* Order Tracker */}
        <OrderTracker 
          status="confirmed"
          estimatedDeliveryTime={`${orderDetails.deliveryDate} ${orderDetails.deliveryTime}`}
        />

        {/* Delivery Address */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Address</h2>
          <div className="text-sm text-gray-600">
            <p className="font-medium text-gray-900">{orderDetails.address.fullName}</p>
            <p>{orderDetails.address.street}</p>
            {orderDetails.address.apartment && <p>{orderDetails.address.apartment}</p>}
            {orderDetails.address.landmark && <p>Landmark: {orderDetails.address.landmark}</p>}
            <p>{orderDetails.address.city} - {orderDetails.address.pincode}</p>
            <p>Phone: {orderDetails.address.phone}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={() => navigate('/orders')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
          >
            Track Order
            <ChevronRight className="w-4 h-4 ml-2" />
          </button>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}