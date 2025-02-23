import streamlit as st
from utils.database import DatabaseManager

def save_auth_state(cookie_manager, user_data):
    # Direct session state setting
    st.session_state['authenticated'] = True
    st.session_state['user_type'] = user_data['user_type']
    if 'profile' in user_data:
        st.session_state['user_profile'] = user_data['profile']
    # Store in cookies
    cookie_manager.set('user_type', user_data['user_type'])
    if 'email' in user_data:
        cookie_manager.set('user_email', user_data['email'])

def load_auth_state(cookie_manager):
    stored_type = cookie_manager.get('user_type')
    if stored_type:
        st.session_state['authenticated'] = True
        st.session_state['user_type'] = stored_type
        # If it's a patient, reload their profile
        if stored_type == 'patient':
            db_manager = DatabaseManager()
            email = cookie_manager.get('user_email')
            if email:
                st.session_state['user_profile'] = db_manager.get_user_profile(email)

def clear_auth_state(cookie_manager):
    cookie_manager.delete('user_type')
    cookie_manager.delete('user_email')
    # Clear all auth-related session state
    keys_to_clear = ['authenticated', 'user_type', 'user_profile', 'otp', 'otp_sent', 'temp_email', 'set', 'delete']
    for key in keys_to_clear:
        if key in st.session_state:
            del st.session_state[key]