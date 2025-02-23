"use client";

import { useForm, Controller } from "react-hook-form";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import NavBar from "@/components/nav";
import { useRouter } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";

export default function SetupPage() {
    const { register, handleSubmit, control, reset } = useForm();
    const [loading, setLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(true);
    const router = useRouter();
    const userId = useUser().user?.id || "";

    // Fetch patient data when the page loads
    useEffect(() => {
        const fetchPatientData = async () => {
            if (!userId) return;

            try {
                const response = await fetch(`http://localhost:8000/api/patient/${userId}`);
                if (response.ok) {
                    const data = await response.json();

                    // Transform fetched data into form-compatible structure
                    const transformedData = {
                        personalInformation: {
                            fullName: data.full_name || "",
                            dateOfBirth: data.date_of_birth || "",
                            gender: data.gender || "",
                            address: data.address || "",
                            phoneNumber: data.phone_number || "",
                            emailAddress: data.email_address || ""
                        },
                        healthInsuranceDetails: {
                            healthCardNumber: data.health_card_number || "",
                        },
                        medicalHistory: {
                            currentMedications: data.current_medications ? JSON.parse(data.current_medications) : "",
                            allergies: data.allergies ? JSON.parse(data.allergies) : "",
                            chronicConditions: data.chronic_conditions ? JSON.parse(data.chronic_conditions) : "",
                            pastSurgeriesOrHospitalizations: data.past_surgeries ? JSON.parse(data.past_surgeries) : "",
                        },
                        reasonForVisit: {
                            presentingSymptoms: data.presenting_symptoms || "",
                            durationOfSymptoms: data.duration_of_symptoms || ""
                        },
                        emergencyContactInformation: {
                            name: data.emergency_contact_name || "",
                            relationship: data.emergency_contact_relationship || "",
                            emergencyContactNumber: data.emergency_contact_number || ""
                        },
                        consentAndAcknowledgments: {
                            privacyPolicyAgreement: data.privacy_policy_agreement === 1,
                            treatmentConsent: data.treatment_consent === 1
                        }
                    };

                    reset(transformedData);
                }
            } catch (error) {
                console.error("Error fetching patient data:", error);
            } finally {
                setFetchingData(false);
            }
        };

        fetchPatientData();
    }, [userId, reset]);

    const onSubmit = async (data: any) => {
        setLoading(true);

        if (!userId) {
            alert("You must be logged in to submit the form.");
            return;
        }

        const payload = { ...data, userId };

        try {
            // Step 1: Register patient
            const registerResponse = await fetch("http://localhost:8000/api/patient/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!registerResponse.ok) {
                throw new Error("Failed to register patient");
            }

            console.log("Patient registered successfully.");

            // Step 2: Generate token
            const tokenResponse = await fetch("http://localhost:8000/api/token/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId }),
            });

            if (!tokenResponse.ok) {
                throw new Error("Failed to generate token");
            }

            const tokenData = await tokenResponse.json();
            console.log("Token generated successfully:", tokenData.token);

            // Step 3: Navigate to /token page
            alert("Registration and token generation successful!");
            router.push("/token");
        } catch (error) {
            console.error("Error:", error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (fetchingData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 text-gray-900 pb-20">
            <NavBar />
            <br /> <br />
            <br /> <br />
            <br /> <br />
            <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
                <h1 className="text-2xl font-bold mb-4">Complete Your Setup</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <h2 className="text-lg font-semibold">Personal Information</h2>
                    <Input placeholder="Full Name" {...register("personalInformation.fullName")} />
                    <Input type="date" {...register("personalInformation.dateOfBirth")} />

                    <Controller
                        name="personalInformation.gender"
                        control={control}
                        render={({ field }) => (
                            <RadioGroup onValueChange={field.onChange} value={field.value}>
                                <Label>Gender</Label>
                                <RadioGroupItem value="Male">Male</RadioGroupItem>
                                <RadioGroupItem value="Female">Female</RadioGroupItem>
                                <RadioGroupItem value="Other">Other</RadioGroupItem>
                            </RadioGroup>
                        )}
                    />

                    <Input placeholder="Address" {...register("personalInformation.address")} />
                    <Input placeholder="Phone Number" {...register("personalInformation.phoneNumber")} />
                    <Input type="email" placeholder="Email Address" {...register("personalInformation.emailAddress")} />

                    <h2 className="text-lg font-semibold">Health Insurance Details</h2>
                    <Input placeholder="Health Card Number" {...register("healthInsuranceDetails.healthCardNumber")} />

                    <h2 className="text-lg font-semibold">Medical History</h2>
                    <Textarea placeholder="Current Medications" {...register("medicalHistory.currentMedications")} />
                    <Textarea placeholder="Allergies" {...register("medicalHistory.allergies")} />
                    <Textarea placeholder="Chronic Conditions" {...register("medicalHistory.chronicConditions")} />
                    <Textarea placeholder="Past Surgeries / Hospitalizations" {...register("medicalHistory.pastSurgeriesOrHospitalizations")} />

                    <h2 className="text-lg font-semibold">Reason for Visit</h2>
                    <Input placeholder="Presenting Symptoms"  />
                    <Input placeholder="Duration of Symptoms"  />

                    <h2 className="text-lg font-semibold">Emergency Contact</h2>
                    <Input placeholder="Name" {...register("emergencyContactInformation.name")} />
                    <Input placeholder="Relationship" {...register("emergencyContactInformation.relationship")} />
                    <Input placeholder="Phone Number" {...register("emergencyContactInformation.emergencyContactNumber")} />

                    <h2 className="text-lg font-semibold">Consent</h2>
                    <Controller
                        name="consentAndAcknowledgments.privacyPolicyAgreement"
                        control={control}
                        defaultValue={false}
                        render={({ field }) => (
                            <div className="flex items-center space-x-2">
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                <Label>I agree to the Privacy Policy</Label>
                            </div>
                        )}
                    />

                    <Controller
                        name="consentAndAcknowledgments.treatmentConsent"
                        control={control}
                        defaultValue={false}
                        render={({ field }) => (
                            <div className="flex items-center space-x-2">
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                <Label>I consent to treatment</Label>
                            </div>
                        )}
                    />

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Submitting..." : "Register and Get Token"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
