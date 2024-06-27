const csv = require("csv-parser");
const fs = require("fs");
const { counterConfig } = require("./symbolAmount");
let { isCounterEnable, count, countLimit } = counterConfig;
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
        if (isCounterEnable && count < countLimit) {
          csvData.push(row);
        } else if (!isCounterEnable) {
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
