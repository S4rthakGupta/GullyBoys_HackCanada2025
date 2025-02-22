"use client";

import { useState } from "react";
import AdminNavbar from "./adminnav";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Patient {
    id: number;
    name: string;
    reason: string;
    status: "Waiting" | "Current" | "Closed";
    location: "Lobby" | "Queue";
}

const hardcodedPatients: Patient[] = [
    { id: 1, name: "John Doe", reason: "Fever & Cold", status: "Waiting", location: "Lobby" },
    { id: 2, name: "Jane Smith", reason: "Back Pain", status: "Waiting", location: "Lobby" },
];

export default function AdminQueue() {
    const [patients, setPatients] = useState<Patient[]>(hardcodedPatients);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    
    const moveToQueue = (patientId: number) => {
        setPatients((prev) => {
            const updatedPatients: Patient[] = prev.map((p) =>
                p.id === patientId ? { ...p, location: "Queue" } : p
            );
            new Audio("/ding.mp3").play();
            return updatedPatients;
        });
    };
    
    
    const changeStatus = (patientId: number, newStatus: "Waiting" | "Current" | "Closed") => {
        setPatients((prev) =>
            prev.map((p) =>
                p.id === patientId ? { ...p, status: newStatus } : p
            )
        );
    };

    return (
        <>
            <AdminNavbar />
            <div className="container mx-auto p-6">
                <h2 className="text-xl font-bold mb-4">Admin Queue Management</h2>

                <div className="grid grid-cols-2 gap-6">
                    {/* Lobby List */}
                    <div>
                        <h3 className="text-lg font-semibold">Lobby</h3>
                        {patients.filter((p) => p.location === "Lobby").length === 0 ? (
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
                                    {patients
                                        .filter((p) => p.location === "Lobby")
                                        .map((p) => (
                                            <TableRow key={p.id}>
                                                <TableCell>{p.name}</TableCell>
                                                <TableCell>{p.reason}</TableCell>
                                                <TableCell>
                                                    <Button onClick={() => moveToQueue(p.id)}>Move to Queue</Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        )}
                    </div>

                    {/* Queue List */}
                    <div>
                        <h3 className="text-lg font-semibold">Queue</h3>
                        {patients.filter((p) => p.location === "Queue").length === 0 ? (
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
                                    {patients
                                        .filter((p) => p.location === "Queue")
                                        .map((p) => (
                                            <TableRow
                                                key={p.id}
                                                className={p.status === "Closed" ? "opacity-50" : ""}
                                                onClick={() => setSelectedPatient(p)}
                                            >
                                                <TableCell>{p.name}</TableCell>
                                                <TableCell>{p.reason}</TableCell>
                                                <TableCell>
                                                    <Select onValueChange={(val) => changeStatus(p.id, val)}>
                                                        <SelectTrigger><SelectValue placeholder={p.status} /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Waiting">Waiting</SelectItem>
                                                            <SelectItem value="Current">Current</SelectItem>
                                                            <SelectItem value="Closed">Closed</SelectItem>
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
