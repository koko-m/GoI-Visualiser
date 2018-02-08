// call-by-need and call-by-name
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

// left-to-right call-by-value
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

// right-to-left call-by-value
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