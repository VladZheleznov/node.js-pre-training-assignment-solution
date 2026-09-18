-- Adding multiple users
INSERT INTO users (name)
VALUES
('Vlad'),
('Ivan');

-- Adding multiple todos for users
INSERT INTO todos (title, description, status, user_id)
VALUES
('first todo', 'learn sql', 'active', 1),
('second todo', '', 'active', 2),
('third todo', 'sql statement', 'completed', 1);

-- Select all todos from the table todos
SELECT * FROM todos

-- Updated the status of a specific todo, identified by its id
UPDATE todos
SET status = 'completed'
WHERE id = 1;

-- Deleted a todo from the table, identified by its id
DELETE FROM todos
WHERE id = 3;