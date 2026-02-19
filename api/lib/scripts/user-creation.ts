
import { db } from "../../../database/src/db";
import { users, roles } from "../../../database/src/db/schema";
import { eq } from "drizzle-orm";
import { createInterface } from "readline/promises";
import { stdin as input, stdout as output } from "process";

const rl = createInterface({ input, output });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables are required.");
    console.error("Please set them in your environment or .env file.");
    process.exit(1);
}

const supabaseUrl = SUPABASE_URL!;
const supabaseServiceRoleKey = SUPABASE_SERVICE_ROLE_KEY!;

async function askQuestion(question: string): Promise<string> {
    return await rl.question(question);
}

async function main() {
    try {
        console.log("--- Create New User Script ---");

        // 1. Fetch available roles
        const allRoles = await db.select().from(roles);
        if (allRoles.length === 0) {
            console.error("Error: No roles found in the database. Please create roles first.");
            process.exit(1);
        }

        console.log("\nAvailable Roles:");
        allRoles.forEach((r, index) => {
            console.log(`${index + 1}. ${r.roleName} (ID: ${r.id})`);
        });

        const roleIndexStr = await askQuestion("\nSelect Role (number): ");
        const roleIndex = parseInt(roleIndexStr) - 1;

        if (isNaN(roleIndex) || roleIndex < 0 || roleIndex >= allRoles.length) {
            console.error("Invalid role selection.");
            process.exit(1);
        }
        const selectedRole = allRoles[roleIndex];

        // 2. Get user details
        const email = await askQuestion("Email: ");
        const password = await askQuestion("Password: ");
        const fullName = await askQuestion("Full Name: ");
        const department = await askQuestion("Department: ");

        console.log("\nCreating user in Supabase Auth...");

        // 3. Create user in Supabase Auth
        const authResponse = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${supabaseServiceRoleKey}`,
                "apikey": supabaseServiceRoleKey,
            },
            body: JSON.stringify({
                email,
                password,
                email_confirm: true, // Auto-confirm email
                user_metadata: {
                    full_name: fullName,
                },
            }),
        });

        if (!authResponse.ok) {
            const errorText = await authResponse.text();
            throw new Error(`Failed to create user in Supabase: ${authResponse.status} ${errorText}`);
        }

        const authData = await authResponse.json();
        const userId = authData.id;

        console.log(`User created in Supabase Auth with ID: ${userId}`);

        // 4. Insert user into database
        console.log("Inserting user into database...");

        await db.insert(users).values({
            id: userId,
            email,
            fullName,
            password: "hashed_by_supabase_auth_id_ref", // We don't store the actual password hash here, usually, or we store a placeholder if the schema requires it. 
            // The schema has `password` as notNull(). The user struct in `user.go` has `Password string`.
            // In `schema.ts`: password: text("password").notNull()
            // Usually we shouldn't store the raw password. But since the field is required, let's store a placeholder or the supabase ID.
            // Wait, if we use Supabase Auth, we don't handle password logic in our DB.
            // But the schema requires it. I will put "SUPABASE_AUTH" or similar.
            // Actually, looking at `api/v1/auth/handler.go`, it doesn't seem to insert into `users` table on login, it just fetches.
            // `AddUser` in `handler.go` inserts `user` struct.
            // I'll put a placeholder since auth is handled by Supabase.
            department,
            roleId: selectedRole.id,
        });

        console.log("\nUser created successfully!");
        console.log(`ID: ${userId}`);
        console.log(`Email: ${email}`);
        console.log(`Name: ${fullName}`);
        console.log(`Role: ${selectedRole.roleName}`);

    } catch (error) {
        console.error("\nError creating user:", error);
    } finally {
        rl.close();
        process.exit(0);
    }
}

main();
