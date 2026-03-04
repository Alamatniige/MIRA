import { Timestamp } from "next/dist/server/lib/cache-handlers/types";

export interface Auth {
    id: string;
    email: string;
    password: string;
    createdAt: Timestamp;
}

export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    createdAt: Timestamp;
}

export interface Role {
    id: string;
    name: string;
}

export interface Assets {
    id: string;
    assetName: string;
    assetType: string;
    serialNumber: string;
    specification: string;
    location: string;
    currentStatus: string;
    createdAt: Timestamp;
}

export interface Assignments {
    id: string;
    assetId: string;
    userId: string;
    assignedDate: Timestamp;
    returnedDate: Timestamp;
    createdAt: Timestamp;
}

export interface AssignmentHistory {
    id: string;
    assetId: Assets["id"];
    status: string;
    remarks: string;
    updatedBy: User["id"];
    updatedAt: Timestamp;
}

export interface IssueReports {
    id: string;
    assetId: Assets["id"];
    reportedBy: User["id"];
    description: string;
    status: string;
    reportedAt: Timestamp;
}

export interface qrCodes {
    id: string;
    assetId: Assets["id"];
    qrCode: string;
    generateAt: Timestamp;
}