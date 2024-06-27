const symbolAmount = {
  A: 500,
  B: 1500,
  C: 7500,
  D: 15000,
  E: 150000,
  F: 300000,
  G: 1000000,
};
const multi = {
  "2X": 2,
  "5X": 5,
  "0X": 1,
  "1X": 1,
  "10X": 10,
  "3X": 3,
};
const AgtvAmount = {
  AAA: 500,
  BBB: 1500,
  CCC: 7500,
  DDD: 15000,
  EEE: 150000,
  FFF: 300000,
  GGG: 1000000,
};
const config = {
  game_1: {},
  game_2: {
    total_win_number: 5,
    total_your_number: 15,
    total_symbol: 15,
  },
};
const counterConfig = { isCounterEnable:false, count:0, countLimit: 2};

module.exports = { symbolAmount, multi, AgtvAmount, config,counterConfig };
