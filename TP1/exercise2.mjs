"use strict";

export function wordc(s){
    let words = s.split(" ");
    let res = [];
    for (let i = 0 ; i < words.length ; i++){
        if (res[words[i]]){
            res[words[i]]++;
        } else {
            res[words[i]] = 1;
        }
    }
    return res;
}

export class WordList{
    constructor(s){
        this.words = s.split(" ");
        this.res = wordc(s);
    }
    getWords(){
        const result = new Set(this.words.sort());
        return Array.from(result);
    }
    maxCountWord(){
        let max = 0;
        let word = "";
        for (let i = 0 ; i < this.words.length ; i++){
            if (this.res[this.words[i]] > max){
                max = this.res[this.words[i]];
                word = this.words[i];
            }
        }
        return word;
    }
    minCountWord(){
        let min = Infinity;
        let word = "";
        for (let i = 0 ; i < this.words.length ; i++){
            if (this.res[this.words[i]] < min){
                min = this.res[this.words[i]];
                word = this.words[i];
            }
        }
        return word;
    }
    getCount(word){
        return this.res[word];
    }
    applyWordFunc(f){
        let sortedWords = this.getWords();
        let res = [];
        for (let i = 0 ; i < sortedWords.length ; i++){
            res.push(f(sortedWords[i]));
        }
        return res;
    }
}