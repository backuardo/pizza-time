import { create } from 'zustand';

import { fetcher } from '@/utils/fetcher';
import { ClientPizza } from '@/types';

type PizzaStore = {
  pizzaList: ClientPizza[] | null;

  fetchPizzaList: () => Promise<void>;
  pizzaListErrorMessage: string | null;
  pizzaListLoading: boolean;

  deletePizza: (id: number) => Promise<void>;
  deletePizzaErrorMessageById: Record<number, string>;

  createPizza: (pizza: Omit<ClientPizza, 'id'>) => Promise<void>;
  createPizzaErrorMessage: string | null;
};

export const usePizzaStore = create<PizzaStore>((set, get) => ({
  pizzaList: null,

  fetchPizzaList: async () => {
    try {
      set({ pizzaListErrorMessage: null, pizzaListLoading: true });
      const data = await fetcher('/api/pizza');
      set({ pizzaList: data });
    } catch (error) {
      set({ pizzaListErrorMessage: (error as Error).message });
    } finally {
      set({ pizzaListLoading: false });
    }
  },
  pizzaListErrorMessage: null,
  pizzaListLoading: false,

  deletePizza: async (id: number) => {
    const currentPizzaList = get().pizzaList;
    try {
      set({
        deletePizzaErrorMessageById: {
          ...get().deletePizzaErrorMessageById,
          [id]: '',
        },
        // Optimistically remove pizza from list.
        pizzaList: get().pizzaList?.filter((pizza) => pizza.id !== id),
      });
      await fetcher(`/api/pizza/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      set({
        deletePizzaErrorMessageById: {
          ...get().deletePizzaErrorMessageById,
          [id]: (error as Error).message,
        },
        pizzaList: currentPizzaList, // Revert optimistic update.
      });
    }
  },
  deletePizzaErrorMessageById: {},

  createPizza: async (pizza: Omit<ClientPizza, 'id'>) => {
    const tempId = Date.now();
    try {
      set({
        createPizzaErrorMessage: null,
        // Optimistically add pizza to list.
        pizzaList: [...(get().pizzaList ?? []), { ...pizza, id: tempId }],
      });
      await fetcher('/api/pizza', {
        method: 'POST',
        body: JSON.stringify(pizza),
      });
      // Refetch pizza list.
      await get().fetchPizzaList();
    } catch (error) {
      set({ createPizzaErrorMessage: (error as Error).message });
    } finally {
      // Remove temporary pizza from list.
      set({
        pizzaList: get().pizzaList?.filter((pizza) => pizza.id !== tempId),
      });
    }
  },
  createPizzaErrorMessage: null,
}));
