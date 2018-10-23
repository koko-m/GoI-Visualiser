define(function(require) {

    var Expo = require('nodes/expo');

    class Pax extends Expo {

	constructor(name) {
	    super(null, "?", name);
	}

	transition(token, link) {
	    if (link.to == this.key && link.toPort == "s") {
		token.envStack.pop();
		return this.findLinksOutOf(null)[0];
	    }
	}

	copy() {
	    return new Pax(this.name);
	}

	delete() {
	    this.group.auxs.splice(this.group.auxs.indexOf(this), 1);
	    super.delete();
	}
    }

    return Pax;
});
