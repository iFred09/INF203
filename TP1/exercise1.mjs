"use strict";

// programming with a loop
export function fibonaIt(n) {
    let a = 0, b = 1, c;
    if (n === 0) return a;
    for (let i = 2 ; i <= n ; i++){
        c = a+b;
        a = b;
        b = c;
    }
    return b;
}

// recursive version
export function fiboRec(n) {
    if (n === 0) return 0;
    if (n === 1) return 1;
    return fiboRec(n-1) + fiboRec(n-2);
}

// use a loop
export function fibArr(t) {
    let res = [];
    for (let i = 0 ; i < t.length ; i++){
        res.push(fiboRec(t[i]));
    }
    return res;
}

// using map
export function fibMap(t) {
    return t.map(fiboRec);
}