

// simplify the function call which used in the front end 
var $ = function (args) {
	return new Base(args);
}

//Base of all basic functions
function Base(args) {

	// create an Array to store the acquire node/nodes  
	this.elements = [];
	
	if (typeof args == 'string') {
		//simulate the CSS selector
		if (args.indexOf(' ') != -1) {
			//split all nodes and save them in the array
			var elements = args.split(' ');			
			//temporary array to solve the overwrite problem
			var childElements = [];					
			// store the parent node
			var node = [];								
			for (var i = 0; i < elements.length; i ++) {
				// if no parent node, then is document 
				if (node.length == 0) node.push(document);		
				switch (elements[i].charAt(0)) {
					case '#' :
						childElements = [];				
						childElements.push(this.getId(elements[i].substring(1)));
						// save the parent node
						node = childElements;		
						break;
					case '.' : 
						childElements = [];
						for (var j = 0; j < node.length; j ++) {
							var temps = this.getClass(elements[i].substring(1), node[j]);
							for (var k = 0; k < temps.length; k ++) {
								childElements.push(temps[k]);
							}
						}
						node = childElements;
						break;
					default : 
						childElements = [];
						for (var j = 0; j < node.length; j ++) {
							var temps = this.getTagName(elements[i], node[j]);
							for (var k = 0; k < temps.length; k ++) {
								childElements.push(temps[k]);
							}
						}
						node = childElements;
				}
			}
			this.elements = childElements;
		} else {
			//find	#: id	.: class  	nothing: others
			switch (args.charAt(0)) {
				case '#' :
					this.elements.push(this.getId(args.substring(1)));
					break;
				case '.' : 
					this.elements = this.getClass(args.substring(1));
					break;
				default : 
					this.elements = this.getTagName(args);
			}
		}
	} else if (typeof args == 'object') {
		// because _this is a object, use   undefined  (no '')
		if (args != undefined) {   
			this.elements[0] = args;
		}
	} else if (typeof args == 'function') {
		this.ready(args);
	}
}



// setup the CSS selector 
Base.prototype.find = function (str) {
	var childElements = [];
	for (var i = 0; i < this.elements.length; i ++) {
		switch (str.charAt(0)) {
			case '#' :
				childElements.push(this.getId(str.substring(1)));
				break;
			case '.' : 
				var temps = this.getClass(str.substring(1), this.elements[i]);
				for (var j = 0; j < temps.length; j ++) {
					childElements.push(temps[j]);
				}
				break;
			default : 
				var temps = this.getTagName(str, this.elements[i]);
				for (var j = 0; j < temps.length; j ++) {
					childElements.push(temps[j]);
				}
		}
	}
	this.elements = childElements;
	return this;
}


//addDomLoaded
Base.prototype.ready = function (fn) {
	addDomLoaded(fn);
};


// get by ID
Base.prototype.getId = function (id) {
	return document.getElementById(id)
};

// get by TagName, which will get array of node(s)
Base.prototype.getTagName = function (tag, parentNode) {
	var node = null;
	var temps = [];
	if (parentNode != undefined) {
		node = parentNode;
	} else {
		node = document;
	}
	var tags = node.getElementsByTagName(tag);
	for (var i = 0; i < tags.length; i ++) {
		temps.push(tags[i]);
	}
	return temps;
};

// get by class
Base.prototype.getClass = function (className, parentNode) {
	var node = null;
	var temps = [];
	if (parentNode != undefined) {
		node = parentNode;
	} else {
		node = document;
	}
	var all = node.getElementsByTagName('*');
	for (var i = 0; i < all.length; i ++) {
		if ((new RegExp('(\\s|^)' +className +'(\\s|$)')).test(all[i].className)) {
			temps.push(all[i]);
		}
	}
	return temps;
}


// get one node, and return itself  
Base.prototype.ge = function (num) {	
	return this.elements[num];
};

// get the first node and return it 
Base.prototype.first = function () {
	return this.elements[0];
};

// get the last node and return it
Base.prototype.last = function () {
	return this.elements[this.elements.length - 1];
};

// get the length of one group of node
Base.prototype.length = function () {
	return this.elements.length;
};

