import { StateStorage } from 'zustand/middleware';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

export const zustandStorage: StateStorage = {
  getItem: async (name) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  setItem: async (name, value) => {
    return storage.set(name, value);
  },
  removeItem: async (name) => {
    return storage.delete(name);
  },
};
