import { NextResponse } from 'next/server';

import { PizzaController } from '@/controllers/pizza';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await PizzaController.remove(parseInt(params.id));
    return NextResponse.json({ message: 'Pizza deleted' }, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
