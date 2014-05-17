'use strict';

function *genSync1(max) {
 for(let n = 0; n < max; n++) {
   yield  n;
 }
}

function *genSync2(start, end, step) {
  for (let n = start; n < end; n += step) {
    yield n;
  }
}

function *genSyncComposer(start, end, step) {
  var gen1 = new genSync1(end);

  for (let value of gen1) {
    yield * new genSync2(value, end, step);
  }
}



var results = [];
var gSync1 = new genSync1(3);

for (let val of gSync1) {
  results.push(val);
}

console.log(results); // [0, 1, 2]

results = [];
var gComposer = new genSyncComposer(0, 3, 1);

for (let val of gComposer) {
  results.push(val);
}

console.log(results); // [0, 1, 2, 1, 2, 2]