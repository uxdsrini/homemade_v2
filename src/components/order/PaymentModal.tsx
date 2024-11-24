import React, { useState } from 'react';
import { X, QrCode, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';

interface PaymentModalProps {
  orderDetails: any;
  onClose: () => void;
  onPaymentComplete: (transactionId: string) => void;
}

export default function PaymentModal({ orderDetails, onClose, onPaymentComplete }: PaymentModalProps) {
  const [transactionId, setTransactionId] = useState('');
  const [copied, setCopied] = useState(false);
  const upiId = 'example@upi'; // Replace with actual UPI ID

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = () => {
    if (!transactionId.trim()) {
      toast.error('Please enter the transaction ID');
      return;
    }
    onPaymentComplete(transactionId);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Complete Payment</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Amount Display */}
            <div className="text-center">
              <p className="text-sm text-gray-600">Amount to Pay</p>
              <p className="text-3xl font-bold text-gray-900">₹{orderDetails.totalAmount.toFixed(2)}</p>
            </div>

            {/* QR Code */}
            <div className="flex justify-center">
              <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                <QrCode className="w-24 h-24 text-gray-400" />
              </div>
            </div>

            {/* UPI ID */}
            <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">UPI ID</p>
                <p className="font-medium">{upiId}</p>
              </div>
              <button
                onClick={handleCopyUPI}
                className="p-2 text-gray-600 hover:text-gray-900"
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>

            {/* Transaction ID Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter UPI Transaction ID
              </label>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                placeholder="Enter the 12-digit transaction ID"
              />
            </div>

            {/* Instructions */}
            <div className="text-sm text-gray-600">
              <p className="font-medium mb-2">Instructions:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Open your UPI app and scan the QR code</li>
                <li>Enter the exact amount shown above</li>
                <li>Complete the payment</li>
                <li>Copy the transaction ID from your UPI app</li>
                <li>Paste the transaction ID above and click verify</li>
              </ol>
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
                onClick={handleSubmit}
                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
              >
                Verify Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}