"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Loader2 } from "lucide-react";

function SetupPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { login } = useAuth();

    const emailFromUrl = searchParams.get("email") || "";

    const [email, setEmail] = useState(emailFromUrl);
    const [tempPassword, setTempPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [successMessage, setSuccessMessage] = useState("");
    const [isStaff, setIsStaff] = useState(false);

    useEffect(() => {
        if (emailFromUrl) {
            setEmail(emailFromUrl);
        }
    }, [emailFromUrl]);

    const handleSetup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email || !tempPassword || !newPassword || !confirmPassword) {
            setError("All fields are required.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("New passwords do not match.");
            return;
        }

        if (newPassword.length < 8) {
            setError("New password must be at least 8 characters long.");
            return;
        }

        setIsLoading(true);

        try {
            const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

            const response = await fetch(`${NEXT_PUBLIC_API_URL}/setup-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    tempPassword,
                    newPassword,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || result.message || "Failed to setup password");
            }

            const roleName = result.data?.User?.Role?.name || "Staff"; // Fallback to Staff

            if (roleName === "Admin" || roleName === "Super Admin") {
                // Determine Admin, log them in automatically
                login(result.data.accessToken, result.data.User);
                setIsStaff(false);
                setSuccessMessage("Password set successfully! Redirecting to dashboard...");
                setTimeout(() => {
                    router.push("/admin/dashboard");
                }, 2000);
            } else {
                // If they are regular Staff, prompt them to use the app
                setIsStaff(true);
            }
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isStaff) {
        return (
            <Card className="w-[400px] border-none shadow-xl">
                <CardHeader className="text-center space-y-4 pt-8">
                    <div className="mx-auto bg-green-100 p-4 rounded-full w-20 h-20 flex items-center justify-center">
                        <ShieldCheck className="w-10 h-10 text-green-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight">Setup Complete</CardTitle>
                    <CardDescription className="text-base">
                        Your password has been successfully set.
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-center pb-8 p-6 space-y-6">
                    <div className="bg-slate-50 border p-4 rounded-lg">
                        <p className="text-slate-700 text-sm">
                            As a Staff member, please log in at the <strong>MIRA Mobile Application</strong> using your email and new password.
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-[400px] border-none shadow-xl">
            <CardHeader className="text-center space-y-2 pt-8">
                <CardTitle className="text-2xl font-bold tracking-tight">Setup Password</CardTitle>
                <CardDescription>
                    Enter your temporary password and choose a new one.
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSetup}>
                <CardContent className="space-y-4">
                    {error && (
                        <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm border border-red-100">
                            {error}
                        </div>
                    )}
                    {successMessage && (
                        <div className="bg-green-50 text-green-600 p-3 rounded-md text-sm border border-green-100">
                            {successMessage}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium leading-none">Email</label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            readOnly={!!emailFromUrl}
                            className={emailFromUrl ? "bg-slate-100" : ""}
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="tempPassword" className="text-sm font-medium leading-none">Temporary Password</label>
                        <Input
                            id="tempPassword"
                            type="password"
                            placeholder="Enter the password from your email"
                            value={tempPassword}
                            onChange={(e) => setTempPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="newPassword" className="text-sm font-medium leading-none">New Password</label>
                        <Input
                            id="newPassword"
                            type="password"
                            placeholder="Ensure it is at least 8 characters"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="confirmPassword" className="text-sm font-medium leading-none">Confirm New Password</label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                </CardContent>
                <div className="flex items-center p-5 pt-0 pb-8">
                    <Button
                        type="submit"
                        className="w-full bg-slate-900 hover:bg-slate-800"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Setting up...
                            </>
                        ) : (
                            "Setup Password"
                        )}
                    </Button>
                </div>
            </form>
        </Card>
    );
}

export default function SetupPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
            <Suspense fallback={<div>Loading...</div>}>
                <SetupPasswordForm />
            </Suspense>
        </div>
    );
}
