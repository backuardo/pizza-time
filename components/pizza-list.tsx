'use client';
import { useEffect } from 'react';

import { IngredientsTable } from './ingredients-table';
import { ClientPizza } from '@/types';
import { usePizzaStore } from '@/state/pizza';

function Pizza({ pizza }: { pizza: ClientPizza }) {
  const deletePizza = usePizzaStore(({ deletePizza }) => deletePizza);

  const handleDeletePizza = () => {
    deletePizza(pizza.id);
  };

  return (
    <div className="card w-full bg-base-100 shadow-md border-1 border-base-300">
      <div className="card-body">
        <div className="flex items-center justify-between">
          <div className="card-title max-w-xs">
            <h3 className="truncate text-ellipsis overflow-hidden text-accent">
              🍕 {pizza.name}
            </h3>
          </div>
          <button
            onClick={handleDeletePizza}
            className="btn btn-xs btn-outline"
          >
            Delete
          </button>
        </div>
        <IngredientsTable ingredients={pizza.ingredients} />
      </div>
    </div>
  );
}

export function PizzaList() {
  const { fetchPizzaList, pizzaListLoading, pizzaList, pizzaListErrorMessage } =
    usePizzaStore(
      ({
        pizzaList,
        pizzaListErrorMessage,
        pizzaListLoading,
        fetchPizzaList,
      }) => ({
        fetchPizzaList,
        pizzaListLoading,
        pizzaList,
        pizzaListErrorMessage,
      })
    );

  useEffect(() => {
    fetchPizzaList();
  }, []);

  if (pizzaListErrorMessage) {
    return <div>{pizzaListErrorMessage}</div>;
  }

  if (!pizzaList) {
    return <div>Loading...</div>;
  }

  if (!pizzaListLoading && pizzaList.length === 0) {
    return <div>No pizzas found</div>;
  }

  return (
    <div className="space-y-8 flex flex-col items-center w-full">
      <h2 className="text-4xl font-bold">Your pizzas</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
        {pizzaList.map((pizza) => (
          <Pizza key={pizza.id} pizza={pizza} />
        ))}
      </div>
    </div>
  );
}
