import type { TimeEntry, Client } from '../types';
import { supabase } from './supabase';
import { localStorageApi } from './localStorage';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const IS_STATIC_MODE = !API_URL.includes('localhost') && !API_URL.includes('http');

// Time Entries API
export const timeEntriesApi = {
  async getAll(userId: string): Promise<TimeEntry[]> {
    if (IS_STATIC_MODE) {
      return localStorageApi.getEntries();
    }

    try {
      const { data, error } = await supabase
        .from('time_entries')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to fetch from Supabase, using localStorage:', error);
      return localStorageApi.getEntries();
    }
  },

  async getByDateRange(userId: string, startDate: string, endDate: string): Promise<TimeEntry[]> {
    if (IS_STATIC_MODE) {
      const allEntries = localStorageApi.getEntries();
      return allEntries.filter(entry => 
        entry.date >= startDate && entry.date <= endDate
      );
    }

    try {
      const { data, error } = await supabase
        .from('time_entries')
        .select('*')
        .eq('user_id', userId)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to fetch from Supabase, using localStorage:', error);
      const allEntries = localStorageApi.getEntries();
      return allEntries.filter(entry => 
        entry.date >= startDate && entry.date <= endDate
      );
    }
  },

  async create(entry: Omit<TimeEntry, 'id' | 'created_at'>): Promise<TimeEntry> {
    if (IS_STATIC_MODE) {
      return localStorageApi.saveEntry(entry);
    }

    try {
      const { data, error } = await supabase
        .from('time_entries')
        .insert({
          date: entry.date,
          client: entry.client,
          hours: entry.hours,
          description: entry.description || '',
          user_id: entry.user_id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to save to Supabase, using localStorage:', error);
      return localStorageApi.saveEntry(entry);
    }
  },

  async delete(id: number): Promise<void> {
    if (IS_STATIC_MODE) {
      localStorageApi.deleteEntry(id);
      return;
    }

    try {
      const { error } = await supabase
        .from('time_entries')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to delete from Supabase, using localStorage:', error);
      localStorageApi.deleteEntry(id);
    }
  }
};

// Clients API
export const clientsApi = {
  async getAll(userId: string): Promise<Client[]> {
    if (IS_STATIC_MODE) {
      return localStorageApi.getClients();
    }

    try {
      const { data, error } = await supabase
        .from('user_clients')
        .select('*')
        .eq('user_id', userId)
        .order('name', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to fetch clients from Supabase, using localStorage:', error);
      return localStorageApi.getClients();
    }
  },

  async create(name: string, userId: string): Promise<Client> {
    if (IS_STATIC_MODE) {
      return localStorageApi.addClient(name);
    }

    try {
      const { data, error } = await supabase
        .from('user_clients')
        .insert({
          name,
          user_id: userId
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to save client to Supabase, using localStorage:', error);
      return localStorageApi.addClient(name);
    }
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('user_clients')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// Default clients to be created for new users
export const DEFAULT_CLIENTS = [
  'LGS Migration',
  'Bruce Power',
  'Alberta Health',
  'Bombardier'
];

// Initialize default clients for a new user
export async function initializeDefaultClients(userId: string): Promise<void> {
  if (IS_STATIC_MODE) {
    // Already initialized in localStorage
    return;
  }

  try {
    const promises = DEFAULT_CLIENTS.map(name => 
      clientsApi.create(name, userId)
    );
    await Promise.all(promises);
  } catch (error) {
    console.error('Error creating default clients:', error);
  }
}