// get and set the attribute of one node		one parameter: get 		two parameters: set
Base.prototype.attr = function (attr, value) {
	for (var i = 0; i < this.elements.length; i ++) {
		if (arguments.length == 1) {
			return this.elements[i].getAttribute(attr);
		} else if (arguments.length == 2) {
			this.elements[i].setAttribute(attr, value);
		}
	}
	return this;
};

// get the index of one node in one group
Base.prototype.index = function () {
	var children = this.elements[0].parentNode.children;
	for (var i = 0; i < children.length; i ++) {
		if (this.elements[0] == children[i]) return i;
	}
};

// set the opacity of one node,  this memthod compatible with old version of IE
Base.prototype.opacity = function (num) {
	for (var i = 0; i < this.elements.length; i ++) {
		this.elements[i].style.opacity = num / 100;
		this.elements[i].style.filter = 'alpha(opacity=' + num + ')';
	}
	return this;
};

// get one node but it return Base object itselt, not the node
Base.prototype.eq = function (num) {
	var element = this.elements[num];
	this.elements = [];
	this.elements[0] = element;
	return this;
};

// get the next node of the current node
Base.prototype.next = function () {
	for (var i = 0; i < this.elements.length; i ++) {
		this.elements[i] = this.elements[i].nextSibling;
		if (this.elements[i] == null) throw new Error('Cannot find the next node that at the same level');
		
		if (this.elements[i].nodeType == 3) this.next();
	}
	return this;
};

// get the previous node of the current node
Base.prototype.prev = function () {
	for (var i = 0; i < this.elements.length; i ++) {
		this.elements[i] = this.elements[i].previousSibling;
		if (this.elements[i] == null) throw new Error('Cannot find the previous node that at the same level ');
		if (this.elements[i].nodeType == 3) this.prev();
	}
	return this;
};

//set CSS (attribute)
Base.prototype.css = function (attr, value) {
	for (var i = 0; i < this.elements.length; i ++) {
		if (arguments.length == 1) {
			return getStyle(this.elements[i], attr);
		}
		this.elements[i].style[attr] = value;
	}
	return this;
}

// add 'class'
Base.prototype.addClass = function (className) {
	for (var i = 0; i < this.elements.length; i ++) {
		if (!hasClass(this.elements[i], className)) {
			this.elements[i].className += ' ' + className;
		}
	}
	return this;
}

//remove 'class'
Base.prototype.removeClass = function (className) {
	for (var i = 0; i < this.elements.length; i ++) {
		if (hasClass(this.elements[i], className)) {
			this.elements[i].className = this.elements[i].className.replace(new RegExp('(\\s|^)' +className +'(\\s|$)'), ' ');
		}
	}
	return this;
}


// add <link> or <style> for CSS
Base.prototype.addRule = function (num, selectorText, cssText, position) {
	var sheet = document.styleSheets[num];
	insertRule(sheet, selectorText, cssText, position);
	return this;
}

// remove <link> or <style> for CSS
Base.prototype.removeRule = function (num, index) {
	var sheet = document.styleSheets[num];
	deleteRule(sheet, index);
	return this;
}

// get the field itself of the form by given the field name 
Base.prototype.form = function (name) {
	for (var i = 0; i < this.elements.length; i ++) {
		this.elements[i] = this.elements[i][name];
	}
	return this;
};

// get/set the value of one field in the form 			0 parameter: get 	1 parameter:set
Base.prototype.value = function (str) {
	for (var i = 0; i < this.elements.length; i ++) {
		if (arguments.length == 0) {
			return this.elements[i].value;
		}
		this.elements[i].value = str;
	}
	return this;
}

// get/set innerHTML			no parameter: get		one parameter: set
Base.prototype.html = function (str) {
	for (var i = 0; i < this.elements.length; i ++) {
		if (arguments.length == 0) {
			return this.elements[i].innerHTML;
		}
		this.elements[i].innerHTML = str;
	}
	return this;
}

// get/set innerText			no parameter: get		one parameter: set
Base.prototype.text = function (str) {
	for (var i = 0; i < this.elements.length; i ++) {
		if (arguments.length == 0) {
			return getInnerText(this.elements[i]);
		}
		setInnerText(this.elements[i], text);
	}
	return this;
}

// setup event trigger, event will bind with one function 
Base.prototype.bind = function (event, fn) {
	for (var i = 0; i < this.elements.length; i ++) {
		addEvent(this.elements[i], event, fn);
	}
	return this;
};

