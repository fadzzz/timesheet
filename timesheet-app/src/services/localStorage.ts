import type { TimeEntry, Client } from '../types';

const ENTRIES_KEY = 'timesheet_entries';
const CLIENTS_KEY = 'timesheet_clients';

export const localStorageApi = {
  // Time Entries
  getEntries(): TimeEntry[] {
    const stored = localStorage.getItem(ENTRIES_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  saveEntry(entry: Omit<TimeEntry, 'id' | 'created_at'>): TimeEntry {
    const entries = this.getEntries();
    const newEntry: TimeEntry = {
      ...entry,
      id: Date.now(),
      created_at: new Date().toISOString(),
    };
    entries.unshift(newEntry);
    localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
    return newEntry;
  },

  deleteEntry(id: number): void {
    const entries = this.getEntries();
    const filtered = entries.filter(e => e.id !== id);
    localStorage.setItem(ENTRIES_KEY, JSON.stringify(filtered));
  },

  // Clients
  getClients(): Client[] {
    const stored = localStorage.getItem(CLIENTS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Initialize with default clients
    const defaultClients: Client[] = [
      { id: '1', name: 'LGS Migration', user_id: 'demo-user', created_at: new Date().toISOString() },
      { id: '2', name: 'Bruce Power', user_id: 'demo-user', created_at: new Date().toISOString() },
      { id: '3', name: 'Alberta Health', user_id: 'demo-user', created_at: new Date().toISOString() },
      { id: '4', name: 'Bombardier', user_id: 'demo-user', created_at: new Date().toISOString() },
    ];
    localStorage.setItem(CLIENTS_KEY, JSON.stringify(defaultClients));
    return defaultClients;
  },

  addClient(name: string): Client {
    const clients = this.getClients();
    const newClient: Client = {
      id: Date.now().toString(),
      name,
      user_id: 'demo-user',
      created_at: new Date().toISOString(),
    };
    clients.push(newClient);
    localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));
    return newClient;
  },
};