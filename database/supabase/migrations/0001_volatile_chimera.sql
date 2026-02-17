CREATE TABLE "assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"assetName" text NOT NULL,
	"assetType" text NOT NULL,
	"serialNumber" text NOT NULL,
	"specification" text NOT NULL,
	"location" text NOT NULL,
	"currentStatus" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "assetsAssignment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"assetId" uuid NOT NULL,
	"userId" uuid NOT NULL,
	"assignedDate" timestamp DEFAULT now() NOT NULL,
	"returnedDate" timestamp DEFAULT now() NOT NULL,
	"acknowledged" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "asssetStatusHistory" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"assetId" uuid NOT NULL,
	"status" text NOT NULL,
	"remarks" text NOT NULL,
	"updatedBy" uuid NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "issueReports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"assetId" uuid NOT NULL,
	"reportedBy" uuid NOT NULL,
	"description" text NOT NULL,
	"status" text NOT NULL,
	"reportAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "qrCodes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"assetId" uuid NOT NULL,
	"qrValue" text NOT NULL,
	"generateAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "assetsAssignment" ADD CONSTRAINT "assetsAssignment_assetId_assets_id_fk" FOREIGN KEY ("assetId") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assetsAssignment" ADD CONSTRAINT "assetsAssignment_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asssetStatusHistory" ADD CONSTRAINT "asssetStatusHistory_assetId_assets_id_fk" FOREIGN KEY ("assetId") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asssetStatusHistory" ADD CONSTRAINT "asssetStatusHistory_updatedBy_users_id_fk" FOREIGN KEY ("updatedBy") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "issueReports" ADD CONSTRAINT "issueReports_assetId_assets_id_fk" FOREIGN KEY ("assetId") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "issueReports" ADD CONSTRAINT "issueReports_reportedBy_users_id_fk" FOREIGN KEY ("reportedBy") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "qrCodes" ADD CONSTRAINT "qrCodes_assetId_assets_id_fk" FOREIGN KEY ("assetId") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;