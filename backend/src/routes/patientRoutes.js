const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/auth');
const db = require('../config/database');

// ✅ Register a New Patient
router.post('/register', requireAuth, (req, res) => {
    const {
        userId,
        personalInformation,
        healthInsuranceDetails,
        medicalHistory,
        reasonForVisit,
        emergencyContactInformation,
        consentAndAcknowledgments
    } = req.body;

    console.log('Processing req.body', req.body);

    db.get(`SELECT * FROM patients WHERE clerk_user_id = ?`, [userId], (err, row) => {
        if (err) {
            console.error('Error checking patient:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (row) {
            // ✅ Update existing patient record
            db.run(
                `UPDATE patients SET 
                    full_name = ?, date_of_birth = ?, gender = ?, address = ?, phone_number = ?, email_address = ?, 
                    health_card_number = ?, international_student_id = ?, 
                    current_medications = ?, allergies = ?, chronic_conditions = ?, past_surgeries = ?, 
                    presenting_symptoms = ?, duration_of_symptoms = ?, 
                    emergency_contact_name = ?, emergency_contact_relationship = ?, emergency_contact_number = ?, 
                    privacy_policy_agreement = ?, treatment_consent = ?
                WHERE clerk_user_id = ?`,
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
                    userId
                ],
                (updateErr) => {
                    if (updateErr) {
                        console.error('Error updating patient:', updateErr);
                        return res.status(500).json({ error: 'Failed to update patient' });
                    }
                    res.json({ message: 'Patient record updated successfully' });
                }
            );
        } else {
            // ✅ Insert new patient record
            db.run(
                `INSERT INTO patients (
                    clerk_user_id, full_name, date_of_birth, gender, address, phone_number, email_address,
                    health_card_number, international_student_id, 
                    current_medications, allergies, chronic_conditions, past_surgeries,
                    presenting_symptoms, duration_of_symptoms,
                    emergency_contact_name, emergency_contact_relationship, emergency_contact_number,
                    privacy_policy_agreement, treatment_consent, status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    userId,
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
                (insertErr) => {
                    if (insertErr) {
                        console.error('Error saving patient:', insertErr);
                        return res.status(500).json({ error: 'Failed to register patient' });
                    }
                    res.json({ message: 'Patient registered successfully' });
                }
            );
        }
    });
});


// ✅ Fetch Patient Data
router.get('/get/:userId', requireAuth, (req, res) => {
    const { userId } = req.params;

    db.get(
        `SELECT * FROM patients WHERE clerk_user_id = ?`,
        [userId],
        (err, row) => {
            if (err) {
                console.error('Error fetching patient:', err);
                return res.status(500).json({ error: 'Failed to fetch patient data' });
            }
            if (!row) {
                return res.status(404).json({ message: 'Patient not found' });
            }
            res.json(row);
        }
    );
});


// ✅ Get Patient List (Lobby & Queue)
router.get('/admitted/patients', requireAuth, (req, res) => {
    db.all('SELECT * FROM patients WHERE status IN ("closed", "inprogress")', [], (err, rows) => {
        if (err) {
            console.error('Error fetching patients:', err);
            return res.status(500).json({ error: 'Failed to fetch patients' });
        }
        console.log('Patients:', rows);
        res.json(rows);
    });
});

// ✅ Get Patient List (Lobby & Queue)
router.get('/waiting/patients', requireAuth, (req, res) => {
    db.all('SELECT * FROM patients WHERE status IN ("waiting")', [], (err, rows) => {
        if (err) {
            console.error('Error fetching patients:', err);
            return res.status(500).json({ error: 'Failed to fetch patients' });
        }
        console.log('Patients:', rows);
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