-- implemented PostgreSQL functions and triggers 
-- for both UPDATE and DELETE events on the todos 
-- table to automatically record changes into the audit log.

CREATE Table audit_log (
   id SERIAL PRIMARY KEY,
   todo_id INT NOT NULL,
   action TEXT NOT NULL,
   changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION log_todo_update()
RETURNS TRIGGER AS $$
BEGIN
   INSERT INTO audit_log(todo_id, action)
   VALUES(NEW.id, 'UPDATE');

   RETURN NEW;
END
;
$$ LANGUAGE plpgsql;

CREATE TRIGGER todo_update_trigger
AFTER UPDATE on todos
FOR EACH ROW
EXECUTE FUNCTION log_todo_update();

CREATE OR REPLACE FUNCTION log_todo_delete()
RETURNS TRIGGER AS $$
BEGIN
   INSERT INTO audit_log(todo_id, action)
   VALUES(OLD.id, 'DELETE');

   RETURN OLD;
END
;
$$ LANGUAGE plpgsql;

CREATE TRIGGER todo_delete_trigger
AFTER DELETE on todos
FOR EACH ROW
EXECUTE FUNCTION log_todo_delete();
