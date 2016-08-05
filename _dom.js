// start here // on toogle/change of  the state of an dom element save its properties
_ = {
	doc: document,
	temp: {},
	sel: null,
	body: document.body
};
_.s = function(el, o) {
	if(o) {
		this._ = [this.doc.querySelector(el)]
	} else {
		this._ = this.doc.querySelectorAll(el);
	}
	return this;
}
_.i = function(el, o) {
	this._ = this.doc.getElementById(el);
	if(!o) {
		this._ = [this._];
	}
	return this;
}
_.t = function(el, o) {
	this._ = this.doc.getElementsByTagName(el);
	if(o) {
		this._ = this._[0]
	}
	return this;
}
_.c = function(el, o) {
	this._ = this.doc.getElementsByClassName(el)
	if(o) {
		this._ = this._[0]
	}
	return this;
}
_.n = function(el, o) {
	this._ = this.doc.getElementsByName(el);
	if(o) {
		this._ = this._[0]
	}
	return this;
}
_.show = function() {
	if(this._) {
		for(var i = 0, z = this._.length; i < z; i++) {
			this._[i].style.display = '';
		}
	}
	return this;
}
_.hide = function() {
	if(this._) {
		for(var i = 0, z = this._.length; i < z; i++) {
			this._[i].style.display = 'none';
		}
	}
	return this;
}
_.visible = function() {
	if(this._) {
		for(var i = 0, z = this._.length; i < z; i++) {
			this._[i].style.visibility = 'visible';
		}
	}
	return this;
}
_.invisible = function() {
	if(this._) {
		for(var i = 0, z = this._.length; i < z; i++) {
			this._[i].style.visibility = "hidden";
		}
	}
	return this;
}
_.append = function(el) {
	if(this._) {
		for(var i = 0, z = this._.length; i < z; i++) {
			this._[i].innerHTML += el;
		}
	}
}
_.empty = function(el) {
	if(this._) {
		for(var i = 0, z = this._.length; i < z; i++) {
			this._[i].innerHTML = null;
		}
	}
}
_.remove = function(el) {
	if(this._) {
		for(var i = 0, z = this._.length; i < z; i++) {
			this._[i].parentNode.removeChild(this._[i]);
		}
	}
}
_.document = {};
_.document.heigth = function(o) {
	if(o) {
		// full document heigth (with scrollbar)
		const body = document.body;
		const html = document.documentElement;
		return Math.max(body.offsetHeight, body.scrollHeight, html.clientHeight, html.offsetHeight, html.scrollHeight);
	} else {
		// jquery like visible document heigth
		return window.document.documentElement.clientHeight;
	}
}
_.window = {};
_.window.scrollTop = function() {
	return(document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
}
_.window.heigth = function(o) {
	if(o) {
		// with scrollbar
		return window.innerHeight;
	} else {
		// without scrollbar, behaves like jQuery
		return window.document.documentElement.clientHeight;
	}
}
_.heigth = function() {
	var array = [];
	for(var i = 0, z = this._.length; i < z; i++) {
		var styles = window.getComputedStyle(this._[i]);
		array.push(this._[i].offsetHeigh - parseFloat(styles.borderBottomWidth) - parseFloat(styles.borderTopWidth) - parseFloat(styles.paddingTop) - parseFloat(styles.paddingBottom));
	}
	if(Object.prototype.toString.call(array) === '[object Array]') {
		return array;
	} else {
		return array[0];
	}
}
_.position = function() {
	return {
		left: this._.offsetLeft,
		top: this._.offsetTop
	};
}
_.offset = function() {
	const box = this._.getBoundingClientRect();
	return {
		top: box.top + window.pageYOffset - document.documentElement.clientTop,
		left: box.left + window.pageXOffset - document.documentElement.clientLeft
	};
}
_.addClass = function(className) {
	this._.classList.add(className);
}
_.removeClass = function(className) {
	this._.classList.remove(className);
}
_.hasClass = function(className) {
	return this._.classList.contains(className);
}
_.toggleClass = function(className) {
	this._.classList.toggle(className);
}
_.closest = function(sel) {
	this._.closest(sel);
}
_.parentsUntil = function(selector, filter) {
	var result = [];
	const matchesSelector = this._.matches || this._.webkitMatchesSelector || this._.mozMatchesSelector || this._.msMatchesSelector;
	// match start from parent
	this._ = this._.parentElement;
	while(this._ && !matchesSelector.call(this._, selector)) {
		if(!filter) {
			result.push(this._);
		} else {
			if(matchesSelector.call(this._, filter)) {
				result.push(this._);
			}
		}
		this._ = this._.parentElement;
	}
	this._ = result;
}
_.val = function() {
	return this._[0].value;
}
_.attr = function(foo, bar) {
	if(bar) {
		this._.setAttribute(foo, bar);
	} else {
		return this._.getAttribute(foo);
	}
}
