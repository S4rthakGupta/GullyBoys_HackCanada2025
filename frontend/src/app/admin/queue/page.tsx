"use client";

import { useState, useEffect } from "react";
import AdminNavbar from "./adminnav";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Patient {
    id: number;
    full_name: string;
    presenting_symptoms: string;
    status: "waiting" | "inprogress" | "closed";
}

export default function AdminQueue() {
    const [waitingPatients, setWaitingPatients] = useState<Patient[]>([]);
    const [admittedPatients, setAdmittedPatients] = useState<Patient[]>([]);

    // Fetch patients when the component mounts
    useEffect(() => {
        fetchWaitingPatients();
        fetchAdmittedPatients();
    }, []);

    // Fetch patients who are in the waiting list
    const fetchWaitingPatients = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/patient/waiting/patients");
            if (!response.ok) throw new Error("Failed to fetch waiting patients");

            const data = await response.json();
            setWaitingPatients(data);
        } catch (error) {
            console.error("Error fetching waiting patients:", error);
        }
    };

    // Fetch patients who are admitted (in queue)
    const fetchAdmittedPatients = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/patient/admitted/patients");
            if (!response.ok) throw new Error("Failed to fetch admitted patients");

            const data = await response.json();
            setAdmittedPatients(data);
        } catch (error) {
            console.error("Error fetching admitted patients:", error);
        }
    };

    // Move patient from waiting to queue (status: "inprogress")
    const moveToQueue = async (patientId: number) => {
        try {
            const response = await fetch("http://localhost:8000/api/patient/move", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ patientId }),
            });

            if (!response.ok) throw new Error("Failed to move patient to queue");

            // Refresh both lists
            fetchWaitingPatients();
            fetchAdmittedPatients();
        } catch (error) {
            console.error("Error moving patient:", error);
        }
    };

    // Change patient status (waiting → inprogress → closed)
    const changeStatus = async (patientId: number, newStatus: "waiting" | "inprogress" | "closed") => {
        try {
            const response = await fetch("http://localhost:8000/api/patient/status", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ patientId, status: newStatus }),
            });

            if (!response.ok) throw new Error("Failed to update status");

            // Refresh admitted list only
            fetchAdmittedPatients();
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    return (
        <>
            <AdminNavbar />
            <div className="container mx-auto p-6">
                <h2 className="text-xl font-bold mb-4">Admin Queue Management</h2>

                <div className="grid grid-cols-2 gap-6">
                    {/* Waiting Patients List */}
                    <div>
                        <h3 className="text-lg font-semibold">Lobby</h3>
                        {waitingPatients.length === 0 ? (
                            <p className="text-gray-500">No patients in the lobby.</p>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Reason</TableHead>
                                        <TableHead>Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {waitingPatients.map((p) => (
                                        <TableRow key={p.id}>
                                            <TableCell>{p.full_name}</TableCell>
                                            <TableCell>{p.presenting_symptoms}</TableCell>
                                            <TableCell>
                                                <Button onClick={() => moveToQueue(p.id)}>
                                                    Move to Queue
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </div>

                    {/* Admitted Patients List */}
                    <div>
                        <h3 className="text-lg font-semibold">Queue</h3>
                        {admittedPatients.length === 0 ? (
                            <p className="text-gray-500">No patients in the queue.</p>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Reason</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {admittedPatients.map((p) => (
                                        <TableRow
                                            key={p.id}
                                            className={p.status === "closed" ? "opacity-50" : ""}
                                        >
                                            <TableCell>{p.full_name}</TableCell>
                                            <TableCell>{p.presenting_symptoms}</TableCell>
                                            <TableCell>
                                                <Select
                                                    defaultValue={p.status}
                                                    onValueChange={(val) =>
                                                        changeStatus(p.id, val as "waiting" | "inprogress" | "closed")
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={p.status} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="waiting">Waiting</SelectItem>
                                                        <SelectItem value="inprogress">Current</SelectItem>
                                                        <SelectItem value="closed">Closed</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
