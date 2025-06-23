CREATE TABLE books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  author text NOT NULL,
  isbn text NOT NULL UNIQUE,
  category text NOT NULL,
  quantity integer NOT NULL,
  status integer NOT NULL CHECK (status IN (0, 1)), -- 0表示借出，1表示在馆
  create_time timestamp with time zone DEFAULT timezone('utc'::text, now()),
  update_time timestamp with time zone DEFAULT timezone('utc'::text, now())
);
