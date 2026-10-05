let deck = [5, 9, 7, 1, 8];

// First
const getFirstCard = (deck) => {
  let [firstCard] = deck;
  console.log(firstCard);
};

getFirstCard(deck);

// Second question
const getSecondCard = (deck) => {
  let [first, second] = deck;
  console.log(second);
};

deck = [3, 2, 10, 6, 7];
getSecondCard(deck);

// Third Question
deck = [10, 7, 3, 8, 5];
const swapTopTwoCards = (deck) => {
  const [firstCard, secondCard, ...rest] = deck;
  deck = [secondCard, firstCard, ...rest];
  console.log(deck);
};
swapTopTwoCards(deck);

// Fourth Question
deck = [2, 5, 4, 9, 3];

const discardTopCard = (deck) => {
  const [firstCard, ...rest] = deck;

  finalDeck = [firstCard, rest];
  console.log(finalDeck);
};

discardTopCard(deck);

//Fifth question
deck = [5, 4, 7, 10];

const insertFaceCards = (deck) => {
  const newValues = ["jack", "queen", "king"];
  const [firstCard, ...rest] = deck;
  const newDeck = [firstCard, ...newValues, ...rest];
  console.log(newDeck);
};

insertFaceCards(deck);
