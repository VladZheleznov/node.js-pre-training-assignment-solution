CREATE TABLE users (
	id SERIAL PRIMARY KEY, 
	name TEXT NOT NULL,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE todos (
	id SERIAL PRIMARY KEY,
	title TEXT NOT NULL,
	description TEXT,
	status TEXT DEFAULT 'active',
	created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
	user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE
);


--    Created a relational schema consisting of two tables: `users` and `todos`.

--    Established a One-to-Many relationship where a single user can own multiple
--    tasks, enforced via a Foreign Key (user_id referencing users(id)).

--    Configured ON DELETE CASCADE so that deleting a user automatically cleans
--    up all associated tasks. 

--    Configured default values for timestamps (CURRENT_TIMESTAMP) and todo
--    status ('active')
