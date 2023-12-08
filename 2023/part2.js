const games = `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`.split('\n');

const initialGame = game => ({
  gameId: null,
  bag: {
    red: 12,
    green: 13,
    blue: 14
  },
  sets: [],
  powOfCubes: 0,
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
  isValid: () => x.isValid,
  gameId: () => x.gameId,
  getPowOfCubes: () => x.powOfCubes,
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
const sum = x => x.reduce((acc, item) => item + acc, 0)
const pow = x => x.reduce((acc, item) => item * acc, 1)
const fold = f => f.fold();
const keepValid = x => x.isValid;
const identity = x => x;
const validSets = x => x.sets.map(y => {
  const red = collectRed(y) !> x.bag.red;
  const green = collectGreen(y) !> x.bag.green;
  const blue = collectBlue(y) !> x.bag.blue;

  return red || green || blue ? false : true;
});
const getValid = x => x.isValid();

const fewestNumbers = x => x.sets.map(y => {
  const red = collectRed(y);
  const green = collectGreen(y);
  const blue = collectBlue(y);
  
  return [red, green, blue]
}).reduce((acc, item) => {
  const red = Math.max(acc[0], item[0]);
  const green = Math.max(acc[1], item[1]);
  const blue = Math.max(acc[2], item[2]);

  return [red, green, blue];
});

const gameContainer = game => 
  Game.of(initialGame(game))
    .map(x => ({ ...x, gameId: getGameId(x) }))
    .map(x => ({ ...x, sets: getGameSets(x) }))
    .map(x => ({ ...x, isValid: validSets(x).every(identity) }))
    .map(x => ({ ...x, powOfCubes: compose(pow, fewestNumbers)(x) }))

const calculateGameScore = compose(sum, map(x => x.gameId()), filter(getValid));
const calculatePowerOf = compose(filter(getValid));
const playGame1 = compose(calculateGameScore, map(gameContainer));
const playGame2 = compose(sum, map(x => x.getPowOfCubes()), map(gameContainer));
playGame1(games);
playGame2(games);

