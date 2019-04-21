const {test} = require('scar');

require('./fQuery.js');
require('./core/each');
require('./core/select');
require('./core/stack');
require('./core/then');
require('./builtin/map');

test.cli();
