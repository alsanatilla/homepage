import * as React from "react";

interface EmailTemplateProps {
  name: string;
  email: string;
  message: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  name,
  email,
  message,
}) => (
  <div
    style={{
      fontFamily: "Arial, sans-serif",
      color: "#333333",
      maxWidth: "600px",
      margin: "0 auto",
      padding: "20px",
      backgroundColor: "#f7f7f7",
      borderRadius: "10px",
    }}
  >
    <table cellPadding="0" cellSpacing="0" style={{ width: "100%" }}>
      <tr>
        <td
          style={{
            backgroundColor: "#4a90e2",
            padding: "20px",
            textAlign: "center",
            borderRadius: "10px 10px 0 0",
          }}
        >
          <h1
            style={{
              color: "#ffffff",
              fontSize: "24px",
              margin: "0",
            }}
          >
            New Contact Form Submission
          </h1>
        </td>
      </tr>
      <tr>
        <td
          style={{
            backgroundColor: "#ffffff",
            padding: "20px",
            borderRadius: "0 0 10px 10px",
          }}
        >
          <p
            style={{
              fontSize: "16px",
              lineHeight: "1.5",
              marginBottom: "15px",
            }}
          >
            You've received a new message from your website's contact form:
          </p>
          <table
            cellPadding="0"
            cellSpacing="0"
            style={{ width: "100%", marginBottom: "15px" }}
          >
            <tr>
              <td
                style={{
                  padding: "10px",
                  backgroundColor: "#f0f0f0",
                  fontWeight: "bold",
                }}
              >
                Name:
              </td>
              <td style={{ padding: "10px", backgroundColor: "#f9f9f9" }}>
                {name}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  padding: "10px",
                  backgroundColor: "#f0f0f0",
                  fontWeight: "bold",
                }}
              >
                Email:
              </td>
              <td style={{ padding: "10px", backgroundColor: "#f9f9f9" }}>
                {email}
              </td>
            </tr>
          </table>
          <p
            style={{
              fontSize: "16px",
              lineHeight: "1.5",
              marginBottom: "15px",
            }}
          >
            <strong>Message:</strong>
          </p>
          <div
            style={{
              backgroundColor: "#f9f9f9",
              padding: "15px",
              borderRadius: "5px",
              fontSize: "16px",
              lineHeight: "1.5",
            }}
          >
            {message}
          </div>
        </td>
      </tr>
      <tr>
        <td style={{ textAlign: "center", padding: "20px" }}>
          <p style={{ fontSize: "14px", color: "#888888", margin: "0" }}>
            This is an automated email. Please do not reply directly to this
            message.
          </p>
        </td>
      </tr>
    </table>
  </div>
);
