import pandas as pd
from pathlib import Path

class DatabaseManager:
    def __init__(self):
        self.user_file = 'data/users.csv'
        self.init_database()

    def init_database(self):
        if not Path(self.user_file).exists():
            df = pd.DataFrame(columns=[
                'email', 'name', 'phone', 'health_card_id'
            ])
            df.to_csv(self.user_file, index=False)

    def add_user(self, user_data):
        users = pd.read_csv(self.user_file)
        if not self.user_exists(user_data['email']):
            users = pd.concat([users, pd.DataFrame([user_data])], ignore_index=True)
            users.to_csv(self.user_file, index=False)
            return True
        return False

    def user_exists(self, email):
        users = pd.read_csv(self.user_file)
        return email in users['email'].values

    def get_user_profile(self, email):
        users = pd.read_csv(self.user_file)
        user = users[users['email'] == email]
        return user.to_dict('records')[0] if not user.empty else None