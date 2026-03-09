import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Preview,
    Section,
    Text,
} from "@react-email/components";
import * as React from "react";

interface EmailInviteProps {
    name: string;
    email: string;
    role: string;
    department: string;
    tempPassword?: string;
}

export const EmailInvite = ({
    name = "User",
    email = "user@example.com",
    role = "Staff",
    department = "General",
    tempPassword = "TempPassword123!",
}: EmailInviteProps) => {
    const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/setup-password?email=${encodeURIComponent(email)}`;

    return (
        <Html>
            <Head />
            <Preview>Welcome to MIRA - You've been invited to join!</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={header}>
                        <Heading style={heading}>MIRA</Heading>
                    </Section>

                    <Section style={content}>
                        <Heading style={subHeading}>Welcome to MIRA, {name}!</Heading>
                        <Text style={paragraph}>
                            You have been invited to join the MIRA platform by your administrator.
                            Your account has been set up with the following details:
                        </Text>

                        <Section style={detailsContainer}>
                            <Text style={detailItem}>
                                <strong style={detailLabel}>Email:</strong> {email}
                            </Text>
                            <Text style={detailItem}>
                                <strong style={detailLabel}>Role:</strong> {role}
                            </Text>
                            <Text style={detailItem}>
                                <strong style={detailLabel}>Department:</strong> {department}
                            </Text>
                            <Text style={detailItem}>
                                <strong style={detailLabel}>Temporary Password:</strong>{" "}
                                <span style={passwordBox}>{tempPassword}</span>
                            </Text>
                        </Section>

                        <Text style={paragraph}>
                            Please use your temporary password to set up your new permanent password.
                        </Text>

                        <Section style={btnContainer}>
                            <Button style={button} href={loginUrl}>
                                Setup Password
                            </Button>
                        </Section>
                    </Section>

                    <Hr style={hr} />

                    <Section style={footerSection}>
                        <Text style={footer}>
                            This invitation was sent from the MIRA Admin system. If you believe this
                            is a mistake, please disregard this email.
                        </Text>
                        <Text style={footerLink}>
                            &copy; {new Date().getFullYear()} MIRA IT Department
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

export default EmailInvite;

// Styling for the email
const main = {
    backgroundColor: "#f5f7f9", // Matches --background
    fontFamily:
        'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
    backgroundColor: "#ffffff",
    margin: "40px auto",
    borderRadius: "12px", // Matches --radius: 0.75rem
    border: "1px solid #d4dbe5", // Matches --border
    boxShadow: "0 4px 12px rgba(15, 118, 110, 0.05)",
    maxWidth: "580px",
    overflow: "hidden" as const,
};

const header = {
    backgroundColor: "#0b1720", // Matches sidebar background for brand consistency
    padding: "32px",
    textAlign: "center" as const,
};

const heading = {
    fontSize: "28px",
    letterSpacing: "0.05em",
    fontWeight: "700",
    color: "#ffffff",
    margin: "0",
    textTransform: "uppercase" as const,
};

const content = {
    padding: "40px 48px",
};

const subHeading = {
    fontSize: "20px",
    lineHeight: "1.3",
    fontWeight: "600",
    color: "#0f766e", // Matches --primary (Teal Green)
    margin: "0 0 16px",
};

const paragraph = {
    fontSize: "15px",
    lineHeight: "1.6",
    color: "#334155", // Slate 700
    margin: "0 0 20px",
};

const detailsContainer = {
    padding: "24px",
    backgroundColor: "#f0fdfa", // Teal 50 (Accent background)
    borderRadius: "8px",
    margin: "24px 0",
    border: "1px solid #ccfbf1", // Teal 100
};

const detailItem = {
    margin: "0 0 8px",
    fontSize: "14px",
    color: "#0f172a", // Matches --foreground
};

const detailLabel = {
    color: "#0f766e", // Teal Green
    fontWeight: "600",
    marginRight: "8px",
};

const passwordBox = {
    display: "inline-block",
    padding: "4px 8px",
    backgroundColor: "#0f172a",
    color: "#ffffff",
    borderRadius: "4px",
    fontWeight: "bold",
    fontSize: "13px",
    fontFamily: 'ui-monospace, "Cascadia Code", monospace',
};

const btnContainer = {
    textAlign: "center" as const,
    marginTop: "32px",
};

const button = {
    backgroundColor: "#0f766e", // Matches --primary
    borderRadius: "8px",
    color: "#fff",
    fontSize: "15px",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "inline-block",
    padding: "14px 32px",
    fontWeight: "600",
};

const hr = {
    borderColor: "#e2e8f0",
    margin: "0",
};

const footerSection = {
    padding: "32px 48px",
    backgroundColor: "#f8fafc",
};

const footer = {
    color: "#64748b", // Matches --muted-foreground
    fontSize: "12px",
    lineHeight: "18px",
    margin: "0 0 12px",
};

const footerLink = {
    color: "#94a3b8",
    fontSize: "12px",
    fontWeight: "500",
    margin: "0",
};
