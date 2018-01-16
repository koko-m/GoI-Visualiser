var dup_ex = '((λf. λx. f (f x)) ((λy. y) (λz. z))) (λw. w)';
var div_ex = '(λx. λy. y) ((λx. x x) (λx. x x))';
var nonval_ex = '((λf. λx. f (f x)) (λy. y)) (λz. z)';
var open_ex = '(λx. (λy. y (y x)) (λz. x)) (λw. w)';