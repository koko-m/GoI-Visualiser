class Contract extends Expo {

	constructor(name) {
		super(null, "C", name);
	}

	transition(token, link) {
		if (link.to == this.key) {
			token.boxStack.push(link);
			token.rewriteFlag = RewriteFlag.F_C;
			return this.findLinksOutOf(null)[0];
		}
		else if (link.from == this.key && token.boxStack.length > 0) {
			return token.boxStack.pop();
		}
	}

	rewrite(token, nextLink) {
		if (token.rewriteFlag == RewriteFlag.F_C && nextLink.from == this.key) {
			token.rewriteFlag = RewriteFlag.EMPTY;

			if (this.findLinksInto(null).length == 1) {
				token.boxStack.pop();
				var inLink = this.findLinksInto(null)[0];
				nextLink.changeFrom(inLink.from, inLink.fromPort);
				this.delete();
			}
			else {
				var i = token.boxStack.last();
				var prev = this.graph.findNodeByKey(i.from);
				if (prev instanceof Contract) {
					token.boxStack.pop();
					for (let link of prev.findLinksInto(null)) {
						link.changeTo(this.key, "s");
					}
					prev.delete();
					token.rewriteFlag = RewriteFlag.F_C;
				}
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
		var con = new Contract(this.name);
		con.text = this.text;
		return con;
	}
}