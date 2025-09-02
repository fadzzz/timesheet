import React, { useState, useEffect } from 'react';
import { Calendar } from './Calendar';
import type { Client } from '../types';
import { formatDateForInput } from '../utils/dateUtils';
import { clientsApi, timeEntriesApi } from '../services/api';
import { useAuthStore } from '../store/authStore';

interface TimeEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const TimeEntryModal: React.FC<TimeEntryModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [hours, setHours] = useState<string>('');
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      loadClients();
      // Auto-select today's date
      setSelectedDate(new Date());
    }
  }, [isOpen, user]);

  const loadClients = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const data = await clientsApi.getAll(user.id);
      setClients(data);
    } catch (error) {
      console.error('Failed to load clients:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleClientSelect = (clientName: string) => {
    setSelectedClient(clientName);
    // Auto-advance to next step after selection
    setTimeout(() => {
      setCurrentStep(3);
    }, 300);
  };

  const handleSave = async () => {
    if (!selectedDate || !selectedClient || !hours || !user) return;

    const hoursNum = parseFloat(hours);
    if (isNaN(hoursNum) || hoursNum <= 0) {
      alert('Please enter valid hours');
      return;
    }

    setIsSaving(true);
    try {
      await timeEntriesApi.create({
        date: formatDateForInput(selectedDate),
        client: selectedClient,
        hours: hoursNum,
        description: '',
        user_id: user.id
      });
      
      onSuccess();
      handleClose();
    } catch (error) {
      console.error('Failed to save entry:', error);
      alert('Failed to save entry. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setCurrentStep(1);
    setSelectedDate(new Date());
    setSelectedClient('');
    setHours('');
    onClose();
  };

  const nextStep = () => {
    if (currentStep === 1 && selectedDate) {
      setCurrentStep(2);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Step 1: Date Selection */}
        {currentStep === 1 && (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-8 h-8 bg-primary-500 text-white rounded-full mb-4">
              1
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Select Date</h3>
            <Calendar selectedDate={selectedDate} onDateSelect={handleDateSelect} />
            <button
              onClick={nextStep}
              disabled={!selectedDate}
              className="mt-6 px-8 py-3 bg-primary-500 text-white rounded-full font-semibold hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}

        {/* Step 2: Client Selection */}
        {currentStep === 2 && (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-8 h-8 bg-primary-500 text-white rounded-full mb-4">
              2
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Choose Client</h3>
            
            {isLoading ? (
              <div className="py-8">Loading clients...</div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {clients.map(client => (
                  <button
                    key={client.id}
                    onClick={() => handleClientSelect(client.name)}
                    className={`
                      p-4 rounded-xl border-2 font-semibold transition-all
                      ${selectedClient === client.name
                        ? 'bg-primary-500 text-white border-primary-600'
                        : 'bg-white text-gray-800 border-gray-200 hover:border-primary-500 hover:bg-primary-50'
                      }
                    `}
                  >
                    {client.name}
                  </button>
                ))}
              </div>
            )}
            
            <button
              onClick={prevStep}
              className="mt-6 px-8 py-3 bg-gray-500 text-white rounded-full font-semibold hover:bg-gray-600 transition-colors"
            >
              Back
            </button>
          </div>
        )}

        {/* Step 3: Hours Entry */}
        {currentStep === 3 && (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-8 h-8 bg-primary-500 text-white rounded-full mb-4">
              3
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Enter Hours</h3>
            
            <input
              type="number"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              placeholder="0.0"
              min="0"
              max="24"
              step="0.25"
              className="w-32 px-4 py-3 text-3xl text-center border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
              autoFocus
            />
            
            <p className="mt-2 text-sm text-gray-500">2.5 = 2 hours 30 minutes</p>
            
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={prevStep}
                className="px-6 py-2 bg-gray-500 text-white rounded-full font-semibold hover:bg-gray-600 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving || !hours || parseFloat(hours) <= 0}
                className="px-6 py-2 bg-success-500 text-white rounded-full font-semibold hover:bg-success-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {isSaving ? 'Saving...' : 'Save Entry'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};