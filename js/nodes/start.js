define(function(require) {

    var Node = require('node');
    var CompData = require('token/machine-token').CompData();

    class Start extends Node {

	constructor() {
	    super("point", "");
	}
	
	transition(token) {
	    if (token.link == null) {
		token.forward = true;
		return this.findLinksOutOf(null)[0];
	    }
	    else 
		return null;
	}
	
	copy() {
	    return new Start();
	}

	draw(level) {
	    return level + this.key + '[shape=' + this.shape + '];'; 
	}

    }

    return Start;
});
