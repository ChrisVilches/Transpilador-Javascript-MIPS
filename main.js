	var editor = null;

	/*
	*	src (string)
	*		source code.
	*
	*	sandboxId (string)
	*		id of an iframe where execution will be sandboxed in,
	*		so things like document.write('hello') don't affect the main view.
	*
	*	returns (string)
	*		compiled code.
	*/

	/*
	*	El top.document.write() no lo sandboxea bien,
	*	habra que compilar los codigos de otra forma para que meta las funciones
	*	en un objeto. Y poner restricciones a que se puede hacer y que no.
	*/
	function compile(src, sandboxId){		

		var sandbox = $("#"+sandboxId)[0].contentWindow;

		sandbox.parent = null;
		sandbox.mips = {};

		var jsTag = new RegExp(/\<\%(=)?((?:.|\n)*?)\%\>/g);

		return src.replace(jsTag, function(match, print, jsCode){

			if(print)
				return sandbox.eval(jsCode).trim() || "";	

			sandbox.eval(jsCode);		

			return "";

		});
	}


	function showResult(){
		var src = editor.getValue();
		var result = compile(src, "sandbox").trim();
		$("#result").html(result);
		hljs.highlightBlock($("#result")[0]);
	}


	function startEditor(){

		editor = CodeMirror.fromTextArea($("#original")[0], {
			mode: "javascript",
			lineNumbers: true,
			indentUnit: 4,
			matchBrackets: true
		});

		editor.on("change", showResult);
		editor.setSize(450, 500);
	}



	$(document).ready(function(){

		startEditor();
		showResult();
	});

	