//Check Browser
(function () {
	window.sys = {};
	var ua = navigator.userAgent.toLowerCase();	
	var s;		
	(s = ua.match(/msie ([\d.]+)/)) ? sys.ie = s[1] :
	(s = ua.match(/firefox\/([\d.]+)/)) ? sys.firefox = s[1] :
	(s = ua.match(/chrome\/([\d.]+)/)) ? sys.chrome = s[1] : 
	(s = ua.match(/opera\/.*version\/([\d.]+)/)) ? sys.opera = s[1] : 
	(s = ua.match(/version\/([\d.]+).*safari/)) ? sys.safari = s[1] : 0;
	
	if (/webkit/.test(ua)) sys.webkit = ua.match(/webkit\/([\d.]+)/)[1];
})();

//Load DOM
function addDomLoaded(fn) {
	var isReady = false;
	var timer = null;
	function doReady() {
		if (timer) clearInterval(timer);
		if (isReady) return;
		isReady = true;
		fn();
	}
	
	if ((sys.opera && sys.opera < 9) || (sys.firefox && sys.firefox < 3) || (sys.webkit && sys.webkit < 525)) {
		timer = setInterval(function () {
			if (document && document.getElementById && document.getElementsByTagName && document.body) {
				doReady();
			}
		}, 1);
	}
	//W3C 
	else if (document.addEventListener) {
		addEvent(document, 'DOMContentLoaded', function () {
			fn();
			removeEvent(document, 'DOMContentLoaded', arguments.callee);
		});
	} 
	// for old version IE 
	else if (sys.ie && sys.ie < 9){
		var timer = null;
		timer = setInterval(function () {
			try {
				document.documentElement.doScroll('left');
				doReady();
			} catch (e) {};
		}, 1);
	}
}

//Add Event, for some old version browser
//Will not be used in the future since most browser support W3C
function addEvent(obj, type, fn) {
	if (typeof obj.addEventListener != 'undefined') {
		obj.addEventListener(type, fn, false);
	} else {
		//create a hashtable to store events
		if (!obj.events) obj.events = {};
		//first time execute 
		if (!obj.events[type]) {	
			//create an array to store the event handle function
			obj.events[type] = [];
			//put the first function into the first position
			if (obj['on' + type]) obj.events[type][0] = fn;
		} else {
			//if it is the same function, not count
			if (addEvent.equal(obj.events[type], fn)) return false;
		}
		//from second time, use counter to store
		obj.events[type][addEvent.ID++] = fn;
		//execute the function 
		obj['on' + type] = addEvent.exec;
	}
}

//create a counter for each event
addEvent.ID = 1;

//function the execute the event
addEvent.exec = function (event) {
	var e = event || addEvent.fixEvent(window.event);
	var es = this.events[e.type];
	for (var i in es) {
		es[i].call(this, e);
	}
};

//ignore the same one
addEvent.equal = function (es, fn) {
	for (var i in es) {
		if (es[i] == fn) return true;
	}
	return false;
}

//match some old version IE frequently use Event object into W3C
addEvent.fixEvent = function (event) {
	event.preventDefault = addEvent.fixEvent.preventDefault;
	event.stopPropagation = addEvent.fixEvent.stopPropagation;
	event.target = event.srcElement;
	return event;
};

//prevent Default for old version IE
addEvent.fixEvent.preventDefault = function () {
	this.returnValue = false;
};

//cancel bubble for old version IE
addEvent.fixEvent.stopPropagation = function () {
	this.cancelBubble = true;
};


//remove Event 
function removeEvent(obj, type, fn) {
	if (typeof obj.removeEventListener != 'undefined') {
		obj.removeEventListener(type, fn, false);
	} else {
		if (obj.events) {
			for (var i in obj.events[type]) {
				if (obj.events[type][i] == fn) {
					delete obj.events[type][i];
				}
			}
		}
	}
}


