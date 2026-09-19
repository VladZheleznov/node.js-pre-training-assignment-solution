-- Count the number of todos for each status
SELECT status, COUNT(*) AS count
FROM todos
GROUP BY status;


-- Count the number of todos for each user
-- A LEFT JOIN ensures that even if a user has 
-- no tasks at all, they will still appear in the 
-- list with a zero value.

SELECT u.name, COUNT(t.id) AS todo_count
FROM users u
LEFT JOIN todos t ON u.id = t.user_id
GROUP BY u.id, u.name;


-- Find all users who do not have any todos assigned to them
-- LEFT JOIN with a NULL check
SELECT u.*
FROM users u
LEFT JOIN todos t ON u.id = t.user_id
WHERE t.id IS NULL;