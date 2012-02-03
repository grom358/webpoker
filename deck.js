function Suit(name) {
  this.name = name;
  this.letter = name.charAt(0).toLowerCase();
}

var suits = [
  new Suit("Club"),
  new Suit("Diamond"),
  new Suit("Heart"),
  new Suit("Spade")
];

function Rank(name, letter, value) {
  this.name = name;
  this.letter = letter;
  this.value = value;
}

var ranks = [
  new Rank("Ace", "A", 14),
  new Rank("King", "K", 13),
  new Rank("Queen", "Q", 12),
  new Rank("Jack", "J", 11),
  new Rank("Ten", "T", 10),
  new Rank("Nine", "9", 9),
  new Rank("Eight", "8", 8),
  new Rank("Seven", "7", 7),
  new Rank("Six", "6", 6),
  new Rank("Five", "5", 5),
  new Rank("Four", "4", 4),
  new Rank("Three", "3", 3),
  new Rank("Deuce", "2", 2)
];

function Card(suit, rank) {
  this.suit = suit;
  this.rank = rank;
}

Card.prototype.toString = function() {
  return this.rank.letter + this.suit.letter;
};

Card.prototype.val = function() {
  return this.rank.value;
};

var cards = [];
suits.forEach(function(suit) {
  ranks.forEach(function(rank) {
    cards.push(new Card(suit, rank));
  });
});

function shuffle(array) {
  var tmp, current, top = array.length;

  if(top) while(--top) {
    current = Math.floor(Math.random() * (top + 1));
    tmp = array[current];
    array[current] = array[top];
    array[top] = tmp;
  }

  return array;
}

function Deck() {
  this.shuffle();
}

Deck.prototype.draw = function() {
  return this.cards.pop();
};

Deck.prototype.shuffle = function() {
  this.cards = cards.slice(0);
  shuffle(this.cards);
};

exports.createDeck = function() {
  return new Deck();
};