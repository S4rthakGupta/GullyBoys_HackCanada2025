import pandas as pd
from datetime import datetime

class QueueManager:
    def __init__(self):
        self.queue_file = 'data/queue.csv'
        self.load_queue()

    def load_queue(self):
        try:
            self.queue = pd.read_csv(self.queue_file)
        except FileNotFoundError:
            self.queue = pd.DataFrame(columns=[
                'token_id', 'name', 'email', 'phone', 
                'health_card_id', 'main_symptom', 'pain_level', 
                'timestamp', 'status', 'reject_reason'
            ])

    def add_to_queue(self, patient_data):
        token = len(self.queue) + 1
        patient_data['token_id'] = token
        patient_data['timestamp'] = datetime.now()
        patient_data['status'] = 'Pending Approval'
        patient_data['reject_reason'] = ''
        
        self.queue = pd.concat([
            self.queue, 
            pd.DataFrame([patient_data])
        ], ignore_index=True)
        self.save_queue()
        return token

    def approve_token(self, token_id):
        self.queue.loc[self.queue['token_id'] == token_id, 'status'] = 'Waiting'
        self.save_queue()

    def reject_token(self, token_id, reason=''):
        self.queue.loc[self.queue['token_id'] == token_id, 'status'] = 'Rejected'
        self.queue.loc[self.queue['token_id'] == token_id, 'reject_reason'] = reason
        self.save_queue()

    def update_status(self, token_id, new_status):
        self.queue.loc[self.queue['token_id'] == token_id, 'status'] = new_status
        self.save_queue()

    def get_waiting_count(self):
        return len(self.queue[self.queue['status'] == 'Waiting'])

    def get_queue_position(self, token_id):
        waiting_queue = self.queue[self.queue['status'] == 'Waiting']
        return waiting_queue.index[waiting_queue['token_id'] == token_id].tolist()[0] + 1

    def save_queue(self):
        self.queue.to_csv(self.queue_file, index=False)