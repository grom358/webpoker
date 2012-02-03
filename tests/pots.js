var pots = require('../pots.js');

// Test heads up pot
exports.testHeadsUp = function(test) {
    var pm = pots.createPotManager({
        'A': 1000,
        'B': 1000
    });
    pm.start();
    pm.bet('A', 100);
    pm.call('B');
    pm.end();
    pm.assignPots(['A', 'B']);
    test.strictEqual(pm.stacks['A'], 1100);
    test.strictEqual(pm.stacks['B'], 900);
    test.done();
};

// Test multi-way pot with 1 winner
exports.testWinnerTakesAll = function(test) {
    var pm = pots.createPotManager({
        'A': 1000,
        'B': 1000,
        'C': 1000,
        'D': 1000,
        'E': 1000
    });
    pm.start();
    pm.bet('A', 100);
    pm.call('B');
    pm.call('C');
    pm.call('D');
    pm.call('E');
    pm.end();
    pm.assignPots(['A', 'B', 'C', ['D', 'E']]);
    test.strictEqual(pm.stacks['A'], 1400);
    test.strictEqual(pm.stacks['B'], 900);
    test.strictEqual(pm.stacks['C'], 900);
    test.strictEqual(pm.stacks['D'], 900);
    test.strictEqual(pm.stacks['E'], 900);
    test.done();
};

// Test split main pot
exports.testSplitMain = function(test) {
    var pm = pots.createPotManager({
        'A': 1000,
        'B': 1000,
        'C': 1000
    });
    pm.start();
    pm.bet('A', 100);
    pm.call('B');
    pm.call('C');
    pm.end();
    pm.assignPots([['A', 'B'], 'C']);
    test.strictEqual(pm.stacks['A'], 1050);
    test.strictEqual(pm.stacks['B'], 1050);
    test.strictEqual(pm.stacks['C'], 900);
    test.done();
};

// Test single all-in
exports.testSingleAllIn = function(test) {
    var pm = pots.createPotManager({
        'A': 1000,
        'B': 50,
        'C': 1000
    });
    pm.start();
    pm.bet('A', 100);
    pm.call('B');
    pm.call('C');
    pm.end();
    pm.assignPots(['B', 'A', 'C']);
    test.strictEqual(pm.stacks['A'], 1000);
    test.strictEqual(pm.stacks['B'], 150);
    test.strictEqual(pm.stacks['C'], 900);
    test.done();
};

// Test 3 way split pots
exports.testSplitThreeWays = function(test) {
    var pm = pots.createPotManager({
        'A': 1000,
        'B': 1000,
        'C': 1000
    });
    pm.start();
    pm.bet('A', 100);
    pm.raise('B', 200);
    pm.raise('C', 500);
    pm.call('A');
    pm.call('B');
    pm.next();
    pm.end();
    pm.assignPots([['A', 'B', 'C']]);
    test.strictEqual(pm.stacks['A'], 1000);
    test.strictEqual(pm.stacks['B'], 1000);
    test.strictEqual(pm.stacks['C'], 1000);
    test.done();
};

// Test multi-way pots
exports.testMultiway = function(test) {
    var pm = pots.createPotManager({
        'A': 150,
        'B': 300,
        'C': 75,
        'D': 100,
        'E': 50,
        'F': 500
    });
    pm.start();
    pm.bet('A', 100);
    pm.raise('B', 200);
    pm.call('C');
    pm.call('D');
    pm.call('E');
    pm.call('F');
    pm.call('A');
    pm.next();
    pm.bet('B', 50);
    pm.raise('F', 200);
    pm.call('B');
    pm.end();
    pm.assignPots([['C','D'],'A','E','F','B']);
    test.strictEqual(pm.stacks['A'], 150);
    test.strictEqual(pm.stacks['B'], 0);
    test.strictEqual(pm.stacks['C'], 213);
    test.strictEqual(pm.stacks['D'], 312);
    test.strictEqual(pm.stacks['E'], 0);
    test.strictEqual(pm.stacks['F'], 500);
    test.done();
};
