import ExcelJS from "exceljs";
import type { Student } from "../models/student.model.js";
import PDFDocument from "pdfkit";

const STUDENT_EXPORT_COLUMNS = [
  { key: "id", header: "ID", width: 8 },
  { key: "student_name", header: "STUDENT NAME", width: 25 },
  { key: "roll_no", header: "ROLL NO.", width: 18 },
  { key: "phone", header: "PHONE", width: 18 },
  { key: "country", header: "COUNTRY", width: 18 },
  { key: "state", header: "STATE", width: 18 },
  { key: "city", header: "CITY", width: 18 },
  { key: "created_at", header: "CREATED AT", width: 20 },
];

export const generateCsv = (students: Student[]): Buffer => {
  const headers = STUDENT_EXPORT_COLUMNS.map((col) => col.header).join(",");

  const rows = students.map((student) =>
    [
      student.id,
      `"${student.student_name}"`,
      `"${student.roll_no}"`,
      `"${student.phone}"`,
      `"${student.country}"`,
      `"${student.state}"`,
      `"${student.city}"`,
      `"${new Date(student.created_at).toLocaleDateString()}"`,
    ].join(","),
  );

  const csv = [headers, ...rows].join("\n");
  return Buffer.from(csv, "utf8");
};

export const generateExcel = async (students: Student[]): Promise<Buffer> => {
  const workBook = new ExcelJS.Workbook();
  workBook.creator = "LMS System";
  workBook.created = new Date();

  const sheet = workBook.addWorksheet("Students");

  sheet.columns = STUDENT_EXPORT_COLUMNS.map((col) => ({
    header: col.header,
    key: col.key,
    width: col.width,
  }));

  // Header
  sheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF18181B" },
    };
    cell.alignment = { vertical: "middle", horizontal: "center" };
  });

  sheet.getRow(1).height = 20;

  // Add data
  students.forEach((student) => {
    sheet.addRow({
      id: student.id,
      student_name: student.student_name,
      roll_no: student.roll_no,
      phone: student.phone,
      country: student.country,
      state: student.state,
      city: student.city,
      created_at: new Date(student.created_at).toLocaleDateString(),
    });
  });

  // Alternate row colors
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1) {
      row.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: rowNumber % 2 === 0 ? "FFF4F4F5" : "FFFFFFFF" },
        };
      });
    }
  });

  const arrayBuffer = await workBook.xlsx.writeBuffer();
  return Buffer.from(arrayBuffer);
};

export const generatePdf = async (students: Student[]): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      margin: 40,
      size: "A4",
      layout: "landscape",
    });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    // Title
    doc
      .fontSize(18)
      .font("Helvetica-Bold")
      .text("Student List", { align: "center" });
    doc
      .fontSize(10)
      .font("Helvetica")
      .fillColor("#71717a")
      .text(
        `Exported on ${new Date().toLocaleDateString()} · Total: ${students.length} students`,
        { align: "center" },
      );
    doc.moveDown(1.5);

    // Table headers
    const colWidths = [40, 140, 90, 100, 90, 90, 90, 90];
    const headers = [
      "ID",
      "Student Name",
      "Roll No",
      "Phone",
      "Country",
      "State",
      "City",
      "Created At",
    ];
    const startX = 40;
    let y = doc.y;

    // Header background
    doc
      .rect(
        startX,
        y,
        colWidths.reduce((a, b) => a + b, 0),
        20,
      )
      .fill("#18181b");

    // Header text
    doc.fillColor("#ffffff").fontSize(9).font("Helvetica-Bold");
    let x = startX;
    headers.forEach((h, i) => {
      doc.text(h, x + 4, y + 5, { width: colWidths[i] - 8, ellipsis: true });
      x += colWidths[i];
    });
    y += 20;

    // Data rows
    doc.fontSize(8).font("Helvetica");
    students.forEach((s, index) => {
      const rowData = [
        String(s.id),
        s.student_name,
        s.roll_no,
        s.phone,
        s.country,
        s.state,
        s.city,
        new Date(s.created_at).toLocaleDateString(),
      ];

      // Alternate row background
      if (index % 2 === 0) {
        doc
          .rect(
            startX,
            y,
            colWidths.reduce((a, b) => a + b, 0),
            18,
          )
          .fill("#f4f4f5");
      }

      doc.fillColor("#18181b");
      x = startX;
      rowData.forEach((val, i) => {
        doc.text(val, x + 4, y + 4, {
          width: colWidths[i] - 8,
          ellipsis: true,
        });
        x += colWidths[i];
      });
      y += 18;

      // Add new page if running out of space
      if (y > doc.page.height - 60) {
        doc.addPage();
        y = 40;
      }
    });

    doc.end();
  });
};
