import { string } from "zod";
import type { BookResponse } from "../models/book.model.js";
import transporter from "../config/mailer.js";

export const sendBookCreationMail = async (input: {
  to: string;
  book: BookResponse;
}): Promise<void> => {
  const { to, book } = input;

  const attachments: { filename: string; path: string }[] = [];
  if (book.file_url) {
    const ext = book.file_url.split(".").pop()?.split("?")[0] ?? "jpg";
    attachments.push({
      filename: `${book.title}.${ext}`,
      path: book.file_url, // Nodemailer fetches the URL and attaches it
    });
  }

  const html = buildBookCreatedHtml(book);

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: `New Book Added: ${book.title}`,
    html,
    attachments,
  });
};

const buildBookCreatedHtml = (book: BookResponse): string => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>New Book Added</title>
    </head>
    <body style="margin:0; padding:0; background-color:#f4f4f5; font-family: Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5; padding: 40px 0;">
        <tr>
          <td align="center">
            <table width="560" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px; overflow:hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
              
              <!-- Header -->
              <tr>
                <td style="background-color:#18181b; padding: 24px 32px;">
                  <p style="margin:0; color:#ffffff; font-size:20px; font-weight:bold;">📚 Library Management System</p>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding: 32px;">
                  <p style="margin: 0 0 8px 0; color:#71717a; font-size:13px; text-transform:uppercase; letter-spacing:0.05em;">New Book Added</p>
                  <h1 style="margin: 0 0 24px 0; color:#18181b; font-size:24px;">${book.title}</h1>

                  <!-- Book details table -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e4e4e7; border-radius:6px; overflow:hidden;">
                    <tr style="background-color:#f4f4f5;">
                      <td style="padding:12px 16px; color:#71717a; font-size:13px; width:120px;">Author</td>
                      <td style="padding:12px 16px; color:#18181b; font-size:14px; font-weight:500;">${book.author}</td>
                    </tr>
                    <tr>
                      <td style="padding:12px 16px; color:#71717a; font-size:13px; border-top:1px solid #e4e4e7;">ISBN</td>
                      <td style="padding:12px 16px; color:#18181b; font-size:14px; font-family:monospace; border-top:1px solid #e4e4e7;">${book.isbn}</td>
                    </tr>
                    <tr style="background-color:#f4f4f5;">
                      <td style="padding:12px 16px; color:#71717a; font-size:13px; border-top:1px solid #e4e4e7;">Added On</td>
                      <td style="padding:12px 16px; color:#18181b; font-size:14px; border-top:1px solid #e4e4e7;">${new Date(book.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</td>
                    </tr>
                  </table>

                  ${
                    book.file_url
                      ? `
                  <p style="margin: 24px 0 8px 0; color:#71717a; font-size:13px;">Cover image is attached to this email.</p>
                  `
                      : ""
                  }

                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color:#f4f4f5; padding:16px 32px; border-top:1px solid #e4e4e7;">
                  <p style="margin:0; color:#a1a1aa; font-size:12px;">This is an automated notification from the Library Management System.</p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};
