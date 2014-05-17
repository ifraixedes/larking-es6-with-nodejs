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

function *genSyncIterator(start, end) {
  yield * {
    counter: start,
    next: function () {
      if (this.counter >= end) {
        return {done: true, value: undefined}; 
      }

      return {value: this.counter++, done: false };
    }
  };
}

function *genSyncComposer(start, end, step) {
  var gen1 = new genSync1(end);

  for (let value of gen1) {
    yield * new genSync2(value, end, step);
  }
}

function *genSyncComposerIterator(start, end) {
  var gen1 = new genSync1(end);

  for (let value of gen1) {
    yield * new genSyncIterator(value, end);
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

results = [];
var gComposerIterator = new genSyncComposerIterator(0, 3);

for (let val of gComposerIterator) {
  results.push(val);
}

console.log(results); // [0, 1, 2, 1, 2, 2]
