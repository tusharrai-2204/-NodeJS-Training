/* 1. Find the position of a card */

const getCardPosition = (stack, card) => stack.indexOf(card);

let card = 2;
console.log(getCardPosition([9, 7, 3, 2], card)); // 3

/* *********************************************************************************************** */

/* 2. Determine if a card is present */

const doesStackIncludeCard = (stack, card) => stack.includes(card);

card = 3;
console.log(doesStackIncludeCard([2, 3, 4, 5], card)); // true 

/* *********************************************************************************************** */

/* 3. Determine if each card is even */

const isEachCardEven = (stack) => stack.every(card => card % 2 === 0);

console.log(isEachCardEven([2, 4, 6, 7])); // false

/* *********************************************************************************************** */

/* 4. Check if the stack contains an odd-value card */

const doesStackIncludeOddCard = (stack) => stack.some(card => card % 2 !== 0);

console.log(doesStackIncludeOddCard([3, 2, 6, 4, 8])); // true

/* *********************************************************************************************** */

/* 5. Get the first odd card from the stack */

const getFirstOddCard = (stack) => stack.find(card => card % 2 !== 0);

console.log(getFirstOddCard([4, 2, 8, 7, 9]));

/* *********************************************************************************************** */

/* 6. Determine the position of the first card that is even */

const getFirstEvenCardPosition = (stack) => stack.findIndex(card => card % 2 === 0);

console.log(getFirstEvenCardPosition([5, 2, 3, 1]));

