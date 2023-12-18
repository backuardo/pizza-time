'use server';

import { cookies } from 'next/headers';

import { createClient } from '@/utils/supabase/server';
import { ClientPizza } from '@/types';
import { AuthController } from '../auth';

export async function list(): Promise<ClientPizza[]> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const user = await AuthController.getLoggedInUser();

  if (!user) {
    return [];
  }

  const { data: pizzas, error } = await supabase
    .from('pizzas')
    .select(
      `
      id,
      name,
      pizza_ingredients(
        quantity,
        unit,
        ingredient:ingredients(name)
      )
    `
    )
    .eq('user_id', user.id);

  if (error) {
    throw error;
  }

  return pizzas.map((pizza) => ({
    id: pizza.id,
    name: pizza.name,
    ingredients: pizza.pizza_ingredients.map((pizzaIngredient) => ({
      // @ts-ignore
      name: pizzaIngredient.ingredient.name,
      quantity: pizzaIngredient.quantity,
      unit: pizzaIngredient.unit,
    })),
  })) as ClientPizza[];
}
