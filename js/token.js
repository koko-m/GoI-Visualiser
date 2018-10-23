define('token/nest-stack', function(require) {

    class NestStack {
	constructor() {
	    this.end = true;
	    this.data = [null,null];
	    this.next = null;
	}

	push(data) {
	    var entry = new NestStack();
	    entry.end = this.end;
	    entry.data[0] = this.data[0];
	    entry.data[1] = this.data[1];
	    entry.next = this.next;
	    this.end = false;
	    this.data[0] = data[0];
	    this.data[1] = data[1];
	    this.next = entry;
	    return;
	}

	pop() {
	    if (this.end) {
		console.error("pop: logical end of NestStack");
	    } else if (this.next == null) {
		console.error("pop: real end of NestStack");
	    } else {
		this.end = this.next.end;
		this.data = this.next.data;
		this.next = this.next.next;
	    }
	    return;
	}

	last() {
	    return this.data;
	}

	copy() {
	    var entry = new NestStack();
	    entry.end = this.end;
	    if (this.data[1] == null) {
		entry.data = [this.data[0], this.data[1]];
	    } else {
		entry.data = [this.data[0], this.data[1].copy()];
	    }
	    if (this.next == null) {
		entry.next = null;
	    } else {
		entry.next = this.next.copy();
	    }
	    return entry;
	}
    }

    return NestStack;
});

define('token/machine-token', function(require) {

    var NestStack = require('token/nest-stack');

    var InterleaveStr = {
	PO: "pass_only",
	RF: "rewrites_first",
    }

    var CompData = {
	PROMPT: '*',
	LAMBDA: 'λ',
	R: '@',
	L: 'A',
    }

    var RewriteFlag = {
	EMPTY: '□',
	F_LAMBDA: '<λ>',
	F_PROMO: '<!>',
    }

    var BoxData = {
	PROMPT: '*',
	PROMO: '!',
	DER: '◇',
    }

    class MachineToken {

	static InterleaveStr() { return InterleaveStr; }
	static CompData() { return CompData; }
	static RewriteFlag() { return RewriteFlag; }
	static BoxData() { return BoxData; }

	constructor(interleaveStr) {
	    this.reset(interleaveStr);
	}

	setLink(link) {
	    if (this.link != null)
		this.link.clearFocus();
	    this.link = link;
	    if (this.link != null) {
		this.link.focus("red");
	    }
	}

	reset(interleaveStr) {
	    this.interleaveStr = interleaveStr;

	    this.forward = true;
	    this.rewrite = false;
	    this.transited = false;
	    
	    this.link = null;
	    
	    this.rewriteFlag = RewriteFlag.EMPTY;
	    this.dataStack = [];
	    if (interleaveStr == InterleaveStr.PO) {
		this.boxStack = new NestStack();
		this.envStack = new NestStack();
	    } else {
		this.boxStack = [BoxData.PROMPT];
		this.envStack = [];
	    }
	}
    }

    return MachineToken;
});
