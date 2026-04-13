const db = require('./index');

function setupDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      company TEXT,
      message TEXT,
      status TEXT CHECK(status IN ('new', 'contacted', 'qualified', 'converted', 'lost')) DEFAULT 'new',
      notes TEXT,
      source TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TRIGGER IF NOT EXISTS UpdateLeadsUpdatedAt 
    AFTER UPDATE ON leads
    FOR EACH ROW
    BEGIN
      UPDATE leads SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
    END;
  `);
  console.log('Database schema created or already exists.');
}

module.exports = { setupDatabase };
