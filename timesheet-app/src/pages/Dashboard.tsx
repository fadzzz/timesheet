import React, { useState, useEffect } from 'react';
import { TimeEntryModal } from '../components/TimeEntryModal';
import { AddClientModal } from '../components/AddClientModal';
import { RecentEntries } from '../components/RecentEntries';
import { WeeklyReport } from '../components/WeeklyReport';
import { useAuthStore } from '../store/authStore';
import { timeEntriesApi, clientsApi, initializeDefaultClients } from '../services/api';
import { TimeEntry, Client } from '../types';

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuthStore();
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadData();
      checkAndInitializeClients();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const [entriesData, clientsData] = await Promise.all([
        timeEntriesApi.getAll(user.id),
        clientsApi.getAll(user.id)
      ]);
      setEntries(entriesData);
      setClients(clientsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkAndInitializeClients = async () => {
    if (!user) return;

    try {
      const existingClients = await clientsApi.getAll(user.id);
      if (existingClients.length === 0) {
        // New user - create default clients
        await initializeDefaultClients(user.id);
        loadData(); // Reload to show new clients
      }
    } catch (error) {
      console.error('Failed to initialize clients:', error);
    }
  };

  const handleTimeEntrySuccess = () => {
    loadData();
  };

  const handleClientAddSuccess = () => {
    loadData();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-primary flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-primary p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                {user?.name}'s Hours
              </h1>
              <p className="text-gray-600">Tracking hours with clients</p>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Logout
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button
              onClick={() => setIsTimeModalOpen(true)}
              className="px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-full text-lg font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all"
            >
              Enter Time
            </button>
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="px-8 py-4 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white rounded-full text-lg font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all"
            >
              View Report
            </button>
            <button
              onClick={() => setIsClientModalOpen(true)}
              className="px-8 py-4 bg-gradient-to-r from-warning-500 to-warning-600 text-white rounded-full text-lg font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all"
            >
              + Add Client
            </button>
          </div>
        </div>

        {/* Recent Entries */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Recent Entries</h3>
          <RecentEntries entries={entries} onDelete={loadData} />
        </div>
      </div>

      {/* Modals */}
      <TimeEntryModal
        isOpen={isTimeModalOpen}
        onClose={() => setIsTimeModalOpen(false)}
        onSuccess={handleTimeEntrySuccess}
      />
      <AddClientModal
        isOpen={isClientModalOpen}
        onClose={() => setIsClientModalOpen(false)}
        onSuccess={handleClientAddSuccess}
        existingClients={clients.map(c => c.name)}
      />
      <WeeklyReport
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  );
};