//get the size of the inner windows of the browser
function getInner() {
	if (typeof window.innerWidth != 'undefined') {
		return {
			width : window.innerWidth,
			height : window.innerHeight
		}
	} else {
		return {
			width : document.documentElement.clientWidth,
			height : document.documentElement.clientHeight
		}
	}
}

//get the scrollbar position
function getScroll() {
	return {
		top : document.documentElement.scrollTop || document.body.scrollTop,
		left : document.documentElement.scrollLeft || document.body.scrollLeft
	}
}


//get the Style, 
function getStyle(element, attr) {
	var value;
	//W3C
	if (typeof window.getComputedStyle != 'undefined') {
		value = window.getComputedStyle(element, null)[attr];
	}
	//old version IE 
	else if (typeof element.currentStyle != 'undeinfed') {
		value = element.currentStyle[attr];
	}
	return value;
}


//check if the class exist
function hasClass(element, className) {
	return element.className.match(new RegExp('(\\s|^)' +className +'(\\s|$)'));
}


//add/insert link Rule
function insertRule(sheet, selectorText, cssText, position) {
	if (typeof sheet.insertRule != 'undefined') {//W3C
		sheet.insertRule(selectorText + '{' + cssText + '}', position);
	} else if (typeof sheet.addRule != 'undefined') {//IE
		sheet.addRule(selectorText, cssText, position);
	}
}

//delete/remove link Rule
function deleteRule(sheet, index) {
	if (typeof sheet.deleteRule != 'undefined') {//W3C
		sheet.deleteRule(index);
	} else if (typeof sheet.removeRule != 'undefined') {//IE
		sheet.removeRule(index);
	}
}

//get innerText
function getInnerText(element) {
	return (typeof element.textContent == 'string') ? element.textContent : element.innerText;
}

//set innerText
function setInnerText(elememt, text) {
	if (typeof element.textContent == 'string') {
		element.textContent = text;
	} else {
		element.innerText = text;
	}
}

//get the top position from one node to the outermost layer
function offsetTop(element) {
	var top = element.offsetTop;
	var parent = element.offsetParent;
	while (parent != null) {
		top += parent.offsetTop;
		parent = parent.offsetParent;
	}
	return top;
}

//delete white space
function trim(str) {
	return str.replace(/(^\s*)|(\s*$)/g, '');
}

//check if one value exist in the array
function inArray(array, value) {
	for (var i in array) {
		if (array[i] === value) return true;
	}
	return false;
}

//get the index of one node to the previous node
function prevIndex(current, parent) {
	var length = parent.children.length;
	if (current == 0) return length - 1;
	return parseInt(current) - 1;
}

//get the index of one node to the next node
function nextIndex(current, parent) {
	var length = parent.children.length;
	if (current == length - 1) return 0;
	return parseInt(current) + 1;
}

//fix Scrollbar position
function fixedScroll() {
	window.scrollTo(fixedScroll.left, fixedScroll.top);
}

//prevent Default event
function predef(e) {
	e.preventDefault();
}

//create cookie
function setCookie(name, value, expires, path, domain, secure) {
	var cookieText = encodeURIComponent(name) + '=' + encodeURIComponent(value);
	if (expires instanceof Date) {
		cookieText += '; expires=' + expires;
	}
	if (path) {
		cookieText += '; expires=' + expires;
	}
	if (domain) {
		cookieText += '; domain=' + domain;
	}
	if (secure) {
		cookieText += '; secure';
	}
	document.cookie = cookieText;
}

//get cookie
function getCookie(name) {
	var cookieName = encodeURIComponent(name) + '=';
	var cookieStart = document.cookie.indexOf(cookieName);
	var cookieValue = null;
	if (cookieStart > -1) {
		var cookieEnd = document.cookie.indexOf(';', cookieStart);
		if (cookieEnd == -1) {
			cookieEnd = document.cookie.length;
		}
		cookieValue = decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length, cookieEnd));
	}
	return cookieValue;
}

//delete cookie
function unsetCookie(name) {
	document.cookie = name + "= ; expires=" + new Date(0);
}