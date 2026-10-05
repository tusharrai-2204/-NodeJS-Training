const displayName = require('./testmodule')

displayName('Tushar');


/*
3. Given a string: "Welcome to NodeJS". Print each word in separate line using REPL.

> "Welcome to NodeJS".split(' ').forEach(word => { console.log(word) });
Welcome
to
NodeJS
undefined
*/

// 4. Print the current working directory and current filename using Node Global Objects
console.log(__dirname);
console.log(__filename);