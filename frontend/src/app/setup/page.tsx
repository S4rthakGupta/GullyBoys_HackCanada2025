"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const schema = z.object({
  personalInformation: z.object({
    fullName: z.string().min(3, "Full name is required"),
    dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
    gender: z.enum(["Male", "Female", "Other"]),
    address: z.string().min(5, "Address is required"),
    phoneNumber: z.string().regex(/^\+?[0-9\s-]+$/, "Invalid phone number"),
    emailAddress: z.string().email("Invalid email"),
  }),
  healthInsuranceDetails: z.object({
    healthCardNumber: z.string().min(5, "Health card number is required"),
    internationalStudentId: z.string().optional(),
  }),
  medicalHistory: z.object({
    currentMedications: z.string().optional(),
    allergies: z.string().optional(),
    chronicConditions: z.string().optional(),
    pastSurgeriesOrHospitalizations: z.string().optional(),
  }),
  reasonForVisit: z.object({
    presentingSymptoms: z.string().min(3, "Presenting symptoms are required"),
    durationOfSymptoms: z.string().min(1, "Duration is required"),
  }),
  emergencyContactInformation: z.object({
    name: z.string().min(3, "Emergency contact name is required"),
    relationship: z.string().min(3, "Relationship is required"),
    emergencyContactNumber: z.string().regex(/^\+?[0-9\s-]+$/, "Invalid phone number"),
  }),
  consentAndAcknowledgments: z.object({
    privacyPolicyAgreement: z.boolean().refine((val) => val === true, "You must agree to the Privacy Policy"),
    treatmentConsent: z.boolean().refine((val) => val === true, "You must agree to the treatment consent"),
  }),
});

export default function SetupPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const response = await fetch("/registerfortoken", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to register");
      }

      alert("Registration successful!");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Complete Your Setup</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        {/* Personal Information */}
        <h2 className="text-lg font-semibold">Personal Information</h2>
        <Input placeholder="Full Name" {...register("personalInformation.fullName")} />
        <p className="text-red-500">{errors.personalInformation?.fullName?.message}</p>

        <Input type="date" {...register("personalInformation.dateOfBirth")} />
        <p className="text-red-500">{errors.personalInformation?.dateOfBirth?.message}</p>

        <RadioGroup onValueChange={(val) => setValue("personalInformation.gender", val)}>
          <Label>Gender</Label>
          <RadioGroupItem value="Male">Male</RadioGroupItem>
          <RadioGroupItem value="Female">Female</RadioGroupItem>
          <RadioGroupItem value="Other">Other</RadioGroupItem>
        </RadioGroup>
        <p className="text-red-500">{errors.personalInformation?.gender?.message}</p>

        <Input placeholder="Address" {...register("personalInformation.address")} />
        <p className="text-red-500">{errors.personalInformation?.address?.message}</p>

        <Input placeholder="Phone Number" {...register("personalInformation.phoneNumber")} />
        <p className="text-red-500">{errors.personalInformation?.phoneNumber?.message}</p>

        <Input type="email" placeholder="Email Address" {...register("personalInformation.emailAddress")} />
        <p className="text-red-500">{errors.personalInformation?.emailAddress?.message}</p>

        {/* Health Insurance */}
        <h2 className="text-lg font-semibold">Health Insurance Details</h2>
        <Input placeholder="Health Card Number" {...register("healthInsuranceDetails.healthCardNumber")} />
        <p className="text-red-500">{errors.healthInsuranceDetails?.healthCardNumber?.message}</p>

        <Input placeholder="International Student ID (Optional)" {...register("healthInsuranceDetails.internationalStudentId")} />

        {/* Medical History */}
        <h2 className="text-lg font-semibold">Medical History</h2>
        <Textarea placeholder="Current Medications" {...register("medicalHistory.currentMedications")} />
        <Textarea placeholder="Allergies" {...register("medicalHistory.allergies")} />
        <Textarea placeholder="Chronic Conditions" {...register("medicalHistory.chronicConditions")} />
        <Textarea placeholder="Past Surgeries / Hospitalizations" {...register("medicalHistory.pastSurgeriesOrHospitalizations")} />

        {/* Reason for Visit */}
        <h2 className="text-lg font-semibold">Reason for Visit</h2>
        <Input placeholder="Presenting Symptoms" {...register("reasonForVisit.presentingSymptoms")} />
        <p className="text-red-500">{errors.reasonForVisit?.presentingSymptoms?.message}</p>

        <Input placeholder="Duration of Symptoms" {...register("reasonForVisit.durationOfSymptoms")} />
        <p className="text-red-500">{errors.reasonForVisit?.durationOfSymptoms?.message}</p>

        {/* Emergency Contact */}
        <h2 className="text-lg font-semibold">Emergency Contact</h2>
        <Input placeholder="Name" {...register("emergencyContactInformation.name")} />
        <Input placeholder="Relationship" {...register("emergencyContactInformation.relationship")} />
        <Input placeholder="Phone Number" {...register("emergencyContactInformation.emergencyContactNumber")} />

        {/* Consent */}
        <h2 className="text-lg font-semibold">Consent</h2>
        <div className="flex items-center space-x-2">
          <Checkbox {...register("consentAndAcknowledgments.privacyPolicyAgreement")} />
          <Label>I agree to the Privacy Policy</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox {...register("consentAndAcknowledgments.treatmentConsent")} />
          <Label>I consent to treatment</Label>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </div>
  );
}
