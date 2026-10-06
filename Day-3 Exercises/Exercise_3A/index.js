/*
1. Use employees.csv file to extract informations
2. Read the CSV file line by line which contains the data of employees using stream.
3. Filter all the records where SALARY > 10000.
4. Return the filter data as response using stream.
Learn about Transform stream, check a way to verify if the data is actually sent via stream.
*/

const http = require('http');
const fs = require('fs');
const { Transform } = require('stream');
const path = require('path');

const filePath = path.join(__dirname, 'employees.csv');
const outputFilePath = path.join(__dirname, 'output.txt');

const readStream = fs.createReadStream(filePath, {
  encoding: 'utf-8',
  highWaterMark: 50
});

const writeStream = fs.createWriteStream(outputFilePath);

let chunkedData = "";
let isHeader = true;

const filterTransform = new Transform({
  transform(chunk, encoding, callback) {

    console.log(`Transform chunk received: ${chunk}`);

    chunkedData += chunk;

    const lines = chunkedData.split("\n");
    chunkedData = lines.pop(); // take incomplete lines for next chunk

    for(const line of lines) {
      const trimmedLine = line.trim();

      if(!trimmedLine) continue;

      if (isHeader) {
        this.push(trimmedLine + "\n");
        isHeader = false;
        continue;
      }

      const columns = trimmedLine.split(",");
      const salary = Number(columns[6]);

      if (salary > 10000) {
        console.log(`Writing filtered lines: ${trimmedLine}`);
        this.push(trimmedLine + "\n");
      }
    }
    callback();
  },
  flush(callback) {

    if (chunkedData.trim()) {
      const trimmedLine = chunkedData.trim();

      const columns = trimmedLine.split(',');
      const salary = Number(columns[6]);

      if (salary > 10000) {
        this.push(trimmedLine + "\n");
      }
    }

    callback();
  }
});

readStream.pipe(filterTransform).pipe(writeStream);

writeStream.on('finish', () => {
  console.log(`Writing finished to ${outputFilePath}`);
})