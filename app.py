import streamlit as st
import extra_streamlit_components as stx
from pages.auth import patient_auth, staff_auth
from pages.patient import show_patient_dashboard
from pages.receptionist import show_receptionist_dashboard
from utils.queue_manager import QueueManager
from utils.database import DatabaseManager
from pages import auth

# ✅ Initialize local storage manager
cookie_manager = stx.CookieManager()

# ✅ Restore session state from local storage
if "authenticated" not in st.session_state:
    st.session_state.authenticated = cookie_manager.get("authenticated") == "True"
if "user_type" not in st.session_state:
    st.session_state.user_type = cookie_manager.get("user_type")
if "user_email" not in st.session_state:
    st.session_state.user_email = cookie_manager.get("user_email")

# ✅ Ensure database and queue managers exist
if "queue_manager" not in st.session_state:
    st.session_state.queue_manager = QueueManager()
if "db_manager" not in st.session_state:
    st.session_state.db_manager = DatabaseManager()

# Initialize session state
auth.initialize_session()

def main():
    st.title("🏥 Walk-in Clinic Queue System")

    if st.session_state.authenticated:
        if st.sidebar.button("Logout"):
            # ✅ Clear session state
            for key in list(st.session_state.keys()):
                del st.session_state[key]

            # ✅ Clear local storage
            cookie_manager.delete("authenticated")
            cookie_manager.delete("user_email")
            cookie_manager.delete("user_type")

            st.rerun()

    if not st.session_state.authenticated:
        show_home()
    else:
        if st.session_state.user_type == "patient":
            show_patient_dashboard()
        elif st.session_state.user_type == "staff":
            show_receptionist_dashboard()

def show_home():
    st.header("Welcome")

    if st.session_state.user_type == "patient":
        patient_auth()  # ✅ Pass local storage manager
    elif st.session_state.user_type == "staff":
        staff_auth()  # ✅ Pass local storage manager
    else:
        col1, col2 = st.columns(2)
        with col1:
            if st.button("🧑 I'm a Patient", use_container_width=True):
                st.session_state.user_type = "patient"  # ✅ Set user type
                st.session_state.authenticated = False  # ✅ Ensure fresh login
                st.rerun()
        with col2:
            if st.button("👨‍⚕️ Clinic Staff", use_container_width=True):
                st.session_state.user_type = "staff"  # ✅ Set user type
                st.session_state.authenticated = False  # ✅ Ensure fresh login
                st.rerun()

if __name__ == "__main__":
    main()
