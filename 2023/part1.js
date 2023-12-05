const mapNumbers = {
  'one': 1,
  'two': 2,
  'three': 3,
  'four': 4,
  'five': 5,
  'six': 6,
  'seven': 7,
  'eight': 8,
  'nine': 9
}

const regex = /(?=(one|two|three|four|five|six|seven|eight|nine))/gi;

const replaceCharNumber = x => {
  return x.replace(regex, function(match, ...rest) {
    const found = rest[0]
    return mapNumbers[found];
  })
}

const parse = x => parseInt(x, 10)
const getChars = (x) => x.match(/\d/g);
const takeFirstAndLast = x => {
  return x.length === 1 ? x.concat(x) : [x[0], x[x.length - 1]];
}
const makeInt = x => x.map(parse)
const calculate = (total, item) => total + item;
const joinNumbers = x => x.join('');

const getCalibrationInput = x => {
  return x.split('\n')
   .map(replaceCharNumber)
   .map(getChars)
   .map(takeFirstAndLast)
   .map(joinNumbers)
   .map(parse)
   .reduce(calculate, 0)
}

