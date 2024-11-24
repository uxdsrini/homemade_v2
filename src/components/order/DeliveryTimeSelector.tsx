import React, { useState } from 'react';
import { Clock, Calendar } from 'lucide-react';

interface DeliveryTimeSelectorProps {
  onSelect: (date: string, time: string) => void;
}

export default function DeliveryTimeSelector({ onSelect }: DeliveryTimeSelectorProps) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  // Generate available time slots
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 10; hour <= 20; hour++) {
      slots.push(`${hour}:00`);
      slots.push(`${hour}:30`);
    }
    return slots;
  };

  // Generate next 7 days
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-900">Select Delivery Time</h4>
      
      {/* Date Selection */}
      <div className="grid grid-cols-7 gap-2">
        {generateDates().map((date) => (
          <button
            key={date.toISOString()}
            onClick={() => {
              const formattedDate = date.toISOString().split('T')[0];
              setSelectedDate(formattedDate);
              onSelect(formattedDate, selectedTime);
            }}
            className={`p-2 text-center rounded-lg border ${
              selectedDate === date.toISOString().split('T')[0]
                ? 'border-orange-500 bg-orange-50'
                : 'border-gray-200 hover:border-orange-500'
            }`}
          >
            <span className="text-xs text-gray-500">
              {date.toLocaleDateString('en-US', { weekday: 'short' })}
            </span>
            <div className="font-medium">
              {date.getDate()}
            </div>
          </button>
        ))}
      </div>

      {/* Time Selection */}
      <div className="grid grid-cols-4 gap-2">
        {generateTimeSlots().map((time) => (
          <button
            key={time}
            onClick={() => {
              setSelectedTime(time);
              onSelect(selectedDate, time);
            }}
            className={`p-2 text-center rounded-lg border ${
              selectedTime === time
                ? 'border-orange-500 bg-orange-50'
                : 'border-gray-200 hover:border-orange-500'
            }`}
          >
            {time}
          </button>
        ))}
      </div>
    </div>
  );
}