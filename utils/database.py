import sqlite3

class DatabaseManager:
    def __init__(self, db_name="clinic.db"):
        self.db_name = db_name
        self._create_tables()

    def _connect(self):
        """Connect to the SQLite database."""
        return sqlite3.connect(self.db_name, check_same_thread=False)

    def _create_tables(self):
        """✅ Create tables for user authentication and queue management."""
        conn = self._connect()
        cursor = conn.cursor()

        # ✅ Create Users table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            phone TEXT NOT NULL,
            health_card_id TEXT UNIQUE NOT NULL
        )
        """)

        # ✅ Create Queue table (Fixed: Added missing fields)
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS queue (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL,
            position INTEGER NOT NULL,
            main_symptom TEXT NOT NULL,
            pain_level INTEGER DEFAULT 0,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            status TEXT DEFAULT 'Waiting',
            FOREIGN KEY(email) REFERENCES users(email)
        )
        """)

        conn.commit()
        conn.close()

    def add_user(self, user_data):
        """✅ Add a new user to the database."""
        try:
            conn = self._connect()
            cursor = conn.cursor()
            cursor.execute("""
            INSERT INTO users (name, email, phone, health_card_id)
            VALUES (?, ?, ?, ?)
            """, (user_data["name"], user_data["email"], user_data["phone"], user_data["health_card_id"]))
            conn.commit()
            conn.close()
            return True
        except sqlite3.IntegrityError:
            return False  # Email or health card ID already exists

    def user_exists(self, email):
        """✅ Check if a user exists in the database."""
        conn = self._connect()
        cursor = conn.cursor()
        cursor.execute("SELECT email FROM users WHERE email=?", (email,))
        user = cursor.fetchone()
        conn.close()
        return user is not None

    def get_user_profile(self, email):
        """✅ Retrieve a user's profile from the database."""
        conn = self._connect()
        cursor = conn.cursor()
        cursor.execute("SELECT name, email, phone, health_card_id FROM users WHERE email=?", (email,))
        user = cursor.fetchone()
        conn.close()
        if user:
            return {"name": user[0], "email": user[1], "phone": user[2], "health_card_id": user[3]}
        return None
