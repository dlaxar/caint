'use strict';

define(['./drawable', '../../utils/inherits'], function(Drawable, inherits) {

	var defaults = {
		fillStyle: 'black',
		width: 0,
		height: 0
	}


	var Rect = function Rect() {
		Rect.super_.apply(this);
	};

	inherits(Rect, Drawable);

	Rect.prototype.paint = function(ctx) {
		ctx.fillStyle = this.fillStyle;
		var pos = this.getPosition();
		ctx.fillRect(pos.x, pos.y, this.width, this.height);
	};

	Drawable._watch(Rect, defaults);

	return Rect;
});