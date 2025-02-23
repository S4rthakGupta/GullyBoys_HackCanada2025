const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');

const dbPath = path.resolve(__dirname, '../../database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err);
        return;
    }
    console.log('Connected to SQLite database');

    // Create users table if it doesn't exist
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            clerk_user_id TEXT UNIQUE,
            name TEXT,
            phone TEXT,
            email TEXT UNIQUE,
            password TEXT,
            role TEXT DEFAULT 'patient',  -- ✅ Default role as "patient"
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Create patients table if it doesn't exist
    db.run(`
        CREATE TABLE IF NOT EXISTS patients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            clerk_user_id TEXT,
            full_name TEXT,
            date_of_birth TEXT,
            gender TEXT,
            address TEXT,
            phone_number TEXT,
            email_address TEXT UNIQUE,
            health_card_number TEXT,
            international_student_id TEXT,
            current_medications TEXT,
            allergies TEXT,
            chronic_conditions TEXT,
            past_surgeries TEXT,
            presenting_symptoms TEXT,
            duration_of_symptoms TEXT,
            emergency_contact_name TEXT,
            emergency_contact_relationship TEXT,
            emergency_contact_number TEXT,
            privacy_policy_agreement BOOLEAN,
            treatment_consent BOOLEAN,
            status TEXT DEFAULT 'waiting',  -- ✅ Track patient status
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
    console.log('✅ Tables checked/created successfully');

    // ✅ Ensure Default Admin Exists
    db.get('SELECT * FROM users WHERE email = ?', ['admin@example.com'], async (err, user) => {
        if (!user) {
            // Hash the admin password before storing it
            const hashedPassword = await bcrypt.hash("admin123", 10);

            db.run(`
                INSERT INTO users (clerk_user_id, name, phone, email, password, role) 
                VALUES (?, ?, ?, ?, ?, ?)
            `, [
                null,  // ✅ NULL because admins don’t use Clerk
                'Admin',
                '1234567890',
                'admin@example.com',
                hashedPassword,  // ✅ Hashed password for admin login
                'admin'
            ], (err) => {
                if (err) {
                    console.error('❌ Error inserting admin user:', err);
                } else {
                    console.log('✅ Default admin user created.');
                }
            });
        }
    });
});

/**
 * ✅ Function to Create a User Dynamically
 * @param {Object} user - User object with details
 */
function createUser({ clerkUserId, name, phone, email, password, role }) {
    const hashedPassword = role === 'admin' && password ? bcrypt.hashSync(password, 10) : null;

    db.run(`
        INSERT INTO users (clerk_user_id, name, phone, email, password, role) 
        VALUES (?, ?, ?, ?, ?, ?)
    `, [
        clerkUserId || null,  // ✅ NULL for admins, Clerk ID for patients
        name,
        phone,
        email,
        hashedPassword,  // ✅ Password for admins, NULL for patients
        role
    ], (err) => {
        if (err) {
            console.error('❌ Error inserting user:', err);
        } else {
            console.log(`✅ ${role} user created successfully.`);
        }
    });
}

module.exports = db;
  

