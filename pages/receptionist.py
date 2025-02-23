import streamlit as st
from datetime import datetime
import pandas as pd

def show_receptionist_dashboard():
    st.header("Receptionist Dashboard")
    
    tab1, tab2 = st.tabs(["Pending Approvals", "Active Queue"])
    
    with tab1:
        show_pending_approvals()
    
    with tab2:
        show_queue_management()

def show_pending_approvals():
    pending = st.session_state.queue_manager.queue[
        st.session_state.queue_manager.queue['status'] == 'Pending Approval'
    ]
    
    st.subheader("Pending Token Approvals")
    if pending.empty:
        st.info("No pending approvals")
        return
        
    for _, patient in pending.iterrows():
        with st.container():
            col1, col2 = st.columns([3,1])
            with col1:
                st.write(f"Token #{patient['token_id']} - {patient['name']}")
                st.write(f"Health Card: {patient['health_card_id']}")
                st.write(f"Issue: {patient['main_symptom']}")
            with col2:
                if st.button("Approve", key=f"app_{patient['token_id']}"):
                    st.session_state.queue_manager.approve_token(patient['token_id'])
                    st.rerun()
                
                # Add reject reason input first
                reason = st.text_input("Reject reason:", key=f"reason_{patient['token_id']}")
                if st.button("Reject", key=f"rej_{patient['token_id']}") and reason:
                    st.session_state.queue_manager.reject_token(patient['token_id'], reason)
                    st.rerun()

def show_queue_management():
    queue = st.session_state.queue_manager.queue
    waiting_patients = queue[queue['status'] == 'Waiting'].sort_values('timestamp')
    
    st.subheader("Current Queue")
    
    # Queue metrics
    col1, col2 = st.columns(2)
    with col1:
        waiting = len(waiting_patients)
        st.metric("Patients Waiting", waiting)
    with col2:
        st.metric("Avg Wait Time", f"{waiting * 15} mins")
    
    if waiting_patients.empty:
        st.info("No patients in active queue")
        return
        
    for _, patient in waiting_patients.iterrows():
        col1, col2, col3 = st.columns([2,2,1])
        with col1:
            st.write(f"Token #{patient['token_id']} - {patient['name']}")
            st.write(f"Issue: {patient['main_symptom']}")
        with col2:
            st.write(f"Pain Level: {patient['pain_level']}")
            wait_time = (datetime.now() - pd.to_datetime(patient['timestamp'])).total_seconds() / 60
            st.write(f"Wait Time: {round(wait_time)} mins")
        with col3:
            if st.button("Call Next", key=f"call_{patient['token_id']}"):
                st.session_state.queue_manager.update_status(patient['token_id'], 'Called')
                st.rerun()