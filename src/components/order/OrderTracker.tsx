import React from 'react';
import { CheckCircle2, Circle, Clock, Truck, Package, ThumbsUp } from 'lucide-react';

interface OrderTrackerProps {
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered';
  estimatedDeliveryTime?: string;
}

export default function OrderTracker({ status, estimatedDeliveryTime }: OrderTrackerProps) {
  const steps = [
    { key: 'pending', label: 'Order Placed', icon: Clock },
    { key: 'confirmed', label: 'Confirmed', icon: CheckCircle2 },
    { key: 'preparing', label: 'Preparing', icon: Package },
    { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: ThumbsUp },
  ];

  const currentStep = steps.findIndex(step => step.key === status);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Status</h3>

      {/* Progress Bar */}
      <div className="relative">
        <div className="absolute left-0 top-5 w-full h-0.5 bg-gray-200" />
        <div
          className="absolute left-0 top-5 h-0.5 bg-orange-500 transition-all duration-500"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />

        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index <= currentStep;
            const isCurrent = index === currentStep;

            return (
              <div key={step.key} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isCompleted
                      ? 'bg-orange-500 text-white'
                      : 'bg-white border-2 border-gray-200 text-gray-400'
                  } ${isCurrent ? 'ring-4 ring-orange-100' : ''}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={`mt-2 text-sm font-medium ${
                    isCompleted ? 'text-orange-600' : 'text-gray-500'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Estimated Delivery Time */}
      {estimatedDeliveryTime && (
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">Estimated Delivery Time</p>
          <p className="text-lg font-semibold text-gray-900">{estimatedDeliveryTime}</p>
        </div>
      )}
    </div>
  );
}