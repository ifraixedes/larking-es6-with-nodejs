'use strict';

// Generators definitions
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

function *genThrowExceptionWhenRandomNumberIsLessThan(bottom) {
  while (true) {
    let rNum;
    if ((rNum = Math.random()) > bottom) {
      try {
        yield rNum;
      } catch (e) {
        throw new Error('Received an external error. Error: ' + e.message);
      }
    } else {
      throw new Error('Random number ' + rNum  + ' is less than ' + bottom);
    }
  }
}


function *genCallYieldOnceAfterError() {
  var error;
  while (true) {
    try {
      yield 'More';
    } catch (e) {
      error = e;
      break;
    }
  }

  // It is executed but generator function doesn't yield more
  // values due the generator object has been stopped when
  // an error is thrown
  console.log('After %s, geneator follows', error.message);
  yield 'Last time';
}

// Generators execution
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

results = [];

try {
  for (let val of genThrowExceptionWhenRandomNumberIsLessThan(0.3)) {
    results.push(val);
  }
} catch (e) {
  console.log('genThrowExeption generator produced [%s] before it throws error: %s', results, e.message);
}

try {
  let domain = require('domain').create();
  let gen = genThrowExceptionWhenRandomNumberIsLessThan(0.3);

  domain.on('error', console.log);
  domain.add(gen);
  domain.run(function () {
    setImmediate(function runAgain() {
      var randomNumGen = gen.next();

      console.log('Asynchronous random number: %s', randomNumGen.value);
      setImmediate(runAgain);
    });
  });
} catch (e) {
  // The execution never falls here, the error is thrown in a future event loop execution
  console.log('IT MUST NOT BE CALLED!!! Error details: ' + e.message);
}

try {
  let domain = require('domain').create();
  //Never it throws an error from itself
  let gen = genThrowExceptionWhenRandomNumberIsLessThan(0);

  domain.on('error', console.log);
  domain.add(gen);
  domain.run(function () {
    var counter = 0;
    setImmediate(function runAgain() {
      var randomNumGen;

      if (counter >= 5) {
        gen.throw(new Error('Counter reached 5'));
      }

      randomNumGen = gen.next();

      counter++;
      console.log('Asynchronous random number: %s', randomNumGen.value);
      setImmediate(runAgain);
    });
  });
} catch (e) {
  // The execution never falls here, the error is thrown in a future event loop execution
  console.log('IT MUST NOT BE CALLED!!! Error details: ' + e.message);
}


try {
  let domain = require('domain').create();
  let gen = genCallYieldOnceAfterError();

  domain.on('error', console.log);
  domain.add(gen);
  domain.run(function () {
    var counter = 0;
    setImmediate(function runAgain() {
      var genMsg;

      if (counter >= 2) {
        try {
          gen.throw(new Error('Counter reached 2'));
        } finally {
          genMsg = gen.next();
          // Error is undefined, because generator is done (genMsg.done === true)
          // due it threw an Error, therefore generator is close
          console.log('Generator says %s', genMsg.value);
          return;
        }
      }

      genMsg = gen.next();
      console.log('Generator says %s', genMsg.value);

      counter++;
      setImmediate(runAgain);
    });
  });
} catch (e) {
  // The execution never falls here, the error is thrown in a future event loop execution
  console.log('IT MUST NOT BE CALLED!!! Error details: ' + e.message);
}
