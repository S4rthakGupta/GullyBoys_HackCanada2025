import streamlit as st
from utils.database import DatabaseManager

def initialize_session():
    """Initialize session state variables if they don't already exist."""
    if "user_profile" not in st.session_state:
        st.session_state.user_profile = None  # No user logged in yet
    
    if "token" not in st.session_state:
        st.session_state.token = None  # No token generated yet

    if "user_type" not in st.session_state:
        st.session_state.user_type = None  # No user type set yet

def generate_otp():
    import random
    return str(random.randint(1000, 9999))

def patient_auth():
    """Handles patient authentication using SQLite database."""
    db_manager = DatabaseManager()  # ✅ Initialize SQLite Database

    auth_type = st.radio("Select Option", ["Login", "Sign Up"])

    if auth_type == "Login":
        email = st.text_input("Email")

        if st.button("Send OTP") and email:
            if db_manager.user_exists(email):
                otp = generate_otp()
                st.session_state.otp = otp
                st.session_state.temp_email = email
                st.session_state.otp_sent = True
                st.success(f"OTP sent! (Demo OTP: {otp})")
            else:
                st.error("Email not registered. Please sign up.")

        if st.session_state.get("otp_sent", False):
            otp_input = st.text_input("Enter OTP")
            if st.button("Verify"):
                if otp_input == st.session_state.otp:
                    user_profile = db_manager.get_user_profile(st.session_state.temp_email)

                    if user_profile:
                        # ✅ Store user session state
                        st.session_state.authenticated = True
                        st.session_state.user_profile = user_profile
                        st.session_state.user_type = "patient"
                        st.success("Login successful!")
                        st.rerun()
                else:
                    st.error("Invalid OTP")

    else:  # Sign Up
        with st.form("signup_form"):
            name = st.text_input("Full Name*")
            email = st.text_input("Email*")
            phone = st.text_input("Phone*")
            health_card = st.text_input("Health Card ID*")

            submitted = st.form_submit_button("Register")
            if submitted:
                if name and email and phone and health_card:
                    user_data = {
                        'name': name,
                        'email': email,
                        'phone': phone,
                        'health_card_id': health_card
                    }
                    if db_manager.add_user(user_data):
                        # ✅ Store session state for login persistence
                        st.session_state.authenticated = True
                        st.session_state.user_profile = user_data
                        st.session_state.user_type = "patient"
                        st.success("Registration successful!")
                        st.rerun()
                    else:
                        st.error("Email already registered. Please login.")
                else:
                    st.error("Please fill all required fields")

def staff_auth():
    """Handles staff authentication."""
    with st.form("staff_login"):
        username = st.text_input("Username")
        password = st.text_input("Password", type="password")

        if st.form_submit_button("Login"):
            if username == "staff" and password == "demo123":
                # ✅ Store session state for staff login
                st.session_state.authenticated = True
                st.session_state.user_type = "staff"
                st.success("Login successful!")
                st.rerun()
            else:
                st.error("Invalid credentials")