// setup functions for mouse moveover and move out
Base.prototype.hover = function (over, out) {
	for (var i = 0; i < this.elements.length; i ++) {
		addEvent(this.elements[i], 'mouseover', over);
		addEvent(this.elements[i], 'mouseout', out);
	}
	return this;
};

// set up the 'click' toggle 
Base.prototype.toggle = function () {
	for (var i = 0; i < this.elements.length; i ++) {
		(function (element, args) {
			var count = 0;
			addEvent(element, 'click', function () {
				args[count++ % args.length].call(this);
			});
		})(this.elements[i], arguments);
	}
	return this;
};

//simplify   XXX.style.display = 'block'
Base.prototype.show = function () {
	for (var i = 0; i < this.elements.length; i ++) {
		this.elements[i].style.display = 'block';
	}
	return this;
};

//simplify   XXX.style.display = 'none'
Base.prototype.hide = function () {
	for (var i = 0; i < this.elements.length; i ++) {
		this.elements[i].style.display = 'none';
	}
	return this;
};

// setup the object at the center 
Base.prototype.center = function (width, height) {
	var top = (getInner().height - height) / 2 + getScroll().top;
	var left = (getInner().width - width) / 2 + getScroll().left;
	for (var i = 0; i < this.elements.length; i ++) {
		this.elements[i].style.top = top + 'px';
		this.elements[i].style.left = left + 'px';
	}
	return this;
};

// screen lock
Base.prototype.lock = function () {
	for (var i = 0; i < this.elements.length; i ++) {
		fixedScroll.top = getScroll().top;
		fixedScroll.left = getScroll().left;
		this.elements[i].style.width = getInner().width + getScroll().left + 'px';
		this.elements[i].style.height = getInner().height + getScroll().top + 'px';
		this.elements[i].style.display = 'block';
		parseFloat(sys.firefox) < 4 ? document.body.style.overflow = 'hidden' : document.documentElement.style.overflow = 'hidden';
		addEvent(this.elements[i], 'mousedown', predef);
		addEvent(this.elements[i], 'mouseup', predef);
		addEvent(this.elements[i], 'selectstart', predef);
		addEvent(window, 'scroll', fixedScroll);
	}
	return this;
};

// screen unlock
Base.prototype.unlock = function () {
	for (var i = 0; i < this.elements.length; i ++) {
		this.elements[i].style.display = 'none';
		parseFloat(sys.firefox) < 4 ? document.body.style.overflow = 'auto' : document.documentElement.style.overflow = 'auto';
		removeEvent(this.elements[i], 'mousedown', predef);
		removeEvent(this.elements[i], 'mouseup', predef);
		removeEvent(this.elements[i], 'selectstart', predef);
		removeEvent(window, 'scroll', fixedScroll);
	}
	return this;
};

// click event
Base.prototype.click = function (fn) {
	for (var i = 0; i < this.elements.length; i ++) {
		this.elements[i].onclick = fn;
	}
	return this;
};

// broswer window resize event
Base.prototype.resize = function (fn) {
	for (var i = 0; i < this.elements.length; i ++) {
		var element = this.elements[i];
		addEvent(window, 'resize', function () {
			fn();
			if (element.offsetLeft > getInner().width + getScroll().left - element.offsetWidth) {
				element.style.left = getInner().width + getScroll().left - element.offsetWidth + 'px';
				if (element.offsetLeft <= 0 + getScroll().left) {
					element.style.left = 0 + getScroll().left + 'px';
				}
			}
			if(element.offsetTop > getInner().height + getScroll().top - element.offsetHeight) {
				element.style.top = getInner().height + getScroll().top - element.offsetHeight + 'px';
				if (element.offsetTop <= 0 + getScroll().top) {
					element.style.top = 0 + getScroll().top + 'px';
				}
			}
		});
	}
	return this;
};

