const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/auth');
const db = require('../config/database');

// ✅ Register a New Patient
router.post('/register', requireAuth, (req, res) => {
    const {
        personalInformation,
        healthInsuranceDetails,
        medicalHistory,
        reasonForVisit,
        emergencyContactInformation,
        consentAndAcknowledgments
    } = req.body;

    db.run(
        `INSERT INTO patients (
            full_name, date_of_birth, gender, address, phone_number, email_address,
            health_card_number, international_student_id, 
            current_medications, allergies, chronic_conditions, past_surgeries,
            presenting_symptoms, duration_of_symptoms,
            emergency_contact_name, emergency_contact_relationship, emergency_contact_number,
            privacy_policy_agreement, treatment_consent, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            personalInformation.fullName,
            personalInformation.dateOfBirth,
            personalInformation.gender,
            personalInformation.address,
            personalInformation.phoneNumber,
            personalInformation.emailAddress,
            healthInsuranceDetails.healthCardNumber,
            healthInsuranceDetails.internationalStudentId,
            JSON.stringify(medicalHistory.currentMedications),
            JSON.stringify(medicalHistory.allergies),
            JSON.stringify(medicalHistory.chronicConditions),
            JSON.stringify(medicalHistory.pastSurgeriesOrHospitalizations),
            reasonForVisit.presentingSymptoms,
            reasonForVisit.durationOfSymptoms,
            emergencyContactInformation.name,
            emergencyContactInformation.relationship,
            emergencyContactInformation.emergencyContactNumber,
            consentAndAcknowledgments.privacyPolicyAgreement ? 1 : 0,
            consentAndAcknowledgments.treatmentConsent ? 1 : 0,
            'waiting' // ✅ Default status for new patients
        ],
        (err) => {
            if (err) {
                console.error('Error saving patient:', err);
                return res.status(500).json({ error: 'Failed to register patient' });
            }
            res.json({ message: 'Patient registered successfully' });
        }
    );
});

// ✅ Get Patient List (Lobby & Queue)
router.get('/patients', requireAuth, (req, res) => {
    db.all('SELECT * FROM patients WHERE status IN ("waiting", "inprogress")', [], (err, rows) => {
        if (err) {
            console.error('Error fetching patients:', err);
            return res.status(500).json({ error: 'Failed to fetch patients' });
        }
        res.json(rows);
    });
});

// ✅ Move Patient to Queue
router.post('/move', requireAuth, (req, res) => {
    const { patientId } = req.body;

    if (!patientId) {
        return res.status(400).json({ error: "Patient ID is required" });
    }

    db.run(
        `UPDATE patients SET status = "inprogress" WHERE id = ? AND status = "waiting"`,
        [patientId],
        function (err) {
            if (err) {
                console.error('Error moving patient to queue:', err);
                return res.status(500).json({ error: 'Failed to move patient' });
            }
            if (this.changes === 0) {
                return res.status(400).json({ error: 'Patient not found or already in queue' });
            }
            res.json({ message: 'Patient moved to queue successfully' });
        }
    );
});

// ✅ Change Patient Status (waiting → inprogress → closed)
router.post('/status', requireAuth, (req, res) => {
    const { patientId, status } = req.body;

    if (!patientId || !["waiting", "inprogress", "closed"].includes(status)) {
        return res.status(400).json({ error: "Valid patient ID and status required" });
    }

    db.run(
        `UPDATE patients SET status = ? WHERE id = ?`,
        [status, patientId],
        function (err) {
            if (err) {
                console.error('Error updating patient status:', err);
                return res.status(500).json({ error: 'Failed to update status' });
            }
            if (this.changes === 0) {
                return res.status(400).json({ error: 'Patient not found' });
            }
            res.json({ message: `Patient status updated to ${status}` });
        }
    );
});

module.exports = router;