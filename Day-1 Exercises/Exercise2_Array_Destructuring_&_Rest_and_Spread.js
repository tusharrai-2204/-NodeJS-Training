let deck = [5, 9, 7, 1, 8];

/* 1. Get the first card */

const getFirstCard = (deck) => {
    const [firstCard] = deck;
    console.log(firstCard);
};
getFirstCard(deck);

/* ******************************************************************************************************* */

/* 2. Get the second card */

const getSecondCard = (deck) => {
    const [, secondCard] = deck;
    console.log(secondCard);
};
getSecondCard(deck);

/* ******************************************************************************************************* */

/* 3. Swap the top two cards */

const swapTopTwoCards = (deck) => {
    const [firstCard, secondCard, ...rest] = deck;
    const newDeck = [secondCard, firstCard, ...rest];
    console.log(newDeck);
};
swapTopTwoCards(deck);

/* ******************************************************************************************************* */

/* 4. Discard the top card */

const discardTopCard = (deck) => {
    const [topCard, ...rest] = deck;
    const discardedDeck = rest;
    console.log(discardedDeck);
};
discardTopCard(deck);

/* ******************************************************************************************************* */

/* 5. Insert face cards */

const insertFaceCards = (deck) => {
    const faceCards = ["jack", "queen", 'king'];
    const [firstCard, ...rest] = deck;
    const newDeck = [firstCard, ...faceCards, ...rest];
    console.log(newDeck);
};
insertFaceCards(deck);