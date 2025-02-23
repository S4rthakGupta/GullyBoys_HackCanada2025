import sqlite3
import streamlit as st
from utils.database import DatabaseManager
import pandas as pd

class QueueManager:
    def __init__(self, db_name="clinic.db"):
        self.db_name = db_name
        self.db_manager = DatabaseManager()

    def get_tokens_for_patient(self, email):
        """Fetch all tokens for a given patient from the queue."""
        conn = self._connect()
        cursor = conn.cursor()

        # Query to get all tokens for the patient
        cursor.execute("""
            SELECT id AS 'Queue ID', main_symptom AS 'Main Symptom', 
                   pain_level AS 'Pain Level', status AS 'Status'
            FROM queue
            WHERE email = ? AND status != 'Rejected'
            ORDER BY timestamp DESC
        """, (email,))
        
        tokens = cursor.fetchall()
        conn.close()
        
        # Convert to DataFrame for easy display in Streamlit
        return pd.DataFrame(tokens, columns=["Queue ID", "Main Symptom", "Pain Level", "Status"])

    def _connect(self):
        """Connect to the SQLite database."""
        return sqlite3.connect(self.db_name, check_same_thread=False)

    def add_to_queue(self, email, main_symptom, pain_level):
        """✅ Add a patient to the queue with symptom and pain level."""
        conn = self._connect()
        cursor = conn.cursor()

        # ✅ Get the last queue position
        cursor.execute("SELECT MAX(position) FROM queue")
        last_position = cursor.fetchone()[0]
        new_position = (last_position + 1) if last_position else 1

        # ✅ Insert patient with `main_symptom` and `pain_level`
        cursor.execute("""
            INSERT INTO queue (email, position, main_symptom, pain_level, status)
            VALUES (?, ?, ?, ?, ?)
        """, (email, new_position, main_symptom, pain_level, "Waiting"))

        conn.commit()
        conn.close()
        return new_position

    def get_queue_position(self, email):
        """Get a patient's current queue position."""
        conn = self._connect()
        cursor = conn.cursor()
        cursor.execute("SELECT position FROM queue WHERE email=?", (email,))
        position = cursor.fetchone()
        conn.close()
        return position[0] if position else None

    def remove_from_queue(self, queue_id):
        """✅ Remove a patient from the queue and update the remaining positions."""
        conn = self._connect()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM queue WHERE id=?", (queue_id,))
        cursor.execute("UPDATE queue SET position = position - 1 WHERE position > (SELECT position FROM queue WHERE id=?)", (queue_id,))
        conn.commit()
        conn.close()

    def get_queue_list(self):
        """✅ Retrieve the full queue as a DataFrame for display, now includes Queue ID."""
        conn = self._connect()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT queue.id AS 'Queue ID', users.name AS 'Name', queue.position AS 'Queue Position',
                queue.main_symptom AS 'Main Symptom', queue.pain_level AS 'Pain Level',
                queue.timestamp AS 'Timestamp', queue.status AS 'Status'
            FROM queue
            JOIN users ON queue.email = users.email
            WHERE queue.status != 'Rejected'  -- Exclude rejected tokens
            ORDER BY queue.position ASC
        """)
        queue_data = cursor.fetchall()
        conn.close()

        if queue_data:
            df = pd.DataFrame(queue_data, columns=["Queue ID", "Name", "Queue Position", "Main Symptom", "Pain Level", "Timestamp", "Status"])
            return df
        else:
            return None

    def get_pending_approvals(self):
        """✅ Fetch patients waiting for approval with `main_symptom`, `pain_level`, and `timestamp`."""
        conn = self._connect()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT queue.id AS 'Queue ID', users.name AS 'Name', users.health_card_id AS 'Health Card ID', 
                   queue.position AS 'Queue Position', queue.email AS 'Email', 
                   queue.main_symptom AS 'Main Symptom', queue.pain_level AS 'Pain Level',
                   queue.timestamp AS 'Timestamp'
            FROM queue 
            JOIN users ON queue.email = users.email 
            WHERE queue.status = 'Waiting'
            ORDER BY queue.position ASC
        """)
        pending_approvals = cursor.fetchall()
        conn.close()

        if pending_approvals:
            df = pd.DataFrame(pending_approvals, columns=["Queue ID", "Name", "Health Card ID", "Queue Position", "Email", "Main Symptom", "Pain Level", "Timestamp"])
            return df
        else:
            return None

    def approve_token(self, queue_id):
        """✅ Mark a patient's token as approved using `Queue ID` instead of `email`."""
        conn = self._connect()
        cursor = conn.cursor()
        cursor.execute("UPDATE queue SET status = 'Approved' WHERE id=?", (queue_id,))
        conn.commit()
        conn.close()

    def reject_token(self, queue_id, reason):
        """✅ Reject a patient's token with a reason using `Queue ID`."""
        conn = self._connect()
        cursor = conn.cursor()
        cursor.execute("UPDATE queue SET status = 'Rejected', reason=? WHERE id=?", (reason, queue_id))
        conn.commit()
        conn.close()

    def update_status(self, queue_id, new_status):
        """✅ Update a patient's queue status (e.g., 'Called', 'Checked-in') using `Queue ID`."""
        conn = self._connect()
        cursor = conn.cursor()
        cursor.execute("UPDATE queue SET status=? WHERE id=?", (new_status, queue_id))
        conn.commit()
        conn.close()

    def get_average_wait_time(self):
        """Calculate the average wait time for patients who have been served."""
        conn = self._connect()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT AVG(julianday('now') - julianday(queue.timestamp)) * 1440
            FROM queue WHERE queue.status = 'Completed'
        """)
        avg_wait_time = cursor.fetchone()[0]
        conn.close()
        return round(avg_wait_time) if avg_wait_time else "N/A"

    def get_total_patients_served(self):
        """Get the total number of patients who have been served today."""
        conn = self._connect()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT COUNT(*) FROM queue WHERE queue.status = 'Completed'
        """)
        total_served = cursor.fetchone()[0]
        conn.close()
        return total_served

    def reject_token(self, token_id, reason):
        """Reject the token and store the rejection reason."""
        conn = self._connect()
        cursor = conn.cursor()

        # Update the queue with the rejection status and reason
        cursor.execute("""
            UPDATE queue SET status = 'Rejected', reason = ? WHERE id = ?
        """, (reason, token_id))
        conn.commit()
        conn.close()
