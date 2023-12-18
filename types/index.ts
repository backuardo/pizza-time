export type Ingredient = {
  name: string;
  quantity: number;
  unit: string;
};

export type ClientPizza = {
  id: number;
  name: string;
  ingredients: Ingredient[];
};
