import streamlit as st
from datetime import datetime
import pandas as pd

def show_patient_dashboard():
    st.header("Patient Dashboard")
    
    # Get user's tokens
    user_tokens = st.session_state.queue_manager.queue[
        st.session_state.queue_manager.queue['email'] == st.session_state.user_profile['email']
    ]
    
    if not user_tokens.empty:
        st.subheader("Your Tokens")
        
        # Create display table
        display_data = []
        for _, token in user_tokens.iterrows():
            status = token['status']
            position = ""
            wait_time = ""
            
            if status == 'Waiting':
                position = st.session_state.queue_manager.get_queue_position(token['token_id'])
                wait_time = f"{position * 15} mins"
            elif status == 'Rejected':
                position = "N/A"
                wait_time = f"Rejected: {token['reject_reason']}"
            elif status == 'Pending Approval':
                position = "Pending"
                wait_time = "Awaiting approval"
                
            display_data.append({
                'Token #': token['token_id'],
                'Status': status,
                'Queue Position': position,
                'Wait Time': wait_time,
                'Symptom': token['main_symptom']
            })
            
        df = pd.DataFrame(display_data)
        st.dataframe(
            df,
            column_config={
                'Token #': st.column_config.NumberColumn('Token #', format="%d"),
                'Wait Time': st.column_config.TextColumn('Est. Wait Time'),
            },
            hide_index=True
        )
    
    # Show form for new token
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
    token = len(st.session_state.queue_manager.queue) + 1
    new_visit = {
        'token_id': token,
        'name': st.session_state.user_profile['name'],
        'email': st.session_state.user_profile['email'],
        'phone': st.session_state.user_profile['phone'],
        'health_card_id': st.session_state.user_profile['health_card_id'],
        'main_symptom': symptom,
        'pain_level': pain,
        'timestamp': datetime.now(),
        'status': 'Pending Approval'
    }
    
    st.session_state.queue_manager.add_to_queue(new_visit)
    return token

def show_token_info(token):
    patient_status = st.session_state.queue_manager.queue[
        st.session_state.queue_manager.queue['token_id'] == token
    ]['status'].iloc[0]
    
    st.success(f"Token Generated: #{token}")
    
    if patient_status == 'Pending Approval':
        st.warning("Your token is pending approval from receptionist")
    elif patient_status == 'Rejected':
        reject_reason = st.session_state.queue_manager.queue[
            st.session_state.queue_manager.queue['token_id'] == token
        ]['reject_reason'].iloc[0]
        st.error(f"Your token was rejected. Reason: {reject_reason}")
        st.info("Please visit the reception desk.")
    else:
        st.info("Track your position in Queue Status")
        queue_position = st.session_state.queue_manager.get_queue_position(token)
        est_wait = queue_position * 15
        st.metric("Estimated Wait Time", f"{est_wait} minutes")