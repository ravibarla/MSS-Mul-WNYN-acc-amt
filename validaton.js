const { readCsvFile } = require("./readCsv");
const path = require("path");
const filepath = path.resolve(
  path.resolve(),
  "data",
  "GameForTest223_202406181554.csv"
);
const { symbolAmount, multi, AgtvAmount } = require("./symbolAmount");
doFunction = async () => {
  try {
    const { data } = await readCsvFile(filepath);
    console.log("data :", data);
    const incorrectAccumulatedAmountValid =
      validateAccumulatedAmountValid(data);
    if (incorrectAccumulatedAmountValid.length !== 0) {
      console.log(
        "incorrect accumulated amount :",
        incorrectAccumulatedAmountValid
      );
    } else {
      console.log("correct accumulated amount");
    }
  } catch (err) {
    console.log(err);
  }
};
doFunction(filepath);

const validateAccumulatedAmountValid = (rows) => {
  let incorrectAccAmount = [];
  rows.forEach((row) => {
    let game1Amount = 0;
    let game1Mult = 1;
    let game2Amount = 0;
    //validate game -1 pattern
    const isGame1PaternValid = validateGame1Pattern(row);
    if (isGame1PaternValid) {
      // record game -1 amount
      game1Amount = parseFloat(symbolAmount[row.g1_prize_symbol]);
    }
    //check for multiplier
    if (isGame1PaternValid) {
      //record multiplier value
      const isGame1HavingMult = validateGame1Mult(
        row.g1_symbol_1,
        row.g1_symbol_4
      );
      if (isGame1HavingMult) {
        game1Mult = parseFloat(multi[row.multi]);
      }
    }

    const isGame2PaternValid = validateGame2Pattern(row);
    if (isGame2PaternValid) {
      game2Amount = parseFloat(symbolAmount[row.g2_prize_symbol]);
    }

    if (AgtvAmount[row.agtvc] !== game2Amount + game1Amount * game1Mult) {
      incorrectAccAmount.push({
        ticket: row.ticket_no_str,
        accAmt: game2Amount + game1Amount * game1Mult,
        expectedAmount: AgtvAmount[row.agtvc],
      });
    }
  });
  return incorrectAccAmount;
};

//validate game -1 pattern
const validateGame1Pattern = (row) => {
  if (
    row.g1_symbol_1 == row.g1_symbol_2 &&
    row.g1_symbol_1 == row.g1_symbol_3
  ) {
    return true;
  }
  return false;
};

//validate game-1 multiplier
const validateGame1Mult = (symbol, winningSymbol) => {
  if (symbol == winningSymbol) {
    return true;
  }
  return false;
};

//validate game-2 pattern
const validateGame2Pattern = (row) => {
  if (
    row.g2_symbol_1 == row.g2_symbol_2 &&
    row.g2_symbol_1 == row.g2_symbol_3
  ) {
    return true;
  }
  return false;
};
