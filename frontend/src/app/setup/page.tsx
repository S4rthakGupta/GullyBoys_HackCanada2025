"use client";

import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function SetupPage() {
    const { register, handleSubmit, control } = useForm();

    const [loading, setLoading] = useState(false);

    const onSubmit = async (data: any) => {
        setLoading(true);

        console.log("Submitting form...");
        console.log("Form Data:", data);

        try {
            const response = await fetch("/registerfortoken", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            console.log("Response Status:", response.status);

            if (!response.ok) {
                throw new Error("Failed to register");
            }

            alert("Registration successful!");
        } catch (error) {
            console.error("Submission Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
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
                <Input placeholder="Presenting Symptoms" {...register("reasonForVisit.presentingSymptoms")} />
                <Input placeholder="Duration of Symptoms" {...register("reasonForVisit.durationOfSymptoms")} />

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
                    {loading ? "Submitting..." : "Submit"}
                </Button>
            </form>
        </div>
    );
}
