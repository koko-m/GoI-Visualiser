define('ast/abstraction', function() {
    class Abstraction {
	/**
	 * param here is the name of the variable of the abstraction. Body is the
	 * subtree  representing the body of the abstraction.
	 */
	constructor(param, body) {
	    this.param = param;
	    this.body = body;
	}
    }
    return Abstraction;
});

define('ast/application', function() {
    class Application {
	/**
	 * (lhs rhs) - left-hand side and right-hand side of an application.
	 */
	constructor(lhs, rhs) {
	    this.lhs = lhs;
	    this.rhs = rhs;
	}
    }
    return Application;
});

define('ast/identifier', function() {
    class Identifier {
	/**
	 * name is the string matched for this identifier.
	 */
	constructor(value, name) {
	    this.value = value;
	    this.name = name;
	}
    }
    return Identifier;
});

define('ast/constant', function() {
    class Constant {
	constructor(value) {
	    this.value = value;
	}
    }
    return Constant;
});

define('ast/operation', function() {
    class Operation {
	constructor(type, name) {
	    this.type = type;
	    this.name = name;
	}
    }
    return Operation;
});

define('ast/unary-op', function(require) {
    var Operation = require('ast/operation');

    class UnaryOp extends Operation {
	constructor(type, name, v1) {
	    super(type, name);
	    this.v1 = v1;
	}
    }
    return UnaryOp;
});

define('ast/binary-op', function(require) {
    var UnaryOp = require('ast/unary-op');

    class BinaryOp extends UnaryOp {
	constructor(type, name, v1, v2) {
	    super(type, name, v1);
	    this.v2 = v2;
	}
    }
    return BinaryOp;
});

define('ast/if-then-else', function() {
    class IfThenElse {
	constructor(cond, t1, t2) {
	    this.cond = cond;
	    this.t1 = t1;
	    this.t2 = t2;
	}
    }
    return IfThenElse;
});

define('ast/recursion', function() {
    class Recursion {
	constructor(param, body) {
	    this.param = param;
	    this.body = body;
	}
    }
    return Recursion;
});
