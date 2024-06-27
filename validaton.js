const { readCsvFile } = require("./readCsv");
const path = require("path");
const filepath = path.resolve(
  path.resolve(),
  "data",
  "GameForTest223_N_202406271413.csv"
);
const { symbolAmount, multi, AgtvAmount, config } = require("./symbolAmount");

doFunction = async () => {
  try {
    const { data } = await readCsvFile(filepath);
    // console.log("data :", data);
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
  let incorrectAccAmountList = [];
  rows.forEach((row) => {
    //validate game-1 pattern
    let isGame_1PatternMatched = validateGame1Pattern(row);
    //store amount of game-1
    let game_1_amt = 0;
    if (isGame_1PatternMatched) {
      game_1_amt = parseInt(symbolAmount[row.g1_prize_symbol]);
    }
    //store mul of game-1 pattern
    let mul = 1;
    if (isGame_1PatternMatched && Object.keys(multi).includes(row.multi)) {
      mul = multi[row.multi];
    }
    //multiply the amount of game -1 with multiplier
    game_1_amt *= mul;
    //validate game-2 pattern
    let isGame_2PatternMatched = validateGame2Pattern(row);
    //store amount of game-2
    let game_2_accAmt = 0;
    if (isGame_2PatternMatched) {
      game_2_accAmt = calculateGame2PatternAmt(row);
    }
    //sum two games
    let accAmt = game_1_amt + game_2_accAmt;
    //compare accumulated amount of game-1 and game-2 with the agtv code
    if ((parseInt(AgtvAmount[row.agtvc]) || 0) !== accAmt) {
      incorrectAccAmountList.push({
        ticket: row.ticket_no_str,
        agtvc: row.agtvc,
        expectedAmount: AgtvAmount[row.agtvc] || 0,
        game_1_Amt: game_1_amt / mul,
        mul: row.multi,
        game_1AmtWithMulti: game_1_amt,
        game_2Amt: game_2_accAmt,
        accAmount: accAmt,
      });
    }
  });
  return incorrectAccAmountList;
};

//validate game-1 pattern
const validateGame1Pattern = (row) => {
  if (
    (row.g1_symbol_1 == row.g1_symbol_2 &&
      row.g1_symbol_1 == row.g1_symbol_3) ||
    (row.g1_symbol_1 == row.g1_symbol_2 && row.g1_symbol_2 == row.g1_symbol_3)
  ) {
    return true;
  } else {
    return false;
  }
};

const validateGame2Pattern = (row) => {
  let flag = false;
  for (let w = 1; w <= config.game_2.total_win_number; w++) {
    for (let y = 1; y <= config.game_2.total_your_number; y++) {
      if (parseInt(row[`wnumber_${w}`]) == parseInt(row[`ynumber_${y}`])) {
        flag = true;
        break;
      }
    }
  }
  return flag;
};

const calculateGame2PatternAmt = (row) => {
  let accAmt = 0;
  for (let w = 1; w <= config.game_2.total_win_number; w++) {
    let amt = 0;
    for (let y = 1; y <= config.game_2.total_your_number; y++) {
      if (parseInt(row[`ynumber_${y}`]) == parseInt(row[`wnumber_${w}`])) {
        amt = symbolAmount[row[`symbol_${y}`]];
      }
    }
    accAmt += amt;
  }
  return accAmt;
};
