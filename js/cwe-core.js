
var $cwe = {
	$notifys: [],
	$add: function(name, fn) {
		this.$notifys[name] = (this.$notifys[name] || []);
		for (var i = 0; i < this.$notifys[name].length; i++) { 
			if (this.$notifys[name][i] === fn) return false; 
		}
		this.$notifys[name].push(fn);
		return true;
	},
	$remove: function(name, fn) {
		if (typeof this.$notifys[name] != "object" || this.$notifys[name].length === undefined) return false;
		for (var i = 0; i < this.$notifys[name].length; i++) {
			if (this.$notifys[name][i] === fn) {
				this.$notifys[name].splice(i, 1);
				return (this.$notifys[name].length == 0);
			}
		}
		return false;
	},
	open: function(mode, url, features, cb) {
		try{window.external.open(mode, url, features, function(w){
			if (typeof cb == "function") {
				if (w) {
					cb({
						$win: w,
						isValid: function(){
							try{return window.external.isWin(this.$win);}catch(e){return false;}
						},
						postNotify: function() {
							var notify = ""+arguments[0];
							var len = arguments.length - 1;
							var cb = arguments[len];
							if (typeof cb != "function") cb = function(){};
							else len--;
							var args = [];
							for (var i = 1; i <= len; i++) args.push(arguments[i]);
							try{window.external.postNotify(this.$win, notify, args, cb);}catch(e){cb(false);}
						}
					});
				} else cb(false);
			}
		});}catch(e){if (typeof cb == "function") cb(false);}
	},
	feature: function(features, cb) {
		try{window.external.feature(features, cb);}catch(e){}
	},
	close: function() {
		try{window.external.close();}catch(e){}
	},
	get: function(name) {
		try{return eval("("+window.external.get(""+name)+")");}catch(e){return false;}
	},
	plugin: function(plugin_name) {
		return {
			name: ""+plugin_name, 
			call: function() {
				var member = ""+arguments[0];
				var len = arguments.length - 1;
				var cb = arguments[len];
				if (typeof cb != "function") cb = function(){};
				else len--;
				var args = [];
				for (var i = 1; i <= len; i++) args.push(arguments[i]);
				try{window.external.plugin(this.name, member, args, cb);}catch(e){cb(false);}
			}
		}
	},
	addNotify: function(name, fn) {
		if (typeof fn != "function") return false;
		name = ""+name;
		if (!this.$add(name, fn)) return true;
		try{window.external.setNotify(name, true, function(){
			var args = [], i, ns = $cwe.$notifys[name];
			for (i = 0; i < arguments.length; i++) args.push(arguments[i]);
			for (i = 0; i < ns.length; i++) {
				if (typeof ns[i] == "function") ns[i].apply(ns[i], args);
			}
		});}catch(e){return false;}
		return true;
	},
	removeNotify: function(name, fn) {
		if (typeof fn != "function") return false;
		name = ""+name;
		if (!this.$remove(name, fn)) return true;
		try{window.external.setNotify(name, false, function(){});}catch(e){return false;}
		return true;
	},
	postNotify: function() {
		var notify = ""+arguments[0];
		var len = arguments.length - 1;
		var cb = arguments[len];
		if (typeof cb != "function") cb = function(){};
		else len--;
		var args = [];
		for (var i = 1; i <= len; i++) args.push(arguments[i]);
		try{window.external.postNotify(0, notify, args, cb);}catch(e){cb(false);}
	},
	popupMenu: function(menu, x, y, cb) {
		try{window.external.popupMenu(menu, x, y, function(){
			if (arguments.length <= 0) cb();
			else {
				var m, p = menu;
				for (var i = arguments.length - 1; i >= 0; i--) {
					m = p[arguments[i]];
					p = m.sub;
				}
				cb(m);
			}
		});}catch(e){cb(false);}
	},
	shellNotifyIcon: function(data, cb) {
		if (typeof cb != "function") cb = function(){};
		try{window.external.shellNotifyIcon(data, cb);}catch(e){cb(false);}
	}
};

(function initialize(){
	$cwe.addNotify('cweui.feature', function(features){
		try{
			$cwe.feature(features, function(){});
		}catch(e){
			alert(e.message);
		}
	});
	//主窗口关闭时通知消息推送窗口关闭
    // $cwe.addNotify('cweui.CloseWnd', function() {
    //     $cwe.close();
    // });
})();