'use strict';

/**** Code to use for the purpose of the example  ****/
function AConstructor(name) {
  this.name = name;
}

AConstructor.prototype.getName = function () {
  return this.name;
};

AConstructor.prototype.setName = function (name) {
  this.name = name;
};
/**********/

/**** Below Some examples with ECMAScripts 6 examples  ****/

const aString = 'You never can asign me to another value';
console.log(aString); // Obviously it prints its asinged value above

aString = 'Change'; // It crashes at compilation time with Error: "SyntaxError: Assignment to constant variable." 

const anObj = new AConstructor('You should not change me');

anObj.getName(); // returns 'You should not change me' 
anObj.setName('I changed you'); // It compiles, because const relates to the created object's reference stored in it, no to the value
    
anObj = new AConstruactor('It is going to crash'); // It crashes at compilation time with Error: "SyntaxError: Assignment to constant variable."



