class Const extends Node {

	constructor(name) {
		super(null, name, name);
	}
	
	transition(token, link) {
		if (token.dataStack.last() == CompData.PROMPT && token.dataStack.pop()) {
			token.dataStack.push(this.name);
			token.forward = false;
			return link;
		}
	}

	copy() {
		return new Const(this.name);
	}
}