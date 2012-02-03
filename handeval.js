var handCategories = [
  "Straight Flush",
  "Four of a kind",
  "Fullhouse",
  "Flush",
  "Straight",
  "Three of a kind",
  "Two pair",
  "Pair",
  "High Card"
];

/**
 * Evaluate an array of cards returning the best hand and its category (ie. Pair)
 */
function evalHand(hand) {
  var handSuits = groupBySuit();
  for (var suit in handSuits) {
    handSuits[suit].sort(rankCompare);
  }

  hand.sort(rankCompare);

  var straightFlush = findStraightFlush();
  if (straightFlush) {
    return {
      "category": "Straight Flush",
      "cards": straightFlush
    };
  }

  var sets = findSets();
  var kindCount = sets.length == 0 ? 0 : sets[0].length;

  if (kindCount == 4) {
    var bestHand = sets[0].concat(findKickers(1, sets[0]));
    return {
      "category": "Four of a kind",
      "cards": bestHand
    };
  } else if (kindCount == 3 && sets.length >= 2) {
    var bestHand = sets[0].concat(sets[1]);
    return {
      "category": "Fullhouse",
      "cards": bestHand
    };
  }

  var flush = findFlush();
  if (flush) {
    return {
      "category": "Flush",
      "cards": flush
    };
  }

  var straight = findStraight(hand);
  if (straight) {
    return {
      "category": "Straight",
      "cards": straight
    };
  } else if (kindCount == 3) {
    var bestHand = sets[0].concat(findKickers(2, sets[0]));
    return {
      "category": "Three of a kind",
      "cards": bestHand
    };
  } else if (sets.length >= 2) {
    var twoPair = sets[0].concat(sets[1]);
    var bestHand = twoPair.concat(findKickers(1, twoPair));
    return {
      "category": "Two pair",
      "cards": bestHand
    };
  } else if (kindCount == 2) {
    var bestHand = sets[0].concat(findKickers(3, sets[0]));
    return {
      "category": "Pair",
      "cards": bestHand
    };
  } else {
    var bestHand = findKickers(5, []);
    return {
      "category": "High Card",
      "cards": bestHand
    };
  }

  function groupBySuit() {
    var groupBy = {
      'c': [],
      'd': [],
      'h': [],
      's': []
    };

    hand.forEach(function(card) {
      groupBy[card.suit.letter].push(card);
    });

    return groupBy;
  }

  function rankCompare(a, b) {
    return b.val() - a.val();
  }

  function findStraightFlush() {
    for (var suit in handSuits) {
      var suitedCards = handSuits[suit];
      if (suitedCards.length >= 5) {
        var straightFlush = findStraight(suitedCards);
        if (straightFlush) {
          return straightFlush;
        }
      }
    }
  }

  function findFlush() {
    for (var suit in handSuits) {
      var suitedCards = handSuits[suit];
      if (suitedCards.length >= 5) {
        return suitedCards.slice(0, 5);
      }
    }
  }

  function findStraight(cards) {
    var straight = [];
    for (var i = 0, len = cards.length; i < len; i++) {
      var card = cards[i];
      if (straight.length == 0) {
        straight.push(card);
      } else {
        var prev = straight[straight.length - 1];
        if (prev.val() - 1 === card.val()) {
          straight.push(card);
        } else if (prev.val() !== card.val()) {
          straight = [];
        }
      }

      if (straight.length == 5) {
        return straight;
      }
    }
  }

  function findSets() {
    var sets = [];

    var maxLength = 0;
    var set = [];
    var prev = hand[0];
    set.push(prev);
    for (var i = 1, len = hand.length; i < len; i++) {
      var card = hand[i];
      if (prev.rank !== card.rank) {
        if (set.length > 1) {
          sets.push(set);
        }
        set = [];
      }
      set.push(card);
      prev = card;
    }
    if (set.length > 1) {
      sets.push(set);
    }

    sets.sort(function(a, b) {
      if (a.length == b.length) {
        return b[0].val() - a[0].val();
      }
      return b.length - a.length;
    });

    return sets;
  }

  function findKickers(noKickers, exclude) {
    var kickers = [];
    for (var i = 0, len = hand.length; i < len; i++) {
      var card = hand[i];
      if (exclude.indexOf(card) === -1) {
        kickers.push(card);
        if (kickers.length == noKickers) {
          return kickers;
        }
      }
    }
    return kickers;
  }
}

function compareHand(a, b) {
  if (a.category == b.category) {
    for (var i = 0, len = a.cards.length; i < len; i++) {
      var aCard = a.cards[i];
      var bCard = b.cards[i];
      if (aCard.val() !== bCard.val()) {
        return bCard.val() - aCard.val();
      }
    }
    return 0;
  }
  var aScore = handCategories.indexOf(a.category);
  var bScore = handCategories.indexOf(b.category);
  return aScore - bScore;
}

exports.eval = evalHand;

exports.sortHands = function(hands) {
    hands.sort(compareHand);
};
