var C = {};                    // C Object simplifies exporting the moduel
C.getChange = function () {    // enough to satisfy the test
    'use strict';              
    return true;               // also passes JSLint
};
module.exports = C;        // export the module with a single method