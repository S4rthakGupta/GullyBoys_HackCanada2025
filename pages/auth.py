import streamlit as st
import random

def generate_otp():
    return str(random.randint(1000, 9999))

def patient_auth():
    auth_type = st.radio("Select Option", ["Login", "Sign Up"])
    
    if auth_type == "Login":
        if 'otp_sent' not in st.session_state:
            st.session_state.otp_sent = False
            
        email = st.text_input("Email")
        
        if st.button("Send OTP") and email:
            if st.session_state.db_manager.user_exists(email):
                otp = generate_otp()
                st.session_state.otp = otp
                st.session_state.temp_email = email
                st.session_state.otp_sent = True
                st.success(f"OTP sent! (Demo OTP: {otp})")
            else:
                st.error("Email not registered. Please sign up.")
                
        if st.session_state.otp_sent:
            otp_input = st.text_input("Enter OTP")
            if st.button("Verify"):
                if otp_input == st.session_state.otp:
                    st.session_state.authenticated = True
                    st.session_state.user_profile = st.session_state.db_manager.get_user_profile(st.session_state.temp_email)
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
                    if st.session_state.db_manager.add_user(user_data):
                        st.session_state.authenticated = True
                        st.session_state.user_profile = user_data
                        st.rerun()
                    else:
                        st.error("Email already registered. Please login.")
                else:
                    st.error("Please fill all required fields")

def staff_auth():
    with st.form("staff_login"):
        username = st.text_input("Username")
        password = st.text_input("Password", type="password")
        
        if st.form_submit_button("Login"):
            if username == "staff" and password == "demo123":
                st.session_state.authenticated = True
                st.rerun()
            else:
                st.error("Invalid credentials")