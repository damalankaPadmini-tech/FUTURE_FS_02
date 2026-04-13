const db = require('./index');
const bcrypt = require('bcrypt');

async function seedAdmin() {
  const adminEmail = 'admin@crm.com';
  
  const stmt = db.prepare('SELECT * FROM admins WHERE email = ?');
  const existingAdmin = stmt.get(adminEmail);
  
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('admin123', 10);
    const insert = db.prepare('INSERT INTO admins (email, password_hash) VALUES (?, ?)');
    insert.run(adminEmail, passwordHash);
    console.log(`Seeded default admin: ${adminEmail}`);
  } else {
    console.log('Admin user already exists.');
  }
}

module.exports = { seedAdmin };
