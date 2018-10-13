// support functions

// returns n where min <= n <= max
const rand = (min, max) => {
  min--;
  const range = max - min;
  const ret = Math.ceil(Math.random() * range) + min;

  return ret;
};

const sleep = sec => new Promise(rs => setTimeout(rs, sec * 1000));

const faces = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

// dice

// most simple implementation
const d0 = () => Math.ceil(Math.random() * 6);

// using support function
const d1 = () => rand(1, 6);

// display dice faces
const d2 = () => faces[rand(0, 5)];

// reel
const d3 = async () => {
  let count = rand(2, 8);

  while (count--) {
    let result = d1();
    console.log(result);

    if (count == 0) {
      console.log(`result is ${result} !`);
      return;
    }
    await sleep(1);
  }
};

d3();
