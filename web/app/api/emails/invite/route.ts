import { EmailInvite } from "@/lib/email-templates/email-invite";
import { NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";
import { render } from "@react-email/render";

// Initialize SendGrid with the API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, name, role, department, tempPassword } = body;

        if (!email || !name) {
            return NextResponse.json(
                { error: "Email and name are required" },
                { status: 400 }
            );
        }

        // Render the React Email component to an HTML string
        const emailHtml = await render(
            EmailInvite({
                name,
                email,
                role,
                department,
                tempPassword,
            })
        );

        // Send the email using SendGrid
        const msg = {
            to: email,
            from: "sapioruiz27@gmail.com", // Change to your verified sender email in Sendgrid
            subject: "You have been invited to MIRA",
            html: emailHtml,
        };

        const response = await sgMail.send(msg);

        return NextResponse.json({ success: true, message: "Email sent" });
    } catch (error: any) {
        console.error("Error sending SendGrid invite email:", error);

        // SendGrid specific error handling
        if (error.response) {
            console.error(error.response.body);
        }

        return NextResponse.json(
            { error: "Failed to send email", details: error.message },
            { status: 500 }
        );
    }
}
