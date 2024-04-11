import { zustandStorage } from '@/storage/mmkv-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Transaction {
  id: string;
  amount: number;
  title: string;
  date: Date;
}

export interface BalanceState {
  balance: () => number;
  transactions: Transaction[];
  runTransaction: (transaction: Transaction) => void;
  clearTransactions: () => void;
}

export const useBalanceStore = create<BalanceState>()(
  persist(
    (set, get) => ({
      transactions: [],
      runTransaction: (transaction: Transaction) => {
        set((state) => ({
          transactions: [...state.transactions, transaction],
        }));
      },
      clearTransactions: () => {
        set({ transactions: [] });
      },
      balance: () => get().transactions.reduce((acc, t) => acc + t.amount, 0),
    }),
    {
      name: 'balance',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
