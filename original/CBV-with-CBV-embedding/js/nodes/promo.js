class Promo extends Expo {

	constructor() {
		super(null, "!");
	}

	transition(token, link) {
		if (link.to == this.key) {
			token.rewriteFlag = RewriteFlag.F_PROMO;
			return this.findLinksOutOf(null)[0];
		}
		else if (link.from == this.key) {
			return this.findLinksInto(null)[0];
		}
	}

	rewrite(token, nextLink) {
		if (token.rewriteFlag == RewriteFlag.F_PROMO) {
			token.rewriteFlag = RewriteFlag.EMPTY;
			var prev = this.graph.findNodeByKey(this.findLinksInto(null)[0].from);

			if (prev instanceof Der) {
				var oldGroup = this.group;
				oldGroup.moveOut(); // this.group is a box-wrapper
				oldGroup.deleteAndPreserveLink();
				var newNextLink = prev.findLinksInto(null)[0];
				prev.deleteAndPreserveInLink(); // preserve inLink
				token.rewrite = true;
				return newNextLink;
			}
			else if (prev instanceof Contract && token.boxStack.length >= 1) {
				if (nextLink.from == this.key) {
					var link = token.boxStack.pop();
					var inLinks = prev.findLinksInto(null);
					if (inLinks.length == 1) { 
						// this will not happen as the C-node should have taken care of it
					}
					else {
						var newBoxWrapper = this.group.copy().addToGroup(this.group.group);
						Term.joinAuxs(this.group.auxs, newBoxWrapper.auxs, newBoxWrapper.group);
						prev.findLinksOutOf(null)[0].changeTo(newBoxWrapper.prin.key, prev.findLinksOutOf(null)[0].toPort);
						link.changeTo(this.key, "s");
					}
					token.rewriteFlag = RewriteFlag.F_PROMO;
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
		return new Promo();
	}
}