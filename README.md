# GullyBoys_HackCanada2025

This is our project for HackCanada 2025. It is a **Walk-in Clinic Queue System** that allows patients to join a queue, track their position, and interact with clinic staff for approval and updates.

## Setup Instructions

Follow these steps to set up the project environment and run the application.

### Step 1: Clone the Repository

```bash
git clone <repository_url>
cd GullyBoys_HackCanada2025
```
### Step 2: Create a Virtual Environment
It is recommended to create a virtual environment to manage dependencies.

```bash
python -m venv .venv
```

### Step 3: Activate the Virtual Environment
- Windows:

```bash

.venv\Scripts\activate
```
- Mac/Linux:

```bash

source .venv/bin/activate
```

### Step 4: Install Dependencies
Install all the necessary dependencies using pip.

```bash
pip install -r requirements.txt
```

### Step 5: Set Up the Database
The project uses an SQLite database for user authentication and queue management.
The database is initialized automatically upon running the app, but you can check the `clinic.db` file to view the data structure.

### Step 6: Run the Application
Run the Streamlit app using the following command:

```bash
streamlit run app.py
```
This will open a local server in your browser where you can interact with the Walk-in Clinic Queue System.

### File Structure
- app.py: Main entry point for the Streamlit app.
- requirements.txt: Contains the list of dependencies.
- clinic.db: SQLite database file containing user data and queue information.
- README.md: Project documentation and setup instructions.
