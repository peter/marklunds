// By John Resig
// function tmpl(str, data){
//   const fn = new Function("obj",
//     "var p=[],print=function(){p.push.apply(p,arguments);};" +
//
//     // Introduce the data as local variables using with(){}
//     "with(obj){p.push('" +
//
//     // Convert the template into pure JavaScript
//     str
//       .replace(/[\r\t\n]/g, " ")
//       .split("<%").join("\t")
//       .replace(/((^|%>)[^\t]*)'/g, "$1\r")
//       .replace(/\t=(.*?)%>/g, "',$1,'")
//       .split("\t").join("');")
//       .split("%>").join("p.push('")
//       .split("\r").join("\\'")
//     + "');}return p.join('');")
//
//   // basic currying
//   return data ? fn(data) : fn;
// }

// Alternative template implementation:
// http://krasimirtsonev.com/blog/article/Javascript-template-engine-in-just-20-line

// https://github.com/cho45/micro-template.js/blob/master/lib/micro-template.js
function template (id, data) {
	var me = arguments.callee;
	if (!me.cache[id]) me.cache[id] = (function () {
		var name = id, string = /^[\w_\/-]+$/.test(id) ? me.get(id): (name = 'template(string)', id); // no warnings
		var line = 1, body = (
			"try { " +
				(me.variable ?  "var " + me.variable + " = this.stash;" : "with (this.stash) { ") +
					"this.ret += '"  +
					string.
						replace(/<%/g, '\x11').replace(/%>/g, '\x13'). // if you want other tag, just edit this line
						replace(/'(?![^\x11\x13]+?\x13)/g, '\\x27').
						replace(/^\s*|\s*$/g, '').
						replace(/\n|\r\n/g, function () { return "';\nthis.line = " + (++line) + "; this.ret += '\\n" }).
						replace(/\x11=raw(.+?)\x13/g, "' + ($1) + '").
						replace(/\x11=(.+?)\x13/g, "' + this.escapeHTML($1) + '").
						replace(/\x11(.+?)\x13/g, "'; $1; this.ret += '") +
				"'; " + (me.variable ? "" : "}") + "return this.ret;" +
			"} catch (e) { throw 'TemplateError: ' + e + ' (on " + name + "' + ' line ' + this.line + ')'; } " +
			"//@ sourceURL=" + name + "\n" // source map
		).replace(/this\.ret \+= '';/g, '');
		var func = new Function(body);
		var map  = { '&' : '&amp;', '<' : '&lt;', '>' : '&gt;', '\x22' : '&#x22;', '\x27' : '&#x27;' };
		var escapeHTML = function (string) { return (''+string).replace(/[&<>\'\"]/g, function (_) { return map[_] }) };
		return function (stash) { return func.call(me.context = { escapeHTML: escapeHTML, line: 1, ret : '', stash: stash }) };
	})();
	return data ? me.cache[id](data) : me.cache[id];
}

template.cache = {};

TEMPLATE_DIR = 'app/templates'

template.get = function (id) {
  return require('fs').readFileSync(TEMPLATE_DIR + '/' + id + '.html', 'utf-8')
}

/**
 * Extended template function:
 *   requires: basic template() function
 *   provides:
 *     include(id)
 *     wrapper(id, function () {})
 */
function extended (id, data) {
	var fun = function (data) {
		data.include = function (name, args) {
			var stash = {};
			for (var key in template.context.stash) if (template.context.stash.hasOwnProperty(key)) {
				stash[key] = template.context.stash[key];
			}
			if (args) for (var key in args) if (args.hasOwnProperty(key)) {
				stash[key] = args[key];
			}
			var context = template.context;
			context.ret += template(name, stash);
			template.context = context;
		};

		data.wrapper = function (name, fun) {
			var current = template.context.ret;
			template.context.ret = '';
			fun.apply(template.context);
			var content = template.context.ret;
			var orig_content = template.context.stash.content;
			template.context.stash.content = content;
			template.context.ret = current + template(name, template.context.stash);
			template.context.stash.content = orig_content;
		};

		return template(id, data);
	};

	return data ? fun(data) : fun;
}

module.exports = extended
