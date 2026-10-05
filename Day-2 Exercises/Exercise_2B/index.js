/*
1. Use employees.csv file to extract informations (You can find the csv file in training folder)
2. Read the CSV file which contains the data of employees.
3. Filter all the records where JOB_ID is IT_PROG.
4. Write all the filtered data in output.txt file.
5. Write the async version of the readFileSync to practices its asychronous function.
*/

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'employees.csv')
const outputFilePath = path.join(__dirname, 'output.txt')

fs.readFile(filePath, 'utf-8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  
  const rows = data.trim().split("\n");
  const headers = rows[0].split(",");
  const idx = headers.indexOf('JOB_ID');
  
  const filteredRows = rows.filter((row, index) => {
    if (index === 0) {
      return false;
    }

    const columns = row.split(",");

    return columns[idx] === 'IT_PROG';
  });

  const outputData = [headers.join(","), ...filteredRows].join("\n");

  fs.writeFile(outputFilePath, outputData, 'utf-8', (err) => {
    if (err) {
      console.log(err);
      return;
    }

    console.log(`Filtered Data written successfully in ${outputFilePath}`);
  })
  
});
