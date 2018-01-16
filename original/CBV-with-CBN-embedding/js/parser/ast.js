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

class Application {
  /**
   * (lhs rhs) - left-hand side and right-hand side of an application.
   */
  constructor(lhs, rhs) {
    this.lhs = lhs;
    this.rhs = rhs;
  }
}

class Identifier {
  /**
   * name is the string matched for this identifier.
   */
  constructor(value, name) {
    this.value = value;
    this.name = name;
  }
}

class Constant {
  constructor(value) {
    this.value = value;
  }
}

class Operation {
  constructor(type, name) {
    this.type = type;
    this.name = name;
  }
}

class UnaryOp extends Operation {
  constructor(type, name, v1) {
    super(type, name);
    this.v1 = v1;
  }
}

class BinaryOp extends UnaryOp {
  constructor(type, name, v1, v2) {
    super(type, name, v1);
    this.v2 = v2;
  }
}

class IfThenElse {
  constructor(cond, t1, t2) {
    this.cond = cond;
    this.t1 = t1;
    this.t2 = t2;
  }
}

class Recursion {
  constructor(param, body) {
    this.param = param;
    this.body = body;
  }
}
