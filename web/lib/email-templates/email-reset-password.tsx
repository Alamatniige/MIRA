import {
    Body,
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

interface EmailResetPasswordProps {
    name: string;
    otp: string;
}

export const EmailResetPassword = ({
    name = "User",
    otp = "000000",
}: EmailResetPasswordProps) => {
    return (
        <Html>
            <Head />
            <Preview>Your MIRA password reset code: {otp}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={header}>
                        <Heading style={heading}>MIRA</Heading>
                    </Section>

                    <Section style={content}>
                        <Heading style={subHeading}>Password Reset Request</Heading>
                        <Text style={paragraph}>Hi {name},</Text>
                        <Text style={paragraph}>
                            We received a request to reset your MIRA account password.
                            Use the code below in the app to continue. This code expires in{" "}
                            <strong>10 minutes</strong>.
                        </Text>

                        <Section style={otpContainer}>
                            <Text style={otpCode}>{otp}</Text>
                        </Section>

                        <Text style={paragraph}>
                            If you did not request a password reset, you can safely ignore
                            this email. Your password will not be changed.
                        </Text>

                        <Hr style={divider} />

                        <Text style={footer}>
                            This code is valid for 10 minutes and can only be used once.
                            <br />
                            © {new Date().getFullYear()} MIRA. All rights reserved.
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

export default EmailResetPassword;

const main: React.CSSProperties = {
    backgroundColor: "#f6f9fc",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
};

const container: React.CSSProperties = {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    padding: "20px 0 48px",
    marginBottom: "64px",
    maxWidth: "560px",
    borderRadius: "8px",
};

const header: React.CSSProperties = {
    background: "linear-gradient(135deg, #0d5f55, #14b8a6)",
    padding: "32px 24px",
    borderRadius: "8px 8px 0 0",
    textAlign: "center",
};

const heading: React.CSSProperties = {
    fontSize: "28px",
    fontWeight: "800",
    color: "#ffffff",
    margin: "0",
    letterSpacing: "-0.5px",
};

const content: React.CSSProperties = {
    padding: "32px 40px",
};

const subHeading: React.CSSProperties = {
    fontSize: "20px",
    fontWeight: "700",
    color: "#0d5f55",
    marginBottom: "16px",
};

const paragraph: React.CSSProperties = {
    fontSize: "15px",
    lineHeight: "1.6",
    color: "#4a5568",
    margin: "0 0 16px",
};

const otpContainer: React.CSSProperties = {
    background: "#f0fdfb",
    border: "2px dashed #14b8a6",
    borderRadius: "12px",
    padding: "24px",
    textAlign: "center",
    margin: "24px 0",
};

const otpCode: React.CSSProperties = {
    fontSize: "42px",
    fontWeight: "800",
    letterSpacing: "12px",
    color: "#0d5f55",
    margin: "0",
};

const divider: React.CSSProperties = {
    borderColor: "#e2e8f0",
    margin: "24px 0",
};

const footer: React.CSSProperties = {
    fontSize: "12px",
    color: "#a0aec0",
    lineHeight: "1.5",
    textAlign: "center",
};
