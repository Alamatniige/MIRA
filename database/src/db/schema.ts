import {
    pgTable,
    uuid,
    text,
    timestamp,
    boolean,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    email: text("email").notNull().unique(),
    fullName: text("fullName").notNull(),
    password: text("password").notNull(),
    department: text("department").notNull(),
    roleId: uuid("roleId").notNull().references(() => roles.id),
    createdAt: timestamp("createdAt")
        .defaultNow()
        .notNull(),
});

export const roles = pgTable("roles", {
    id: uuid("id").defaultRandom().primaryKey(),
    roleName: text("roleName").notNull(),
});

export const assets = pgTable("assets", {
    id: uuid("id").defaultRandom().primaryKey(),
    assetName: text("assetName").notNull(),
    assetType: text("assetType").notNull(),
    serialNumber: text("serialNumber").notNull(),
    specification: text("specification").notNull(),
    location: text("location").notNull(),
    currentStatus: text("currentStatus").notNull(),
    createdAt: timestamp("createdAt")
        .defaultNow()
        .notNull(),
});

export const assetsAssignment = pgTable("assetsAssignment", {
    id: uuid("id").defaultRandom().primaryKey(),
    assetId: uuid("assetId").notNull().references(() => assets.id),
    userId: uuid("userId").notNull().references(() => users.id),
    assignedDate: timestamp("assignedDate")
        .defaultNow()
        .notNull(),
    returnedDate: timestamp("returnedDate")
        .defaultNow()
        .notNull(),
    acknowledged: boolean("acknowledged").default(false).notNull(),
});

export const asssetStatusHistory = pgTable("asssetStatusHistory", {
    id: uuid("id").defaultRandom().primaryKey(),
    assetId: uuid("assetId").notNull().references(() => assets.id),
    status: text("status").notNull(),
    remarks: text("remarks").notNull(),
    updatedBy: uuid("updatedBy").notNull().references(() => users.id),
    updatedAt: timestamp("updatedAt")
        .defaultNow()
        .notNull(),
});

export const issueReports = pgTable("issueReports", {
    id: uuid("id").defaultRandom().primaryKey(),
    assetId: uuid("assetId").notNull().references(() => assets.id),
    reportedBy: uuid("reportedBy").notNull().references(() => users.id),
    description: text("description").notNull(),
    status: text("status").notNull(),
    reportAt: timestamp("reportAt")
        .defaultNow()
        .notNull(),
});

export const qrCodes = pgTable("qrCodes", {
    id: uuid("id").defaultRandom().primaryKey(),
    assetId: uuid("assetId").notNull().references(() => assets.id),
    qrValue: text("qrValue").notNull(),
    generateAt: timestamp("generateAt")
        .defaultNow()
        .notNull(),
});
