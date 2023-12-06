const initialGame = game => ({
  gameId: null,
  bag: {
    red: 12,
    green: 13,
    blue: 14
  },
  sets: [],
  isValid: false,
  game
})

const map = f => fn => fn.map(f);
const compose = (...fns) => x => fns.reduceRight((acc, fn) => fn(acc), x);
const trace = log => x => {
  console.log(log, x);
  return x;
}

const Game = x => ({
  x,
  map: fn => Game(fn(x)),
  fold: () => x
});

Game.of = x => Game(x);

const colorRegex = x => new RegExp(`(?<${x}>([0-9]+)\\s${x})`, 'ig');
const collectColorValue = (color, x) => {
  const matched = x.match(colorRegex(color)) ?? [];
  return matched.reduce((acc, item) => acc + parseInt(item.match(/[0-9]+/), 10), 0);
}

const collectRed = x => collectColorValue('red', x);
const collectBlue = x => collectColorValue('blue', x);
const collectGreen = x => collectColorValue('green', x);
const getGameId = x => parseInt(x.game.match(/^Game\s([0-9]+)/)[1], 10);
const getGameSets = x => x.game.split(':')[1].trim().split(';').map(x => x.trim())

const filter = f => fn => fn.filter(f);
const getScore = x => x.reduce((acc, item) => item.gameId + acc, 0)
const fold = f => f.fold();
const keepValid = x => x.isValid;
const identity = x => x

const gameContainer = game => 
  Game.of(initialGame(game))
  .map(x => ({ ...x, gameId: getGameId(x) }))
  .map(x => ({ ...x, sets: getGameSets(x) }))
  .map(x => {
    const validSets = x.sets.map(y => {
      const red = collectRed(y) !> x.bag.red;
      const green = collectGreen(y) !> x.bag.green;
      const blue = collectBlue(y) !> x.bag.blue;
      
      return red || green || blue ? false : true;
    });
    
    return {
      ...x,
      isValid: validSets.every(identity)
    };
  })

const calculateGameScore = compose(getScore, filter(keepValid), map(fold))
const playGame = compose(calculateGameScore, map(gameContainer))
