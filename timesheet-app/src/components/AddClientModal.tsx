import React, { useState } from 'react';
import { clientsApi } from '../services/api';
import { useAuthStore } from '../store/authStore';

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  existingClients: string[];
}

export const AddClientModal: React.FC<AddClientModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess,
  existingClients 
}) => {
  const { user } = useAuthStore();
  const [clientName, setClientName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    const trimmedName = clientName.trim();
    
    if (!trimmedName) {
      setError('Please enter a client name');
      return;
    }

    if (existingClients.some(c => c.toLowerCase() === trimmedName.toLowerCase())) {
      setError('Client already exists');
      return;
    }

    if (!user) {
      setError('User not authenticated');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      await clientsApi.create(trimmedName, user.id);
      onSuccess();
      handleClose();
    } catch (error) {
      console.error('Failed to add client:', error);
      setError('Failed to add client. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setClientName('');
    setError('');
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">Add New Client</h2>
        
        <div className="mb-6">
          <input
            type="text"
            value={clientName}
            onChange={(e) => {
              setClientName(e.target.value);
              setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder="Enter client name"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
            autoFocus
          />
          {error && (
            <p className="mt-2 text-sm text-danger-500">{error}</p>
          )}
        </div>
        
        <div className="flex justify-center gap-4">
          <button
            onClick={handleClose}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-6 py-2 bg-success-500 text-white rounded-lg font-semibold hover:bg-success-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Adding...' : 'Add Client'}
          </button>
        </div>
      </div>
    </div>
  );
};