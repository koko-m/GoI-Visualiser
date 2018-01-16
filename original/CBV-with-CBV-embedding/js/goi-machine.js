var graph = null;

class GoIMachine {
	
	constructor() {
		this.graph = new Graph();
		graph = this.graph; // cheating!
		this.token = new MachineToken();
		this.gc = new GC(this.graph);
		this.count = 0;
	}

	compile(source) {
		const lexer = new Lexer(source + '\0');
		const parser = new Parser(lexer);
		const ast = parser.parse();
		// init
		this.graph.clear();
		this.token.reset();
		this.count = 0;
		// create graph
		var start = new Start().addToGroup(this.graph.child);
		var term = this.toGraph(ast, this.graph.child);
		new Link(start.key, term.prin.key, "n", "s").addToGroup(this.graph.child);
		this.deleteVarNode(this.graph.child);
	}

	// translation
	toGraph(ast, group) {
		var graph = this.graph;

		if (ast instanceof Identifier) {
			var v = new Var(ast.name).addToGroup(group)
			return new Term(v, [v]);
		} 

		else if (ast instanceof Abstraction) {
			var param = ast.param;
			var wrapper = BoxWrapper.create().addToGroup(group);
			var abs = new Abs().addToGroup(wrapper.box);
			var term = this.toGraph(ast.body, wrapper.box);
			new Link(wrapper.prin.key, abs.key, "n", "s").addToGroup(wrapper);

			new Link(abs.key, term.prin.key, "e", "s").addToGroup(abs.group);

			var auxs = Array.from(term.auxs);
			var paramUsed = false;
			var auxNode;
			for (let aux of term.auxs) {
				if (aux.name == param) {
					paramUsed = true;
					auxNode = aux;
					break;
				}
			}
			if (paramUsed) {
				auxs.splice(auxs.indexOf(auxNode), 1);
			} else {
				auxNode = new Weak(param).addToGroup(abs.group);
			}
			new Link(auxNode.key, abs.key, "nw", "w", true).addToGroup(abs.group);

			wrapper.auxs = wrapper.createPaxsOnTopOf(auxs);

			return new Term(wrapper.prin, wrapper.auxs);
		} 

		else if (ast instanceof Application) {
			var app = new App().addToGroup(group);
			//lhs
			var left = this.toGraph(ast.lhs, group);
			var der = new Der(left.prin.name).addToGroup(group);
			new Link(der.key, left.prin.key, "n", "s").addToGroup(group);
			// rhs
			var right = this.toGraph(ast.rhs, group);		
			
			new Link(app.key, der.key, "w", "s").addToGroup(group);
			new Link(app.key, right.prin.key, "e", "s").addToGroup(group);

			return new Term(app, Term.joinAuxs(left.auxs, right.auxs, group));
		} 

		else if (ast instanceof Constant) {
			var wrapper = BoxWrapper.create().addToGroup(group);
			var constant = new Const(ast.value).addToGroup(wrapper.box);
			new Link(wrapper.prin.key, constant.key, "n", "s").addToGroup(wrapper);
			return new Term(wrapper.prin, wrapper.auxs);
		}

		else if (ast instanceof BinaryOp) {
			var binop = new BinOp(ast.name).addToGroup(group);

			binop.subType = ast.type;
			var left = this.toGraph(ast.v1, group);
			var right = this.toGraph(ast.v2, group);

			new Link(binop.key, left.prin.key, "w", "s").addToGroup(group);
			new Link(binop.key, right.prin.key, "e", "s").addToGroup(group);

			return new Term(binop, Term.joinAuxs(left.auxs, right.auxs, group));
		}

		else if (ast instanceof UnaryOp) {
			var unop = new UnOp(ast.name).addToGroup(group);
			unop.subType = ast.type;
			var box = this.toGraph(ast.v1, group);

			new Link(unop.key, box.prin.key, "n", "s").addToGroup(group);

			return new Term(unop, box.auxs);
		}

		else if (ast instanceof IfThenElse) {
			var ifnode = new If().addToGroup(group);
			var cond = this.toGraph(ast.cond, group);
			var t1 = this.toGraph(ast.t1, group);
			var t2 = this.toGraph(ast.t2, group);

			new Link(ifnode.key, cond.prin.key, "w", "s").addToGroup(group);
			new Link(ifnode.key, t1.prin.key, "n", "s").addToGroup(group);
			new Link(ifnode.key, t2.prin.key, "e", "s").addToGroup(group);

			return new Term(ifnode, Term.joinAuxs(Term.joinAuxs(t1.auxs, t2.auxs, group), cond.auxs, group));
		}

		else if (ast instanceof Recursion) {
			var p1 = ast.param;
			// recur term
			var wrapper = BoxWrapper.create().addToGroup(group);
			wrapper.prin.delete();
			var recur = new Recur().addToGroup(wrapper);
			wrapper.prin = recur;
			var box = this.toGraph(ast.body, wrapper.box);
			wrapper.auxs = Array.from(box.auxs);
			recur.box = box;

			new Link(recur.key, box.prin.key, "e", "s").addToGroup(wrapper);

			var p1Used = false;
			var auxNode1;
			for (var i=0; i<wrapper.auxs.length; i++) {
				var aux = wrapper.auxs[i];
				if (aux.name == p1) {
					p1Used = true;
					auxNode1 = aux;
					break;
				}
			}
			if (p1Used) {
				wrapper.auxs.splice(wrapper.auxs.indexOf(auxNode1), 1);
			} else {
				auxNode1 = new Weak(p1).addToGroup(wrapper.box);
			}
			new Link(auxNode1.key, recur.key, "nw", "w", true).addToGroup(wrapper);

			return new Term(wrapper.prin, wrapper.auxs);
		}
	}

