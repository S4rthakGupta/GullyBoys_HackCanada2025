import streamlit as st
from datetime import datetime
import pandas as pd

def show_patient_dashboard():
    st.header("Patient Dashboard")

    # ✅ Get user's queue position from SQLite instead of `queue`
    user_queue_position = st.session_state.queue_manager.get_queue_position(st.session_state.user_profile["email"])

    if user_queue_position:
        st.subheader("Your Queue Position")
        st.write(f"**Your current queue position:** {user_queue_position}")
    else:
        st.write("You are not in the queue. Please request a new token.")

    # ✅ Show form for new token request
    st.subheader("Request New Token")
    show_visit_form()

def show_visit_form():
    with st.form("visit_form"):
        main_symptom = st.text_area("Main Symptom/Issue*")
        pain_level = st.slider("Pain Level (if applicable)", 0, 10, 0)

        submitted = st.form_submit_button("Get Token")
        if submitted and main_symptom:
            token = generate_token(main_symptom, pain_level)
            st.session_state.current_token = token
            show_token_info(token)

def generate_token(symptom, pain):
    """✅ Add patient to queue using SQLite instead of CSV"""
    token = st.session_state.queue_manager.add_to_queue(
        st.session_state.user_profile["email"], symptom, pain
    )
    
    new_visit = {
        'token_id': token,
        'name': st.session_state.user_profile['name'],
        'email': st.session_state.user_profile['email'],
        'phone': st.session_state.user_profile['phone'],
        'health_card_id': st.session_state.user_profile['health_card_id'],
        'main_symptom': symptom,
        'pain_level': pain,
        'timestamp': datetime.now(),
        'status': 'Waiting'
    }

    return token

def show_token_info(token):
    """✅ Fetch status from SQLite instead of queue memory"""
    queue_position = st.session_state.queue_manager.get_queue_position(st.session_state.user_profile["email"])

    if queue_position:
        st.success(f"Token Generated: #{token}")
        st.info(f"Your estimated wait time: **{queue_position * 15} minutes**")
    else:
        st.error("Token could not be retrieved. Please contact reception.")
