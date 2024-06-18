const csv = require("csv-parser");
const fs = require("fs");
const readCsvFile = (filepath) => {
  let csvHeaders = [];
  let csvData = [];
  let count = 0;
  return new Promise((resolve, reject) => {
    fs.createReadStream(filepath)
      .pipe(csv({ saparator: "," }))
      .on("headers", (header) => {
        csvHeaders.push(header);
      })
      .on("data", (row) => {
        if (count < 2) {
          csvData.push(row);
        }
        count++;
      })
      .on("end", () => {
        resolve({ headers: csvHeaders, data: csvData });
      });
  });
};

module.exports = { readCsvFile };
