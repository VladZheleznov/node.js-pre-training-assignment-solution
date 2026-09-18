-- Select all todos with the status 'active'
SELECT * FROM todos
WHERE status = 'active'

-- Select all todos with the status 'completed'
SELECT * FROM todos
WHERE status = 'completed'

-- Select all todos, sorted by the created_at column in ascending order (oldest first)
SELECT * FROM todos
ORDER BY created_at

-- Select all todos, sorted by the created_at column in descending order (newest first)
SELECT * FROM todos
ORDER BY created_at DESC

-- Select all todos where the title or description contains 'meeting'
SELECT * FROM todos
WHERE title LIKE '%meeting%'
OR description LIKE '%meeting%'