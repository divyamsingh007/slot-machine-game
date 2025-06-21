// 1. Deposit the money
// 2. Determine the number of slots
// 3. Collct the bet amount
// 4. Spin the slots
// 5. Check the outcome
// 6. Give the winning/losing
// 7. Play again

const prompt = require("prompt-sync")();

const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
  A: 2,
  B: 4,
  C: 6,
  D: 8,
};

const SYMBOLS_VALUE = {
  A: 5,
  B: 4,
  C: 3,
  D: 2,
};

const deposit = () => {
  while (true) {
    const depositAmt = parseFloat(prompt("Enter a deposit amount: "));

    if (isNaN(depositAmt) || depositAmt <= 0) {
      console.log("Enter correct amount.");
    } else {
      console.log(`You have deposited ${depositAmt}.`);
      return depositAmt;
    }
  }
};

const getNumberOfLines = () => {
  while (true) {
    const numberOfLines = parseFloat(
      prompt("Enter the number of lines to bet on: ")
    );

    if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3) {
      console.log("Enter correct value.");
    } else {
      console.log(`You are betting on ${numberOfLines} lines.`);
      return numberOfLines;
    }
  }
};

const getBet = (balance, lines) => {
  while (true) {
    const betAmt = prompt("Enter the Bet Amount per line: ");
    if (betAmt <= balance / lines && betAmt > 0) {
      console.log(`Your total bet amount is ${betAmt * lines}`);
      balance -= betAmt * lines;
      console.log(`Your remaining balance is ${balance}`);
      return betAmt;
    } else {
      console.log(
        `Enter correct value! (It should not exceed your current balance of ${balance} by ${lines} lines.)`
      );
    }
  }
};

const spin = () => {
  const symbols = [];
  for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
    for (let i = 0; i < count; i++) {
      symbols.push(symbol);
    }
  }
  //   console.log(symbols);
  const reels = [];
  for (let i = 0; i < COLS; i++) {
    reels.push([]);
    const reelSymbols = [...symbols];
    for (let j = 0; j < ROWS; j++) {
      const randomIndex = Math.floor(Math.random() * reelSymbols.length);
      const selectedSymbol = reelSymbols[randomIndex];
      reels[i].push(selectedSymbol);
      reelSymbols.splice(randomIndex, 1);
    }
  }
  return reels;
};

const transpose = (reels) => {
  const rows = [];
  for (let i = 0; i < ROWS; i++) {
    rows.push([]);
    for (let j = 0; j < COLS; j++) {
      rows[i].push(reels[j][i]);
    }
  }
  return rows;
};

const printRows = (rows) => {
  for (const row of rows) {
    console.log(row.join(" | "));
  }
};

const checkWin = (rows, bet, lines) => {
  let win = 0;

  for (let i = 0; i < lines; i++) {
    const symbols = rows[i];
    let allSame = true;

    for (const symbol of symbols) {
      if (symbol != symbols[0]) {
        allSame = false;
        break;
      }
    }
    if (allSame) {
      win += SYMBOLS_VALUE[symbols[0]] * bet;
      balance += win;
    }
  }
  return win;
};

const Game = () => {
  let balance = deposit();
  while (true) {
    const numberOfLines = getNumberOfLines();
    const betAmt = getBet(balance, numberOfLines);
    balance -= betAmt * numberOfLines;
    const reels = spin();
    const rows = transpose(reels);
    printRows(rows);
    const winAmt = checkWin(rows, betAmt, numberOfLines);
    balance += winAmt;
    console.log(`You have won ${winAmt}.`);

    if (balance <= 0) {
      console.log("You have no balance left. Game Over!");
      break;
    }
    const playAgain = prompt("Do you want to play again? (y/n): ");
    if (playAgain.toLowerCase() !== "y") {
      console.log("Thanks for playing! Your final balance is: " + balance);
      break;
    }
  }
};

Game();
