var C = {};     // C Object simplifies exporting the module
C.coins = [5000, 2000, 1000, 500, 200, 100, 50, 20, 10, 5, 2, 1]
/**
 * getChange returns and Array containing the values of notes & coins
 * equivalent to the change for a given transaction
 * @param totalPayable the amount payable for a transaction
 * @param cashPaid  the amount the customer hands over to pay
 * return [500,20,5] the array equivalent of the change
 */

C.getChange = function (totalPayable, cashPaid) {
    'use strict';
    var change = [];
    var length = C.coins.length;
    var remaining = cashPaid - totalPayable; // we reduce this below

    console.log('\nDifference: '+remaining);

    for (var i = 0; i < length; i++) { // loop through array of notes & coins:
        var coin = C.coins[i];

        if(remaining/coin >= 1) { // check coin fits into the remaining amount
            var times = Math.floor(remaining/coin); // no partial coins
            console.log('Coin: '+coin+' fits in remaining ' +times +' times');

            for(var j = 0; j < times; j++) { // add coin to change array x times
                change.push(coin);            
                remaining = remaining - coin; // reduce remaining amount by coin
            }
        }
    }
    console.log(change); // print change array to console for feedback
    return change
};

module.exports = C;         // export the module with a single method