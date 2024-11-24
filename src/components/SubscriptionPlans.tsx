import React from 'react';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Weekly',
    price: 299,
    period: 'week',
    features: [
      'Up to 7 meals per week',
      'Free delivery',
      'Priority customer support',
      'Weekly menu customization'
    ]
  },
  {
    name: 'Monthly',
    price: 999,
    period: 'month',
    popular: true,
    features: [
      'Up to 30 meals per month',
      'Free delivery',
      'Priority customer support',
      'Monthly menu customization',
      '10% discount on all orders',
      'Special occasion treats'
    ]
  },
  {
    name: 'Annual',
    price: 9999,
    period: 'year',
    features: [
      'Unlimited meals',
      'Free premium delivery',
      '24/7 VIP support',
      'Custom menu planning',
      '20% discount on all orders',
      'Special occasion treats',
      'Exclusive cooking workshops'
    ]
  }
];

export default function SubscriptionPlans() {
  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Subscribe to HomeMade
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Choose a plan that works best for you and enjoy delicious homemade meals delivered to your doorstep.
          </p>
        </div>

        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-lg shadow-lg divide-y divide-gray-200 ${
                plan.popular ? 'border-2 border-orange-500' : 'border border-gray-200'
              }`}
            >
              <div className="p-6">
                {plan.popular && (
                  <span className="inline-flex px-4 py-1 rounded-full text-sm font-semibold tracking-wide uppercase bg-orange-100 text-orange-600 mb-4">
                    Most Popular
                  </span>
                )}
                <h3 className="text-2xl font-semibold text-gray-900">{plan.name}</h3>
                <p className="mt-4">
                  <span className="text-4xl font-extrabold text-gray-900">₹{plan.price}</span>
                  <span className="text-base font-medium text-gray-500">/{plan.period}</span>
                </p>
                <p className="mt-6 text-gray-500">Perfect for regular home-cooked meals.</p>

                <button
                  className={`mt-8 w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium ${
                    plan.popular
                      ? 'text-white bg-orange-600 hover:bg-orange-700'
                      : 'text-orange-600 bg-orange-50 hover:bg-orange-100'
                  }`}
                >
                  Subscribe Now
                </button>
              </div>
              <div className="px-6 pt-6 pb-8">
                <h4 className="text-sm font-medium text-gray-900 tracking-wide uppercase">
                  What's included
                </h4>
                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex space-x-3">
                      <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
                      <span className="text-sm text-gray-500">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}