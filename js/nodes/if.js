class If extends Node {

	constructor() {
		super(null, "if");
	}

	transition(token, link) {
		if (link.to == this.key) {
			token.dataStack.push(CompData.PROMPT);
			return this.findLinksOutOf("w")[0];
		}
		else if (link.from == this.key && link.fromPort == "w") {
			if (token.dataStack.last() == true) {
				token.dataStack.pop();
				token.rewriteFlag = RewriteFlag.F_IF;
				token.forward = true;
				return this.findLinksOutOf("n")[0];
			}
			else if (token.dataStack.last() == false) {
				token.dataStack.pop();
				token.rewriteFlag = RewriteFlag.F_IF;
				token.forward = true;
				return this.findLinksOutOf("e")[0];
			}
		} 
	}

	rewrite(token, nextLink) {
		if (token.rewriteFlag == RewriteFlag.F_IF && nextLink.from == this.key) {
			token.rewriteFlag = RewriteFlag.EMPTY;
			
			var left = this.graph.findNodeByKey(this.findLinksOutOf("w")[0].to);
			if (left instanceof Promo) {
				var downLink = this.findLinksInto(null)[0];
				var otherLink = this.findLinksOutOf(nextLink.fromPort == "n"?"e":"n")[0];
				nextLink.changeFrom(downLink.from, downLink.fromPort);
				var weak = new Weak(this.graph.findNodeByKey(otherLink.to).name).addToGroup(this.group);
				otherLink.changeFrom(weak.key, "n");
				this.delete();
				left.group.delete();
			}

			token.rewrite = true;
			return nextLink;
		}

		else if (token.rewriteFlag == RewriteFlag.EMPTY) {
			token.rewrite = false;
			return nextLink;
		}
	}

	copy() {
		return new If();
	}
}