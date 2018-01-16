var dpi = 96;

Array.prototype.last = function() {
    return this[this.length-1];
}

var play = false;
var playing = false;
var finished = false;

var isDraw = true;

require(["jquery", "renderer", "goi-machine"],
	function ($, renderer, machine) {

		function clearGraph(callback) {
			renderer.render('digraph G {\n\t\n}');
			$("#ta-graph").val("");
			pause();
			setTimeout(callback, 100);
		}

		function draw() {
			var width = $("#graph").width();
			var height = $("#graph").height();
			// update stage with new dot source
			var result = machine.graph.draw(width/dpi, height/dpi);
			$("#ta-graph").val(result);
			if (isDraw)
				renderer.render(result);
		}

		// register onClick event
		$("#btn-make-graph").click(function(event) {
			clearGraph(function() {
				$("#dataStack").val("");
				$("#flag").val("");
				$("#boxStack").val("");
				var source = $("#ta-program").val();
				machine.compile(source);
				draw();
				finished = false;
			});
		});

		$("#btn-save").click(function (event) {
		      var img = renderer.stage.getImage(false);
		      img.onload = function () {
		        $("#download").attr("href", img.src);
		        $("#download")[0].click();
		      };
		      event.preventDefault();
		});

		$("#btn-info").click(function (event) {
		      alert("'λ' = \\lambda\n'⊞' = \\sq+\n'⊠' = \\sq*\n'⊡' = \\sq.");
		});

		$('#cb-show-key').change(function() {
	        showKey = this.checked;
	        $("#btn-refresh").click();       
   		 });

		$('#cb-draw').change(function() {
	        isDraw = this.checked;
	        $("#btn-refresh").click();       
   		 });

		$("#btn-refresh").click(function(event) {
			clearGraph(function() {
				draw();
			});
		});

		$("#btn-play").click(function(event) {
			play = true;
			if (!playing)
				autoPlay();
		});

		function autoPlay() {
			playing = true;
			next();
			if (play)
				if (isDraw)
					setTimeout(autoPlay, 800);
				else
					setTimeout(autoPlay, 0);
			else
				playing = false;
		}

		function pause() {
			play = false;
			playing = false;
		}

		function next() {
			if (!finished) {
				machine.pass($("#flag"), $("#dataStack"), $("#boxStack"));
				draw();
			}
		}

		$("#btn-pause").click(function(event) {
			pause();
		});

		$("#btn-next").click(function(event) {
			pause();
			next();
		});

		$("#ta-program").on('input', function() {
		    specialChar(this);
		}).trigger('input');

		var $stacks = $('#flag, #dataStack, #boxStack');
		var sync = function(e){
		    var $other = $stacks.not(this);
		    $other.get(0).scrollTop = this.scrollTop;
		    $other.get(1).scrollTop = this.scrollTop;
		}
		$stacks.on('scroll', sync);

		renderer.init("#graph");
		//renderer.init({element: "#graph", zoom: {extent: [0.1, 10]}})
  		$("#btn-make-graph").click();
	}
);

function specialChar(textarea) {
	text = textarea.value;
	if (text.includes("\\lambda")) {
		var selection = textarea.selectionStart;
		textarea.value = text.replace("\\lambda", "λ");
		textarea.setSelectionRange(selection-6, selection-6);
	}
}

/*
var info =
      "Instructions:" +
+ "\n  1. Choose an example from the drop down menu or create your own program"
+ "\n  2. Click '>>' button to display the graph"
+ "\n  3. Click ";
*/
