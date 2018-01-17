# dGoI Visualiser
A tool for web browsers (http://koko-m.github.io/GoI-Visualiser/) that simulates
execution of the *dynamic GoI* abstract machine for the lambda-calculus.

## What is the dynamic GoI abstract machine?
Given the graph representation of an untyped lambda-term, the dynamic
GoI abstract machine simulates its evaluation by *token-guided graph
rewriting*. An agent called "token" moves around the graph and
triggers rewrites, using its own data. The machine can simulate three
evaluation strategies: namely, call-by-need, left-to-right
call-by-value, and right-to-left call-by-value.

## Usage
1. Select an example, or enter your own closed lambda-term.
2. Select an evaluation strategy, or click the `>>` button if you are
happy with the current strategy.
3. Click the `►` button.

Un-checking the `Draw` button stops drawing graphs. An execution can be
paused by the `❚❚` button, resumed by the `►` button, and run
step-by-step by the `►|` button. The `↻` button refreshes the drawing.

If you do not see any graphs, try reloading several times.

## Accepted terms
Only pure untyped lambda-terms are accepted, in the following
grammar. You may need more parenthesis than you expect, especially for
function application.

    <var> := {variables}
    <expr> ::= <var>  # variables
             | (\lambda <var>. <expr>)     # abstraction
             | (<expr> <expr>)             # application

Note that you will see the character `λ` as soon as you type
`\lambda`.

## What you can see
- A graph, with the token indicated by the red edge.
  - Its [Graphviz](https://www.graphviz.org/) source is shown in the
  left gray box.
- The token data below the graph, whose top lines are always the
latest:
  - The left data is *rewrite flag*. The graph is rewritten whenever
  the flag is raised, i.e. set to `<λ>` or `<!>`.
  - The middle data is *computation stack*, used to determine
  the order of evaluating a function and its argument.
  - The right data is *box stack*, used to manage duplication of
  sub-graphs wrapped in a dashed box.

## For more information

### Developers
- [Steven Cheung](http://www.cs.bham.ac.uk/~wtc488/) for the [preceding implementation](https://github.com/cwtsteven/GoI-Visualiser)
- [Koko Muroya](http://www.cs.bham.ac.uk/~kxm538/)

### Reference
- [Koko Muroya](http://www.cs.bham.ac.uk/~kxm538/) and [Dan
R. Ghica](http://www.cs.bham.ac.uk/~drg/).
**The dynamic Geometry of Interaction machine: a call-by-need graph
rewriter**. In CSL 2017. [[pdf (lipics)](http://drops.dagstuhl.de/opus/volltexte/2017/7688/pdf/LIPIcs-CSL-2017-32.pdf)]
- [Koko Muroya](http://www.cs.bham.ac.uk/~kxm538/) and [Dan
R. Ghica](http://www.cs.bham.ac.uk/~drg/).
**Efficient implementation of evaluation strategies via token-guided
graph rewriting**. In WPTE 2017. [[preprint pdf](http://www.cs.bham.ac.uk/~kxm538/papers/dynGoICBV.pdf)]

## Libraries
This tool uses
[graph-viz-d3-js](https://github.com/mstefaniuk/graph-viz-d3-js) for
generating diagrams, and
[lo-js](https://github.com/tadeuzagallo/lc-js) for parsing terms.
