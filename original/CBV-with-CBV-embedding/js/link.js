class Link {
	constructor(from, to, fromPort, toPort, reverse) {
		this.from = from;
		this.to = to;
		this.fromPort = fromPort;
		this.toPort = toPort;
		this.reverse = reverse;

		this.colour = null;
		this.penWidth = null;
		this.addToGraph(graph); // cheating
		this.addToNode(); // cheating
	}

	addToNode() {
		var fromNode = this.graph.findNodeByKey(this.from);
		fromNode.links.push(this);
		var toNode = this.graph.findNodeByKey(this.to);
		toNode.links.push(this);
	}

	addToGraph(graph) {
		if (graph != null)
			graph.addLink(this);
		this.graph = graph;
		return this; // to provide chain operation
	}

	addToGroup(group) {
		group.addLink(this);
		this.group = group;
		return this; // to provide chain operation
	}

	changeToGroup(group) {
		this.group.removeLink(this);
		this.addToGroup(group);
		return this;
	}

	changeFrom(key, port) {
		var fromNode = this.graph.findNodeByKey(this.from);
		fromNode.links.splice(fromNode.links.indexOf(this), 1);

		this.from = key;
		this.fromPort = port;
		fromNode = this.graph.findNodeByKey(this.from);
		fromNode.links.push(this);
	}

	changeTo(key, port) {
		var toNode = this.graph.findNodeByKey(this.to);
		toNode.links.splice(toNode.links.indexOf(this), 1);

		this.to = key;
		this.toPort = port;
		toNode = this.graph.findNodeByKey(this.to);
		toNode.links.push(this);
	}

	focus(colour) {
		this.colour = colour;
		this.penWidth = "20";
	}

	clearFocus() {
		this.colour = null;
		this.penWidth = null;
	}

	delete() {
		var fromNode = this.graph.findNodeByKey(this.from);
		fromNode.links.splice(fromNode.links.indexOf(this), 1);
		var toNode = this.graph.findNodeByKey(this.to);
		toNode.links.splice(toNode.links.indexOf(this), 1);
		this.group.removeLink(this);
		this.graph.removeLink(this);
	}

	toString() {
		return this.from + "->" + this.to;
	}

	draw(level) {
		var str = level;

		if (!this.reverse) {
			str += this.from + '->' + this.to + '[';
			if (this.fromPort != null)
				str += 'tailport=' + this.fromPort;
			if (this.toPort != null)
				str += ',headport=' + this.toPort;
		}
		else {
			str += this.to + '->' + this.from + '[dir=back';
			if (this.fromPort != null)
				str += ',headport=' + this.fromPort;
			if (this.toPort != null)
				str += ',tailport=' + this.toPort;
		}

		if (this.colour != null)
			str += ',color=' + this.colour;
		if (this.penWidth != null)
			str += ',penwidth=' + this.penWidth;

		str += '];';
		return str;
	}
}