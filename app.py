import streamlit as st
from pages.auth import patient_auth, staff_auth
from pages.patient import show_patient_dashboard
from pages.receptionist import show_receptionist_dashboard
from utils.queue_manager import QueueManager
from utils.database import DatabaseManager

# Initialize session state
if 'authenticated' not in st.session_state:
    st.session_state.authenticated = False
if 'user_type' not in st.session_state:
    st.session_state.user_type = None
if 'queue_manager' not in st.session_state:
    st.session_state.queue_manager = QueueManager()
if 'db_manager' not in st.session_state:
    st.session_state.db_manager = DatabaseManager()

def main():
    st.title("🏥 Walk-in Clinic Queue System")
    
    # Logout button in sidebar
    if st.session_state.authenticated:
        if st.sidebar.button("Logout"):
            for key in list(st.session_state.keys()):
                del st.session_state[key]
            st.rerun()
    
    if not st.session_state.authenticated:
        show_home()
    else:
        if st.session_state.user_type == "patient":
            show_patient_dashboard()
        else:
            show_receptionist_dashboard()

def show_home():
    st.header("Welcome")
    
    if st.session_state.user_type == "patient":
        patient_auth()
    elif st.session_state.user_type == "staff":
        staff_auth()
    else:
        col1, col2 = st.columns(2)
        with col1:
            if st.button("🧑 I'm a Patient", use_container_width=True):
                st.session_state.user_type = "patient"
                st.rerun()
        with col2:
            if st.button("👨‍⚕️ Clinic Staff", use_container_width=True):
                st.session_state.user_type = "staff"
                st.rerun()

if __name__ == "__main__":
    main()