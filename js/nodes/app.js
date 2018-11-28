// call-by-need and call-by-name
define('nodes/app/need', function(require) {

    var Node = require('node');
    var CompData = require('token/machine-token').CompData();
    var BoxData = require('token/machine-token').BoxData();
    
    class AppNeed extends Node {

	constructor() {
	    super(null, "@");
	}
	
	transition(token, link) {
	    if (link.to == this.key && link.toPort == "s") {
		token.dataStack.push(CompData.R);
		return this.findLinksOutOf("w")[0];
	    } else if (link.from == this.key && link.fromPort == "e") {
		token.dataStack.push(CompData.L);
		token.forward = true;
		return this.findLinksOutOf("w")[0];
	    } else if (link.from == this.key && link.fromPort == "w") {
		var data = token.dataStack.last();
		if (data == CompData.R) {
		    token.dataStack.pop();
		    return this.findLinksInto(null)[0];
		} else if (data == CompData.L) {
		    token.dataStack.pop();
		    token.forward = true;
		    return this.findLinksOutOf("e")[0];
		}
	    }
	}

	copy() {
	    return new AppNeed();
	}
    }

    return AppNeed;
});

// left-to-right call-by-value
define('nodes/app/lrvalue', function(require) {

    var Node = require('node');
    var CompData = require('token/machine-token').CompData();
    var BoxData = require('token/machine-token').BoxData();
    
    class AppLRValue extends Node {

	constructor() {
	    super(null, "@>");
	}
	
	transition(token, link) {
	    if (link.to == this.key) {
		token.dataStack.push(CompData.PROMPT);
		return this.findLinksOutOf("w")[0];
	    }
	    else if (link.from == this.key && link.fromPort == "w") {
		token.dataStack.pop();
		token.boxStack.push(BoxData.PROMPT);
		token.forward = true;
		return this.findLinksOutOf("e")[0];
	    }
	    else if (link.from == this.key && link.fromPort == "e") {
		token.boxStack.pop();
		token.dataStack.push(CompData.R);
		token.forward = true;
		return this.findLinksOutOf("w")[0];
	    }
	}

	copy() {
	    return new AppLRValue();
	}
    }

    return AppLRValue;
});

// right-to-left call-by-value
define('nodes/app/rlvalue', function(require) {

    var Node = require('node');
    var CompData = require('token/machine-token').CompData();
    var BoxData = require('token/machine-token').BoxData();
    
    class AppRLValue extends Node {

	constructor() {
	    super(null, "<@");
	}
	
	transition(token, link) {
	    if (link.to == this.key) {
		token.boxStack.push(BoxData.PROMPT);
		return this.findLinksOutOf("e")[0];
	    }
	    else if (link.from == this.key && link.fromPort == "e") {
		token.boxStack.pop();
		token.dataStack.push(CompData.R);
		token.forward = true;
		return this.findLinksOutOf("w")[0];
	    }
	}

	copy() {
	    return new AppRLValue();
	}
    }

    return AppRLValue;
});
