var fs = require("fs");

const data = [
  { id: 1, name: "Harry Potter", author: "J.K. Rowling", price: 499 },
  { id: 2, name: "War, and Peace", author: "Tolstoy", price: null },
  { id: 3, name: 'The "Best" Book', author: "Anon", tags: ["a", "b"] },
  { id: 4, name: "Line\nBreak", author: "=SUM(A1:A2)" },
];

function escapeCsv(value) {
  if (value == null || value == undefined) {
    return '';
  }

  if (typeof value == 'object') {
    value = JSON.stringify(value);
  }

  value = String(value);
  
  value = value.replace(/\r\n|\r|\n/g, "\\n");

   // Prevent CSV/Excel formula injection
  if (/^[=+\-@]/.test(value)) {
    value = "'" + value;
  }

  // Escape quotes
  value = value.replace(/"/g, '""');

  // Wrap values containing comma, quote or newline in double quotes
  if (/[",\n\r]/.test(value)) {
    value = `"${value}"`;
  }

  return value;
}

try {

  fs.mkdir("test_data", { recursive: true }, (err) => {
    console.log("Entered callback: ");

    if (err) {
      console.log("Error while creating directory ", err.message);
      return;
    }

    console.log("Directory creation successful");

    if (data.length === 0) {
      console.log("No data to write");
      return;
    }

    const writeStream = fs.createWriteStream("test_data/data.csv");
    const headers = [...new Set(data.flatMap((item) => Object.keys(item)))];

    writeStream.write(`${headers.map(escapeCsv).join(',')}\n`);

    for (let i = 0; i < data.length; i++) {
      const row = headers.map(header => escapeCsv(data[i][header]));
      console.log(row)
      writeStream.write(`${row.join(",")}\n`);
    }

    writeStream.end();

    writeStream.on('finish', () => {
      console.log(`CSV File created successfully`);
    });

    writeStream.on('error', (error) => {
      console.log("Error occured during CSV file creation: ", error.message);
    })
  });

} catch (error) {
  console.log("Error in catch: ", error.message);
} finally {
  console.log("Finally block runs");
}
