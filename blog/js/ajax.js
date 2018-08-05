//ajax
function ajax(obj) {
	var xhr = (function () {
		if (typeof XMLHttpRequest != 'undefined') {
			return new XMLHttpRequest();
		} else if (typeof ActiveXObject != 'undefined') {
			var version = [
										'MSXML2.XMLHttp.6.0',
										'MSXML2.XMLHttp.3.0',
										'MSXML2.XMLHttp'
			];
			for (var i = 0; version.length; i ++) {
				try {
					return new ActiveXObject(version[i]);
				} catch (e) {
					//skip
				}	
			}
		} else {
			throw new Error('your system/browser not support XHR object！');
		}
	})();
	obj.url = obj.url + '?rand=' + Math.random();
	obj.data = (function (data) {
		var arr = [];
		for (var i in data) {
			arr.push(encodeURIComponent(i) + '=' + encodeURIComponent(data[i]));
		}
		return arr.join('&');
	})(obj.data);
	if (obj.method === 'get') obj.url += obj.url.indexOf('?') == -1 ? '?' + obj.data : '&' + obj.data;
	if (obj.async === true) {
		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4) {
				callback();
			}
		};
	}
	xhr.open(obj.method, obj.url, obj.async);
	if (obj.method === 'post') {
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.send(obj.data);	
	} else {
		xhr.send(null);
	}
	if (obj.async === false) {
		callback();
	}
	function callback() {
		if (xhr.status == 200) {
			obj.success(xhr.responseText);			//send parameters back 
		} else {
			alert('Get Data Fail！Error Code：' + xhr.status + '，Error Message：' + xhr.statusText);
		}	
	}
}