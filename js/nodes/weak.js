define(function(require) {

    var Node = require('node');
    var Expo = require('nodes/expo');

    class Weak extends Expo {

	constructor() {
	    super(null, 'C0');
	}

	copy() {
	    return new Weak();
	}
	
    }

    return Weak;
});
