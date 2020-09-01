CREATE TABLE IF NOT EXISTS food_categories (
    food_category_id INTEGER PRIMARY KEY,
    user_id INTEGER,
    name TEXT NOT NULL,
    FOREIGN KEY (user_id)
        REFERENCES users (user_id)
);

ALTER TABLE food_entries
    ADD food_category_id INTEGER
