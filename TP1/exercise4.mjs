import {Stdt, ForeignStud} from "./exercise3.mjs";
import fs from 'fs';

export class Promotion{
    constructor(){
        this.students = [];
    }
    add(student){
        this.students.push(student);
    }
    size(){
        return this.students.length;
    }
    get(i){
        return this.students[i];
    }
    print(){
        for (let i = 0 ; i < this.students.length ; i++){
            console.log(this.students[i].toString());
        }
    }
    write(){
        return JSON.stringify(this.students)
    }
    read(str){
        const parsedStudents = JSON.parse(str);
        for (let student of parsedStudents){
            if (student.nationality != undefined){
                student = Object.assign(new ForeignStud(), student);
            }
            else {
                student = Object.assign(new Stdt(), student);
            }
            this.add(student);
        }
    }
    saveFile(filename){
        fs.writeFileSync(filename, this.write());
    }
    readFrom(filename){
        this.read(fs.readFileSync(filename));
    }
}