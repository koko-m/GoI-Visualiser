class App extends Node {

	constructor() {
		super(null, "@");
	}
	
	transition(token, link) {
		if (link.to == this.key) {
			token.dataStack.push(CompData.PROMPT);
			return this.findLinksOutOf("e")[0];

			//token.dataStack.push(CompData.R);
			//return this.findLinksOutOf("w")[0];
		}
		else if (link.from == this.key && link.fromPort == "e") {
			token.dataStack.pop();
			token.dataStack.push(CompData.R);
			token.forward = true;
			return this.findLinksOutOf("w")[0];
		}
	}

	copy() {
		return new App();
	}
}