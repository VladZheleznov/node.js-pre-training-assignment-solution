CREATE INDEX idx_todos_status ON todos(status);

EXPLAIN ANALYZE 
SELECT * FROM todos 
WHERE status = 'completed';

-- Created an index on the status column in the todos table
-- to optimize filtering performance

-- Executed EXPLAIN ANALYZE on a SELECT query filtering 
-- tasks by status to inspect the physical execution plan,
-- verify index usage, and measure actual execution time