// setup animatation effect
Base.prototype.animate = function (obj) {
	for (var i = 0; i < this.elements.length; i ++) {
		var element = this.elements[i];
		var attr = obj['attr'] == 'x' ? 'left' : obj['attr'] == 'y' ? 'top' : 
					   obj['attr'] == 'w' ? 'width' : obj['attr'] == 'h' ? 'height' : 
					   obj['attr'] == 'o' ? 'opacity' : obj['attr'] != undefined ? obj['attr'] : 'left';

		
		var start = obj['start'] != undefined ? obj['start'] : 
						attr == 'opacity' ? parseFloat(getStyle(element, attr)) * 100 : 
												   parseInt(getStyle(element, attr));

		// OPTATIONAL, default value: every 10 ms  
		var t = obj['t'] != undefined ? obj['t'] : 10;	
		// OPTATIONAL, default: every time change 20 pixel,
		var step = obj['step'] != undefined ? obj['step'] : 20;								
		
		var alter = obj['alter'];
		var target = obj['target'];
		var mul = obj['mul'];
		
		// OPTATIONAL, default: buffering 6
		var speed = obj['speed'] != undefined ? obj['speed'] : 6;							
		// OPTATIONAL, default: buffering,		0: constant speed   1: buffering 
		var type = obj['type'] == 0 ? 'constant' : obj['type'] == 1 ? 'buffer' : 'buffer';		
		
		
		if (alter != undefined && target == undefined) {
			target = alter + start;
		} else if (alter == undefined && target == undefined && mul == undefined) {
			throw new Error('alter增量或target目标量必须传一个！');
		}
		
		
		
		if (start > target) step = -step;
		
		if (attr == 'opacity') {
			element.style.opacity = parseInt(start) / 100;
			element.style.filter = 'alpha(opacity=' + parseInt(start) +')';
		} else {
			//element.style[attr] = start + 'px';
		}
		
		
		if (mul == undefined) {
			mul = {};
			mul[attr] = target;
		} 
		

		clearInterval(element.timer);
		element.timer = setInterval(function () {
				
			
			// at then end is true, it means all animatation effect done 
			var flag = true; 
			
			for (var i in mul) {
				attr = i == 'x' ? 'left' : i == 'y' ? 'top' : i == 'w' ? 'width' : i == 'h' ? 'height' : i == 'o' ? 'opacity' : i != undefined ? i : 'left';
				target = mul[i];
					

				if (type == 'buffer') {
					step = attr == 'opacity' ? (target - parseFloat(getStyle(element, attr)) * 100) / speed :
														 (target - parseInt(getStyle(element, attr))) / speed;
					step = step > 0 ? Math.ceil(step) : Math.floor(step);
				}
				
								
				if (attr == 'opacity') {
					if (step == 0) {
						setOpacity();
					} else if (step > 0 && Math.abs(parseFloat(getStyle(element, attr)) * 100 - target) <= step) {
						setOpacity();
					} else if (step < 0 && (parseFloat(getStyle(element, attr)) * 100 - target) <= Math.abs(step)) {
						setOpacity();
					} else {
						var temp = parseFloat(getStyle(element, attr)) * 100;
						element.style.opacity = parseInt(temp + step) / 100;
						element.style.filter = 'alpha(opacity=' + parseInt(temp + step) + ')';
					}
					
					if (parseInt(target) != parseInt(parseFloat(getStyle(element, attr)) * 100)) flag = false;

				} else {
					if (step == 0) {
						setTarget();
					} else if (step > 0 && Math.abs(parseInt(getStyle(element, attr)) - target) <= step) {
						setTarget();
					} else if (step < 0 && (parseInt(getStyle(element, attr)) - target) <= Math.abs(step)) {
						setTarget();
					} else {
						element.style[attr] = parseInt(getStyle(element, attr)) + step + 'px';
					}
					
					if (parseInt(target) != parseInt(getStyle(element, attr))) flag = false;
				}
				
				//document.getElementById('test').innerHTML += i + '--' + parseInt(target) + '--' + parseInt(getStyle(element, attr)) + '--' + flag + '<br />';
				
			}
			
			if (flag) {
				clearInterval(element.timer);
				if (obj.fn != undefined) obj.fn();
			}
				
		}, t);
		
		function setTarget() {
			element.style[attr] = target + 'px';
		}
		
		function setOpacity() {
			element.style.opacity = parseInt(target) / 100;
			element.style.filter = 'alpha(opacity=' + parseInt(target) + ')';
		}
	}
	return this;
};

// extend other js 
Base.prototype.extend = function (name, fn) {
	Base.prototype[name] = fn;
};

