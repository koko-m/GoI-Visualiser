// GARBAGE COLLECTION TURNED OFF
define(function(require) {

	var Group = require('group');
	var Contract = require('nodes/contract');
	var Promo = require('nodes/promo');
	var Recur = require('nodes/recur');
	var Abs = require('nodes/abs');
	var Weak = require('nodes/weak');

    class GC {

	constructor(graph) {
	    this.graph = graph;
	    this.noMore = false;
	}
	
	collect() {
	    do {
		this.noMore = true;
		this.collectInGroup(this.graph.child);
	    } while (!this.noMore)
	}

	collectInGroup(group) {
	    for (let node of Array.from(group.nodes)) {
		if ((node instanceof Weak) || (node instanceof Contract && node.findLinksInto(null).length == 0)) {
		    var link = node.findLinksOutOf(null)[0];
		    var nextNode = this.graph.findNodeByKey(link.to);
		    if (!(nextNode instanceof Abs && link.toPort == "w")) { 
			this.noMore = false;
			this.collectFromBottom(node);
		    }
		}
		else if (node instanceof Group) {
		    this.collectInGroup(node);
		}
	    }
	}

	collectFromBottom(node) {
	    if ((node instanceof Contract && node.findLinksInto(null).length != 0)) {

	    }
	    else if (node instanceof Promo || node instanceof Recur) {
		for (let aux of node.group.auxs) {
		    this.collectFromBottom(aux);
		}
		node.group.delete();
	    }
	    else {
		for (let link of node.findLinksOutOf(null)) {
		    this.collectFromBottom(this.graph.findNodeByKey(link.to));
		}
		node.delete();
	    }
	}
    }

    return GC;
});
