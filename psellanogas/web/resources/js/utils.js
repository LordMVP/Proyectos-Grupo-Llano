/**
 * In IE browsers show a window to add favorites. In others show an alert message.
 * @type void
 */
function addFavorite(url, title, message){
	if ((navigator.appName=="Microsoft Internet Explorer") && (parseInt(navigator.appVersion)>=4)) {
		window.external.AddFavorite(url,3);
	}
	if(navigator.appName == "Netscape"){
	window.sidebar.addPanel(title,url,'');
	}
	return false;
}


/**
 * Opens a new browser window. The "type" parameter is a sum
 * where each member represents a chrome property: 1-toolbar,
 * 2-location, 4-directories, 8-status, 16-menubar, 32-scrollbars,
 * 64-resizable, 128-copyhistory. Ex: 48 = menubar+scrollbars
 * @param {String} url Window URL
 * @param {Number} wid Window width, defaults to screen width
 * @param {Number} hei Window height, defaults to screen available height
 * @param {Number} x Window X, defaults to 0
 * @param {Number} y Window Y, defaults to 0
 * @param {Number} type Bitmap chrome properties, defaults to 255
 * @param {String} tit Window title
 * @param {Boolean} ret Whether to return the created window or not
 * @type void
 */
function openWindow (url, wid, hei, x, y, type, tit, ret) {
	// sanitize parameters
	wid = wid || screen.width, hei = hei || screen.availHeight;
	x = Math.abs(x), y = Math.abs(y);
	ret = !!ret;
	// build props string
	var props =
		(type & 1 ? 'toolbar,' : '') + (type & 2 ? 'location,' : '') +
		(type & 4 ? 'directories,' : '') + (type & 8 ? 'status,' : '') +
		(type & 16 ? 'menubar,' : '') + (type & 32 ? 'scrollbars,' : '') +
		(type & 64 ? 'resizable,' : '') + (type & 128 ? 'copyhistory,' : '') +
		'width='+wid+',height='+hei+',left='+x+',top='+y;
	var wnd = window.open(url, tit, props);
	wnd.focus();
	if (ret)
		return wnd;
}

/**
 * Opens a new browser window in the center of the main window.
 * Uses {@link openWindow} internally
 * @param {String} url Window URL
 * @param {Number} wid Window width, defaults to 800
 * @param {Number} hei Window height, defaults to 600
 * @param {Number} type Bitmap properties, defaults to 255
 * @param {String} tit Window title
 * @param {Boolean} ret Whether to return the created window or not
 * @type void
 */
function openCenteredWindow (url, wid, hei, type, tit, ret) {
	wid = wid || 800, hei = hei || 600;
	var x = Math.floor((screen.availWidth-wid)/2);
	var y = Math.floor((screen.availHeight-hei)/2);
	return openWindow(url, wid, hei, x, y, type, tit, ret);
}
