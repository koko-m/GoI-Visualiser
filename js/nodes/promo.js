class Promo extends Expo {

	constructor() {
		super(null, "!");
	}

	transition(token, link) {
		if (link.to == this.key) {
			var data = token.boxStack.last();
			if (data == BoxData.PROMPT) {
				token.boxStack.pop();
				token.boxStack.push(BoxData.PROMO);
				token.forward = false;
				return link;
			}
			else {
				token.rewriteFlag = RewriteFlag.F_PROMO;
				return this.findLinksOutOf(null)[0];
			}
		}
	}

	rewrite(token, nextLink) {
		if (token.rewriteFlag == RewriteFlag.F_PROMO) {
			token.rewriteFlag = RewriteFlag.EMPTY;
			var prev = this.graph.findNodeByKey(this.findLinksInto(null)[0].from);

			if (prev instanceof Der) {
				token.boxStack.pop();
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
						var inLink = prev.findLinksInto(null)[0];
						prev.deleteAndPreserveInLink();
					}
					else {
						var newBoxWrapper = this.group.copy().addToGroup(this.group.group);
						Term.joinAuxs(this.group.auxs, newBoxWrapper.auxs, newBoxWrapper.group);
						prev.findLinksOutOf(null)[0].changeTo(newBoxWrapper.prin.key, prev.findLinksOutOf(null)[0].toPort);
						link.changeTo(this.key, "s");
					}

					token.rewrite = true;
					return link;
				}
			}
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