class Recur extends Expo {

	constructor() {
		super(null, "μ");
		this.box = null;
	}

	transition(token, link) {
		if (link.to == this.key) {
			token.rewriteFlag = RewriteFlag.F_RECUR;
			return this.findLinksOutOf("e")[0];
		}
	}

	rewrite(token, nextLink) {
		if (token.rewriteFlag == RewriteFlag.F_RECUR && nextLink.from == this.key) {
			token.rewriteFlag = RewriteFlag.EMPTY;

			var wrapper = BoxWrapper.create().addToGroup(this.group.group);
			var newBox = this.group.copy().addToGroup(wrapper.box);
			wrapper.auxs = wrapper.createPaxsOnTopOf(newBox.auxs);
			
			new Link(wrapper.prin.key, newBox.prin.key, "n", "s").addToGroup(wrapper);
			
			var oldGroup = this.group;
			var oldBox = this.group.box;
			this.group.moveOut();
			var leftLink = this.findLinksInto("w")[0];
			leftLink.changeTo(wrapper.prin.key, "s");
			leftLink.fromPort = "n";
			leftLink.reverse = false;
			var inLink = this.findLinksInto("s")[0];
			var outLink = this.findLinksOutOf("e")[0];
			outLink.changeFrom(inLink.from, inLink.fromPort);

			Term.joinAuxs(wrapper.auxs, oldBox.auxs, wrapper.group);
			
			oldGroup.delete();

			token.rewrite = true;
			return nextLink;
		}

		else if (token.rewriteFlag == RewriteFlag.EMPTY) {
			token.rewrite = false;
			return nextLink;
		}
	}

	copy() {
		return new Recur();
	}
}