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
    const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}`;

    return (
        <Html>
        <Head />
        < Preview > You have been invited to join MIRA! </Preview>
            < Body style = { main } >
                <Container style={ container }>
                    <Heading style={ heading }> Welcome to MIRA </Heading>

                        < Text style = { paragraph } > Hello { name }, </Text>
                            < Text style = { paragraph } >
                                You have been invited to join the MIRA platform by your administrator.
            Your account has been set up with the following details:
    </Text>

        < Section style = { detailsContainer } >
            <Text style={ detailItem }>
                <strong>Email: </strong> {email}
                    </Text>
                    < Text style = { detailItem } >
                        <strong>Role: </strong> {role}
                            </Text>
                            < Text style = { detailItem } >
                                <strong>Department: </strong> {department}
                                    </Text>
                                    < Text style = { detailItem } >
                                        <strong>Temporary Password: </strong>{" "}
                                            < span style = { passwordBox } > { tempPassword } </span>
                                                </Text>
                                                </Section>

                                                < Text style = { paragraph } >
                                                    Please use your temporary password to log in.You will be prompted to
            change this password upon your first successful login(if implemented).
          </Text>

        < Section style = { btnContainer } >
            <Button style={ button } href = { loginUrl } >
                Log in to MIRA
                    </Button>
                    </Section>

                    < Hr style = { hr } />

                        <Text style={ footer }>
                            This invitation was sent from the MIRA Admin system.If you believe this
            is a mistake, please disregard this email.
          </Text>
        </Container>
        </Body>
        </Html>
  );
};

export default EmailInvite;

// Styling for the email
const main = {
    backgroundColor: "#f6f9fc",
    fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    padding: "20px 0 48px",
    marginBottom: "64px",
    borderRadius: "8px",
    border: "1px solid #e6ebf1",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
    maxWidth: "600px",
};

const heading = {
    fontSize: "24px",
    letterSpacing: "-0.5px",
    lineHeight: "1.3",
    fontWeight: "400",
    color: "#484848",
    padding: "17px 40px",
    margin: "0",
    borderBottom: "1px solid #e6ebf1",
    textAlign: "center" as const,
};

const paragraph = {
    margin: "0 0 15px",
    fontSize: "15px",
    lineHeight: "1.4",
    color: "#3c4149",
    padding: "0 40px",
};

const detailsContainer = {
    padding: "24px 40px",
    backgroundColor: "#f9fafb",
    borderRadius: "4px",
    margin: "20px 40px",
    border: "1px solid #e6ebf1",
};

const detailItem = {
    margin: "0 0 10px",
    fontSize: "15px",
    color: "#3c4149",
};

const passwordBox = {
    display: "inline-block",
    padding: "4px 8px",
    backgroundColor: "#e2e8f0",
    borderRadius: "4px",
    fontWeight: "bold",
    fontFamily: "monospace",
};

const btnContainer = {
    textAlign: "center" as const,
    marginTop: "32px",
    marginBottom: "32px",
};

const button = {
    backgroundColor: "#000000",
    borderRadius: "6px",
    color: "#fff",
    fontSize: "15px",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "inline-block",
    padding: "12px 24px",
    fontWeight: "600",
};

const hr = {
    borderColor: "#e6ebf1",
    margin: "20px 0",
};

const footer = {
    color: "#8898aa",
    fontSize: "12px",
    padding: "0 40px",
    lineHeight: "16px",
};
