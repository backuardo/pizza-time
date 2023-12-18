'use client';

import { useRef, useState } from 'react';

import { IngredientsTable } from '@/components/ingredients-table';
import { Ingredient } from '@/types';
import { usePizzaStore } from '@/state/pizza';
import { useAuthStore } from '@/state/auth';

const DEFAULT_NEW_INGREDIENT = Object.freeze({
  name: '',
  quantity: 1,
  unit: '',
});

export function CreatePizzaModal() {
  const user = useAuthStore(({ user }) => user);
  const dialogRef = useRef<HTMLDialogElement>(null!);
  const { createPizza, pizzaList } = usePizzaStore(
    ({ createPizza, pizzaList }) => ({
      createPizza,
      pizzaList,
    })
  );
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [newIngredient, setNewIngredient] = useState<Ingredient>(
    DEFAULT_NEW_INGREDIENT
  );
  const isDuplicateName = Boolean(
    pizzaList && pizzaList.some((pizza) => pizza.name === name)
  );

  const handleAddIngredient = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIngredients((prevIngredients) => [...prevIngredients, newIngredient]);
    setNewIngredient(DEFAULT_NEW_INGREDIENT);
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    createPizza({ name, ingredients });
    setName('');
    setIngredients([]);
    setNewIngredient(DEFAULT_NEW_INGREDIENT);
    dialogRef.current.close();
  };

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleChangeNewIngredient = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setNewIngredient((prevNewIngredient) => ({
      ...prevNewIngredient,
      [name]: value,
    }));
  };

  if (!user) return null;

  return (
    <>
      {/* Modal button */}
      <button
        onClick={() => dialogRef.current.showModal()}
        className="btn btn-sm btn-accent"
      >
        New recipe
      </button>

      {/* Modal */}
      <dialog ref={dialogRef} className="modal">
        <div className="modal-box space-y-8 border-1 border-base-300">
          {/* Header */}
          <div className="modal-header flex items-center justify-between">
            <div className="modal-title text-2xl font-semibold text-accent">
              New recipe
            </div>
            <button
              className="btn btn-sm btn-outline"
              onClick={() => dialogRef.current.close()}
            >
              Close
            </button>
          </div>

          {/* New pizza form */}
          <form onSubmit={handleSubmit} className="modal-body space-y-8">
            {/* Add pizza name */}
            <div className="flex flex-col w-full space-y-2">
              <label className="label-text text-xs">Pizza name</label>
              <input
                type="text"
                placeholder="Cheese pizza"
                value={name}
                onChange={handleChangeName}
                className="input input-bordered"
              />
              <div className="text-xs text-error h-6">
                {isDuplicateName && 'Pizza name must be unique'}
              </div>
            </div>

            {/* Add new ingredient */}
            <div className="grid grid-cols-6 gap-4">
              <div className="col-span-3 w-full flex flex-col space-y-2">
                <label className="label-text text-xs">Ingredient name</label>
                <input
                  onChange={handleChangeNewIngredient}
                  value={newIngredient.name}
                  name="name"
                  type="text"
                  placeholder="Shredded cheese"
                  className="input input-bordered"
                />
              </div>
              <div className="col-span-1 w-full flex flex-col space-y-2">
                <label className="label-text text-xs">Quantity</label>
                <input
                  onChange={handleChangeNewIngredient}
                  value={newIngredient.quantity}
                  name="quantity"
                  type="number"
                  step="0.1"
                  placeholder="1"
                  className="input input-bordered"
                />
              </div>
              <div className="col-span-1 w-full flex flex-col space-y-2">
                <label className="label-text text-xs">Unit</label>
                <input
                  onChange={handleChangeNewIngredient}
                  value={newIngredient.unit}
                  name="unit"
                  type="text"
                  placeholder="Cup"
                  className="input input-bordered"
                />
              </div>
              <div className="col-span-1 flex flex-col justify-end">
                <button onClick={handleAddIngredient} className="btn">
                  Add
                </button>
              </div>
            </div>

            {/* List ingredients */}
            <IngredientsTable ingredients={ingredients} />

            {/* Add new pizza */}
            <button
              type="submit"
              disabled={
                name.length === 0 || ingredients.length === 0 || isDuplicateName
              }
              className="btn btn-accent btn-wide w-full"
            >
              Add recipe
            </button>
          </form>
        </div>
      </dialog>
    </>
  );
}
