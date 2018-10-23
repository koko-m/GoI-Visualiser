requirejs.config({
	//urlArgs: "bust=" + (new Date()).getTime(),
	//By default load any module IDs from js/lib
	baseUrl: 'js',
	//except, if the module ID starts with "app",
	//load it from the js/app directory. paths
	//config is relative to the baseUrl, and
	//never includes a ".js" extension since
	//the paths config could be for a directory.
	bundles: {
        'parser/ast': ['ast/abstraction', 'ast/application', 'ast/identifier'
        			 , 'ast/constant', 'ast/operation', 'ast/unary-op'
        			 , 'ast/binary-op', 'ast/if-then-else', 'ast/recursion'],
        //'op': ['unop-type', 'biop-type'],
        'group': ['group', 'box'],
        'term': ['term', 'box-wrapper'],
        'nodes/der': ['nodes/der', 'nodes/var'],
        'token': ['token/nest-stack', 'token/machine-token'],
        'nodes/app': ['nodes/app/need', 'nodes/app/lrvalue', 'nodes/app/rlvalue'],
   	},
	paths: {
		d3: '../bower_components/d3/d3',
		"dot-checker": '../bower_components/graphviz-d3-renderer/dist/dot-checker',
		"layout-worker": '../bower_components/graphviz-d3-renderer/dist/layout-worker',
		worker: '../bower_components/requirejs-web-workers/src/worker',
		renderer: '../bower_components/graphviz-d3-renderer/dist/renderer',
		jquery: '../bower_components/jquery/dist/jquery',
		"goi-machine": './goi-machine',
	},
	shim: {
		jquery: {
			exports: '$'
		},
		"goi-machine": {
			exports: 'machine'
		}
	},
	deps: ["app"]
});
