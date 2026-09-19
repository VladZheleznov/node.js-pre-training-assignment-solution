-- Add a new column email to the users table.
ALTER TABLE users
ADD COLUMN email TEXT UNIQUE;

-- Set email 
UPDATE users 
SET email = 'qwerty@gmail.com'
WHERE id = 1;

UPDATE users
SET email = 'ivanov@gmail.com'
WHERE id = 2;

-- Set constraint
ALTER TABLE users 
ALTER COLUMN email SET NOT NULL;

--    I wrote those queries because I had created the `users` table earlier,
--    but if I hadn't done that, it would have looked like this:


CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -- Add a new column user_id to the todos table.
ALTER TABLE todos 
ADD COLUMN user_id INT;

-- Adding a foreign key with a cascade delete constraint
ALTER TABLE todos 
ADD CONSTRAINT fk_todos_user_id 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;