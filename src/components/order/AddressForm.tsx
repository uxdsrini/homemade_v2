import React, { useState } from 'react';
import { MapPin } from 'lucide-react';

interface AddressFormProps {
  onAddressSubmit: (address: any) => void;
}

export default function AddressForm({ onAddressSubmit }: AddressFormProps) {
  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    street: '',
    apartment: '',
    landmark: '',
    city: '',
    pincode: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedAddress = { ...address, [name]: value };
    setAddress(updatedAddress);
    onAddressSubmit(updatedAddress);
  };

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-900">Delivery Address</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            name="fullName"
            value={address.fullName}
            onChange={handleChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={address.phone}
            onChange={handleChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Street Address
          </label>
          <input
            type="text"
            name="street"
            value={address.street}
            onChange={handleChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Apartment, Suite, etc.
          </label>
          <input
            type="text"
            name="apartment"
            value={address.apartment}
            onChange={handleChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Landmark
          </label>
          <input
            type="text"
            name="landmark"
            value={address.landmark}
            onChange={handleChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City
          </label>
          <input
            type="text"
            name="city"
            value={address.city}
            onChange={handleChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            PIN Code
          </label>
          <input
            type="text"
            name="pincode"
            value={address.pincode}
            onChange={handleChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            required
          />
        </div>
      </div>
    </div>
  );
}