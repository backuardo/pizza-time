'use client';

import { usePizzaStore } from '@/state/pizza';

function ErrorToast({ message }: { message: string }) {
  return (
    <div className="toast">
      <div className="alert alert-error text-xs">
        <span>{message}</span>
      </div>
    </div>
  );
}

export function ErrorToasts() {
  const {
    pizzaListErrorMessage,
    deletePizzaErrorMessageById,
    createPizzaErrorMessage,
  } = usePizzaStore(
    ({
      pizzaListErrorMessage,
      deletePizzaErrorMessageById,
      createPizzaErrorMessage,
    }) => ({
      pizzaListErrorMessage,
      deletePizzaErrorMessageById,
      createPizzaErrorMessage,
    })
  );

  return (
    <>
      {/* List error */}
      {pizzaListErrorMessage && (
        <ErrorToast
          message={`Error fetching pizzas: ${pizzaListErrorMessage}`}
        />
      )}

      {/* Create error */}
      {createPizzaErrorMessage && (
        <ErrorToast
          message={`Error creating pizza: ${createPizzaErrorMessage}`}
        />
      )}

      {/* Delete error */}
      {Object.entries(deletePizzaErrorMessageById).map(([id, message]) =>
        message ? (
          <ErrorToast key={id} message={`Error deleting pizza: ${message}`} />
        ) : null
      )}
    </>
  );
}
