const readline = require('readline');
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);


function getRankinDiceGame() {
  const getInput = process.argv;
  const N = getInput[2];
  const M = getInput[3];
  const playerObj = [];
  const randomOrder = randomInteger(N);
  for (let i = 0; i < N; i++) {
    playerObj.push({name: `Player-${i+1}`,order: randomOrder[i], pointsRemaining: +M, currentRollPoint: 0, previousRollPoint: 0});
  }
  /**
   * Assign random order in which player will play
   */
  let sortPlayerByOrder = sortPlayer(playerObj, 'order');
  playGame(sortPlayerByOrder);
}

function playGame(sortPlayerByOrder) {
  const rank = [];
  let countOf1 = 0;
  console.log(`${sortPlayerByOrder[0].name} turn`);
  /**
   * Press r for player turn
   */
  process.stdin.on('keypress', (str, key) => {
    if (key.ctrl && key.name === 'r') {
      /**
       * Once all player will complete there game and if that is the last
       * player there rank will be last.
       */
      if (sortPlayerByOrder.length === 1) {
        rank.push(sortPlayerByOrder[0]);
        console.log('rank', rank);
        process.exit();
      }
      /** 
       * Roll dice by player.
      */
      const point = rollDice(6, 1);
      console.log('point', point);
      const stack = sortPlayerByOrder.shift();
      console.log(`${stack.name} turn`);
      console.log('Press ctrl+r to roll the dice');
      stack.previousRollPoint = stack.currentRollPoint;
      stack.currentRollPoint = point;
      const previousPoint = stack.pointsRemaining;
      /**
       * If player get consecutive 1 then don't subtract previous point.
       */
      if (stack.currentRollPoint !== 1 && stack.previousRollPoint !== 1) {
        stack.pointsRemaining -= point;
      }
      // if (stack.pointsRemaining < 0 ) {
      //   stack.pointsRemaining = previousPoint;
      // }
      if (stack.pointsRemaining > 0) {
        /**
         * If player gets 6 then the same player will
         * roll the dice again.
         */
        if (point === 6) {
          sortPlayerByOrder.unshift(stack);
        } else {
          sortPlayerByOrder.push(stack);
        }
      }
      /** If any player gets atleast M Points get the rank of that player */

      if (stack.pointsRemaining <= 0){
        rank.push(stack);
        sortPlayerByOrder = sortPlayerByOrder.filter(player => player.order !== stack.order);
      }
      console.log(stack.pointsRemaining);
      console.log('----rank after every dice roll----start-------');
      console.log(sortPlayer([...sortPlayerByOrder, ...rank], 'pointsRemaining'))
      console.log('----rank after every dice roll----end-------');
    }

    if (key.ctrl && key.name === 'c') {
      console.log(`Press c to quit the game`);
      process.exit();
    }
  });
}

function randomInteger(N) {
  var arr = [];
  while(arr.length < N){
      var r = Math.floor(Math.random() * N) + 1;
      if(arr.indexOf(r) === -1) arr.push(r);
  }
  return arr;
}

function sortPlayer(arr, key) {
  return arr.sort(function(a, b) {
    return a[key] - b[key];
  })
}

function rankPlayer(arr, key) {
  return arr.sort(function(a, b) {
    return b[key] - a[key];
  })
}

function rollDice(maximum, minimum) {
  return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
}



getRankinDiceGame();