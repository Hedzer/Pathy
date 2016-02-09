var Pathy = (function(window){
	var fs = require('fs');
	var watch = false;
	var lastStamp = false;
	var readyInterval = setInterval(function() {
		var state = document.readyState;
		if (state === "complete" || state === "loaded") {
			clearInterval(readyInterval);
			if (window.location.hash){
				navigate();
			}
			window.onhashchange = function () {
				navigate();
			};
		}
	}, 10);
	var aliases = {};
	function select(q){
		return document.querySelector(q);
	}
	function stamp(file){
		fs.stat(file, function(err, data){
			lastStamp = data.mtime+"";
		});	
	}
	function navigate(){
		var path = window.location.hash;
		var cleaned = path.replace("#","");
		var parts = cleaned.split("+");
		if (parts.length <= 1){
			Pathy.navigate(cleaned, undefined, true);
			return;
		}
		cleaned = parts.splice(0,1);
		var args = parts.join("+");
		var jArgs = {};
		try{
			var jArgs = JSON.parse(args);
			args = jArgs;
		}catch(e){
			try{
				jArgs = JSON.parse("\""+args+"\"");
				args = jArgs;
			}catch(e){}
		}
		Pathy.navigate(cleaned, args, true);
	}
	function runScripts(url, args){
		var scripts = select(Pathy.container).getElementsByTagName("script");
		execute(url, scripts, args);
	}
	function execute(url, scripts, args){
		scripts = Array.prototype.slice.call(scripts,0);
		if (scripts && scripts.forEach){
			scripts.forEach(function(script){
				var $arguments = args;
				//var code = (script.src ? script.src : script.innerText);
				var code = script.innerText;
				//add state maybe?
				window.eval.call(window,"(function($arguments){"+code+" })" + '//# sourceURL='+getAlias(url))($arguments);
			});
		}
	}
	function monitor(url, args){
		var file = Pathy.routes+url+".html";
		watch = setInterval(function(){
			fs.stat(file, function(err, data){
				if (data.mtime+"" != lastStamp+""){
					lastStamp = data.mtime+"";
					Pathy.navigate(url, args);
				}
			});
		},100);
	}
	function getLocation(url){
		routes = (typeof Pathy.routes == "string" ? Pathy.routes : "./app/routes/").trim();
		var length = routes.length;
		if (routes[length - 1] !== "/" ) {
			routes+="/";
			Pathy.routes = routes;
		}
		var result = routes+getAlias(url)+".html";
		return result;
	}
	function getAlias(url){
		return (aliases[url] ? aliases[url] : url);
	}
	var Pathy = {
		liveReload:true,
		routes:"./app/routes/",
		container:"body",
		navigate:function(url, args, noCheck){
			clearInterval(watch);
			if (!noCheck){
				var expected = "#"+url+"+"+(typeof args == "string" ? args : JSON.stringify(args));
				if (window.location.hash != expected){
					window.location.hash = expected;
				}
			}
			var file = getLocation(url);
			fs.readFile(file, 'utf8', function (err,data) {
				if (err) {
					return console.log(err);
				}
				stamp(file);
				select(Pathy.container).innerHTML = data;
				runScripts(url, args);
				if (Pathy.liveReload){
					monitor(url, args);
				}
			});
		},
		include:function(url, args){
			var file = getLocation(url);
			console.log(file);
			fs.readFile(file, 'utf8', function (err,data) {
				if (err) {
					return console.log(err);
				}
				var root = document.createElement("div");
				root.innerHTML = data;
				var scripts = root.getElementsByTagName("script");
				if (root.hasChildNodes()){
					var children = root.childNodes;
					for (var i = 0; i < children.length; i++){
						select(Pathy.container).appendChild(children[i].cloneNode(true));
					}
				}
				execute(url, scripts, args);
			});

		},
		alias:function(url, alias){
			aliases[alias] = url;
		},
		unalias:function(alias){
			delete aliases[alias];
		}
	};
	return Pathy;
})(window);
