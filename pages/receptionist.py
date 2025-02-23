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
    """✅ Fetch pending approvals from SQLite instead of queue memory"""
    pending = st.session_state.queue_manager.get_pending_approvals()

    st.subheader("Pending Token Approvals")

    if pending is None or pending.empty:
        st.info("No pending approvals")
        return

    for _, patient in pending.iterrows():
        with st.container():
            col1, col2 = st.columns([3, 1])
            with col1:
                st.write(f"Token #{patient['Queue ID']} - {patient['Name']}")
                st.write(f"Health Card: {patient['Health Card ID']}")
                st.write(f"Issue: {patient['Main Symptom']}")
            with col2:
                if st.button("Approve", key=f"app_{patient['Queue ID']}"):  # ✅ Fixed
                    st.session_state.queue_manager.approve_token(patient['Queue ID'])  # ✅ Fixed
                    st.rerun()

                # ✅ Add reject reason input
                reason = st.text_input("Reject reason:", key=f"reason_{patient['Queue ID']}")  # ✅ Fixed
                if st.button("Reject", key=f"rej_{patient['Queue ID']}") and reason:  # ✅ Fixed
                    st.session_state.queue_manager.reject_token(patient['Queue ID'], reason)  # ✅ Fixed
                    st.rerun()


def show_queue_management():
    """✅ Fetch queue list from SQLite instead of queue memory"""
    queue_df = st.session_state.queue_manager.get_queue_list()

    st.subheader("Current Queue")

    if queue_df is None or queue_df.empty:
        st.info("No patients in the queue.")
        return

    # ✅ Display queue metrics
    col1, col2 = st.columns(2)
    with col1:
        st.metric("Patients Waiting", len(queue_df))
    with col2:
        st.metric("Avg Wait Time", f"{len(queue_df) * 15} mins")

    # ✅ Display queue in Streamlit DataFrame
    st.dataframe(queue_df)

    for _, patient in queue_df.iterrows():
        col1, col2, col3 = st.columns([2, 2, 1])
        with col1:
            st.write(f"Token #{patient['Queue ID']} - {patient['Name']}")  # ✅ Now correctly matched
            st.write(f"Issue: {patient['Main Symptom']}")  # ✅ Corrected column name
        with col2:
            st.write(f"Pain Level: {patient['Pain Level']}")  # ✅ Corrected column name
            if "Timestamp" in patient:
                wait_time = (datetime.now() - pd.to_datetime(patient['Timestamp'])).total_seconds() / 60
                st.write(f"Wait Time: {round(wait_time)} mins")
            else:
                st.write("Wait Time: N/A")
        with col3:
            if st.button("Call Next", key=f"call_{patient['Queue ID']}"):  # ✅ Now correctly matched
                st.session_state.queue_manager.update_status(patient['Queue ID'], 'Called')  # ✅ Now correctly matched
                st.rerun()
