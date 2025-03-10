"use strict";

import {fibonaIt,fiboRec,fibArr,fibMap} from "./exercise1.mjs";
import {wordc,WordList} from "./exercise2.mjs";
import {Stdt,ForeignStud} from "./exercise3.mjs";
import {Promotion} from "./exercise4.mjs";

// ex 1
console.log("-----------------");

console.log(fibonaIt(7)); // do more that one test per function
console.log(fiboRec(8));
console.log(fibonaIt(9) === fiboRec(9));
console.log(fibArr([7, 8, 9, 10]));
console.log(fibMap([7, 8, 9, 10]));

// ex 2
console.log("-----------------");

console.log(wordc("fish bowl fish bowl fish"));
console.log(wordc("hello world hello world hello"));

let wl = new WordList("fish bowl fish bowl fish");
console.log(wl.getWords());
console.log(wl.maxCountWord());
console.log(wl.minCountWord());
console.log(wl.getCount("fish"));

function f (word) {return word.length;}
console.log(wl.applyWordFunc(f));

// ex 3
console.log("-----------------");

var student = new Stdt("Dupond", "John", 1835);
console.log(student.toString());
var foreigner = new ForeignStud("Doe", "John", 432, "American");
console.log(foreigner.toString());

// ex 4
console.log("-----------------");

var promo = new Promotion();
promo.add(foreigner);
promo.add(student);
console.log(promo.size());
console.log(promo.get(0));
console.log(promo.get(1));
promo.saveFile("promo.json");

console.log("-----------------");

var promoRead = new Promotion();
promoRead.readFrom("promo.json");
console.log("------------------ promo readed ------------------");
promo.print();
console.log(promo.get(0));
console.log(promo.get(1));