	deleteVarNode(group) {
		for (let node of Array.from(group.nodes)) {
			if (node instanceof Group)
				this.deleteVarNode(node);
			else if (node instanceof Var) 
				node.deleteAndPreserveOutLink();
		}
	}

	// machine step
	pass(flag, dataStack, boxStack) {	
		if (!finished) {
			this.count++;
			if (this.count == 200) {
				this.count = 0;
				this.gc.collect();
			}

			var node;
			if (!this.token.transited) {

				if (this.token.link != null) {
					var target = this.token.forward ? this.token.link.to : this.token.link.from;
					node = this.graph.findNodeByKey(target);
				}
				else
					node = this.graph.findNodeByKey("nd1");


				this.token.rewrite = false;
				var nextLink = node.transition(this.token, this.token.link);
				if (nextLink != null) {
					this.token.setLink(nextLink);
					this.printHistory(flag, dataStack, boxStack); 
					this.token.transited = true;
				}
				else {
					this.gc.collect();
					this.token.setLink(null);
					play = false;
					playing = false;
					finished = true;
				}
			}
			else {
				var target = this.token.forward ? this.token.link.from : this.token.link.to;
				node = this.graph.findNodeByKey(target);
				var nextLink = node.rewrite(this.token, this.token.link);
				if (!this.token.rewrite) {
					this.token.transited = false;
					this.pass(flag, dataStack, boxStack);
				}
				else {
					this.token.setLink(nextLink);
					this.printHistory(flag, dataStack, boxStack);
				}
			}
		}
	}

	printHistory(flag, dataStack, boxStack) {
		flag.val(this.token.rewriteFlag + '\n' + flag.val());
		var dataStr = this.token.dataStack.length == 0 ? '□' : Array.from(this.token.dataStack).reverse().toString() + ',□';
		dataStack.val(dataStr + '\n' + dataStack.val());
		var boxStr = this.token.boxStack.length == 0 ? '□' : Array.from(this.token.boxStack).reverse().toString() + ',□';
		boxStack.val(boxStr + '\n' + boxStack.val());
	}

}

define('goi-machine', ['gc', 'graph', 'node', 'group', 'link', 'term', 'token', 'op', 'parser/ast', 'parser/token', 'parser/lexer', 'parser/parser'
					, 'nodes/expo', 'nodes/abs', 'nodes/app', 'nodes/binop', 'nodes/const', 'nodes/contract'
					, 'nodes/der', 'nodes/if', 'nodes/pax', 'nodes/promo'
					, 'nodes/recur', 'nodes/start', 'nodes/unop', 'nodes/weak'],
	function() {
		return new GoIMachine();	
	}
);