define(function(require) {
    var Node = require('node');
    var InterleaveStr = require('token/machine-token').InterleaveStr();
    var CompData = require('token/machine-token').CompData();
    var RewriteFlag = require('token/machine-token').RewriteFlag();
    var AppNeed = require('nodes/app/need');
    var AppLRValue = require('nodes/app/lrvalue');
    var AppRLValue = require('nodes/app/rlvalue');
    var Expo = require('nodes/expo');

    class Abs extends Node {

	constructor() {
	    super(null, "λ");
	}
	
	transition(token, link) {
	    if (link.to == this.key && link.toPort == "s") {
		var data = token.dataStack.last();
		if (data == CompData.PROMPT) {
		    token.dataStack.pop();
		    token.dataStack.push(CompData.LAMBDA);
		    token.forward = false;
		    return link;
		} else if (data == CompData.R) {
		    token.dataStack.pop();
		    if (token.interleaveStr != InterleaveStr.PO) {
			token.rewriteFlag = RewriteFlag.F_LAMBDA;
		    }
		    return this.findLinksOutOf(null)[0];
		} else if (data == CompData.L) {
		    token.dataStack.pop();
		    token.forward = false;
		    return this.findLinksInto("w")[0];
		}
	    } else if (link.to == this.key && link.toPort == "w") {
		token.dataStack.push(CompData.L);
		token.forward = false;
		return this.findLinksInto("s")[0];
	    } else if (link.from == this.key && link.fromPort == "e") {
		token.dataStack.push(CompData.R);
		return this.findLinksInto("s")[0];
	    }
	}

	rewrite(token, nextLink) {
	    if (token.rewriteFlag == RewriteFlag.F_LAMBDA && nextLink.from == this.key) {
		token.rewriteFlag = RewriteFlag.EMPTY;

		var app = this.graph.findNodeByKey(this.findLinksInto("s")[0].from);
		if ((app instanceof AppNeed) || (app instanceof	AppLRValue) || (app instanceof AppRLValue)) {
		    // M rule
		    var appLink = app.findLinksInto(null)[0];
		    var appOtherLink = app.findLinksOutOf("e")[0];
		    var otherNextLink = this.findLinksInto("w")[0];

		    nextLink.changeFrom(appLink.from, appLink.fromPort);
		    nextLink.changeToGroup(appLink.group);
		    
		    otherNextLink.changeTo(appOtherLink.to, appOtherLink.toPort);
		    otherNextLink.reverse = false;

		    var otherNode = this.graph.findNodeByKey(otherNextLink.from);
		    if (otherNode instanceof Expo) 
			otherNextLink.fromPort = "n";
		    otherNextLink.changeToGroup(appOtherLink.group);
		    
		    this.delete();
		    app.delete();
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
	    return new Abs();
	}
    }

    return Abs;

});
