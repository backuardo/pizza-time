'use server';

import { cookies } from 'next/headers';

import { createClient } from '@/utils/supabase/server';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

type Ingredient = {
  name: string;
  quantity: number;
  unit: string;
};

async function getOrCreateIngredient(
  supabase: SupabaseClient<Database>,
  ingredientName: string
): Promise<number> {
  // Check if the ingredient already exists
  const { data: existingIngredients, error: existingIngredientError } =
    await supabase
      .from('ingredients')
      .select('id')
      .eq('name', ingredientName)
      .limit(1);
  if (existingIngredientError) {
    throw existingIngredientError;
  }

  if (existingIngredients && existingIngredients.length > 0) {
    return existingIngredients[0].id;
  }

  // Insert new ingredient
  const { data: newIngredient, error: newIngredientError } = await supabase
    .from('ingredients')
    .insert([{ name: ingredientName }])
    .select('id')
    .single();

  if (newIngredientError || !newIngredient) {
    throw newIngredientError;
  }

  return newIngredient.id;
}

async function linkIngredientWithPizza(
  supabase: SupabaseClient<Database>,
  pizzaId: number,
  ingredientId: number,
  quantity: number,
  unit: string
) {
  const { error } = await supabase.from('pizza_ingredients').insert([
    {
      pizza_id: pizzaId,
      ingredient_id: ingredientId,
      quantity,
      unit,
    },
  ]);

  if (error) {
    throw error;
  }
}

export async function create({
  name,
  ingredients,
}: {
  name: string;
  ingredients: Ingredient[];
}) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error('No user');
  }

  try {
    // Start transaction
    await supabase.rpc('start_transaction'); // TODO: fix types
    // Insert the pizza
    const { data: pizzaData, error: pizzaError } = await supabase
      .from('pizzas')
      .insert([{ user_id: user.id, name }])
      .select('id')
      .single();

    if (pizzaError || !pizzaData) {
      throw pizzaError;
    }

    // Handle each ingredient
    for (const ingredient of ingredients) {
      const ingredientId = await getOrCreateIngredient(
        supabase,
        ingredient.name
      );
      await linkIngredientWithPizza(
        supabase,
        pizzaData.id,
        ingredientId,
        ingredient.quantity,
        ingredient.unit
      );
    }

    // Commit transaction
    await supabase.rpc('commit_transaction'); // TODO: fix types
    return pizzaData;
  } catch (error) {
    // Rollback transaction in case of error
    await supabase.rpc('rollback_transaction'); // TODO: fix types
    console.error('Error in creating pizza:', error);
    throw error;
  }
}
