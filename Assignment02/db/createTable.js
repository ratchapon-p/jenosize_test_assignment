import Database from 'better-sqlite3';

const db = new Database('./my-database.db', { verbose: console.log });

const createProductTable = () =>{
    db.prepare(`
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_name TEXT DEFAULT NULL,
            stock_quantity INTEGER DEFAULT NULL,
            price DECIMAL DEFAULT NULL,
            created_at_utc DATETIME DEFAULT NULL,
            updated_at_utc DATETIME DEFAULT NULL,
            deleted_at_utc DATETIME DEFAULT NULL
        )
    `).run()

}

export { createProductTable };
