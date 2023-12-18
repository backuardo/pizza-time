'use server';

import { cookies } from 'next/headers';

import { createClient } from '@/utils/supabase/server';
import { AuthController } from '@/controllers/auth';

export async function remove(id: number) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const user = await AuthController.getLoggedInUser();

  // Check if the pizza exists and belongs to the user
  const { data: pizza, error: pizzaFetchError } = await supabase
    .from('pizzas')
    .select('id')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (pizzaFetchError) {
    throw pizzaFetchError;
  }

  if (!pizza) {
    throw new Error(
      'Pizza not found or user does not have permission to delete this pizza'
    );
  }

  // Delete the pizza
  const { error: pizzaDeleteError } = await supabase
    .from('pizzas')
    .delete()
    .eq('id', id);

  if (pizzaDeleteError) {
    throw pizzaDeleteError;
  }
}
