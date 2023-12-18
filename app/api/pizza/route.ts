import { NextResponse } from 'next/server';

import { PizzaController } from '@/controllers/pizza';

export async function GET(request: Request) {
  try {
    const pizzas = await PizzaController.list();
    return NextResponse.json(pizzas, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}

export async function POST(request: Request) {
  const pizzaDetails = await request.json();

  try {
    const pizza = await PizzaController.create({
      name: pizzaDetails.name,
      ingredients: pizzaDetails.ingredients,
    });
    return NextResponse.json(pizza, { status: 201 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
