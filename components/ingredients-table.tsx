import { Ingredient } from '@/types';

export function IngredientsTable({
  ingredients,
}: {
  ingredients: Ingredient[];
}) {
  if (ingredients.length === 0) {
    return null;
  }

  return (
    <table className="table grid w-full rounded-none">
      <thead>
        <tr className="grid grid-cols-3 gap-4">
          <th className="flex px-0">Ingredient</th>
          <th className="flex px-0">Quantity</th>
          <th className="flex px-0">Units</th>
        </tr>
      </thead>
      <tbody>
        {ingredients.map((ingredient, index) => (
          <tr key={ingredient.name} className="grid grid-cols-3 gap-4">
            <td className="px-0 truncate text-ellipsis overflow-hidden">
              {ingredient.name}
            </td>
            <td className="px-0 truncate text-ellipsis overflow-hidden">
              {ingredient.quantity}
            </td>
            <td className="px-0 truncate text-ellipsis overflow-hidden">
              {ingredient.unit}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
