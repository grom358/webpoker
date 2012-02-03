function PotManager(stacks) {
    this.stacks = stacks;
}

PotManager.prototype.start = function() {
    this.betAmount = 0; // Current bet amount
    this.pots = [{
        total: 0,
        carryOver: 0,
        callAmount: 0,
        callTotal: 0,
        chips: {}
    }];
    this.betAmount = 0;
    this.bets = {};
    this.sidePots = []; // List of side pots from previous betting rounds
};

PotManager.prototype.next = function() {
    // Setup new betting round
    this.betAmount = 0;
    this.bets = {};

    var mainPot = this.pots[this.pots.length - 1];
    this.sidePots = this.sidePots.concat(this.pots.slice(0, this.pots.length - 1));

    // Clear mainPot
    mainPot.carryOver = mainPot.total;
    mainPot.callAmount = 0;
    mainPot.callTotal = 0;
    //mainPot.chips = clone(mainPot.chips);
    for (var player in mainPot.chips) {
        mainPot.chips[player] = 0;
    }

    this.pots = [mainPot];
};

PotManager.prototype.end = function() {
    this.pots = this.sidePots.concat(this.pots);
};

PotManager.prototype.bet = function(player, amount) {
    this.bets[player] = amount;
    this.betAmount = amount;
    this.stacks[player] -= amount;

    var mainPot = this.pots[this.pots.length - 1];
    mainPot.total += amount;
    mainPot.callAmount = amount;
    mainPot.callTotal = amount;
    mainPot.chips = {};
    mainPot.chips[player] = amount;
};

PotManager.prototype.raise = function(player, amount) {
    var incAmount = amount - this.betAmount;
    var incBet = amount - (this.bets[player] || 0);
    this.betAmount = amount;
    this.stacks[player] -= incBet;
    this.bets[player] = amount;

    var pot = this.pots[this.pots.length - 1];
    pot.callAmount += incAmount;
    pot.callTotal = amount;
    pot.chips[player] = amount;
    pot.total += incBet;
};

function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

PotManager.prototype.call = function(player) {
    var stackAmount = this.stacks[player];
    for (var i = 0, len = this.pots.length; stackAmount > 0 && i < len; ++i) {
        var pot = this.pots[i];
        var amountToCall = pot.callAmount - (pot.chips[player] || 0);
        if (stackAmount >= amountToCall) {
            stackAmount -= amountToCall;
            pot.total += amountToCall;
            pot.chips[player] = pot.callAmount;
        } else {
            if (!(player in pot.chips)) {
                pot.chips[player] = 0;
            }

            var playerSize = Object.keys(pot.chips).length;
            var sideAmount = this.stacks[player] + (this.bets[player] || 0);
            var prevCall = i > 0 ? this.pots[i - 1].callTotal : 0;
            var sideCall = sideAmount - prevCall;
            var sidePot = {
                total: playerSize * sideCall + pot.carryOver,
                callAmount: sideCall,
                callTotal: sideAmount,
                chips: clone(pot.chips),
                carryOver: pot.carryOver
            };
            for (var p in sidePot.chips) {
                sidePot.chips[p] = sidePot.callAmount;
            }
            sidePot.chips[player] = sidePot.callAmount;

            var oldPot = {
                total: 0,
                callAmount: pot.callTotal - sidePot.callTotal,
                callTotal: pot.callTotal,
                chips: pot.chips,
                carryOver: 0
            };
            for (var p in oldPot.chips) {
                var chipAmount = oldPot.chips[p] - sidePot.chips[p];
                oldPot.chips[p] = chipAmount;
                if (oldPot.chips[p] <= 0) {
                    delete oldPot.chips[p];
                } else {
                    oldPot.total += chipAmount;
                }
            }

            this.pots.splice(i, 1, sidePot, oldPot);
            this.pots.sort(function(a, b) {
                return a.callTotal - b.callTotal;
            });

            stackAmount = 0;
        }
    }
    this.bets[player] = this.stacks[player] < this.betAmount ? this.stacks[player] : this.betAmount;
    this.stacks[player] = stackAmount;
};

PotManager.prototype.assignPots = function(results) {
    var self = this;
    var prize = {};
    for (var player in this.stacks) {
        prize[player] = 0;
    }

    var assignedPots = {};

    function splitPot(pot, players) {
        var winners = [];
        for (var i = 0, n = players.length; i < n; ++i) {
            var player = players[i];
            if (player in pot.chips) {
                winners.push(player);
            }
        }
        return winners;
    }

    results.forEach(function(el) {
        if (Array.isArray(el)) {
            self.pots.filter(function(pot, index, array) {
                if (!(index in assignedPots)) {
                    var winners = splitPot(pot, el);
                    if (winners.length) {
                        if (winners.length == 1) {
                            winners = winners[0];
                            prize[winners] += pot.total;
                        } else {
                            var splitWin = Math.floor(pot.total / winners.length);
                            var leftOver = pot.total - (splitWin * winners.length);
                            winners.forEach(function(winner) {
                                prize[winner] += splitWin + leftOver;
                                leftOver = 0;
                            });
                        }
                        assignedPots[index] = winners;
                    }
                }
            });
        } else {
            self.pots.filter(function(pot, index, array) {
                if (!(index in assignedPots) && el in pot.chips) {
                    assignedPots[index] = el;
                    prize[el] += pot.total;
                }
            });
        }
    });

    for (var player in prize) {
        this.stacks[player] += prize[player];
    }
};

exports.createPotManager = function(stacks) {
    return new PotManager(stacks);
};
