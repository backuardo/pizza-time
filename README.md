# Pizza Time

## Run locally
- Create .env.local file with NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, NEXT_PUBLIC_SITE_ORIGIN
- run `npm i`
- run `npm run dev`

## DB Creation
```
-- Create pizzas table
CREATE TABLE pizzas (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_user_pizza UNIQUE (user_id, name)
);

-- Create ingredients table
CREATE TABLE ingredients (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create pizza_ingredients table (many-to-many)
CREATE TABLE pizza_ingredients (
  id SERIAL PRIMARY KEY,
  pizza_id INTEGER REFERENCES pizzas(id) ON DELETE CASCADE,
  ingredient_id INTEGER REFERENCES ingredients(id),
  quantity NUMERIC,
  unit VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Procedure to start a transaction
CREATE OR REPLACE PROCEDURE start_transaction()
LANGUAGE plpgsql
AS $$
BEGIN
  START TRANSACTION;
END;
$$;

-- Procedure to commit a transaction
CREATE OR REPLACE PROCEDURE commit_transaction()
LANGUAGE plpgsql
AS $$
BEGIN
  COMMIT;
END;
$$;

-- Procedure to rollback a transaction
CREATE OR REPLACE PROCEDURE rollback_transaction()
LANGUAGE plpgsql
AS $$
BEGIN
  ROLLBACK;
END;
$$;

-- Enable Row Level Security on tables
ALTER TABLE pizzas ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE pizza_ingredients ENABLE ROW LEVEL SECURITY;

-- RLS policies for pizzas table
CREATE POLICY select_own_pizzas ON pizzas FOR SELECT USING (
  auth.uid() = user_id
);
CREATE POLICY delete_own_pizzas ON pizzas FOR DELETE USING (
  auth.uid() = user_id
);
CREATE POLICY insert_pizzas ON pizzas FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL
);

-- RLS policy for ingredients table (assuming read access for all authenticated users)
CREATE POLICY select_ingredients ON ingredients FOR SELECT USING (
  auth.uid() IS NOT NULL
);
CREATE POLICY insert_ingredients ON ingredients FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL
);

-- RLS policies for pizza_ingredients table
CREATE POLICY select_own_pizza_ingredients ON pizza_ingredients FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM pizzas WHERE pizzas.id = pizza_id AND pizzas.user_id = auth.uid()
  )
);
CREATE POLICY delete_own_pizza_ingredients ON pizza_ingredients FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM pizzas WHERE pizzas.id = pizza_id AND pizzas.user_id = auth.uid()
  )
);
CREATE POLICY insert_pizza_ingredients ON pizza_ingredients FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL AND EXISTS (
    SELECT 1 FROM pizzas WHERE pizzas.id = pizza_id AND pizzas.user_id = auth.uid()
  )
);

```